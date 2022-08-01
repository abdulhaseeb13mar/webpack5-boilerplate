import { keyStores } from "near-api-js";
import { Chain, CustomChain } from "@ethereumjs/common";

import {
  AuroraLogo,
  AvalancheLogo,
  CronosLogo,
  FantomLogo,
  NearLogo,
  SolanaLogo,
  EthereumLogo,
  LogoBNB,
  Polygon,
} from "assets/images";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { ReceivedIcon, SentIcon, SwapIcon } from "assets/Icons";

export const RPC_URL =
  "https://speedy-nodes-nyc.moralis.io/93b5e495700257c1f1635d38/eth/mainnet";
export const CURRENTLY_IN_DEVELOPMENT = true;
export const OPEN_IN_WEB = chrome.storage ? false : true;
export const STORAGE = OPEN_IN_WEB ? undefined : chrome.storage.sync;
export const baseURL = "https://api.coingecko.com/api/v3";
export const DUMMY_IMAGE_URL =
  "https://media.istockphoto.com/photos/pastel-colored-paper-background-picture-id942599722?k=20&m=942599722&s=612x612&w=0&h=aXtvLGY7hg8kJuIgJRSHFRQypahRnGPQeeusGeqiqWY=";
/////////////////////////////////////
///                               ///
///             COMMON            ///
///                               ///
/////////////////////////////////////
export const GRAPH_EXPIRY = 3600000;
export const LOGIN_EXPIRY = 3600000;
export const EXTENDED_TIME = LOGIN_EXPIRY / 2;
export const ETHERSCAN_API_KEY = "M193VGUECIDFKWVWAJA9ZPQNKBANY9613B";
export const BSC_API_KEY = "E4EU36PNSJEURVVB9FZEZ5VEW6VMAM83WS";
export const POLYGON_API_KEY = "9RQBN2EHMAFFZUGTH9IKZK4IHJV7U4MIPU";
export const FANTOM_API_KEY = "GT2TBRWHRDCSJHIPPSRX5J36NJ3K34Q28P";
export const GET_GAS_PRICE = "https://ethgasstation.info/api/ethgasAPI.json";
export const GET_GAS_PRICE_MATIC =
  "https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=9RQBN2EHMAFFZUGTH9IKZK4IHJV7U4MIPU";
export const GET_GAS_PRICE_BSC =
  "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=6MH6338G1KQ1GWS423AICCF3G3DP6EFF1Z";
export const LOCAL_SERVER_URL = "http://localhost:5000";
const BINANCE_OX_API = "https://bsc.api.0x.org";
const POLYGON_OX_API = "https://polygon.api.0x.org";
const ETHEREUM_OX_API = "https://api.0x.org";
const ETHEREUM_OX_API_ROPSTEN = "https://ropsten.api.0x.org";
export const CACHE_TIME = 60000;
export const USD_CACHE_TIME = 30000;
export const ETHEREUM_USDT_ADDRESS =
  "0xdac17f958d2ee523a2206206994597c13d831ec7";
export const BINANCE_USDT_ADDRESS =
  "0xe9e7cea3dedca5984780bafc599bd69add087d56";
export const POLYGON_USDT_ADDRESS =
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
export const WETH_SYMBOL = "weth";
export const WBNB_SYMBOL = "wbnb";
export const WMATIC_SYMBOL = "wmatic";
export const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const SOLANA_ADDRESS = "0x41848d32f281383F214C69B7b248DC7C2E0a7374";
export const WBNB_ADDRESS = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
export const WMATIC_ADDRESS = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
export const ETHEREUM_COINGECKO_ID = "ethereum";
export const BINANCE_COIN_COINGECKO_ID = "binancecoin";
export const MATIC_COINGECKO_ID = "matic-network";
export const SONAR_WALLET_ADDRESS =
  "0xE37C4bADb0ccE83AFEAc9b838724c4B31845Ff2d";
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
export const EXCHANGE_PROXY_ADDRESS_0X =
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

