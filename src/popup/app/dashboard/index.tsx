/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import axios from "axios";

import {
  WrapperBackground,
  Background,
  ConnectionBadge,
  ApexChart,
  SectionOne,
  ExplorerSection,
  ChartDataBar,
  DashboardHeader,
  SkeletonComponent,
  LandingCardSection,
  TokenDetailSection,
  TransactionReceiptModal,
  WalletNetworkSelection,
} from "components";
import { RootState, USERINFO } from "interfaces";
import {
  getUserAccounts,
  getUserSingleAccount,
  scrollListener,
  setDataWithExpiry,
} from "utils";
import {
  HudStyled,
  LoadingAssetsStyled,
  ChartDataBarStyled,
  TokenSectionStyled,
} from "@styled";
import {
  AVERAGE,
  GRAPH_EXPIRY,
  NEAR_MAINNET,
  NEAR_TESTNET,
  NETWORKCHAIN,
  NODE_URL,
} from "utils/constants";
import { BASE_URL } from "api";
import { getStorageSyncValue, setStorageSyncValue } from "@constants";
import {
  checkUser,
  setAccountNumber,
  setInitiallyAnimate,
  setNewWallet,
  setTotalWalletData,
  setUserLoggedIn,
  setWalletNumber,
  showLoading,
} from "@slices/appSlice";
import {
  addSelectedToken,
  setGasSpeed,
  setSlippage,
} from "@slices/sendTransaction";
import { apiCall as APICALL } from "@slices/walletSlice";
import {
  calculateProfit,
  checkTransactionReceipt,
} from "@slices/walletSlice/wallet.actions";
import { useGetWalletHoldings } from "hooks/useGetWalletHoldings";

let web3: Web3;

