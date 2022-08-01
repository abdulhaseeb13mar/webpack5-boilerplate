import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { connect } from "near-api-js";
import { useDispatch } from "react-redux";
// import { useERC20Balances, useMoralis, useTokenPrice } from "react-moralis";
import Web3 from "web3";
import web3, { clusterApiUrl, Connection } from "@solana/web3.js";

import { SingleEthHistory, TokenHistory } from "interfaces";
import { apiCall, fetchTokenHistory } from "@slices/walletSlice";
import {
  balanceInThatChain,
  fetchAllHoldingTokens,
  fetchBalance,
  fetchBalanceSolana,
  fetchUsdRate,
  getChainAddressWithSecretKeys,
  showAllHoldings,
  showAllHoldingsSolana,
  SolanaInitialTasks,
} from "utils";
import {
  API,
  API_KEY,
  COMMITMENT,
  CONFIG,
  DEVNET,
  MAINNET,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
  NATIVE_TOKEN_NAME,
  NATIVE_TOKEN_SYMBOL,
  NETWORKCHAIN,
  NODE_URL,
  SupportedChainId,
  SUPPORTEDCHAINS,
  WRAPPED_ADDRESS,
} from "utils/constants";
import { showLoading } from "@slices/appSlice";
import { removeStorageSyncValue } from "@constants";