export const PANCAKE_V2_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
export const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export const SWAP_EXPIRATION_TIME = (Date.now() + 600000).toString();
export const ETHEREUM_MAINNET = "ETHEREUM_MAINNET";
export const ETHEREUM_ROPSTEN = "ETHEREUM_ROPSTEN";
export const POLYGON_MAINNET = "POLYGON_MAINNET";
export const POLYGON_TESTNET = "POLYGON_TESTNET";
export const BINANCE_SMART_CHAIN = "BINANCE_SMART_CHAIN";
export const BSC_TESTNET = "BSC_TESTNET";

export const NODE_URL = "NODE_URL";

export const API = "API";
export const BITQUERY_NETWORK = "BITQUERY_NETWORK";
export const WRAPPED_SYMBOL = "WRAPPED_SYMBOL";
export const WRAPPED_ADDRESS = "WRAPPED_ADDRESS";
export const COINGECKO_ID = "COINGECKO_ID";
export const API_KEY = "API_KEY";
export const NATIVE_TOKEN_NAME = "NATIVE_TOKEN_NAME";
export const NATIVE_TOKEN_SYMBOL = "NATIVE_TOKEN_SYMBOL";
export const NEAR_TESTNET = "NEAR_TESTNET";
export const NEAR_MAINNET = "NEAR";
export const NEAR = "NEAR";
export const SOLANA_DEVNET = "SOLANA_DEVNET";
export const SOLANA_MAINNET = "SOLANA_MAINNET";
export const TESTNET = "TESTNET";
export const ROPSTEN = "ROPSTEN";
export const RINKEBY = "RINKEBY";
export const SOLANADEVNET = "DEVNET";
// export const SWAP_EXPIRATION_TIME = parseInt(
//   (Date.now() + 900) / 1000
// ).toString();

/////////////////////////////////////
///                               ///
///             DEVELOPMENT       ///
///                               ///
/////////////////////////////////////
export const ETHERSCAN_API = "https://api-ropsten.etherscan.io/api";
export const BINANCE_API = "https://api-testnet.bscscan.com/api";
export const POLYGON_API = "https://api-testnet.polygonscan.com/api";
export const FANTOM_API = "https://api-testnet.ftmscan.com/api";
export const ETH_NODE_URL =
  "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
export const BSC_NODE_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
export const POLYGON_NODE_URL = "https://rpc-mumbai.maticvigil.com/";
export const ETHEREUM_CHAIN_TX = Chain.Ropsten;
export const POLYGON_CHAIN_TX = CustomChain.PolygonMumbai;
export const BINANCE_CHAIN_TX = {
  name: "bnb",
  networkId: 97,
  chainId: 97,
};
export const SUPPORTED_NETWORKS = [
  { value: "ropsten", name: "Ethereum" },
  { value: "Polygon", name: "Polygon" },
  { value: "Binance Smart Chain", name: "Binance Smart Chain" },
];
export const BITQUERY_ETHEREUM_NETWORK = "ethereum";
export const BITQUERY_BNB_NETWORK = "bsc_testnet";
export const BITQUERY_POLYGON_NETWORK = "matic";
export const ETHEREUM_RINKEBY = "ETHEREUM_RINKEBY";
export const CHAIN_TX = "CHAIN_TX";
export const NATIVE_TOKEN_COINGECKO_ID = "NATIVE_TOKEN_COINGECKO_ID";
export const GET_SWAP_TOKEN_API = "GET_SWAP_TOKEN_API";
export const OX_API = "OX_API";
export const SCAN_LINK = "SCAN_LINK";
export const LOGO = "LOGO";
export const COMMITMENT = "confirmed";
export const EVM = "EVM";
export const SOLANA = "SOLANA";

export const ACCOUNTS = "accounts";
export const secretKey = "secretKey";
export const DEVNET = "devnet";
export const MAINNET = "mainnet-beta";

export const CURRENT_NETWORK = "devnet";
export const ACCOUNT_ADDRESS = "0x8b1c8Fd6B72D5707eC99a87BcE016DD899890e30";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const PRIVATE_KEY =
  "0xb1ec69f6728f5c9acf666850438d9d2f4221c31a3dd1db9b0d12d0f5d6af6315";
