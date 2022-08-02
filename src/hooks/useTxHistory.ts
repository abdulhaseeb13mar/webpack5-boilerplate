/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import axios from "axios";

import { SupportedChainId } from "utils/constants";
import { RootState } from "interfaces/index";
import { getStorageSyncValue, setStorageSyncValue } from "@constants";
import {
  DUMMY_IMAGE_URL,
  LOGO,
  NATIVE_TOKEN_COINGECKO_ID,
  NATIVE_TOKEN_SYMBOL,
  NETWORKCHAIN,
  NODE_URL,
} from "utils/constants";
import { fetchRates, fetchUsdRate } from "utils";
import { BASE_URL } from "api";

const { providers } = require("near-api-js");
const { abi } = require("../abis/erc20abi.json");

export const useTxHistory = () => {
  const { transactions, cachedTransactions } = useSelector(
    (state: RootState) => state.sendTransaction
  );
  const [txList, setTxList] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const previousTxLists = (await getStorageSyncValue(`PreviousTxLists`)) as
        | any[]
        | [];
      if (previousTxLists.length > 0) {
        const pendingLists: any[] | any = await fetchPendingTransactions();
        const finalTxList = [...pendingLists, ...previousTxLists];
        setTxList(finalTxList);
      }
    };
    init();
  }, [transactions, cachedTransactions]);

  const getPreviousTransactions = useCallback(async () => {
    const lists: any[] | any = await fetchPastTransactionHistory();
    const sortedLists = lists.sort(function (a: any, b: any) {
      return b.timeStamp - a.timeStamp;
    });
    const pendingLists: any[] | any = await fetchPendingTransactions();
    const finalTxList = [...pendingLists, ...sortedLists];
    await setStorageSyncValue(`PreviousTxLists`, finalTxList);
    setTxList(finalTxList);
  }, [transactions, cachedTransactions]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getPreviousTransactions();
    }, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchPendingTransactions = useCallback(async () => {
    return await Object.keys(transactions).reduce((prev: any, curr: any) => {
      const previousList = prev;
      const txHistory: any[] = transactions[curr] || [];
      return [...previousList, ...txHistory];
    }, []);
  }, [transactions]);

  const fetchPastTransactionHistory = useCallback(async () => {
    return await Object.keys(cachedTransactions).reduce(
      async (prev: any, curr: any) => {
        const previousList = await prev;
        const network = await parseInt(curr);
        const txHistory: any[] = cachedTransactions[curr] || [];

        let newlist = [];
        if (
          SupportedChainId.SOLANA_MAINNET === network ||
          SupportedChainId.SOLANA_DEVNET === network
        ) {
          newlist = (await decodeSolana(txHistory, network)) || [];
        } else if (
          SupportedChainId.NEAR === network ||
          SupportedChainId.NEAR_TESTNET === network
        ) {
          newlist = (await decodeNear(txHistory, network)) || [];
        } else {
          newlist = (await decodeEVM(txHistory, network)) || [];
        }

        return [...previousList, ...newlist];
      },
      Promise.resolve([] as any[])
    );
  }, [cachedTransactions]);

  const decodeEVM = async (txHistory: any[], network: number) => {
    try {
      const nodeURL =
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL];

      const web3 = new Web3(new Web3.providers.HttpProvider(nodeURL));

      const nativeTokenSymbol =
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NATIVE_TOKEN_SYMBOL];

      const usdRate = await fetchUsdRate(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
          NATIVE_TOKEN_COINGECKO_ID
        ]
      );

      return await Promise.all(
        txHistory.map(async (tx: any) => {
          const txHash = tx.hash;
          const address = tx.address;
          const txDetails = {} as any;
          txDetails.txHash = txHash;

          const receiptErc20 = await web3.eth.getTransactionReceipt(txHash);
          const receiptNativeToken = await web3.eth.getTransaction(txHash);

          const gasUsed = parseInt(receiptNativeToken.gas.toString());
          const gasPrice = parseInt(receiptNativeToken.gasPrice.toString());
          const gasCost = gasUsed * gasPrice;

          const ts = (await web3.eth.getBlock(
            receiptNativeToken.blockNumber || 0
          )) as any;
          txDetails.timeStamp = ts.timestamp * 1000;

          const gasFeeInUSD = (
            parseFloat(web3.utils.fromWei(gasCost.toString(), "ether")) *
            usdRate
          ).toFixed(4);

          txDetails.gasFeeInUSD = gasFeeInUSD;

          //erc20 transfer
          if (receiptErc20.logs.length > 0) {
            txDetails.from = receiptErc20.from;
            txDetails.to = receiptErc20.to;
            txDetails.network = network;
            if (receiptErc20.to.toLowerCase() === address.toLowerCase()) {
              txDetails.TxType = "Received";
            } else {
              txDetails.TxType = "Sent";
            }

            //signle erc20 transfer
            if (receiptErc20.logs.length === 1) {
              for (let log of receiptErc20.logs) {
                if (
                  log.topics[0] ===
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
                  log.data !== "0x"
                ) {
                  txDetails.contractAddress = log.address;

                  const contract = new web3.eth.Contract(abi, log.address);
                  const symbol = await contract.methods.symbol().call();
                  const decimals = await contract.methods.decimals().call();
                  txDetails.amount =
                    Number(web3.eth.abi.decodeParameter("uint256", log.data)) /
                    10 ** decimals;
                  txDetails.symbol = symbol;
                  const result = await axios.get(
                    `${BASE_URL}/tokens/${log.address}`
                  );
                  if (result.data !== "not found") {
                    // console.log(result.data, "==-result");
                    let fetchData = await fetchRates(result.data.id);
                    txDetails.amountInUSD = parseInt(
                      (
                        Number(txDetails.amount) * Number(fetchData.price)
                      ).toFixed(4)
                    );
                    txDetails.image = fetchData.image;
                  } else {
                    txDetails.amountInUSD = 0;
                    txDetails.image = DUMMY_IMAGE_URL;
                  }
                }
              }
            } else {
              // console.log("multiple erc20 transfer--SWAP");
              //swap transfer - multierc20 transfer
              txDetails.TxType = "Swap";
              let index = 1;
              for (let log of receiptErc20.logs) {
                if (
                  log.topics[0] ===
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
                  log.data !== "0x"
                ) {
                  // console.log("SWAP", index);

                  txDetails[`contractAddress${index}`] = log.address;

                  const contract = new web3.eth.Contract(abi, log.address);
                  const symbol = await contract.methods.symbol().call();
                  const decimals = await contract.methods.decimals().call();

                  const amount = Number(
                    Number(web3.eth.abi.decodeParameter("uint256", log.data)) /
                      10 ** decimals
                  ).toFixed(4);

                  txDetails[`amount${index}`] = amount;

                  let balance = await contract.methods
                    .balanceOf(receiptErc20.from)
                    .call();

                  balance = Number(Number(balance) / 10 ** decimals).toFixed(4);

                  txDetails[`balance${index}`] = balance;

                  txDetails[`symbol${index}`] = symbol;

                  const result = await axios.get(
                    `${BASE_URL}/tokens/${log.address}`
                  );
                  if (result.data !== "not found") {
                    // console.log(result.data, "==-result");
                    let fetchData = await fetchRates(result.data.id);
                    txDetails[`amountInUSD${index}`] = Number(
                      Number(amount) * Number(fetchData.price)
                    ).toFixed(4);
                    txDetails[`image${index}`] = fetchData.image;
                    txDetails[`tokenPrice${index}`] = fetchData.price;
                    txDetails[`balance$InUSD${index}`] = Number(
                      balance * Number(fetchData.price)
                    ).toFixed(4);
                  } else {
                    txDetails[`amountInUSD${index}`] = 0;
                    txDetails[`image${index}`] = DUMMY_IMAGE_URL;
                    txDetails[`tokenPrice${index}`] = 0;
                    txDetails[`balance$InUSD${index}`] = 0;
                  }
                  index = index + 1;
                }
              }
            }

            return txDetails;
          } else {
            //native token transfer ie ETH or BNB
            txDetails.from = receiptNativeToken.from;
            txDetails.to = receiptNativeToken.to;
            txDetails.network = network;

            if (receiptErc20.to.toLowerCase() === address.toLowerCase()) {
              txDetails.TxType = "Received";
            } else {
              txDetails.TxType = "Sent";
            }
            txDetails.contractAddress = "";
            txDetails.amount = web3.utils.fromWei(
              receiptNativeToken.value,
              "ether"
            );
            txDetails.symbol = nativeTokenSymbol;

            txDetails.amountInUSD = (
              Number(txDetails.amount) * Number(usdRate)
            ).toFixed(4);
            txDetails.image =
              NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][LOGO];

            return txDetails;
          }
        })
      );
    } catch (error) {
      console.log("error: ", error);
      return [];
    }
  };

  const decodeSolana = async (txHistory: any[], network: number) => {
    try {
      // console.log("decodeSolana");
      // const url = NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][API];
      // const key = NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][API_KEY];
      // const nodeURL =
      //   NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL];
      // const nativeTokenSymbol =
      //   NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NATIVE_TOKEN_SYMBOL];

      const usdRate = await fetchUsdRate(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
          NATIVE_TOKEN_COINGECKO_ID
        ]
      );

      const tokenlistResponse = await axios.get(
        "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json"
      );

      const tokenlist = tokenlistResponse.data.tokens || [];

      return await Promise.all(
        txHistory.map(async (tx: any) => {
          const txHash = tx.hash;
          const address = tx.address;
          const txDetails = {} as any;
          txDetails.txHash = txHash;
          txDetails.timeStamp = tx.timestamp;
          txDetails.from = address;
          txDetails.to = tx.to;
          txDetails.amount = tx.amount;
          txDetails.network = network;
          txDetails.contractAddress = tx.tokenAddress;
          txDetails.gasFeeInUSD = tx.gasFee * usdRate;
          // TODO: get token amount in USD
          txDetails.amountInUSD = 0;

          if (tx.to.toLowerCase() === address.toLowerCase()) {
            txDetails.TxType = "Received";
          } else {
            txDetails.TxType = "Sent";
          }

          tokenlist.forEach((token: any) => {
            if (
              token.address.toLowerCase() ===
              txDetails.contractAddress.toLowerCase()
            ) {
              txDetails.symbol = token.symbol;
              txDetails.image = token.logoURI;
            } else {
              txDetails.symbol = "TOKEN";
              txDetails.image = DUMMY_IMAGE_URL;
            }
          });

          return txDetails;
        })
      );
    } catch (error) {
      console.log("error: ", error);
      return [];
    }
  };

  const decodeNear = async (txHistory: any[], network: number) => {
    try {
      const nodeURL =
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL];

      const nativeTokenSymbol =
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NATIVE_TOKEN_SYMBOL];

      const usdRate = await fetchUsdRate(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
          NATIVE_TOKEN_COINGECKO_ID
        ]
      );

      const provider = new providers.JsonRpcProvider(nodeURL);

      return await Promise.all(
        txHistory.map(async (tx: any) => {
          const decimals = 24;
          const txHash = tx.hash;
          const address = tx.address;
          const txDetails = {} as any;

          const result = await provider.txStatus(txHash, address);
          // console.log("result NEAR", result);

          txDetails.txHash = txHash;
          //TODO: get timestamp from NEAR
          txDetails.timeStamp = tx.timestamp ? tx.timestamp : 0;
          const gasUsed =
            result.transaction_outcome.outcome.tokens_burnt / 10 ** decimals;
          const gasFeeInUSD = (gasUsed * usdRate).toFixed(4);
          txDetails.gasFeeInUSD = gasFeeInUSD;

          txDetails.from = result.transaction.signer_id;
          txDetails.to = result.transaction.receiver_id;
          txDetails.network = network;

          if (
            result.transaction.receiver_id.toLowerCase() ===
            address.toLowerCase()
          ) {
            txDetails.TxType = "Received";
          } else {
            txDetails.TxType = "Sent";
          }
          txDetails.contractAddress = "";
          txDetails.amount = (
            result.transaction.actions[0].Transfer.deposit /
            10 ** decimals
          ).toFixed(4);
          txDetails.symbol = nativeTokenSymbol;

          txDetails.amountInUSD = (
            Number(txDetails.amount) * Number(usdRate)
          ).toFixed(4);

          txDetails.image =
            NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][LOGO];
          return txDetails;
        })
      );
    } catch (error) {
      console.log("error: ", error);
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      const previousTxLists = (await getStorageSyncValue(`PreviousTxLists`)) as
        | any[]
        | [];
      if (previousTxLists.length > 0) {
        setTxList(previousTxLists);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getPreviousTransactions();
    }, 15000);
    return () => clearInterval(intervalId);
  }, [transactions, cachedTransactions]);

  return { txList };
};