export const useGetWalletHoldings = () => {
  const dispatch = useDispatch();
  // const { fetchERC20Balances, data, isLoading, isFetching, error } =
  //   useERC20Balances();
  // const { isInitialized } = useMoralis();
  // const { fetchTokenPrice, data: DATA } = useTokenPrice({
  //   address: "0x5546600f77EdA1DCF2e8817eF4D617382E7f71F5",
  //   chain: "bsc",
  //   // exchange: "uniswap-v2",
  // });
  const getAcummulatedAccountBalance = (tokenHistory: SingleEthHistory[]) => {
    const res = Array.from(
      tokenHistory
        .reduce((acc, { priceInUSD, tokenBalance, ...r }) => {
          const key = JSON.stringify(r);
          const current = acc.get(key) || {
            ...r,
            tokenBalance: 0,
            priceInUSD: 0,
          };
          return acc.set(key, {
            ...current,
            tokenBalance: current.tokenBalance + tokenBalance,
            priceInUSD: current.priceInUSD + priceInUSD,
          });
        }, new Map())
        .values()
    );
    return res;
  };

  const fetchNearTokenHolding = async (
    nearAccountId: string,
    network: number
  ) => {
    try {
      // @ts-ignore
      let near = await connect(CONFIG[network]);
      const account = await near.account(nearAccountId);

      const availableBalance = await fetchBalance(account);
      const usdRate = await fetchUsdRate("near");

      let allTokens = await showAllHoldings(nearAccountId, near, network);
      if (availableBalance > 0) {
        allTokens.push({
          tokenName: "NEAR",
          tokenSymbol: "NEAR",
          tokenBalance: availableBalance,
          priceInUSD: availableBalance * usdRate,
          tokenAddress: "0x1fa4a73a3f0133f0025378af00236f3abdee5d63",
          tokenDecimal: 18,
          image: NETWORKCHAIN[+network as keyof typeof NETWORKCHAIN].LOGO,
        });
      }
      return allTokens;
    } catch (error) {
      console.log("near error", error);
      return [];
    }
  };

  const fetchAllHoldingsSolana = async (
    address: string,
    secretKey: string,
    network: number,
    connection: web3.Connection
  ) => {
    const importedAccount = await SolanaInitialTasks(secretKey);

    const SolanaBalanace = await fetchBalanceSolana(
      network === SupportedChainId.SOLANA_DEVNET ? DEVNET : MAINNET,
      importedAccount.publicKey,
      NETWORKCHAIN[+network as keyof typeof NETWORKCHAIN].LOGO
    );

    let allTokens: object[] = [];
    if (SolanaBalanace) {
      allTokens.push(SolanaBalanace);
    }
    const SolanaTokens = await showAllHoldingsSolana(
      address,
      network,
      connection
    );
    console.log("SolanaTokens", SolanaTokens);
    allTokens.push(...SolanaTokens);

    return allTokens;
  };

  const fetchTxHistoryAction = async (
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
    nativeTokenSymbol: string,
    image: string
  ) => {
    console.log("FETCH HISTORY ACTION");
    // const usdRate = await fetchUsdRate(coingeckoId);
    // console.log(usdRate, "usdRate", wrappedSymbol);
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

    let tokensHistory = updatedData as any; // as SingleEthHistory[];
    const nativeTokenBalance = {
      balance,
      balanceInUSD,
      symbol: coingeckoId,
    };
    if (parseFloat(nativeTokenBalance.balance) > 0) {
      tokensHistory?.unshift({
        tokenName: nativeTokenName,
        tokenSymbol: nativeTokenSymbol,
        tokenBalance: parseFloat(nativeTokenBalance.balance),
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        tokenDecimal: 18,
        priceInUSD: nativeTokenBalance.balanceInUSD,
        image: image,
      });
    }

    return tokensHistory;
  };

  const getTokensByAccount = (
    data: SingleEthHistory[],
    network: number,
    address: string,
    tokenHistoryOfAllAccounts: any
  ) => {
    data.forEach((token) => {
      if (tokenHistoryOfAllAccounts[network] !== undefined) {
        if (
          tokenHistoryOfAllAccounts[network][
            `${token.tokenName}_${token.tokenAddress}_${token.tokenSymbol}`
          ]
        ) {
          // console.log(tokenHistoryOfAllAccounts[network], "shshhs");
          tokenHistoryOfAllAccounts[network] = {
            ...tokenHistoryOfAllAccounts[network],
            [`${token.tokenName}_${token.tokenAddress}_${token.tokenSymbol}`]: {
              ...tokenHistoryOfAllAccounts[network][
                `${token.tokenName}_${token.tokenAddress}_${token.tokenSymbol}`
              ],
              tokenBalance:
                token.tokenBalance +
                tokenHistoryOfAllAccounts[network][
                  `${token.tokenName}_${token.tokenAddress}_${token.tokenSymbol}`
                ].tokenBalance,
              priceInUSD:
                token.priceInUSD +
                tokenHistoryOfAllAccounts[network][
                  `${token.tokenName}_${token.tokenAddress}_${token.tokenSymbol}`
                ].priceInUSD,

              accounts: {
                ...tokenHistoryOfAllAccounts[network][
                  `${token.tokenName}_${token.tokenAddress}_${token.tokenSymbol}`
                ].accounts,
                ...(token.tokenBalance > 0 && {
                  [address]: {
                    tokenBalance: token.tokenBalance,
                    priceInUSD: token.priceInUSD,
                  },
                }),
              },
            },
          };
        } else {
          tokenHistoryOfAllAccounts[network] = {
            ...tokenHistoryOfAllAccounts[network],
            [`${token.tokenName}_${token.tokenAddress}_${token.tokenSymbol}`]: {
              tokenBalance: token.tokenBalance,
              priceInUSD: token.priceInUSD,
              tokenAddress: token.tokenAddress,
              tokenDecimal: token.tokenDecimal,
              tokenName: token.tokenName,
              tokenSymbol: token.tokenSymbol,
              image: token.image,
              accounts: {
                ...(token.tokenBalance > 0 && {
                  [address]: {
                    tokenBalance: token.tokenBalance,
                    priceInUSD: token.priceInUSD,
                  },
                }),
              },
            },
          };
        }
      } else {
        tokenHistoryOfAllAccounts = {
          ...tokenHistoryOfAllAccounts,
          [network]: {
            [`${token.tokenName}_${token.tokenAddress}_${token.tokenSymbol}`]: {
              tokenBalance: token.tokenBalance,
              priceInUSD: token.priceInUSD,
              tokenAddress: token.tokenAddress,
              tokenDecimal: token.tokenDecimal,
              tokenName: token.tokenName,
              tokenSymbol: token.tokenSymbol,
              image: token.image,
              accounts: {
                ...(token.tokenBalance > 0 && {
                  [address]: {
                    tokenBalance: token.tokenBalance,
                    priceInUSD: token.priceInUSD,
                  },
                }),
              },
            },
          },
        };
      }
    });

    return tokenHistoryOfAllAccounts;
  };
  // key point to remmebr c hain upar sa pass honfi
  const getWalletHoldings = async (
    networkKeys: number[],
    accounts: {
      [key: string]: string[];
    }
  ) => {
    try {
      let tokenHistoryOfAllAccounts: TokenHistory = {};
      const solanaAddressWithSecretKeys = await getChainAddressWithSecretKeys(
        SUPPORTEDCHAINS.SOLANA
      );
      let tokenHistory: SingleEthHistory[] = [];
      let result: any[] = [];
      let promiseData: any[] = [];
      let solanaTestnetConnection: web3.Connection;
      let solanaMainnetConnection: web3.Connection;

      solanaTestnetConnection = new Connection(
        clusterApiUrl(DEVNET),
        COMMITMENT
      );

      solanaMainnetConnection = new Connection(
        "https://solana-api.projectserum.com"
      );
      await Promise.all(
        networkKeys.map(async (network, index) => {
          if (
            NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].chain ===
            SUPPORTEDCHAINS.EVM
          ) {
            // if (!NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].isTestnet) {
            let web3 = new Web3(
              new Web3.providers.HttpProvider(
                NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL]
              )
            );

            promiseData = await Promise.all(
              accounts[
                NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].chain
              ].map(async (address) => {
                console.log(
                  networkKeys,
                  "network keys",
                  accounts[
                    NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].chain
                  ]
                );
                //loop on account id and if there is a duplicate token add the token amount

                const data = (await fetchTxHistoryAction(
                  address,

                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][API],
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][API_KEY],
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL],
                  network,
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                    WRAPPED_ADDRESS
                  ],
                  fetchTokenHistory,
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                    NATIVE_TOKEN_COINGECKO_ID
                  ],
                  web3,
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                    NATIVE_TOKEN_NAME
                  ],
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                    NATIVE_TOKEN_SYMBOL
                  ],
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].LOGO
                )) as SingleEthHistory[];
                tokenHistoryOfAllAccounts = getTokensByAccount(
                  data,
                  network,
                  address,
                  tokenHistoryOfAllAccounts
                );
                return data;
              })
            );
          } else if (
            NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].chain ===
            SUPPORTEDCHAINS.SOLANA
          ) {
            // console.log("run solana functionality", network);

            promiseData = await Promise.all(
              accounts[
                NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].chain
              ].map(async (address) => {
                const secretKey =
                  solanaAddressWithSecretKeys[
                    address as keyof typeof solanaAddressWithSecretKeys
                  ];

                const data = (await fetchAllHoldingsSolana(
                  address,
                  secretKey,
                  network,
                  network === SupportedChainId.SOLANA_DEVNET
                    ? solanaTestnetConnection
                    : solanaMainnetConnection
                )) as SingleEthHistory[];
                tokenHistoryOfAllAccounts = getTokensByAccount(
                  data,
                  network,
                  address,
                  tokenHistoryOfAllAccounts
                );

                return data;
              })
            );
          } else if (
            NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].chain ===
              SUPPORTEDCHAINS.NEAR_TESTNET ||
            NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].chain ===
              SUPPORTEDCHAINS.NEAR
          ) {
            try {
              promiseData = await Promise.all(
                accounts[
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].chain
                ].map(async (accountId) => {
                  const data = await fetchNearTokenHolding(accountId, network);
                  tokenHistoryOfAllAccounts = getTokensByAccount(
                    data,
                    network,
                    accountId,
                    tokenHistoryOfAllAccounts
                  );
                  return data;
                })
              );
            } catch (error) {
              console.log(error);
            }
          }

          tokenHistory = [...promiseData.flat()];

          result = getAcummulatedAccountBalance(tokenHistory);

          return result;
        })
      );

      dispatch(apiCall(true));
      removeStorageSyncValue("graphDataExpiry");
      dispatch(fetchTokenHistory({ tokensHistory: tokenHistoryOfAllAccounts }));
      dispatch(showLoading(false));
    } catch (error) {
      console.log(error);
    }
  };

  return { getWalletHoldings };
};