/////////////////////////////////////
///                               ///
///          PRODUTION            ///
///                               ///
/////////////////////////////////////
export const TEST_NETWORK = "testnet";
export const MAIN_NETWORK = "default";
export const NETWORK_ID = "networkId";
export const NEAR_MAINNET_HEX_ADDRESS_LENGTH = 64;
export const FT_TRANSFER_GAS = parseNearAmount("0.00000000003");
export const MAX_GAS_PRICE = 713252;
export const FT_TRANSFER_DEPOSIT = "1";
const NEAR_BASE_URL = "https://api.kitwallet.app";
const NEAR_TESTNET_BASE_URL = "https://testnet-api.kitwallet.app";

export const SUPPORTEDCHAINS = {
  EVM: "EVM",
  NEAR_TESTNET: "NEAR_TESTNET",
  SOLANA: "SOLANA",
  NEAR,
};
export const ACCOUNT1 = "ACCOUNT1";
export const CHAINS = "chains";
export const PASSWORD = "password";
export const SEEDPHRASE = "seedphrase";
export const STATIC_WALLET_NUMBER = 1;
export const SECRET = "secret";
export const FAST = "Fast";
export const SLOW = "Slow";
export const AVERAGE = "Average";
export const SEND = "Send";
export const FROM = "FROM";
export const RECEIVE = "Receive";
export const NEAR_ADDRESS = "0x1fa4a73a3f0133f0025378af00236f3abdee5d63";
////=========================CHAINMAP TO SWITCH BETWEEN MAINNET AND ROPSTEN
export enum SupportedChainId {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_ROPSTEN = 3,
  ETHEREUM_RINKEBY = 4,
  POLYGON_MAINNET = 137,
  POLYGON_TESTNET = 80001,
  BINANCE_SMART_CHAIN = 56,
  BSC_TESTNET = 97,
  FANTOM_MAINNET = 250,
  FANTOM_TESTNET = 4002,
  CRONOS_MAINNET = 25,
  CRONOS_TESTNET = 338,
  AVALANCHE_MAINNET = 43114,
  AVALANCHE_TESTNET = 43113,
  AURORA_MAINNET = 1313161554,
  AURORA_TESTNET = 1313161555,
  NEAR_TESTNET = 100,
  NEAR = 101,
  SOLANA_DEVNET = 102,
  SOLANA_MAINNET = 103,
}
export const CONFIG = {
  [SupportedChainId.NEAR_TESTNET]: {
    networkId: TEST_NETWORK,
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl: `https://rpc.${TEST_NETWORK}.near.org`,
    walletUrl: `https://wallet.${TEST_NETWORK}.near.org`,
    helperUrl: NEAR_TESTNET_BASE_URL,
    explorerUrl: `https://explorer.${TEST_NETWORK}.near.org`,
  },
  [SupportedChainId.NEAR]: {
    networkId: MAIN_NETWORK,
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl: `https://rpc.mainnet.near.org`,
    walletUrl: `https://wallet.mainnet.near.org`,
    helperUrl: NEAR_BASE_URL,
    explorerUrl: `https://explorer.mainnet.near.org`,
  },
};

