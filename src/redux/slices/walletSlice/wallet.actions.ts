/* eslint-disable no-loop-func */
import Web3 from "web3";
import { Dispatch } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { connect } from "near-api-js";
import axios from "axios";

import {
  balanceInThatChain,
  fetchAllHoldingTokens,
  fetchBalance,
  fetchUsdRate,
  showAllHoldings,
} from "utils";
import { SingleEthHistory, USERINFO } from "interfaces";
import {
  addProfit,
  apiCall,
  fetchNativeTokenPrice,
  fetchTokenHistory,
  setChain,
  changeNetwork as CHANGENETWORK,
} from "@slices/walletSlice";
import {
  ACCOUNTS,
  CHAINS,
  CONFIG,
  EVM,
  NATIVE_TOKEN_ADDRESS,
  NEAR,
  NEAR_TESTNET,
  NETWORKCHAIN,
  SCAN_LINK,
  SOLANA,
  SOLANA_DEVNET,
  SOLANA_MAINNET,
  SupportedChainId,
} from "utils/constants";
import {
  setAccountNumber,
  setTotalWalletData,
  setUserAddress,
  setWalletNumber,
  showLoading,
} from "@slices/appSlice";
import { BASE_URL } from "api";
import {
  generateNotification,
  getStorageSyncValue,
  numFormatter,
} from "@constants";
import { STATIC_STRAIGHTLINE_GRAPH } from "theme/constants";
import {
  removeTransaction,
  setTransactionReceipt,
} from "@slices/sendTransaction";

export const fetchTxHistoryAction =
  (
    switchNetwork: boolean,
    switchWallet: boolean,
    address: string,
    baseURL: string,
    apiKey: string,
    nodeUrl: string,
    bitqueryNetwork: number,
    wrappedAddress: string,
    fetchHistoryAction: ActionCreatorWithPayload<any, string>,
    coingeckoId: string,
    web3: Web3,
    nativeTokenName: string,
    nativeTokenSymbol: string
  ) =>
  async (dispatch: Dispatch) => {
    try {
      console.log("FETCH HISTORY ACTION");
      const usdRate = await fetchUsdRate(coingeckoId);

      const updatedData = await fetchAllHoldingTokens(
        address,
        baseURL,
        apiKey,
        nodeUrl,
        bitqueryNetwork,
        wrappedAddress
      );
      const { balance, balanceInUSD } = await balanceInThatChain(
        address,
        coingeckoId,
        baseURL,
        apiKey,
        web3
      );

      let tokensHistory = updatedData as any as SingleEthHistory[];
      const nativeTokenBalance = {
        balance,
        balanceInUSD,
        symbol: coingeckoId,
      };
      dispatch(apiCall(true));

      if (parseFloat(nativeTokenBalance.balance) !== 0) {
        tokensHistory.unshift({
          tokenName: nativeTokenName,
          tokenSymbol: nativeTokenSymbol,
          tokenBalance: parseFloat(nativeTokenBalance.balance),
          tokenAddress: NATIVE_TOKEN_ADDRESS,
          tokenDecimal: 18,
          priceInUSD: nativeTokenBalance.balanceInUSD,
          image: "",
        });
      }
      console.log(
        "TOKENNNNN HISTORYyyyyyyyy-------------------------------------yyyyyyyyyyyyyyyyy",
        tokensHistory
      );

      dispatch(
        fetchHistoryAction({
          switchNetwork,
          tokensHistory,
          switchWallet,
        })
      );
      dispatch(fetchNativeTokenPrice(usdRate));
      dispatch(showLoading(false));
    } catch (e) {
      console.log(e);
    }
  };

export const fetchNearTokenHolding =
  (
    nearAccountId: string,
    network: number,
    switchNetwork?: boolean,
    switchWallet?: boolean
  ) =>
  async (dispatch: Dispatch) => {
    try {
      console.log("IN FETCH NEAR TOKEN HOLDING 222222");
      // @ts-ignore
      let near = await connect(CONFIG[network]);
      const account = await near.account(nearAccountId);
      console.log(account, "account");
      const availableBalance = await fetchBalance(account);
      const usdRate = await fetchUsdRate("near");
      console.log(usdRate, "usdRate>>>>>>");
      console.log(availableBalance, "availableBalance");
      let allTokens = await showAllHoldings(nearAccountId, near, network);
      if (availableBalance > 0) {
        allTokens.push({
          tokenName: "NEAR",
          tokenSymbol: "NEAR",
          tokenBalance: availableBalance,
          priceInUSD: availableBalance * usdRate,
          tokenAddress: "0x1fa4a73a3f0133f0025378af00236f3abdee5d63",
          tokenDecimal: 18,
          image: "https://near.org/images/near-logo.png",
        });
      }

      dispatch(
        fetchTokenHistory({
          tokensHistory: allTokens,
          switchNetwork,
          switchWallet,
        })
      );
      dispatch(fetchNativeTokenPrice(usdRate));
      dispatch(showLoading(false));
      console.log(allTokens, "allTokens");
    } catch (error) {
      console.log("near error", error);
      dispatch(showLoading(false));
    }
  };

