import { ThisRootState } from "../redux/reducers";
import { ElementType, MouseEventHandler } from "react";
import { Transition } from "framer-motion";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { PaletteMode, SvgIconTypeMap } from "@mui/material";
import React from "react";

export type RootState = ThisRootState;

export interface Inet {
  value: string;
  name: string;
}
export interface Ibalance {
  actualAmount: number;
  amountInUsd: number;
}
export type ExtraTypographyProps = {
  component: ElementType;
};

export type ExtraSelectProps = {
  IconComponent: ElementType;
};

export interface materialBtnProps {
  typo: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export interface OutLineCardsProps {
  isSeedPhrase?: number;
  heading: string;
  noMargin?: number;
}
export interface DestructureData {
  data: dataInterface;
  categorydata: categoryInterface;
}

export interface dataInterface {
  data: number[];
}
export interface categoryInterface {
  daycategory: number[];
  weekcategory: number[];
  monthcategory: number[];
}
export interface CardCompProps {
  heading: string;
}

export interface CustomTokenObj {
  name: string;
  balance: string;
  balanceInUSD: string;
}

export interface LandingBoxProps {
  image: string;
  heading: string;
  para: string;
  btn: string;
}

export interface BootstrapDialogTitleProps {
  children: string;
  onClose: (...args: any[]) => any;
  id: string;
}

export interface ModalBtnProps {
  onClick: () => void;
}

export interface ToaccountModalbtnProps {
  text: string;
  onClick: () => void;
}

export type RainbowBoxProps = {
  borderwidth?: string;
  borderradius?: string;
  visible?: boolean;
  fullwidth?: boolean;
  renderShadow?: boolean;
  shadow?: boolean;
};

export interface dataInterface {
  day: number[];
  week: number[];
  month: number[];
}
export interface categoryInterface {
  daycategory: number[];
  weekcategory: number[];
  monthcategory: number[];
}

export type SwitchTabProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

export type isActive = {
  active: boolean;
};

export type AnimateButton = {
  text: string;
  icon: any;
  onExpand?: () => void;
  onClose?: () => void;
  buttonStyle?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  animateHover?: boolean;
  iconPosition?: "left" | "right";
};

export type AnimateAlternate = {
  firstText: string;
  secondText: string;
  interval?: number;
  style?: React.CSSProperties;
  transition?: Transition;
};

export type AnimatePasswordStep = {
  order: number;
  currentStep: number;
  children: React.ReactNode;
};

type ContentArray = {
  content: React.ReactNode;
};

export type AnimationGroupContent = {
  content: ContentArray[];
  currentStep: number;
  height?: number;
};

export interface AppReduxState {
  isLoggedIn: boolean;
  isUserExists: boolean;
  colorTheme: PaletteMode;
  initiallyAnimated: boolean;
  totalWalletData: any;
  password: string;
  hudMargin: number;
  isLoading: boolean;
  address: string;
  switchNetwork: boolean;
  accountNumber: number;
  switchWallet: boolean;
  walletNumber: number;
  isNewWallet: boolean;
  currentAccountAddress: string;
  isUserSavedMnemonic: boolean;
}

export type BasicModal = {
  children: React.ReactElement;
  open: boolean;
  top?: number;
  zoom: boolean;
  handleClose: () => void;
};

export type WalletNetworkSelection = {
  open: boolean;
  handleClose: () => void;
};

export type WalletNetworkAccordian = {
  children: React.ReactElement;
  summary: string;
  switchChecked: boolean;
  handleSwitchChange?: () => void;
  expanded?: boolean;
};

export type AccordianRow = {
  selected?: boolean;
  logo?: string;
  text: string;
  isLast?: boolean;
  isHeading?: boolean;
  onClick?: () => void;
  copy?: boolean;
  setCopied?: React.Dispatch<React.SetStateAction<boolean>>;
  address?: string;
  isChecked?: boolean;
  setCurrentAccountIndex?: React.Dispatch<
    React.SetStateAction<{
      walletIndex: number;
      accountIndex: number;
    }>
  >;
  index?: number;
  walletIndex?: number;
  setCopyIndex?: React.Dispatch<
    React.SetStateAction<{
      walletIndex: number;
      accountIndex: number;
    }>
  >;
};

export type Input = {
  children: React.ReactElement[] | React.ReactElement;
  currentStep: number;
  stepNumber: number;
  icon?: string;
  inputStyle?: React.CSSProperties;
  showCaret?: boolean;
  password?: string;
  setAlert?: React.Dispatch<
    React.SetStateAction<{
      message: string;
      status: boolean;
    }>
  >;
};

export type Switch = { checked: boolean; handleSwitchChange?: () => void };
export type TopLayoutProps = {
  text: string;
  // BannerImage: string;
  TopImage: string;
  onTopImageClick: () => void;
  // onBannerImageClick: () => void;
  isBackgroundImage: boolean;
};

export type TokenInfo = {
  tokenName: string;
  usdAmount: number;
  tokenSymbol?: string;
  tokenAmount: number;
  tokenDecimal?: number;
  tokenAddress?: string;
  tokenNetwork?: number;
  image: string;
};
export type SetTokenDetail = React.Dispatch<
  React.SetStateAction<{
    open: boolean;
    name: string;
    price: number;
    priceChange: number;
    time: string;
    address: string;
    chain: number;
  }>
>;
export type SetActiveToken = React.Dispatch<
  React.SetStateAction<{
    chainId: number;
    index: number;
  }>
>;
export type AccordionProps = {
  symbolSrc?: string;
  isSwap?: boolean;
  isShow?: boolean;
  isDashboard?: boolean;
  handleAccordionClick: () => void;
  handleClose?: () => void;
  tokenInfo: TokenInfo;
  setTokenDetail?: SetTokenDetail;

  chainName: string;
  value?: number;
  onClick?: () => void;
  accordionRows: {
    [key: string]: {
      priceInUSD: number;
      tokenBalance: number;
    };
  };
  active?: boolean;
  chainId?: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  setToken?: SetToken["token"];
  setFromToken?: React.Dispatch<React.SetStateAction<number>>;
  setActiveToken?: SetActiveToken;
};
export type TokenValuesProps = {
  tokenName?: string;
  usdAmount: number;
  tokenAmount: number;
  tokenSymbol?: string;
};
export type AccordionRowProps = {
  value: string;
  imageSrc: string;
  tokenInfo: TokenInfo;
  isLast: boolean;
  isDashboard?: boolean;

  address: string;
  isSwap?: boolean;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  setToken?: SetToken["token"];
  handleClose?: () => void;
  setFromToken?: React.Dispatch<React.SetStateAction<number>>;
  isShow?: boolean;
  setTokenDetail?: SetTokenDetail;
};
export interface TokensHistory {
  tokensHistory: any[] | SingleEthHistory[];
}
export type StepsProps = {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isSwap?: boolean;
  setToken?: SetToken["token"];
  tokensHistory: TokenHistory;
  tokenAddress?: string;
  handleClose?: () => void;
  isShow?: boolean;
  setFromToken?: React.Dispatch<React.SetStateAction<number>>;
};

export type GenericBoxContent = {
  title: string;
  address?: string;
  isAddress: boolean;
  imageSrc: string;

  customColor?: string;
};
export type SearchBarProps = {
  placeholder: string;
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  StartAdornment?: React.ReactElement;
  EndAdornment?: React.ReactElement;
  customPadding?: number;
  disable?: boolean;
};
export type ButtonBoxProps = {
  title: string;
  customColor: string;
  marginTop?: number;
  customStyle?: React.CSSProperties;
  handleClick?: () => void;
  textColor?: string;
  isPulsate?: boolean;
  isDisabled?: boolean;
};
export type AddressInsertionProps = {
  open: boolean;
  handleClose: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  walletAddress: string;
  navigate: React.Dispatch<React.SetStateAction<number>>;
};
export type selectWalletModal = {
  open: boolean;

  handleClose: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  walletList?: string[];
};
export type StartAdornmentProps = {
  Icon: string;
};
export type PanelBoxProps = {
  title: string;
  value: string;
  borderStyle?: React.CSSProperties;
  Icon: JSX.Element | undefined;
  customColor?: string;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
};
export type TokenSelectionProps = {
  customStyle?: React.CSSProperties;
  customColor?: string;
  isStep4?: boolean;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  recieverAddress: string;
};

export type GasModalProps = {
  open: boolean;
  handleClose: () => void;
  gasPrice: GasPrice;
  hideSlippage?: boolean;
  gasOptionIndex: number;
  setGasOptionIndex: React.Dispatch<React.SetStateAction<number>>;
  slippageOptionIndex: number;
  setSlippageOptionIndex: React.Dispatch<React.SetStateAction<number>>;
  setGasPrice?: React.Dispatch<React.SetStateAction<number>>;
  handleClick?: () => Promise<void>;
};
export type ModalProps = {
  open: boolean;
  handleClose: () => void;
  isSwap?: boolean;
  setToken?: SetToken["token"];
  tokenAddress?: string;
  tokensHistory: TokenHistory;
  isShow?: boolean;
  setFromToken?: React.Dispatch<React.SetStateAction<number>>;
};
export type OptionBoxProps = {
  children: React.ReactElement;
  active: boolean;
  handleOption: (index: number) => void;
  index?: number;
  handleSelection?: () => void;
  value?: string;
};
export type SelectionBoxProps = {
  OptionList: {
    title:
      | string
      | (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
          muiName: string;
        })
      | number;
    value?: string | number;
    isIcon: boolean;
  }[];
  handleOption: (index: number) => void;
  Icon: JSX.Element;
  showDollar?: boolean;
  optionIndex: number;
  gasOptionList: boolean;
  height: number;
  customSelection: () => void;
};
export type AdvanceOptionStepProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
  gasPrice: GasPrice;
  hideSlippage?: boolean;
  gasOptionIndex: number;
  setGasOptionIndex: React.Dispatch<React.SetStateAction<number>>;
  slippageOptionIndex: number;
  setSlippageOptionIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type GasPrice = {
  safeLow: number;
  average: number;
  fast: number;
  avgWait: number;
  fastWait: number;
  safeLowWait: number;
};
export type CustomAmountComponentProps = {
  title: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
};
export type Step3Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};
export type UserInfo = {
  [key: string]: {
    [key: string]: {
      name: string;
      accounts: {
        [key: string]: {
          data: string;
          address: string;
          secretKey: string;
        };
      };
    };
  };
};
export type USERINFO = {
  [key: string]: {
    seedphrase: string;
    chains: {
      [key: string]: {
        accounts: {
          [key: string]: {
            name: string;
            address: string;
            secret: string;
          };
        };
      };
    };
  };
};
export type MnemonicReduxState = {
  isUserSavedMnemonic: boolean;
};
export interface TOKEN {
  token: {
    tokenName: string;
    tokenBalance: number;
    tokenBalanceInUsd: number;
    tokenAddress: string;
  };
}
export type SendTransactionReduxState = {
  selectedToken: {
    tokenName: string;
    tokenAddress: string;

    tokenAmount: number;
    amount: number;
    recieverAddress: string;
    tokenDecimal: number;
    tokenNetwork: number;
    address: string;
    usdAmount: number;
    nativeTokenInUsd: number;
    accountName: string;
    walletName: string;
    multiAccountExist: boolean;
  };
  clipboard: string;
  addressBook: AddressBook[];
  selectedGasValue: string;
  receipt: {
    open: boolean;
    status: boolean;
    transactionHash: string;
    blockNumber: number;

    from: string;
    to: string;
  };
  recentRecipient: {
    EVM: string;
    NEAR_TESTNET: string;
    NEAR: string;
    SOLANA: string;
  };
  transactions: {
    [key: string]: any[];
  };
  cachedTransactions: {
    [key: string]: any[];
  };

  pendingTransaction: {
    [key: string]: {
      userToken: TOKEN["token"];
      swapToken: TOKEN["token"];
      address: string;
      fromToken: number;
    }[];
  };

  slippage: number;
  swapTransactionTime: number;
  gasSpeed: string;
  sendTransactionPrice: number;
  gasPrice: 0;
};
export type SectionOneProps = {
  token: TokenDetailType;
  setToken: SetTokenDetail;
};
export type TokenDetailType = {
  open: boolean;
  name: string;
  price: number;
  priceChange: number;
  time: string;
  address: string;
  chain: number;
};
export type ExplorerSectionProps = {
  swap: boolean;
  token?: TokenDetailType;
  setToken: SetTokenDetail;
};
export type TokenDetailSectionProps = {
  token?: TokenDetailType;
  setToken: SetTokenDetail;
};
export type MainAccordionProps = {
  tokensHistory: TokenHistory;
  handleToggle?: (index: number) => void;
  handleAccordionClick: (index: number, chain: number, value: string) => void;
  activeToken?: {
    chainId: number;
    index: number;
  };
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  setToken?: SetToken["token"];
  setFromToken?: React.Dispatch<React.SetStateAction<number>>;
  isSwap?: boolean;
  isShow?: boolean;
  handleClose?: () => void;
  isDashboard: boolean;
  setActiveToken?: SetActiveToken;
  toggle?: boolean;
  setTokenDetail?: SetTokenDetail;
};