export const NETWORKCHAIN = {
  [SupportedChainId.ETHEREUM_MAINNET]: {
    NAME: "Ethereum Mainnet",
    API: "https://api.etherscan.io/api",
    NODE_URL: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "ethereum",
    WRAPPED_ADDRESS: WETH_ADDRESS,
    COINGECKO_ID: ETHEREUM_COINGECKO_ID,
    API_KEY: ETHERSCAN_API_KEY,
    NATIVE_TOKEN_NAME: "Ethereum",
    NATIVE_TOKEN_SYMBOL: "ETH",
    NATIVE_TOKEN_COINGECKO_ID: "ethereum",
    GET_SWAP_TOKEN_API: "https://api.0x.org/swap/v1/tokens",
    OX_API: ETHEREUM_OX_API,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://etherscan.io/tx",
    GET_GAS_PRICE: "https://ethgasstation.info/api/ethgasAPI.json",
    LOGO: EthereumLogo,
    isTestnet: true, //chnage hoga
    isSwap: true,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "0x1",
  },
  [SupportedChainId.ETHEREUM_ROPSTEN]: {
    NAME: "Ethereum Ropsten",
    API: "https://api-ropsten.etherscan.io/api",
    NODE_URL: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    CHAIN_TX: Chain.Ropsten,
    SUPPORTED_NETWORKS: [{ value: "ropsten", name: "Ethereum" }],
    BITQUERY_NETWORK: "ethereum",
    WRAPPED_ADDRESS: WETH_ADDRESS,
    COINGECKO_ID: ETHEREUM_COINGECKO_ID,
    API_KEY: ETHERSCAN_API_KEY,
    NATIVE_TOKEN_NAME: "Ethereum",
    NATIVE_TOKEN_SYMBOL: "ETH",
    NATIVE_TOKEN_COINGECKO_ID: "ethereum",
    GET_SWAP_TOKEN_API: "https://ropsten.api.0x.org/swap/v1/tokens",
    OX_API: ETHEREUM_OX_API_ROPSTEN,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://ropsten.etherscan.io/tx",
    GET_GAS_PRICE: "https://ethgasstation.info/api/ethgasAPI.json",
    LOGO: EthereumLogo,
    isTestnet: true,
    isSwap: true,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.ETHEREUM_RINKEBY]: {
    NAME: "Ethereum Rinkeby",
    API: "https://api-rinkeby.etherscan.io/api",
    NODE_URL: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    CHAIN_TX: Chain.Rinkeby,
    SUPPORTED_NETWORKS: [{ value: "rinkeby", name: "Ethereum" }],
    BITQUERY_NETWORK: "ethereum",
    WRAPPED_ADDRESS: WETH_ADDRESS,
    COINGECKO_ID: ETHEREUM_COINGECKO_ID,
    API_KEY: ETHERSCAN_API_KEY,
    NATIVE_TOKEN_NAME: "Ethereum",
    NATIVE_TOKEN_SYMBOL: "ETH",
    NATIVE_TOKEN_COINGECKO_ID: "ethereum",
    GET_SWAP_TOKEN_API: "https://ropsten.api.0x.org/swap/v1/tokens",
    OX_API: ETHEREUM_OX_API,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://rinkeby.etherscan.io/tx",
    GET_GAS_PRICE: "https://ethgasstation.info/api/ethgasAPI.json",
    LOGO: EthereumLogo,
    isTestnet: true,
    isSwap: false,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.POLYGON_MAINNET]: {
    NAME: "Polygon Mainnet",
    API: "https://api.polygonscan.com/api",
    NODE_URL: "https://polygon-rpc.com/",
    CHAIN_TX: CustomChain.PolygonMainnet,
    SUPPORTED_NETWORKS: [{ value: "Polygon", name: "Polygon" }],
    BITQUERY_NETWORK: "matic",
    WRAPPED_ADDRESS: WMATIC_ADDRESS,
    COINGECKO_ID: MATIC_COINGECKO_ID,
    API_KEY: POLYGON_API_KEY,
    NATIVE_TOKEN_NAME: "Polygon",
    NATIVE_TOKEN_SYMBOL: "matic",
    NATIVE_TOKEN_COINGECKO_ID: "matic-network",
    GET_SWAP_TOKEN_API: "https://matcha.xyz/tokenlists/137.json",
    OX_API: POLYGON_OX_API,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://polygonscan.com/tx",
    GET_GAS_PRICE: GET_GAS_PRICE_MATIC,
    LOGO: Polygon,
    isTestnet: true, //chnage hoga
    isSwap: true,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "0x89",
  },
  [SupportedChainId.POLYGON_TESTNET]: {
    NAME: "Polygon Testnet",
    API: "https://api-testnet.polygonscan.com/api",
    NODE_URL: "https://rpc.ankr.com/polygon_mumbai", // https://rpc-mumbai.matic.today
    CHAIN_TX: CustomChain.PolygonMumbai,
    SUPPORTED_NETWORKS: [{ value: "Polygon", name: "Polygon" }],
    BITQUERY_NETWORK: "matic",
    WRAPPED_ADDRESS: WMATIC_ADDRESS,
    COINGECKO_ID: MATIC_COINGECKO_ID,
    API_KEY: POLYGON_API_KEY,
    NATIVE_TOKEN_NAME: "Polygon",
    NATIVE_TOKEN_SYMBOL: "matic",
    NATIVE_TOKEN_COINGECKO_ID: "matic-network",
    GET_SWAP_TOKEN_API: "https://matcha.xyz/tokenlists/137.json",
    OX_API: POLYGON_OX_API,
    ROUTER: UNISWAP_V2_ROUTER,
    SCAN_LINK: "https://mumbai.polygonscan.com/tx",
    GET_GAS_PRICE: GET_GAS_PRICE_MATIC,
    LOGO: Polygon,
    isTestnet: false,
    isSwap: false,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.BINANCE_SMART_CHAIN]: {
    NAME: "Binance Smart Chain",
    API: "https://api.bscscan.com/api",
    NODE_URL: "https://bsc-dataseed.binance.org/",
    CHAIN_TX: {
      name: "bnb",
      networkId: 56,
      chainId: 56,
    },
    SUPPORTED_NETWORKS: [
      { value: "Binance Smart Chain", name: "Binance Smart Chain" },
    ],
    BITQUERY_NETWORK: "bsc",
    WRAPPED_ADDRESS: WBNB_ADDRESS,
    COINGECKO_ID: BINANCE_COIN_COINGECKO_ID,
    API_KEY: BSC_API_KEY,
    NATIVE_TOKEN_NAME: "BNB",
    NATIVE_TOKEN_SYMBOL: "BNB",
    NATIVE_TOKEN_COINGECKO_ID: "binancecoin",
    GET_SWAP_TOKEN_API: "https://matcha.xyz/tokenlists/56.json",
    OX_API: BINANCE_OX_API,
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://bscscan.com/tx",
    GET_GAS_PRICE:
      "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=6MH6338G1KQ1GWS423AICCF3G3DP6EFF1Z",
    LOGO: LogoBNB,
    isTestnet: true,
    isSwap: true,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "0x38",
  },
  [SupportedChainId.BSC_TESTNET]: {
    NAME: "Bsc Testnet",
    API: "https://api-testnet.bscscan.com/api",
    NODE_URL: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    CHAIN_TX: {
      name: "bnb",
      networkId: 97,
      chainId: 97,
    },
    SUPPORTED_NETWORKS: [
      { value: "Binance Smart Chain", name: "Binance Smart Chain" },
    ],
    BITQUERY_NETWORK: "bsc_testnet",
    WRAPPED_ADDRESS: WBNB_ADDRESS,
    COINGECKO_ID: BINANCE_COIN_COINGECKO_ID,
    API_KEY: BSC_API_KEY,
    NATIVE_TOKEN_NAME: "BNB",
    NATIVE_TOKEN_SYMBOL: "BNB",
    NATIVE_TOKEN_COINGECKO_ID: "binancecoin",
    GET_SWAP_TOKEN_API: "https://matcha.xyz/tokenlists/56.json",
    OX_API: BINANCE_OX_API,
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://testnet.bscscan.com/tx",
    GET_GAS_PRICE:
      "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=6MH6338G1KQ1GWS423AICCF3G3DP6EFF1Z",
    LOGO: LogoBNB,
    isTestnet: false,
    isSwap: false,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.FANTOM_MAINNET]: {
    NAME: "Fantom Mainnet",
    API: "https://api.ftmscan.com/api",
    NODE_URL: "https://rpc.ftm.tools/",
    CHAIN_TX: {
      name: "ftm",
      networkId: 250,
      chainId: 250,
    },
    SUPPORTED_NETWORKS: [{ value: "fantom", name: "fantom" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    COINGECKO_ID: "fantom",
    API_KEY: "9V5QFDM7PGMHX9B4P7DH1W3MKGHCY5GASE",
    NATIVE_TOKEN_NAME: "fantom",
    NATIVE_TOKEN_SYMBOL: "FTM",
    NATIVE_TOKEN_COINGECKO_ID: "fantom",
    GET_SWAP_TOKEN_API: "https://fantom.api.0x.org/swap/v1/tokens",
    OX_API: "https://fantom.api.0x.org/",
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://ftmscan.com/tx",
    GET_GAS_PRICE:
      "https://api.ftmscan.com/api?module=gastracker&action=gasoracle&apikey=9V5QFDM7PGMHX9B4P7DH1W3MKGHCY5GASE",
    LOGO: FantomLogo,
    isTestnet: true, //chnage hoga
    isSwap: true,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "0xfa",
  },
  [SupportedChainId.FANTOM_TESTNET]: {
    NAME: "Fantom Testnet",
    API: "https://api-testnet.ftmscan.com/api",
    NODE_URL: "https://rpc.testnet.fantom.network",
    CHAIN_TX: {
      name: "ftm",
      networkId: 4002,
      chainId: 4002,
    },
    SUPPORTED_NETWORKS: [{ value: "fantom", name: "fantom" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    COINGECKO_ID: "fantom",
    API_KEY: "9V5QFDM7PGMHX9B4P7DH1W3MKGHCY5GASE",
    NATIVE_TOKEN_NAME: "fantom",
    NATIVE_TOKEN_SYMBOL: "FTM",
    NATIVE_TOKEN_COINGECKO_ID: "fantom",
    GET_SWAP_TOKEN_API: "https://fantom.api.0x.org/swap/v1/tokens",
    OX_API: "https://fantom.api.0x.org/",
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://testnet.ftmscan.com/tx",
    GET_GAS_PRICE:
      "https://api.ftmscan.com/api?module=gastracker&action=gasoracle&apikey=9V5QFDM7PGMHX9B4P7DH1W3MKGHCY5GASE",
    LOGO: FantomLogo,
    isTestnet: false,
    HEX_CHAIN_ADDRESS: "",
    isSwap: false,
    chain: SUPPORTEDCHAINS.EVM,
  },
  [SupportedChainId.AVALANCHE_MAINNET]: {
    NAME: "Avalanche Mainnet",
    API: "https://api.snowtrace.io/api",
    NODE_URL: "https://api.avax.network/ext/bc/C/rpc",
    CHAIN_TX: {
      name: "avax",
      networkId: 43114,
      chainId: 43114,
    },
    SUPPORTED_NETWORKS: [{ value: "avax", name: "avax" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    COINGECKO_ID: "avalanche-2",
    API_KEY: "4MW725HAAHIU7R1J9DYPT9ES3MGYRDNE2Y",
    NATIVE_TOKEN_NAME: "avalanche",
    NATIVE_TOKEN_SYMBOL: "avax",
    NATIVE_TOKEN_COINGECKO_ID: "avalanche-2",
    GET_SWAP_TOKEN_API: "https://avalanche.api.0x.org/swap/v1/tokens",
    OX_API: "https://avalanche.api.0x.org/",
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://snowtrace.io/tx",
    GET_GAS_PRICE:
      "https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice&apikey=4MW725HAAHIU7R1J9DYPT9ES3MGYRDNE2Y",
    LOGO: AvalancheLogo,
    isTestnet: true, //chnage hoga
    isSwap: true,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.AVALANCHE_TESTNET]: {
    NAME: "Avalanche Testnet",
    API: "https://api-testnet.snowtrace.io/api",
    NODE_URL: "https://rpc.ankr.com/avalanche_fuji",
    CHAIN_TX: {
      name: "avax",
      networkId: 43113,
      chainId: 43113,
    },
    SUPPORTED_NETWORKS: [{ value: "avax", name: "avax" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    COINGECKO_ID: "avalanche-2",
    API_KEY: "4MW725HAAHIU7R1J9DYPT9ES3MGYRDNE2Y",
    NATIVE_TOKEN_NAME: "avalanche",
    NATIVE_TOKEN_SYMBOL: "avax",
    NATIVE_TOKEN_COINGECKO_ID: "avalanche-2",
    GET_SWAP_TOKEN_API: "https://avalanche.api.0x.org/swap/v1/tokens",
    OX_API: "https://avalanche.api.0x.org/",
    ROUTER: PANCAKE_V2_ROUTER,
    SCAN_LINK: "https://testnet.snowtrace.io/tx",
    GET_GAS_PRICE:
      "https://api-testnet.snowtrace.io/api?module=proxy&action=eth_gasPrice&apikey=4MW725HAAHIU7R1J9DYPT9ES3MGYRDNE2Y",
    LOGO: AvalancheLogo,
    isTestnet: false, //chnage hoga
    isSwap: true,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.CRONOS_MAINNET]: {
    NAME: "CRONOS MAINNET",
    API: "https://api.cronoscan.com/api",
    NODE_URL: "https://evm.cronos.org",
    CHAIN_TX: {
      name: "cro",
      networkId: 25,
      chainId: 25,
    },
    SUPPORTED_NETWORKS: [{ value: "CRONOS", name: "CRONOS" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23",
    COINGECKO_ID: "crypto-com-chain",
    API_KEY: "CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    NATIVE_TOKEN_NAME: "CRONOS",
    NATIVE_TOKEN_SYMBOL: "CRO",
    NATIVE_TOKEN_COINGECKO_ID: "crypto-com-chain",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://cronoscan.com/tx",
    GET_GAS_PRICE:
      "https://api.cronoscan.com/api?module=proxy&action=eth_gasPrice&apikey=CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    LOGO: CronosLogo,
    isTestnet: true, //chnage hoga
    isSwap: false,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.CRONOS_TESTNET]: {
    NAME: "CRONOS TESTNET",
    API: "https://api-testnet.cronoscan.com/api",
    NODE_URL: "https://evm-t3.cronos.org",
    CHAIN_TX: {
      name: "tcro",
      networkId: 338,
      chainId: 338,
    },
    SUPPORTED_NETWORKS: [{ value: "CRONOS", name: "CRONOS" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23",
    COINGECKO_ID: "crypto-com-chain",
    API_KEY: "CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    NATIVE_TOKEN_NAME: "CRONOS",
    NATIVE_TOKEN_SYMBOL: "CRO",
    NATIVE_TOKEN_COINGECKO_ID: "crypto-com-chain",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://testnet.cronoscan.com/tx",
    GET_GAS_PRICE:
      "https://api.cronoscan.com/api?module=proxy&action=eth_gasPrice&apikey=CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    LOGO: CronosLogo,
    isTestnet: false, //chnage hoga
    isSwap: false,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.AURORA_MAINNET]: {
    NAME: "AURORA MAINNET",
    API: "https://api.aurorascan.dev/api",
    NODE_URL: "https://mainnet.aurora.dev	",
    CHAIN_TX: {
      name: "eth",
      networkId: 1313161554,
      chainId: 1313161554,
    },
    SUPPORTED_NETWORKS: [{ value: "AURORA", name: "AURORA" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "",
    COINGECKO_ID: "aurora",
    API_KEY: "8I7G791V4ITU4NJ3JNDZWU74AEBI7JAASB",
    NATIVE_TOKEN_NAME: "ETH",
    NATIVE_TOKEN_SYMBOL: "ETH",
    NATIVE_TOKEN_COINGECKO_ID: "ethereum",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://aurorascan.dev/tx",
    GET_GAS_PRICE:
      "https://api.aurorascan.dev/api?module=proxy&action=eth_gasPrice&apikey=CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    LOGO: AuroraLogo,
    isTestnet: true, //chnage hoga
    isSwap: false,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.AURORA_TESTNET]: {
    NAME: "AURORA TESTNET",
    API: "https://api-testnet.aurorascan.dev/api",
    NODE_URL: "https://testnet.aurora.dev",
    CHAIN_TX: {
      name: "eth",
      networkId: 1313161555,
      chainId: 1313161555,
    },
    SUPPORTED_NETWORKS: [{ value: "AURORA", name: "AURORA" }],
    BITQUERY_NETWORK: "",
    WRAPPED_ADDRESS: "",
    COINGECKO_ID: "aurora",
    API_KEY: "8I7G791V4ITU4NJ3JNDZWU74AEBI7JAASB",
    NATIVE_TOKEN_NAME: "ETH",
    NATIVE_TOKEN_SYMBOL: "ETH",
    NATIVE_TOKEN_COINGECKO_ID: "ethereum",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://testnet.aurorascan.dev/tx",
    GET_GAS_PRICE:
      "https://api.aurorascan.dev/api?module=proxy&action=eth_gasPrice&apikey=CQFCEBXCH68PASC3CWIZ9NBRPJ3PBJAAQ7",
    LOGO: AuroraLogo,
    isTestnet: false, //chnage hoga
    isSwap: false,
    chain: SUPPORTEDCHAINS.EVM,
    HEX_CHAIN_ADDRESS: "",
  },
  [SupportedChainId.NEAR_TESTNET]: {
    NAME: "Near Testnet",
    API: NEAR_TESTNET_BASE_URL,
    NODE_URL: "https://rpc.testnet.near.org",
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "",
    WRAPPED_SYMBOL: NEAR,
    WRAPPED_ADDRESS: NATIVE_TOKEN_ADDRESS,
    COINGECKO_ID: "near",
    API_KEY: "",
    NATIVE_TOKEN_NAME: NEAR,
    NATIVE_TOKEN_SYMBOL: NEAR,
    NATIVE_TOKEN_COINGECKO_ID: "near",
    GET_SWAP_TOKEN_API: "https://api.0x.org/swap/v1/tokens",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://explorer.testnet.near.org/transactions",
    LOGO: NearLogo,
    isTestnet: true, //change hoga
    isSwap: false,
    chain: SUPPORTEDCHAINS.NEAR_TESTNET,
    HEX_CHAIN_ADDRESS: "",
    GET_GAS_PRICE: "",
  },
  [SupportedChainId.NEAR]: {
    NAME: "Near",
    API: NEAR_BASE_URL,
    NODE_URL: "https://rpc.mainnet.near.org",
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "ethereum",
    WRAPPED_SYMBOL: NEAR,
    WRAPPED_ADDRESS: NATIVE_TOKEN_ADDRESS,
    COINGECKO_ID: "near",
    API_KEY: "",
    NATIVE_TOKEN_NAME: NEAR,
    NATIVE_TOKEN_SYMBOL: NEAR,
    NATIVE_TOKEN_COINGECKO_ID: "near",
    GET_SWAP_TOKEN_API: "https://api.0x.org/swap/v1/tokens",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://explorer.near.org/transactions",
    LOGO: NearLogo,
    isTestnet: false, //change hoga
    isSwap: false,
    chain: SUPPORTEDCHAINS.NEAR,
    HEX_CHAIN_ADDRESS: "",
    GET_GAS_PRICE: "",
  },
  [SupportedChainId.SOLANA_DEVNET]: {
    NAME: "Solana Devnet",
    API: "https://public-api.solscan.io",
    NODE_URL: "",
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "",
    WRAPPED_SYMBOL: NEAR,
    WRAPPED_ADDRESS: NATIVE_TOKEN_ADDRESS,
    COINGECKO_ID: "solana",
    API_KEY: "",
    NATIVE_TOKEN_NAME: "Solana",
    NATIVE_TOKEN_SYMBOL: "SOL",
    NATIVE_TOKEN_COINGECKO_ID: "solana",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://explorer.solana.com/tx/",
    LOGO: SolanaLogo,
    isTestnet: true,
    isSwap: false,
    chain: SUPPORTEDCHAINS.SOLANA,
    HEX_CHAIN_ADDRESS: "",
    GET_GAS_PRICE: "",
  },
  [SupportedChainId.SOLANA_MAINNET]: {
    NAME: "Solana Mainnet",
    API: "https://public-api.solscan.io",
    NODE_URL: "",
    CHAIN_TX: Chain.Mainnet,
    SUPPORTED_NETWORKS: [{ value: "homestead", name: "Ethereum" }],
    BITQUERY_NETWORK: "",
    WRAPPED_SYMBOL: NEAR,
    WRAPPED_ADDRESS: NATIVE_TOKEN_ADDRESS,
    COINGECKO_ID: "solana",
    API_KEY: "",
    NATIVE_TOKEN_NAME: "Solana",
    NATIVE_TOKEN_SYMBOL: "SOL",
    NATIVE_TOKEN_COINGECKO_ID: "solana",
    GET_SWAP_TOKEN_API: "",
    OX_API: "",
    ROUTER: "",
    SCAN_LINK: "https://explorer.solana.com/tx/",
    LOGO: SolanaLogo,
    isTestnet: false, //change hoga
    isSwap: false,
    chain: SUPPORTEDCHAINS.SOLANA,
    HEX_CHAIN_ADDRESS: "",
    GET_GAS_PRICE: "",
  },
};

export enum TX_TYPES {
  Received = "Received",
  Sent = "Sent",
  Swap = "Swap",
}

export const TxHistoryTitle: { [TxType in TX_TYPES]: any } = {
  [TX_TYPES.Received]: {
    icon: ReceivedIcon,
    title: "Received",
    subtitle: "on",
  },
  [TX_TYPES.Sent]: {
    icon: SentIcon,
    title: "Sent",
    subtitle: "to",
  },
  [TX_TYPES.Swap]: {
    icon: SwapIcon,
    title: "Swap",
    subtitle: "from",
  },
};
