import axios from "axios";
import { ethers } from "ethers";
import Web3 from "web3";
import crypto from "crypto-js";
import { Account } from "near-api-js/lib/account";
import { Near } from "near-api-js";
import * as Bip39 from "bip39";
import * as web3 from "@solana/web3.js";
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";
import { Transaction as TX } from "@ethereumjs/tx";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { BASE_URL } from "api";
import { getStorageSyncValue, setStorageSyncValue } from "@constants";
import {
  FilteredHistory,
  SingleEthHistory,
  TransactionHistory,
  TransactionHistoryResult,
  USERINFO,
  UserInfo,
} from "interfaces";
import {
  ACCOUNTS,
  API,
  baseURL,
  CHAINS,
  COMMITMENT,
  DUMMY_IMAGE_URL,
  EXCHANGE_PROXY_ADDRESS_0X,
  GET_GAS_PRICE,
  GET_SWAP_TOKEN_API,
  LOGIN_EXPIRY,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
  NETWORKCHAIN,
  OX_API,
  SECRET,
  SOLANA_ADDRESS,
  SONAR_WALLET_ADDRESS,
  SupportedChainId,
  SUPPORTEDCHAINS,
  SWAP_EXPIRATION_TIME,
  USD_CACHE_TIME,
  WRAPPED_ADDRESS,
} from "utils/constants";

const b58 = require("b58");
const splToken = require("@solana/spl-token");
const { abi } = require("../abis/erc20abi.json");
const { reflectAbi } = require("../abis/reflectabi.json");
const { pancakeSwapv2 } = require("../abis/pancakeswapV2.json");

export const convertBalanceToBaseUnit = async (
  contract: any,
  value: string
) => {
  let numOfDecimals = await contract.methods.decimals().call();
  let convertedValue = parseFloat(value) * Math.pow(10, numOfDecimals);
  return convertedValue.toString();
};

export const arraysAreIdentical = (array1: string[], array2: string[]) => {
  let isIdentical = false;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] === array2[i]) {
      isIdentical = true;
    } else {
      isIdentical = false;
      break;
    }
  }

  return isIdentical;
};