const Dashboard = () => {
  /* global-state */
  const {
    initiallyAnimated,
    address,
    isLoading,
    isNewWallet,
    walletNumber,
    accountNumber,
  } = useSelector((state: RootState) => state.app);
  const { tokensHistory, apiCall, network, swap } = useSelector(
    (state: RootState) => state.wallet
  );
  const { transactions, receipt } = useSelector(
    (state: RootState) => state.sendTransaction
  );
  const { switchNetwork, switchWallet } = useSelector(
    (state: RootState) => state.app
  );

  /* local-state */
  const [test, setTest] = useState(false);
  const [animation, setAnimation] = useState("hidden");
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState({
    open: false,
    name: "",
    price: 0.028,
    priceChange: 10,
    time: "1d",
    address: "",
    chain: 1,
  });

  /* hooks */
  const { getWalletHoldings } = useGetWalletHoldings();
  const dispatch = useDispatch();

  /* functions */
  const startAnimation = () => {
    setAnimation("visible");

    setTimeout(() => {
      dispatch(setInitiallyAnimate(true));
    }, 1000);
  };

  const fetchGraphData = async (currentTokens: { [key: string]: number }) => {
    try {
      const key = `graphDataExpiry`;
      const graphExpiry = JSON.parse(localStorage.getItem(key) as string);
      const tokenCount = Object.keys(currentTokens).length;

      if (!graphExpiry || new Date().getTime() > graphExpiry?.expiry) {
        if (tokenCount > 0) {
          const request = await axios.post(`${BASE_URL}/graph/data/30`, {
            ...currentTokens,
          });

          dispatch(setTotalWalletData(request.data));

          dispatch(APICALL(false));
          dispatch(calculateProfit(currentTokens));
          dispatch(showLoading(false));
          setDataWithExpiry(key, JSON.stringify(request.data), GRAPH_EXPIRY);
          startAnimation();
        } else {
          startAnimation();
          dispatch(showLoading(false));
          dispatch(APICALL(false));
        }
      } else {
        dispatch(setTotalWalletData(JSON.parse(graphExpiry.data)));
        console.log("if request nnot gone");
        dispatch(APICALL(false));
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const calculateGraphData = async () => {
    const tokenNetworkKeys = Object.keys(tokensHistory);

    let currentTokens = {};
    tokenNetworkKeys.forEach((network) => {
      Object.keys(tokensHistory[+network as keyof typeof tokensHistory]).map(
        (token) => {
          if (
            currentTokens[
              tokensHistory[+network as keyof typeof tokensHistory][token]
                .tokenSymbol as keyof typeof currentTokens
            ]
          ) {
            currentTokens = {
              ...currentTokens,
              [tokensHistory[+network as keyof typeof tokensHistory][token]
                .tokenSymbol]:
                currentTokens[
                  tokensHistory[+network as keyof typeof tokensHistory][token]
                    .tokenSymbol as keyof typeof currentTokens
                ] +
                tokensHistory[+network as keyof typeof tokensHistory][token]
                  .tokenBalance,
            };
          } else {
            currentTokens = {
              ...currentTokens,
              [tokensHistory[+network as keyof typeof tokensHistory][token]
                .tokenSymbol]:
                tokensHistory[+network as keyof typeof tokensHistory][token]
                  .tokenBalance,
            };
          }
          return null;
        }
      );
      console.log(
        currentTokens,
        "tokens-----------------------------------------------=========="
      );
    });
    await fetchGraphData(currentTokens);
  };

  /* effects */
  useEffect(() => {
    // dispatch(removeTransaction({}));
    if (isNewWallet) {
      (async () => {
        let isUserExists = (await getStorageSyncValue("userInfo")) as USERINFO;
        let keys = Object.keys(isUserExists);
        delete isUserExists[keys[keys.length - 1]];
        dispatch(setWalletNumber(1));
        dispatch(setAccountNumber(0));
        dispatch(setNewWallet(false));
        await setStorageSyncValue("userInfo", isUserExists);
      })();
    }
    dispatch(
      addSelectedToken({
        tokenName: "",
        tokenAddress: "",
        tokenAmount: 0,
        amount: "0",
        recieverAddress: "",
        tokenDecimal: 0,
        tokenNetwork: 1,
        address: "",
        usdAmount: 0,
        nativeTokenInUsd: 0,
      })
    );
  }, []);

  useEffect(() => {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL]
      )
    );
  }, [network, address]);

  useEffect(() => {
    const onScroll = () => {
      scrollListener();
    };

    document.addEventListener("scroll", onScroll);
    const SetUserExpiry = async () => {
      const user: number = (await getStorageSyncValue("expiry")) as number;

      const now = new Date().getTime();
      if (now > user) {
        dispatch(checkUser(true));

        dispatch(setUserLoggedIn(false));
      }
    };
    SetUserExpiry();

    const networkKeys = Object.keys(NETWORKCHAIN)
      .map(Number)
      .filter(
        (value) => true
        // NETWORKCHAIN[value as keyof typeof NETWORKCHAIN].isTestnet === true
      );

    if (switchWallet) {
      // dispatch(showLoading(true));
      (async () => {
        const wallets = [`wallet${walletNumber}`];
        if (accountNumber === -1) {
          const accounts = await getUserAccounts(wallets);
          getWalletHoldings(networkKeys, accounts);
        } else {
          const allaccounts = await getUserAccounts(wallets);
          const accounts = getUserSingleAccount(address, allaccounts);
          console.log(accounts, "account...", address);
          const networks = Object.keys(NETWORKCHAIN)
            .map(Number)
            .filter(
              (value) =>
                // NETWORKCHAIN[value as keyof typeof NETWORKCHAIN].isTestnet ===
                //   true &&
                NETWORKCHAIN[
                  value as keyof typeof NETWORKCHAIN
                ].chain.toLowerCase() === Object.keys(accounts)[0].toLowerCase()
            );
          getWalletHoldings(networks, accounts);
        }
      })();
    }
    if (!switchWallet) {
      (async () => {
        // dispatch(showLoading(true));

        const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;
        const wallets = Object.keys(isUserExist);
        const accounts = await getUserAccounts(wallets);

        getWalletHoldings(networkKeys, accounts);
      })();
    }
    dispatch(setSlippage(1));
    dispatch(setGasSpeed(AVERAGE));
    console.log(network, "net", NEAR_TESTNET, NEAR_MAINNET);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [
    network,
    switchNetwork,
    switchWallet,
    walletNumber,
    accountNumber,
    receipt.open,
  ]);

  useEffect(() => {
    if (apiCall) {
      calculateGraphData();
    }
    startAnimation();
  }, [tokensHistory]);

  useEffect(() => {
    setTest(!test);
  }, [tokensHistory]);

  useEffect(() => {
    dispatch(
      checkTransactionReceipt(
        web3,
        transactions[`${network}${address}`],
        network,
        address
      )
    );
  }, [transactions, swap]);

  return (
    <WrapperBackground boxHeight={793}>
      <HudStyled
        className="hud"
        animate={animation}
        variants={{ visible: { height: "240px" } }}
        transition={{
          duration: 0.7,
          delay: 0.4,
          ease: "easeInOut",
        }}
        layout
        initiallyAnimated={initiallyAnimated}
      >
        <Background />
        <ConnectionBadge animation={animation} />
        <DashboardHeader
          animation={animation}
          onExpand={() => {
            setOpen(true);
          }}
        />
        <motion.div className="hud-chart" layout>
          <ApexChart startAnimate={startAnimation} />
        </motion.div>
        <div className="bottom-chart-container">
          <LoadingAssetsStyled
            layout
            variants={{
              visible: { top: 50 },
              initial: { opacity: 1 },
            }}
            animate={animation === "visible" ? "visible" : "initial"}
            transition={{
              duration: animation === "visible" ? 0.4 : 0.9,
              ease: animation === "visible" ? "easeOut" : "easeInOut",
              ...(animation === "visible"
                ? {}
                : { repeat: Infinity, repeatType: "reverse" }),
            }}
            initiallyAnimated={initiallyAnimated}
          >
            Loading assets
          </LoadingAssetsStyled>
          <ChartDataBarStyled
            className="chart-databar"
            layout
            variants={{
              visible: {
                opacity: 1,
                top: 0,
              },
            }}
            animate={animation}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2,
            }}
            initiallyAnimated={initiallyAnimated}
          >
            <ChartDataBar />
          </ChartDataBarStyled>
        </div>
      </HudStyled>

      <div className="below-hud-container">
        {isLoading ? (
          <SkeletonComponent />
        ) : Object.keys(tokensHistory).length > 0 ? (
          <TokenSectionStyled
            className="tokens-section"
            layout
            variants={{
              visible: { opacity: 1, display: "block", marginTop: "20px" },
            }}
            animate={animation}
            transition={{
              duration: 0,
              ease: "easeOut",
              delay: 0,
            }}
            initiallyAnimated={initiallyAnimated}
          >
            <SectionOne token={token} setToken={setToken} />
            {token.open ? (
              <TokenDetailSection token={token} setToken={setToken} />
            ) : (
              <ExplorerSection swap={test} setToken={setToken} token={token} />
            )}
          </TokenSectionStyled>
        ) : (
          <LandingCardSection />
        )}
        <WalletNetworkSelection
          open={open}
          handleClose={() => setOpen(false)}
        />
        <TransactionReceiptModal />
      </div>
    </WrapperBackground>
  );
};

export default Dashboard;
