import ChainService from "../../chain";
import { AddressOnNetwork, NameOnNetwork } from "../../../accounts";
import { ROPSTEN } from "../../../constants";
import { sameNetwork } from "../../../networks";
import { NameResolver } from "../name-resolver";

export default function ensResolverFor(
  chainService: ChainService
): NameResolver<"ENS"> {
  return {
    type: "ENS",
    canAttemptNameResolution(): boolean {
      return true;
    },
    canAttemptAvatarResolution(addressOrNameOnNetwork: NameOnNetwork): boolean {
      if ("name" in addressOrNameOnNetwork) {
        return this.canAttemptAddressResolution(addressOrNameOnNetwork);
      }
      return true;
    },
    canAttemptAddressResolution({ name, network }: NameOnNetwork): boolean {
      return sameNetwork(network, ROPSTEN) && name.endsWith(".eth");
    },

    async lookUpAddressForName({
      name,
      network,
    }: NameOnNetwork): Promise<AddressOnNetwork | undefined> {
      const address = await chainService
        .providerForNetwork(network)
        ?.resolveName(name);

      if (address === undefined || address === null) {
        return undefined;
      }

      return {
        address,
        network,
      };
    },
    async lookUpAvatar(
      addressOrNameOnNetwork: AddressOnNetwork | NameOnNetwork
    ) {
      const { network } = addressOrNameOnNetwork;

      const { name } =
        "name" in addressOrNameOnNetwork
          ? addressOrNameOnNetwork
          : (await this.lookUpNameForAddress(addressOrNameOnNetwork)) ?? {
              name: undefined,
            };

      const provider = chainService.providerForNetwork(network);

      if (name === undefined || provider === undefined) {
        return undefined;
      }

      const { url: avatarUrn } = (await (
        await provider.getResolver(name)
      )?.getAvatar()) ?? { url: undefined };

      if (avatarUrn === undefined) {
        return undefined;
      }

      return {
        uri: avatarUrn,
        network,
      };
    },
    async lookUpNameForAddress({
      address,
      network,
    }: AddressOnNetwork): Promise<NameOnNetwork | undefined> {
      const name = await chainService
        .providerForNetwork(network)
        ?.lookupAddress(address);

      if (name === undefined || name === null) {
        return undefined;
      }

      return {
        name,
        network,
      };
    },
  };
}