export const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const setDataWithExpiry = (key: string, data: any, expiry: number) => {
  const now = new Date();

  const item = {
    data,
    expiry: now.getTime() + expiry,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

export const fetchRates = async (coinId: string) => {
  // console.log("coinId---------", coinId);
  const { data } = await axios.get(`${baseURL}/coins/${coinId}`);

  return {
    price: data.market_data.current_price.usd || 0,
    image: data.image.thumb,
  };
};

export const fetchUsdRate = async (symbol: string) => {
  let usdRate, tokenPrice;
  if (localStorage.getItem(symbol))
    tokenPrice = JSON.parse(localStorage.getItem(symbol) as string);
  const now = new Date();
  if (tokenPrice && tokenPrice.expiry > now.getTime()) {
    usdRate = Number(tokenPrice.data);
  } else {
    usdRate = await (await fetchRates(symbol)).price;
    setDataWithExpiry(symbol, usdRate, USD_CACHE_TIME);
  }

  return usdRate;
};

export const fetchAllHoldingTokens = async (
  address: string,
  url: string,
  key: string,
  nodeURL: string,
  network: number,
  wrappedAddress: string
) => {
  try {
    const web3 = new Web3(nodeURL);

    let response;
    const txHistory: TransactionHistory = JSON.parse(
      localStorage.getItem("txHistory" + address) as string
    );
    const now = new Date();
    let obj: {
      [key: string]: TransactionHistoryResult;
    } = {};
    let erc20 = [];

    if (txHistory && txHistory?.expiry > now.getTime()) {
      response = JSON.parse(txHistory.data);
    } else {
      response = await axios.get(
        `${url}?module=account&action=tokentx&address=${address}&sort=asc&apikey=${key}`
      );

      setDataWithExpiry(
        "txHistory" + address,
        JSON.stringify(response),
        USD_CACHE_TIME
      );
    }

    const result: TransactionHistoryResult[] = response.data.result.slice(
      0,
      500
    );
    console.log("resukt", result);
    if (result.length > 0) {
      erc20 = await Promise.all(
        result.map(async (res) => {
          if (!obj[res.contractAddress]) {
            obj[res.contractAddress] = {
              tokenName: res.tokenName,
              tokenSymbol: res.tokenSymbol,
              tokenDecimal: res.tokenDecimal,
              contractAddress: res.contractAddress,
            };

            const contract = new web3.eth.Contract(abi, res.contractAddress);

            const tokenBalance = await contract.methods
              .balanceOf(address)
              .call();
            if (Number(tokenBalance) && res.tokenName) {
              return {
                tokenName: res.tokenName,
                tokenSymbol: res.tokenSymbol,
                tokenBalance:
                  Number(tokenBalance) / 10 ** Number(res.tokenDecimal),
                tokenAddress: res.contractAddress,
                tokenDecimal: res.tokenDecimal,
              };
            }
          }
        })
      );
      let filtered: FilteredHistory[] = [];

      // eslint-disable-next-line array-callback-return
      erc20?.map((token) => {
        if (token) {
          filtered.push(token);
        }
      });
      let updatedData;
      if (filtered.length > 15) {
        filtered = filtered.splice(0, 12);
      }
      updatedData = await calculateUsdPrice(filtered, network, wrappedAddress);
      console.log({ updatedData });

      return updatedData;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const calculateUsdPrice = async (
  data: FilteredHistory[],
  network: number,
  wrappedAddress: string
) => {
  return Promise.all(
    data.map(async (value) => {
      let symbol: string = value.tokenSymbol.toLowerCase();
      const address = value.tokenAddress;
      let tokenPrice = JSON.parse(localStorage.getItem(symbol) as any);
      const now = new Date();
      if (tokenPrice && tokenPrice.expiry > now.getTime()) {
        value.priceInUSD = Number(value.tokenBalance) * Number(tokenPrice.data);
      } else {
        const result = await axios.get(`${BASE_URL}/tokens/${address}`);
        if (result.data !== "not found") {
          // console.log(result.data, "==-result");
          let fetchData = await fetchRates(result.data.id);

          value.priceInUSD = parseInt(
            (Number(value.tokenBalance) * Number(fetchData.price)).toFixed(4)
          );
          value.image = fetchData.image;
          setDataWithExpiry(symbol, fetchData.price, USD_CACHE_TIME);
        } else {
          value.priceInUSD = 0;
          value.image = DUMMY_IMAGE_URL;
        }
      }

      return value;
    })
  );
};

export const fetchChainBalance = async (
  address: string,
  chainAPI: string,
  chainAPIkey: string,
  web3: Web3
) => {
  const balance = await web3.eth.getBalance(address);

  return ethers.utils.formatUnits(balance);
};

export const balanceInThatChain = async (
  address: string,
  nativeTokenNetwork: string,
  chainAPI: string,
  chainAPIkey: string,
  web3: Web3
) => {
  const usdRate = await fetchUsdRate(nativeTokenNetwork);
  const balance = await fetchChainBalance(address, chainAPI, chainAPIkey, web3);
  return {
    balance,
    balanceInUSD: usdRate * parseFloat(balance),
  };
};

export const getSwapTokens = async (network: number) => {
  let url =
    NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][GET_SWAP_TOKEN_API];
  try {
    const { data } = await axios.get(url);
    return data.tokens || data.records;
  } catch (error) {
    console.log("error in swap quote ===", error);
    throw error;
  }
};

export const getPriceChange = async (address: string) => {
  const result = await axios.get(`${BASE_URL}/tokens/${address}`);

  if (result.data !== "not found") {
    const { data } = await axios.get(`${baseURL}/coins/${result.data.id}`);
    return data.market_data.price_change_24h;
  } else return 0;
};

export const initializeTokenContract = (tokenAddress: string, web3: Web3) => {
  const contract = new web3.eth.Contract(reflectAbi, tokenAddress);
  return contract;
};

export const checkIfReflectToken = async (contract: any) => {
  try {
    let feeRateRes = await contract.methods._maxTxAmount().call();
    console.log("feeRateRes", feeRateRes);
    return true;
  } catch (error) {
    return false;
  }
};

export const getSwapContractAdressAndContract = async (
  selectToTokenAddress: string,
  selectFromTokenAddress: string,
  network: number,
  web3: Web3,
  fromToken: number,
  // amount: string,
  address: string
) => {
  let amount;

  if (selectFromTokenAddress !== NATIVE_TOKEN_ADDRESS) {
    console.log(web3);
    const SellTokenContract = initializeTokenContract(
      selectFromTokenAddress,
      web3
    );
    amount = await convertBalanceToBaseUnit(
      SellTokenContract,
      fromToken.toString()
    );
  } else {
    amount = web3.utils.toWei(fromToken.toString(), "ether");
    console.log("amount", amount, "etheer");
  }
  let routerV2,
    isReflection: boolean = false;
  let newData = {
    to: EXCHANGE_PROXY_ADDRESS_0X,
  };
  const BuyTokenContract = initializeTokenContract(selectToTokenAddress, web3);
  const SellTokenContract = initializeTokenContract(
    selectFromTokenAddress,
    web3
  );
  let reflectionValue: boolean = false;
  if (
    (await checkIfReflectToken(BuyTokenContract)) ||
    (await checkIfReflectToken(SellTokenContract))
  ) {
    console.log("reflect ko truee kardooooooo");
    reflectionValue = true;
  }
  console.log(selectFromTokenAddress, "selectFromTokenAddress", amount);
  const data = await getSwapQuote(
    selectToTokenAddress,
    selectFromTokenAddress,
    amount,
    address,
    network,
    reflectionValue
  );
  console.log("RETURNED DATAAAAAAAAAAAAAAAAAAAAAAA", data);
  if (reflectionValue || data === 400) {
    const ROUTER = NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].ROUTER;
    console.log("ROUTER============", ROUTER);
    routerV2 = new web3.eth.Contract(pancakeSwapv2, ROUTER);
    newData.to = ROUTER;
  }
  console.log("isReflection in getSwapContractAdressAndContract", isReflection);
  return { routerV2, newData, isReflection: reflectionValue, data };
};

export const getSwapQuote = async (
  buyToken: string,
  sellToken: string,
  amount: string,
  takerAddress: string,
  network: number,
  isReflection: boolean,
  slippage?: number
) => {
  try {
    console.log("getSwapQuote", {
      buyToken,
      sellToken,
      amount,
      takerAddress,
      network,
      isReflection,
      slippage,
    });
    let BASE_URL = NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][OX_API];
    const { data } = await axios.get(
      `${BASE_URL}/swap/v1/quote?takerAddress=${takerAddress}&buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${amount}&slippagePercentage=${
        slippage ? slippage / 100 : 3 / 100
      }&feeRecipient=${SONAR_WALLET_ADDRESS}&buyTokenPercentageFee=0.002&skipValidation=true${
        isReflection ? "&includedSources=PancakeSwap_V2,Uniswap" : ""
      }`
    );
    console.log("getSwapQuote", data);
    data.gas = (Number(data.gas) * 4).toString();
    return data;
  } catch (error: any) {
    console.log("error in swap quote ===", error.response);
    // if (error?.response?.data?.validationErrors?.length > 0) {
    //   return new Error(error?.response?.data?.validationErrors[0].reason);
    // }
    // if (error?.response?.data?.reason) {
    //   return new Error(error?.response?.data?.reason);
    // }
    return error.response.status;
  }
};

export const checkAllowance = async (
  web3: Web3,
  abi: AbiItem | AbiItem[],
  address: string,
  tokenAddress: string,
  ProxyAddress: string
) => {
  console.log("I AM IN CHECKALLOWANCE FUNCTION");
  let contract;
  let allowance;
  if (tokenAddress && tokenAddress !== NATIVE_TOKEN_ADDRESS) {
    contract = new web3.eth.Contract(abi, tokenAddress);
    allowance = await contract.methods.allowance(address, ProxyAddress).call();
    console.log("alloo=======", allowance);
  } else {
    allowance = 0;
    contract = "";
  }

  return { allowance: Number(allowance), contract };
};

export const getTransactionRawData = async (
  data: any,
  common: any,
  address: string
) => {
  const addressWithSecretKeys = await getChainAddressWithSecretKeys(
    SUPPORTEDCHAINS.EVM
  );
  console.log("addressWithSecretKeys", { addressWithSecretKeys }, address);
  const privateKey = addressWithSecretKeys[
    address as keyof typeof addressWithSecretKeys
  ] as string;
  console.log("privateKey", privateKey);
  let pvtKey = Buffer.from(privateKey.split("x")[1], "hex");
  console.log({ privateKey, pvtKey });
  const tx = new TX(data, { common });
  const signedTx = tx.sign(pvtKey);
  const serializedTx = signedTx.serialize();
  const raw = "0x" + serializedTx.toString("hex");
  return raw;
};

export const removeItemFromLocalStorage = (network: string, key: string) => {
  let keyToRemove;
  keyToRemove = network + "txHistory" + key;
  localStorage.removeItem(keyToRemove);
};

export const calculateAmount = async (
  address: string,
  fromToken: number,

  web3: Web3
) => {
  let amount;
  if (address !== NATIVE_TOKEN_ADDRESS) {
    const SellTokenContract = initializeTokenContract(address, web3);
    amount = await convertBalanceToBaseUnit(
      SellTokenContract,
      fromToken.toString()
    );
  } else {
    amount = web3.utils.toWei(fromToken.toString(), "ether");
  }
  return amount;
};

export const estimateGasLimit = async (
  tokenAddress: string,
  web3: Web3,
  address: string
) => {
  try {
    const contract = new web3.eth.Contract(
      abi,
      tokenAddress || NATIVE_TOKEN_ADDRESS
    );
    const estimateGas = await contract.methods
      .transfer(address, 123)
      .estimateGas({ from: address });
    return estimateGas;
  } catch (error) {
    console.log(error);
  }
};

export const calculateGasSpeed = async (
  tokenAddress: string,
  web3: Web3,
  address: string,
  network: number
) => {
  try {
    const NATIVE_TOKEN_ID =
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
        NATIVE_TOKEN_COINGECKO_ID
      ];
    const estimateGas = await estimateGasLimit(tokenAddress, web3, address);
    const gasData = await getGasPrice(network);
    console.log("gasData", gasData);
    const PriceInUSd = await fetchUsdRate(NATIVE_TOKEN_ID);
    const safeLow =
      ((gasData.safeLow * estimateGas) / 10 ** 9) * parseFloat(PriceInUSd);
    const average =
      ((gasData.average * estimateGas) / 10 ** 9) * parseFloat(PriceInUSd);
    const fast =
      ((gasData.fast * estimateGas) / 10 ** 9) * parseFloat(PriceInUSd);
    const [safeLowWait, fastWait, avgWait] = [
      gasData.safeLowWait,
      gasData.fastWait,
      gasData.avgWait,
    ];

    return {
      safeLow,
      average,
      fast,
      safeLowWait,
      fastWait,
      avgWait,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error in gas speed");
  }
};

export const calculateGasPrice = async () => {};
/* eslint-disable no-useless-escape */

export const scrollListener = () => {
  const hudChart = document.querySelector<HTMLElement>(".hud-chart");
  const chartDatabar = document.querySelector<HTMLElement>(".chart-databar");
  const tokenSection = document.querySelector<HTMLElement>(".tokens-section");
  const navigators = document.querySelector<HTMLElement>(".navigators");
  const scrollTop = document.documentElement.scrollTop;
  if (scrollTop <= 90) {
    if (tokenSection !== null) {
      tokenSection.style.marginTop = `${20 - scrollTop}px`;
    }
    if (hudChart !== null && chartDatabar !== null && navigators !== null) {
      hudChart.style.opacity = `${1 - scrollTop / 90}`;
      chartDatabar.style.opacity = `${1 - scrollTop / 90}`;
      navigators.style.opacity = "1";
    }
  } else {
    if (hudChart !== null && chartDatabar !== null && navigators !== null) {
      hudChart.style.opacity = "0";
      chartDatabar.style.opacity = "0";
      navigators.style.opacity = "0";
    }
  }
};

export const keyDownListener = (
  e: KeyboardEvent,
  currentStep: number,
  stepNumber: number,
  onEnterPress: () => void,
  onBackSpacePress: () => void,
  onValidKeyPress: (key: string) => void,
  thisPassword?: string,
  thisConfirmPassword?: string
) => {
  if (currentStep === stepNumber) {
    if (e.code === "Tab") {
      e.preventDefault();
    } else if (
      e.code === "Enter" &&
      (currentStep === 3
        ? thisPassword === thisConfirmPassword
          ? true
          : false
        : true)
    ) {
      onEnterPress();
      return;
    }
    if (
      e.code === "NumpadEnter" &&
      (currentStep === 3
        ? thisPassword === thisConfirmPassword
          ? true
          : false
        : true)
    ) {
      onEnterPress();
      return;
    }
    if (e.code === "Backspace") {
      onBackSpacePress();
      return;
    }
    const SpecialChars = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/); //check for special character
    const AlphanumericChars = new RegExp(/^[a-zA-Z0-9]*$/); //check for alphanumeric character
    if (
      e.key.length === 1 &&
      (SpecialChars.test(e.key) || AlphanumericChars.test(e.key))
    ) {
      onValidKeyPress(e.key);
    }
  }
};

export const getGasPrice = async (network: number) => {
  try {
    let data: any;
    if (
      network === SupportedChainId.AVALANCHE_MAINNET ||
      network === SupportedChainId.AVALANCHE_TESTNET ||
      network === SupportedChainId.AURORA_MAINNET ||
      network === SupportedChainId.AURORA_TESTNET
    ) {
      const res: any = await axios.get(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
      );
      console.log("PRICE RESPONSE FROM API", res);
      const gasPriceInGwei = parseInt(res.data.result) / Math.pow(10, 9);
      console.log("gasPriceInGwei", gasPriceInGwei, gasPriceInGwei * 1.2);
      data = {
        safeLow:
          gasPriceInGwei === 0
            ? gasPriceInGwei + 0.1
            : Math.ceil(gasPriceInGwei * 0.8),
        average:
          gasPriceInGwei === 0
            ? gasPriceInGwei + 0.15
            : Math.ceil(gasPriceInGwei),
        fast:
          gasPriceInGwei === 0
            ? gasPriceInGwei + 0.2
            : Math.ceil(gasPriceInGwei * 1.2),
        avgWait: 1,
        fastWait: 0.5,
        safeLowWait: 1.5,
      };
    } else if (
      network === SupportedChainId.CRONOS_MAINNET ||
      network === SupportedChainId.CRONOS_TESTNET
    ) {
      const res: any = await axios.get(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
      );
      console.log("PRICE RESPONSE FROM API", res);
      const gasPriceInGwei = parseInt(res.data.result) / Math.pow(10, 9);
      console.log("gasPriceInGwei", gasPriceInGwei);
      data = {
        safeLow: Math.ceil(gasPriceInGwei * 1.1),
        average: Math.ceil(gasPriceInGwei * 1.2),
        fast: Math.ceil(gasPriceInGwei * 1.3),
        avgWait: 1,
        fastWait: 0.5,
        safeLowWait: 1.5,
      };
    } else if (
      network === SupportedChainId.POLYGON_MAINNET ||
      network === SupportedChainId.POLYGON_TESTNET ||
      network === SupportedChainId.FANTOM_MAINNET ||
      network === SupportedChainId.FANTOM_TESTNET ||
      network === SupportedChainId.BINANCE_SMART_CHAIN ||
      network === SupportedChainId.BSC_TESTNET
    ) {
      const res: any = await axios.get(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].GET_GAS_PRICE
      );
      data = {
        safeLow: +res.data.result.SafeGasPrice,
        average: +res.data.result.ProposeGasPrice,
        fast: +res.data.result.FastGasPrice,
        avgWait: 1,
        fastWait: 0.5,
        safeLowWait: 1.5,
      };
    } else if (
      network === SupportedChainId.ETHEREUM_MAINNET ||
      network === SupportedChainId.ETHEREUM_ROPSTEN ||
      network === SupportedChainId.ETHEREUM_RINKEBY
    ) {
      console.log("network === ROPSTEN RINKEBY WGHRA");
      let res = await axios.get(GET_GAS_PRICE);
      data = res.data;
      console.log("res.data", data);
      data = {
        ...data,
        safeLow: data.safeLow / 10,
        average: data.average / 10,
        fast: data.fast / 10,
      };
    }
    // data = await axios.get(GET_GAS_PRICE);
    console.log("GET GAS PRICE RESPONSE FROM API", data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getUserInfoToSave = async (
  chain: string,
  isUserExists: UserInfo,
  address: string,
  data: string,
  secretKey: string
) => {
  let chainCount = Object.keys(isUserExists).length;
  let user: UserInfo = isUserExists;
  console.log(chainCount, "my chain Count");
  let walletCount = 1;
  if (chainCount !== 0) {
    if (user[chain]) {
      walletCount = Object.keys(user[chain]).length;
      walletCount++;
      user[chain] = {
        ...user[chain],
        [`wallet${walletCount}`]: {
          name: `wallet${walletCount}`,
          accounts: {
            [address]: {
              data,
              address,
              secretKey,
            },
          },
        },
      };
      console.log(user, "=-------------------=====NEW USE");
      // await setStorageSyncValue("userInfo", isUserExists);
    } else {
      console.log("wallet not exist on that chain");
      user = {
        ...isUserExists,

        [chain]: {
          [`wallet${walletCount}`]: {
            name: `wallet${walletCount}`,
            accounts: {
              [address]: {
                data,
                address,
                secretKey,
              },
            },
          },
        },
      };
      console.log(
        user,
        "=-------------------=====NEW USER IN CASE OF NEW CHAIN ADDI NG"
      );
      // await setStorageSyncValue("userInfo", isUserExists);
    }
    // WalletCount++;
  } else {
    console.log("first time");
    user = {
      [chain]: {
        [`wallet${walletCount}`]: {
          name: `wallet${walletCount}`,
          accounts: {
            [address]: {
              data,
              address,
              secretKey,
            },
          },
        },
      },
    };
    console.table(user);
    // await setStorageSyncValue("userInfo", isUserExists);
  }
  console.log(
    user,
    "=----#######################################USER++++++++++++++++++++++++++++++++++++++++++++++++++"
  );
  await setStorageSyncValue("userInfo", user);
};

export const addWallet = async (
  password: string,
  mnemonicWallet: ethers.Wallet,
  chain: string
) => {
  let hashedPassword = ethers.utils.hashMessage(password);
  let encryptPromise = await mnemonicWallet.encrypt(hashedPassword);

  let isUserExists = (await getStorageSyncValue("userInfo")) as UserInfo;
  console.log(isUserExists, "=------------------firts inititaeed");
  await getUserInfoToSave(
    chain,
    isUserExists,
    mnemonicWallet.address,
    encryptPromise,
    mnemonicWallet.privateKey
  );
  // await setStorageSyncValue("userInfo", isUserExists);
  await setStorageSyncValue("hashedPassword", hashedPassword);
  await setStorageSyncValue("accounts", 0);
  await setStorageSyncValue("expiry", new Date().getTime() + LOGIN_EXPIRY);

  // console.log({ userInfo });
};

export const encryptMessage = (message: string, secret: string) => {
  const ciphertext = crypto.AES.encrypt(
    JSON.stringify(message),
    secret
  ).toString();

  return ciphertext;
};

export const addNearWallet = async (
  phrase: string,
  address: string,
  secret: string,
  chain: string
) => {
  const hashedPassword = (await getStorageSyncValue(
    "hashedPassword"
  )) as string;
  let isUserExists = (await getStorageSyncValue("userInfo")) as UserInfo;
  const cipherMnemonic = encryptMessage(phrase, hashedPassword);
  const cipherPrivate = encryptMessage(secret, hashedPassword);
  await getUserInfoToSave(
    chain,
    isUserExists,
    address,
    cipherMnemonic,
    cipherPrivate
  );

  await setStorageSyncValue("hashedPassword", hashedPassword);
  await setStorageSyncValue("accounts", 0);
  await setStorageSyncValue("expiry", new Date().getTime() + LOGIN_EXPIRY);
};

export const checkAccountStatus = async (accountInfo: any) => {
  try {
    // console.log(accountInfo, "=------------------accountInfo");
    await accountInfo.state();
    return true;
  } catch (error) {
    console.log("er=====", error);
    return false;
  }
};

export const fetchBalance = async (account: Account) => {
  const balance = await account.getAccountBalance();
  console.log(balance, "=------------------balance>>>");
  return Number(balance.available) / 10 ** 24;
};

export const showAllHoldings = async (
  accountID: string,
  near: Near,
  network: number
) => {
  const { data } = await axios.get(
    `${
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][API]
    }/account/${accountID}/likelyTokens`
  );
  // retreat pen garden critic spring gallery parent alone current liar census provide
  const account = await near.account(accountID);
  let tokensInfo: SingleEthHistory[] = [];
  console.log(data, "====------------------data");
  await Promise.all(
    data.map(async (token: any) => {
      let tokenInfo = await account.viewFunction(token, "ft_metadata", {
        account_id: accountID,
      });

      let balance = await account.viewFunction(token, "ft_balance_of", {
        account_id: accountID,
      });

      tokensInfo.push({
        tokenName: tokenInfo.name,
        tokenSymbol: tokenInfo.symbol,
        tokenBalance: balance / 10 ** tokenInfo.decimals,
        tokenAddress: token,
        tokenDecimal: tokenInfo.decimals,
        image: "",
        priceInUSD: balance / 10 ** tokenInfo.decimals,
      });
    })
  );

  return tokensInfo;
};

export const decryptMessage = (cipherText: string, secret: string) => {
  let bytes = crypto.AES.decrypt(cipherText, secret);
  let decryptedText = JSON.parse(bytes.toString(crypto.enc.Utf8));

  return decryptedText;
};

export const tokenSwapWithout0xApi = async (
  userTokenAddress: string,
  swapTokenAddress: string,
  fromToken: number,
  web3: any,
  transactions: any,
  address: string,
  routerAddress: string,
  network: number,
  routerV2: any
) => {
  if (userTokenAddress === NATIVE_TOKEN_ADDRESS) {
    console.log("native into shit token swap function");
    let count = await web3.eth.getTransactionCount(address);
    const transactionsHashes = transactions[`${network}${address}`];
    if (transactionsHashes) {
      count = count + transactionsHashes.length;
    }
    let transactionObject = {
      from: address,
      to: routerAddress,
      value: web3.utils.toHex(web3.utils.toWei(fromToken.toString(), "ether")),
      nonce: "0x" + count.toString(16),
      gasPrice: web3.utils.toHex("34000000000"),
      // gasPrice: web3.utils.toHex(
      //   web3.utils.toWei(gasPrice.toFixed(2), "gwei")
      // ),
      gasLimit: web3.utils.toHex("370000"),
      data: await routerV2?.methods
        .swapExactETHForTokens(
          // data.buyAmount.toString(),
          web3.utils.toWei(fromToken.toString()), // IT IS HARD CODED VALUE THAT USER ENTERS TO SWAP          [
          [
            NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][WRAPPED_ADDRESS],
            swapTokenAddress,
          ],
          address,
          SWAP_EXPIRATION_TIME
        )
        .encodeABI(),
    };
    // await sendSignTransaction( transactionObject);

    // transactionObject.data = await routerV2?.methods
    //   .swapExactETHForTokens(
    //     data.buyAmount.toString(),
    //     [
    //       NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
    //         WRAPPED_ADDRESS
    //       ],
    //       swapTokenAddress,
    //     ],
    //     address,
    //     SWAP_EXPIRATION_TIME
    //   )
    //   .encodeABI();
    console.log("transacationObject in NATIVE TOKEN SWAP", transactionObject);
    return transactionObject;
  } else {
    console.log("Normal token into shit token swap function");
    let count = await web3.eth.getTransactionCount(address);
    const transactionsHashes = transactions[`${network}${address}`];
    if (transactionsHashes) {
      count = count + transactionsHashes.length;
    }

    const getTokenAmount = await routerV2?.methods.getAmountsOut(
      web3.utils.toWei(fromToken.toString()), // IT IS HARD CODED VALUE THAT USER ENTERS TO SWAP 0.0001
      [userTokenAddress, swapTokenAddress]
    );
    console.log("getTokenAmount=========", getTokenAmount);
    let data = await routerV2?.methods
      .swapExactTokensForTokens(
        web3.utils.toWei(fromToken.toString()), // IT IS HARD CODED VALUE THAT USER ENTERS TO SWAP
        // Amount we will get after swap,
        getTokenAmount.arguments[0],
        [userTokenAddress, swapTokenAddress],
        address,
        SWAP_EXPIRATION_TIME
      )
      .encodeABI();
    let estimatedGas = await web3.eth.estimateGas({
      to: routerAddress,
      data: data,
    });
    console.log("estimatedGas=========", estimatedGas);
    let transactionObject = {
      from: address,
      to: routerAddress,
      value: web3.utils.toHex(web3.utils.toWei(fromToken.toString(), "ether")),
      nonce: "0x" + count.toString(16),
      gasPrice: web3.utils.toHex("34000000000"),
      // gasPrice: web3.utils.toHex(
      //   web3.utils.toWei(gasPrice.toFixed(2), "gwei")
      // ),
      gasLimit: web3.utils.toHex(estimatedGas),
      data: data,
    };

    // const res = await routerV2?.methods
    //   .swapExactTokensForTokens(
    //     // Amount we will get after swap,
    //     "100000", // IT IS HARD CODED VALUE THAT USER ENTERS TO SWAP
    //     getTokenAmount.arguments[0],
    //     [userTokenAddress, swapTokenAddress],
    //     address,
    //     SWAP_EXPIRATION_TIME
    //   )
    //   .encodeABI();
    console.log("transactionObject in token to token", transactionObject);

    return transactionObject;
  }
};

export const getChainAddressWithSecretKeys = async (chain: string) => {
  const userInfo = (await getStorageSyncValue("userInfo")) as USERINFO;
  let hashedPassword = (await getStorageSyncValue("hashedPassword")) as string;
  let finalObject = {};
  Object.keys(userInfo).forEach((wallet) => {
    Object.keys(userInfo[wallet][CHAINS][chain][ACCOUNTS]).forEach(
      (account) => {
        const accountInfo = userInfo[wallet][CHAINS][chain][ACCOUNTS][account];
        finalObject = {
          ...finalObject,
          [accountInfo.address]: decryptMessage(
            accountInfo.secret,
            hashedPassword
          ),
        };
      }
    );
  });
  return finalObject;
};

export const SolanaInitialTasks = async (secretKey: string) => {
  let split = secretKey.split(" ");
  let seed, importedAccount;
  if (split.length > 1) {
    console.log("split in If", split);
    seed = Bip39.mnemonicToSeedSync(secretKey).slice(0, 32);
    importedAccount = web3.Keypair.fromSeed(seed);
  } else {
    const address = b58.decode(secretKey);
    console.log("address in ELSE", address);

    importedAccount = web3.Keypair.fromSecretKey(address);
  }
  return importedAccount;
  // const data = await getSolanaAddressWithSecretKeys();
};

export const fetchBalanceSolana = async (
  network: any,
  publicKey: any,
  image: string
) => {
  console.log("sdjdshhjdhj", publicKey.toString());
  if (!publicKey) return;

  try {
    console.log("Here in solana", network);
    let connection;

    connection = new Connection(clusterApiUrl(network), COMMITMENT);

    const balance = await connection.getBalance(publicKey);
    console.log("fetchBalanceSolana res =======", balance / LAMPORTS_PER_SOL);
    const SolanaBalance = balance / LAMPORTS_PER_SOL;
    // const data = await fetchRates("Sol");
    // console.log(" fetchBalanceSolana DATA===========", data);
    // const priceInUsd = await fetchSolanaUsdRates("SOL");
    const usdRate = await fetchUsdRate("solana");
    console.log({ usdRate });
    if (SolanaBalance) {
      return {
        tokenName: "Solana",
        tokenSymbol: "SOL",
        tokenBalance: SolanaBalance,
        priceInUSD: SolanaBalance * usdRate, // this should be price in uSd
        tokenAddress: SOLANA_ADDRESS,
        tokenDecimal: 18,
        image,
      };
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
};

const fetchTokens = async ({ account }: any) => {
  console.log("account in fetchTokens", account);
  let address = account.data.parsed.info.mint;
  let { data } = await axios.get(
    "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json"
  );
  console.log({ data });
  let tokenList = data.tokens;

  tokenList = await Promise.all(
    tokenList
      .filter((tk: any) => tk.address === address)
      .map(async (tk: any) => {
        if (tk.address === address) {
          tk.amount = account.data.parsed.info.tokenAmount.uiAmount;

          return tk;
        }
      })
  );
  return tokenList.length > 0 ? tokenList : [];
  // });
};

export const showAllHoldingsSolana = async (
  address: string,
  network: number,
  connection: web3.Connection
) => {
  try {
    console.log("ADD======", address);

    // if (network === SupportedChainId.SOLANA_DEVNET) {
    //   connection = new Connection(clusterApiUrl(DEVNET), COMMITMENT);
    // } else {
    //   connection = new Connection(clusterApiUrl(MAINNET), COMMITMENT);
    // }
    const accounts = await connection.getParsedProgramAccounts(
      splToken.TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      {
        filters: [
          {
            dataSize: 165, // number of bytes
          },
          {
            memcmp: {
              offset: 32, // number of bytes
              bytes: new web3.PublicKey(address).toString(), // base58 encoded string
            },
          },
        ],
      }
    );

    console.log("accounts in SHOW ALL HOLDING SOLANA=========", accounts);

    if (accounts.length > 0) {
      let acc = await Promise.all(
        accounts.map((acc) => {
          let tkInfo = fetchTokens(acc);
          return tkInfo;
        })
      );

      console.log("AA=========", acc);
      const tokenObject = acc.flat().map((res: any) => {
        return {
          tokenName: res.name,
          tokenSymbol: res.symbol,
          tokenBalance: res.amount,
          tokenAddress: res.address,
          tokenDecimal: res.decimals,
          priceInUSD: 0,
        };
      });
      console.log("ALL TOKEN OBJECT ", tokenObject);
      return tokenObject;
      // return acc.flat();
    } else {
      return accounts;
    }
  } catch (e: any) {
    console.log("error in showAllHoldingsSolana", e);
    throw new e();
  }
};

export const getAccountIds = async (publicKey: string, network: number) => {
  const { data } = await axios.get(
    `${
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][API]
    }/publicKey/${publicKey}/accounts`
  );
  console.log(data, "datanet");
  return data.length > 0 ? data[0] : "";
};

export const formateAmount = (value: string, decimals: number = 18) => {
  return new BigNumber(value).div(new BigNumber(10).pow(decimals)).toString();
};

export const isStringIncludesTheValue = (item: string, value: string) => {
  if (item.toLowerCase().includes(value.toLowerCase())) {
    return true;
  } else return false;
};

export const getPublicAddress = async (
  userInfo: USERINFO,
  walletNumber: number,
  accountNumber: number,
  chain: string
) => {
  const publicAddress = Object.keys(
    userInfo[`wallet${walletNumber}`][CHAINS][chain][ACCOUNTS]
  )[accountNumber];
  return publicAddress;
};

export const getPrivateKeyByPublicAddress = (
  userInfo: USERINFO,
  walletNumber: number,
  publicAddress: string,
  chain: string
) => {
  const privateKey =
    userInfo[`wallet${walletNumber}`][CHAINS][chain][ACCOUNTS][publicAddress][
      SECRET
    ];
  return privateKey;
};

export const getUserAccounts = async (wallets: string[]) => {
  let addresses: {
    [key: string]: string[];
  } = {};
  const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;

  let chains = Object.keys(SUPPORTEDCHAINS);

  wallets.forEach((wallet) => {
    chains.forEach((chain) => {
      // if (!chain.includes(TESTNET)) {
      if (addresses[chain]) {
        addresses[chain].push(
          ...Object.keys(isUserExist[wallet][CHAINS][chain][ACCOUNTS]).map(
            (account) =>
              isUserExist[wallet][CHAINS][chain][ACCOUNTS][account].address
          )
        );
      } else {
        if (isUserExist[wallet][CHAINS][chain] !== undefined) {
          addresses[chain] = Object.keys(
            isUserExist[wallet][CHAINS][chain][ACCOUNTS]
          ).map(
            (account) =>
              isUserExist[wallet][CHAINS][chain][ACCOUNTS][account].address
          );
        }
      }
      // }
    });
    console.log("MY OUTPUT LOG=====", wallets, chains, { addresses });
  });

  return addresses;
};

export const getUserSingleAccount = (
  address: string,
  allAccounts: {
    [key: string]: string[];
  }
) => {
  let data: {
    [key: string]: string[];
  } = {};
  console.log("filter me");
  Object.keys(allAccounts).every((element) => {
    // if(allAccounts[element].filter((val) => val === address){
    //   return false
    // }
    if (allAccounts[element].filter((val) => val === address).length > 0) {
      data = {
        [element]: [address],
      };
      return false;
    }
    return true;
  });
  console.log("which wallet account :-------", data, allAccounts);
  return data;
};
