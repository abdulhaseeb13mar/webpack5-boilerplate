import { FiatCurrency } from "../../assets";
import { AddressOnNetwork, NameOnNetwork } from "../../accounts";
import { ServiceLifecycleEvents, ServiceCreatorFunction } from "../types";

import { Preferences, TokenListPreferences } from "./types";
import { getOrCreateDB, PreferenceDatabase } from "./db";
import BaseService from "../base";
import { normalizeEVMAddress } from "../../lib/utils";
import { ROPSTEN } from "../../constants";
import { EVMNetwork, sameNetwork } from "../../networks";
import { HexString } from "../../types";

type InMemoryAddressBook = {
  network: EVMNetwork;
  address: HexString;
  name: string;
}[];

const BUILT_IN_CONTRACTS = [
  {
    network: ROPSTEN,
    address: normalizeEVMAddress("0xDef1C0ded9bec7F1a1670819833240f027b25EfF"),
    name: "0x Router",
  },
  {
    network: ROPSTEN,
    // Uniswap v3 Router
    address: normalizeEVMAddress("0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"),
    name: "🦄 Uniswap",
  },
];

console.log("BUILT_IN_CONTRACTS", BUILT_IN_CONTRACTS);

interface Events extends ServiceLifecycleEvents {
  preferencesChanges: Preferences;
  initializeDefaultWallet: boolean;
  initializeSelectedAccount: AddressOnNetwork;
}

/*
 * The preference service manages user preference persistence, emitting an
 * event when preferences change.
 */
export default class PreferenceService extends BaseService<Events> {
  private knownContracts: InMemoryAddressBook = BUILT_IN_CONTRACTS;

  private addressBook: InMemoryAddressBook = [];

  /*
   * Create a new PreferenceService. The service isn't initialized until
   * startService() is called and resolved.
   */
  static create: ServiceCreatorFunction<Events, PreferenceService, []> =
    async () => {
      const db = await getOrCreateDB();

      return new this(db);
    };

  private constructor(private db: PreferenceDatabase) {
    super();
  }

  protected async internalStartService(): Promise<void> {
    await super.internalStartService();

    this.emitter.emit("initializeDefaultWallet", await this.getDefaultWallet());
    this.emitter.emit(
      "initializeSelectedAccount",
      await this.getSelectedAccount()
    );
  }

  protected async internalStopService(): Promise<void> {
    this.db.close();

    await super.internalStopService();
  }

  // TODO Implement the following 4 methods as something stored in the database and user-manageable.
  // TODO Track account names in the UI in the address book.
  async lookUpAddressForName({
    name,
    network,
  }: NameOnNetwork): Promise<AddressOnNetwork | undefined> {
    return this.addressBook.find(
      ({ name: entryName, network: entryNetwork }) =>
        sameNetwork(network, entryNetwork) && name === entryName
    );
  }

  async lookUpNameForAddress({
    address,
    network,
  }: AddressOnNetwork): Promise<NameOnNetwork | undefined> {
    return this.addressBook.find(
      ({ address: entryAddress, network: entryNetwork }) =>
        sameNetwork(network, entryNetwork) &&
        normalizeEVMAddress(address) === normalizeEVMAddress(entryAddress)
    );
  }

  async lookUpAddressForContractName({
    name,
    network,
  }: NameOnNetwork): Promise<AddressOnNetwork | undefined> {
    console.log("lookUpAddressForContractName", this.knownContracts);
    return this.knownContracts.find(
      ({ name: entryName, network: entryNetwork }) =>
        sameNetwork(network, entryNetwork) && name === entryName
    );
  }

  async lookUpNameForContractAddress({
    address,
    network,
  }: AddressOnNetwork): Promise<NameOnNetwork | undefined> {
    console.log("lookUpNameForContractAddress", this.knownContracts);

    return this.knownContracts.find(
      ({ address: entryAddress, network: entryNetwork }) =>
        sameNetwork(network, entryNetwork) &&
        normalizeEVMAddress(address) === normalizeEVMAddress(entryAddress)
    );
  }

  async getCurrency(): Promise<FiatCurrency> {
    return (await this.db.getPreferences())?.currency;
  }

  async getTokenListPreferences(): Promise<TokenListPreferences> {
    return (await this.db.getPreferences())?.tokenLists;
  }

  async getDefaultWallet(): Promise<boolean> {
    return (await this.db.getPreferences())?.defaultWallet;
  }

  async setDefaultWalletValue(newDefaultWalletValue: boolean): Promise<void> {
    return this.db.setDefaultWalletValue(newDefaultWalletValue);
  }

  async getSelectedAccount(): Promise<AddressOnNetwork> {
    return (await this.db.getPreferences())?.selectedAccount;
  }

  async setSelectedAccount(addressNetwork: AddressOnNetwork): Promise<void> {
    return this.db.setSelectedAccount(addressNetwork);
  }
}