export type AddressBook = {
  ADDRESS: string;
  NAME: string;
  NOTE: string;
};
export type TransactionHistory = {
  expiry: number;
  data: string;
};
export type priceInUSD = string;
export type TransactionHistoryResult = {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  contractAddress: string;
};
export type SingleEthHistory = {
  tokenName: string;
  tokenSymbol: string;
  priceInUSD: number;
  tokenBalance: number;
  tokenAddress: string;
  image: string;
  tokenDecimal: number;
};
export type WalletReduxState = {
  apiCall: boolean;
  network: number;
  currentWalletName: string;
  tokensHistory: TokenHistory;
  toTokens: TokenHistory;
  swapToken: { [key: string]: swapTokenArray[] };
  nativeTokenBalance: {
    balance: number;
    balanceInUSD: number;
    symbol: string;
  };
  accountKeypairSolana: {
    publicKey: any;
    secretKey: any;
  };
  profit: {
    amount: number;
    symbol: string;
    status: boolean;
  };

  swap: boolean;
  nativeTokenPrice: number;

  chain: string;
  nearAccountId: string;
  nearMainnetAccountId: string;
  nearAccountNetwork: number;
};
export type nativeTokenRateReduxState = {
  price: number;
};
export type TokenHistory = {
  [key: number]: {
    [key: string]: {
      tokenBalance: number;
      tokenDecimal: string;
      tokenName: string;
      tokenAddress: string;
      priceInUSD: number;
      tokenSymbol: string;
      image: string;
      accounts: {
        [key: string]: {
          priceInUSD: number;
          tokenBalance: number;
        };
      };
    };
  };
};
export type swapTokenArray = {
  tokenName: string;
  tokenSymbol: string;
  tokenBalance: number;
  tokenAddress: string;
  priceInUSD: number;
  tokenDecimal: number;
};
export type FilteredHistory = {
  tokenName: string;
  tokenSymbol: string;
  tokenBalance: number;
  tokenAddress: string;
  tokenDecimal: string;
  priceInUSD?: number;
  image?: string;
};