export const calculateProfit =
  (Tokens: { [key: string]: number }) => async (dispatch: Dispatch) => {
    const request = await axios.post(`${BASE_URL}/graph/profit/30`, {
      ...Tokens,
    });

    const profitAmount = numFormatter(request.data);
    dispatch(addProfit(profitAmount));
  };

export const changeNetwork =
  (value: number, selectedChainIndex: number) =>
  async (dispatch: Dispatch, getState: any) => {
    const chainSelectedIndex = Object.keys(NETWORKCHAIN).indexOf(
      value.toString()
    );
    console.log(chainSelectedIndex, "chainSelectedIndex");
    console.log(getState());
    if (chainSelectedIndex !== selectedChainIndex) {
      const user = (await getStorageSyncValue("userInfo")) as USERINFO;
      let address = "";
      if (value === SupportedChainId.NEAR_TESTNET) {
        if (getState().wallet.chain !== NEAR_TESTNET) {
          dispatch(setAccountNumber(0));
          dispatch(setWalletNumber(1));
        }
        dispatch(setChain(NEAR_TESTNET));
        dispatch(setAccountNumber(0));
        dispatch(setWalletNumber(1));
      } else if (value === SupportedChainId.NEAR) {
        if (getState().wallet.chain !== NEAR) {
          dispatch(setAccountNumber(0));
          dispatch(setWalletNumber(1));
        }
        dispatch(setChain(NEAR));
      } else if (
        value === SupportedChainId.SOLANA_DEVNET ||
        value === SupportedChainId.SOLANA_MAINNET
      ) {
        if (
          getState().wallet.chain !== SOLANA_DEVNET ||
          getState().wallet.chain !== SOLANA_MAINNET
        ) {
          dispatch(setAccountNumber(0));
          dispatch(setWalletNumber(1));
        }
        dispatch(setChain(SOLANA));
      } else {
        if (getState().wallet.chain !== EVM) {
          address =
            user[`wallet${1}`][CHAINS][EVM][ACCOUNTS][
              Object.keys(user[`wallet${1}`][CHAINS][EVM][ACCOUNTS])[0]
            ].address;
          dispatch(setAccountNumber(0));
          dispatch(setWalletNumber(1));
          dispatch(setUserAddress(address));
        }
        dispatch(setChain(EVM));
      }
      console.log("come here>>", value);

      dispatch(apiCall(true));
      dispatch(CHANGENETWORK(value));
      dispatch(showLoading(true));

      dispatch(
        addProfit({
          amount: 0,
          symbol: "",
          status: true,
        })
      );

      dispatch(setTotalWalletData({ data: STATIC_STRAIGHTLINE_GRAPH }));
    }
  };

export const checkTransactionReceipt =
  (web3: Web3, hashes: any[], network: number, address: string) =>
  async (dispatch: Dispatch) => {
    console.log("checkTransactionReceipt", hashes);
    let hashesLength = 0;
    if (hashes) {
      hashesLength = hashes.length;
    } else {
      hashes = [];
      hashesLength = 0;
    }
    let transactionInterval: string | number | NodeJS.Timer | undefined;

    for (let i = 0; i < hashesLength; i++) {
      transactionInterval = setInterval(async () => {
        let transactionReceipt = await web3.eth.getTransactionReceipt(
          hashes[i].hash
        );
        console.log(transactionReceipt, "transactionReceipt");
        if (transactionReceipt) {
          dispatch(
            removeTransaction({
              chain: [`${network}${address}`],
              hash: hashes[i].hash,
              // nonce: transactionReceipt.nonce,
              nonce: hashes[i].nonce,
            })
          );
          console.log("transaction Receipt status", transactionReceipt);
          if (transactionReceipt.status === true) {
            const [title, message, link] = [
              "Transaction Succesfull",
              "you can see your confirmed transaction",
              `${
                NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][SCAN_LINK]
              }/${transactionReceipt.transactionHash}`,
            ];
            generateNotification(title, message, link);
          } else {
            const [title, message, link] = [
              "Transaction Failed",
              "your can see your failed transaction",
              `${
                NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][SCAN_LINK]
              }/${transactionReceipt.transactionHash}`,
            ];
            generateNotification(title, message, link);
          }

          dispatch(
            setTransactionReceipt({
              open: true,
              status: transactionReceipt.status,
              transactionHash: transactionReceipt.transactionHash,
              blockNumber: transactionReceipt.blockNumber,
              from: transactionReceipt.from,
              to: transactionReceipt.to,
            })
          );
        }

        clearInterval(transactionInterval);
        // }
      }, 5000);
    }
  };

export const changeAccount =
  (value: number, address: string, chain: string) =>
  async (dispatch: Dispatch) => {
    dispatch(setAccountNumber(value));
    console.log("change account", address);

    dispatch(setUserAddress(address));
  };
