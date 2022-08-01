import browser, { Runtime } from "webextension-polyfill";
import { TransactionRequest as EthersTransactionRequest } from "@ethersproject/abstract-provider";
import {
  AllowedQueryParamPage,
  EIP1193Error,
  EIP1193_ERROR_CODES,
  EXTERNAL_PORT_NAME,
  isTallyConfigPayload,
  PermissionRequest,
  PortRequestEvent,
  PortResponseEvent,
  RPCRequest,
} from "../../../provider-bridge-shared";
import showExtensionPopup from "../../../show-popup";
import logger from "../../lib/logger";
import BaseService from "../base";
import InternalEthereumProviderService from "../internal-ethereum-provider";
import PreferenceService from "../preferences";
import { ServiceCreatorFunction, ServiceLifecycleEvents } from "../types";
import {
  checkPermissionSignTransaction,
  checkPermissionSignTypedData,
} from "./authorization";
import { getOrCreateDB, ProviderBridgeServiceDatabase } from "./db";

import { ACCOUNT_ADDRESS } from "../../../utils/constants";
import { HexString } from "../../types";

type Events = ServiceLifecycleEvents & {
  requestPermission: PermissionRequest;
  initializeAllowedPages: Record<string, PermissionRequest>;
};

export default class ProviderBridgeService extends BaseService<Events> {
  #pendingPermissionsRequests: {
    [origin: string]: (value: unknown) => void;
  } = {};

  openPorts: Array<Runtime.Port> = [];

  static create: ServiceCreatorFunction<
    Events,
    ProviderBridgeService,
    [Promise<InternalEthereumProviderService>, Promise<PreferenceService>]
  > = async (internalEthereumProviderService, preferenceService) => {
    return new this(
      await getOrCreateDB(),
      await internalEthereumProviderService,
      await preferenceService
    );
  };

  private constructor(
    private db: ProviderBridgeServiceDatabase,
    private internalEthereumProviderService: InternalEthereumProviderService,
    private preferenceService: PreferenceService
  ) {
    super();

    browser.runtime.onConnect.addListener(async (port) => {
      if (port.name === EXTERNAL_PORT_NAME && port.sender?.url) {
        port.onMessage.addListener((event) => {
          this.onMessageListener(port as Required<browser.Runtime.Port>, event);
        });
        port.onDisconnect.addListener(() => {
          this.openPorts = this.openPorts.filter(
            (openPort) => openPort !== port
          );
        });
        this.openPorts.push(port);
      }
    });

    // TODO: on internal provider handlers connect, disconnect, account change, network change
  }

  protected async internalStartService(): Promise<void> {
    await super.internalStartService(); // Not needed, but better to stick to the patterns

    this.emitter.emit(
      "initializeAllowedPages",
      await this.db.getAllPermission()
    );
  }

  async onMessageListener(
    port: Required<browser.Runtime.Port>,
    event: PortRequestEvent
  ): Promise<void> {
    const { url, tab } = port.sender;
    if (typeof url === "undefined") {
      return;
    }

    const { origin } = new URL(url);
    const completeTab =
      typeof tab !== "undefined" && typeof tab.id !== "undefined"
        ? {
            ...tab,
            ...(await browser.tabs.get(tab.id)),
          }
        : tab;
    const faviconUrl = completeTab?.favIconUrl ?? "";
    const title = completeTab?.title ?? "";

    const response: PortResponseEvent = { id: event.id, result: [] };

    const originPermission = await this.checkPermission(origin);
    if (isTallyConfigPayload(event.request)) {
      // let's start with the internal communication
      response.id = "tallyHo";
      response.result = {
        method: event.request.method,
        defaultWallet: await this.preferenceService.getDefaultWallet(),
      };
    } else if (typeof originPermission !== "undefined") {
      // if it's not internal but dapp has permission to communicate we proxy the request
      // TODO: here comes format validation
      response.result = await this.routeContentScriptRPCRequest(
        originPermission,
        event.request.method,
        event.request.params
      );
    } else if (event.request.method === "eth_requestAccounts") {
      // if it's external communication AND the dApp does not have permission BUT asks for it
      // then let's ask the user what he/she thinks

      // const { address: accountAddress } =
      //   await this.preferenceService.getSelectedAccount();
      localStorage.setItem("method", "eth_requestAccounts");
      const accountAddress = ACCOUNT_ADDRESS;
      const permissionRequest: PermissionRequest = {
        key: `${origin}_${accountAddress}`,
        origin,
        faviconUrl,
        title,
        state: "request",
        accountAddress,
      };
      localStorage.setItem("permission", JSON.stringify(permissionRequest));

      console.log("ppppppppppppppppppppppppppppp", permissionRequest);

      const blockUntilUserAction = await this.requestPermission(
        permissionRequest
      );

      await blockUntilUserAction;

      const persistedPermission = await this.checkPermission(origin);
      console.log("persistedPermission", persistedPermission);
      if (persistedPermission) {
        // if agrees then let's return the account data

        response.result = await this.routeContentScriptRPCRequest(
          persistedPermission,
          "eth_accounts",
          event.request.params
        );
      } else {
        // if user does NOT agree, then reject

        response.result = new EIP1193Error(
          EIP1193_ERROR_CODES.userRejectedRequest
        ).toJSON();
      }
    } else if (event.request.method === "wallet_switchEthereumChain") {
      response.result = ["0x3"];
    } else {
      // sorry dear dApp, there is no love for you here
      response.result = new EIP1193Error(
        EIP1193_ERROR_CODES.unauthorized
      ).toJSON();
    }

    port.postMessage(response);
  }

  notifyContentScriptAboutConfigChange(newDefaultWalletValue: boolean): void {
    this.openPorts.forEach((p) => {
      p.postMessage({
        id: "tallyHo",
        result: {
          method: "tally_getConfig",
          defaultWallet: newDefaultWalletValue,
        },
      });
    });
  }

  async notifyContentScriptsAboutAddressChange(
    newAddress?: string
  ): Promise<void> {
    this.openPorts.forEach(async (port) => {
      // we know that url exists because it was required to store the port
      const { origin } = new URL(port.sender?.url as string);
      if (await this.checkPermission(origin)) {
        port.postMessage({
          id: "tallyHo",
          result: {
            method: "tally_accountChanged",
            address: [newAddress],
          },
        });
      } else {
        port.postMessage({
          id: "tallyHo",
          result: {
            method: "tally_accountChanged",
            address: [],
          },
        });
      }
    });
  }

  async requestPermission(
    permissionRequest: PermissionRequest
  ): Promise<unknown> {
    console.log("REQ==========================", permissionRequest);
    this.emitter.emit("requestPermission", permissionRequest);
    await showExtensionPopup(AllowedQueryParamPage.dappPermission);

    // if (permission.state !== "allow" || !permission.accountAddress) return;

    return new Promise((resolve) => {
      this.#pendingPermissionsRequests[permissionRequest.origin] = resolve;
    });
  }

  async grantPermission(permission: PermissionRequest): Promise<void> {
    console.log("GRANT=============================");
    // FIXME proper error handling if this happens - should not tho
    if (permission.state !== "allow" || !permission.accountAddress) return;

    await this.db.setPermission(permission);

    if (this.#pendingPermissionsRequests[permission.origin]) {
      this.#pendingPermissionsRequests[permission.origin](permission);
      delete this.#pendingPermissionsRequests[permission.origin];
    }
  }

  async denyOrRevokePermission(permission: PermissionRequest): Promise<void> {
    // FIXME proper error handling if this happens - should not tho
    if (permission.state !== "deny" || !permission.accountAddress) return;

    const { address } = await this.preferenceService.getSelectedAccount();

    // TODO make this multi-network friendly
    await this.db.deletePermission(permission.origin, address);

    if (this.#pendingPermissionsRequests[permission.origin]) {
      this.#pendingPermissionsRequests[permission.origin]("Time to move on");
      delete this.#pendingPermissionsRequests[permission.origin];
    }

    await this.notifyContentScriptsAboutAddressChange();
  }

  async checkPermission(
    origin: string,
    address?: string
  ): Promise<PermissionRequest | undefined> {
    // const { address: selectedAddress } =
    //   await this.preferenceService.getSelectedAccount();
    // const currentAddress = address ?? selectedAddress;
    const currentAddress = ACCOUNT_ADDRESS;
    // TODO make this multi-network friendly
    return this.db.checkPermission(origin, currentAddress);
  }

  async routeSafeRequest(
    method: string,
    params: unknown[],
    popupPromise: Promise<browser.Windows.Window>
  ): Promise<unknown> {
    const response = await this.internalEthereumProviderService
      .routeSafeRPCRequest(method, params)
      .finally(async () => {
        // Close the popup once we're done submitting.
        const popup = await popupPromise;
        if (typeof popup.id !== "undefined") {
          browser.windows.remove(popup.id);
        }
      });
    return response;
  }

  async routeContentScriptRPCRequest(
    enablingPermission: PermissionRequest,
    method: string,
    params: RPCRequest["params"]
  ): Promise<unknown> {
    try {
      switch (method) {
        case "eth_requestAccounts":
        case "eth_accounts":
          return [ACCOUNT_ADDRESS];
        case "eth_signTypedData":
        case "eth_signTypedData_v1":
        case "eth_signTypedData_v3":
        case "eth_signTypedData_v4":
          localStorage.setItem("method", "eth_signTypedData_v4");

          checkPermissionSignTypedData(
            params[0] as HexString,
            enablingPermission
          );

          return await this.routeSafeRequest(
            method,
            params,
            showExtensionPopup(AllowedQueryParamPage.signData)
          );
        // case "eth_sign":
        // case "personal_sign":
        //   checkPermissionSign(params[1] as HexString, enablingPermission);

        //   return await this.routeSafeRequest(
        //     method,
        //     params,
        //     showExtensionPopup(AllowedQueryParamPage.personalSignData)
        //   );
        case "eth_signTransaction":
        case "eth_sendTransaction":
          console.log("CASE eth_sendTransaction", params[0]);
          localStorage.setItem("method", "eth_sendTransaction");
          localStorage.setItem("transactionObject", JSON.stringify(params[0]));

          checkPermissionSignTransaction(
            params[0] as EthersTransactionRequest,
            enablingPermission
          );

          return await this.routeSafeRequest(
            method,
            params,
            showExtensionPopup(AllowedQueryParamPage.signTransaction)
          );

        default: {
          return await this.internalEthereumProviderService.routeSafeRPCRequest(
            method,
            params
          );
        }
      }
    } catch (error) {
      logger.log("error processing request", error);
      return new EIP1193Error(EIP1193_ERROR_CODES.userRejectedRequest).toJSON();
    }
  }
}