export type Tokens = {
  [key: string]: number;
};
export type CoinData = {
  [key: string]: {
    data: number[];
    name: string;
  };
};
export type PasswordStepProps = {
  changeStep: (number: number) => void;
  currentStep: number;
};
export type SwapTokenBoxProps = {
  title: string;
  tokenName: string;
  tokenImageSrc?: string;
  amountInUsd: number;
  nativeAmount: number;
  handleClick?: () => void;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  isPulsate: boolean;
};
export type AccountSelectionAccordianRowProps = {
  value: string;
  controlProps: (item: string) => {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    name: string;
    inputProps: {
      "aria-label": string;
    };
    checkedIcon: JSX.Element;
    icon: JSX.Element;
  };
  showLine: boolean;
};
export interface SetToken {
  token: React.Dispatch<
    React.SetStateAction<{
      tokenName: string;
      tokenBalance: number;
      tokenBalanceInUsd: number;
      tokenAddress: string;
      tokenDecimal: number;
    }>
  >;
}
export type TokenAccordianProps = {
  value: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isSwap?: boolean;
  setToken?: SetToken["token"];
  tokensHistory: TokenHistory;
  tokenAddress?: string;
  handleClose?: () => void;
  isShow?: boolean;

  setFromToken?: React.Dispatch<React.SetStateAction<number>>;
};
export type TransactionFeesProps = {
  gasPrice: number;
  loading: boolean;
  transactionPrice: number;
  isShowTitle: boolean;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  modalProps: GasModalProps;
};
export type TxHistoryProps = {
  tokenSymbol?: string;
  chain?: number;
  height: number;
};
export interface RainbowButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: React.ReactNode;
  width?: number;
  onHoldComplete?: () => void;
}
export type ImportProps = {
  accountImport: boolean;
};
export type SeedPhraseS1Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};
export type DetailedDataProps = {
  startAnimate: () => void;
};
export type ChainComponentProps = {
  value: number;
  onClick: () => void;
};
export type ConnectionBadgeProps = {
  animation: string;
  pending?: boolean;
  loading?: boolean;
  connected?: boolean;
};
export type DashboardHeaderProps = {
  animation: string;
  onExpand: () => void;
};
export type TxHistoryAmountProps = {
  TxType: string;
  amount: string;
  symbol: string;
  image: string;
  amount0?: string;
  amount2?: string;
  symbol0?: string;
  symbol2?: string;
  image0?: string;
  image2?: string;
};
export type TxHistoryButtonsProps = {
  txHash: string;
  network: number;
};
export type TxHistoryResultingBalanceProps = {
  amount0: string;
  amount2: string;
  symbol0: string;
  symbol2: string;
  amountInUSD0: string;
  amountInUSD2: string;
  balance0: string;
  balance2: string;
};
export type TxHistoryRouteProps = {
  from: string;
  to: string;
};
export type TxHistorySpeedupCancelBtnProps = {
  speedUpFn: () => void;
  cancelFn: () => void;
};
export type TxHistoryTitleProps = {
  TxType: string;
  toOrFrom: string;
  chainId: number;
  status?: string;
};
export type TxHistoryTokenPricesProps = {
  symbol0: string;
  symbol2: string;
  tokenPrice0: string;
  tokenPrice2: string;
};
export type TxHistoryTransactionProps = {
  amountInUSD: string;
  gasFeeInUSD: string;
};
export type TxHistoryReceivedProps = {
  item: {
    TxType: string;
    from: string;
    to: string;
    contractAddress: string;
    amount: string;
    network: number;
    symbol: string;
    txHash: string;
    amountInUSD: string;
    image: string;
    gasFeeInUSD: string;
  };
};
export type TxHistorySendingProps = {
  item: {
    hash: string;
    rough: any;
    TxType: string;
  };
};
export type TxHistorySentProps = {
  item: {
    TxType: string;
    from: string;
    to: string;
    contractAddress: string;
    amount: string;
    network: number;
    symbol: string;
    txHash: string;
    amountInUSD: string;
    image: string;
    gasFeeInUSD: string;
  };
};
export type TxHistorySwapProps = {
  item: {
    TxType: string;
    from: string;
    to: string;
    contractAddress1: string;
    contractAddress2: string;
    amount1: string;
    amount2: string;
    network: number;
    symbol1: string;
    symbol2: string;
    txHash: string;
    amountInUSD1: string;
    amountInUSD2: string;
    image1: string;
    image2: string;
    gasFeeInUSD: string;
    tokenPrice1: string;
    tokenPrice2: string;
    balance1: string;
    balance2: string;
  };
};
export type TxHistorySwappingProps = {
  item: {
    hash: string;
    rough: any;
    TxType: string;
  };
};
export type ListItemContainerProps = {
  tokenName: string;
  tokenSymbol: string;
  priceInUSD: string;
  tokenBalance: number;
  swap: boolean;
};
export type ListItemValueBoxProps = {
  isChain: boolean;
  usdAmount: number;
};
export type PasswordMainProps = {
  ContentArray: {
    content: JSX.Element;
  }[];
  currentStep: number;
};
