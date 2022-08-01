type WalletProvider = {
  providerInfo?: {
    label: string;
    injectedNamespace: string;
    iconURL: string;
    identityFlag?: string;
    checkIdentity?: () => boolean;
  };
  on: (
    eventName: string | symbol,
    listener: (...args: unknown[]) => void
  ) => unknown;
  removeListener: (
    eventName: string | symbol,
    listener: (...args: unknown[]) => void
  ) => unknown;
  [optionalProps: string]: unknown;
};

type TallyProvider = WalletProvider & {
  isSonar: true;
};

type WindowEthereum = WalletProvider & {
  isMetaMask?: boolean;
  isSonar?: boolean;
  autoRefreshOnNetworkChange?: boolean;
};
interface Window {
  walletRouter?: {
    currentProvider: WalletProvider;
    providers: WalletProvider[];
    switchToPreviousProvider: () => void;
    getProviderInfo: (
      provider: WalletProvider
    ) => WalletProvider["providerInfo"];
    hasProvider: (
      checkIdentity: (provider: WalletProvider) => boolean
    ) => boolean;
    setCurrentProvider: (
      checkIdentity: (provider: WalletProvider) => boolean
    ) => void;
    addProvider: (newProvider: WalletProvider) => void;
  };
  tally?: TallyProvider;
  ethereum?: WindowEthereum;
  oldEthereum?: WindowEthereum;
}
