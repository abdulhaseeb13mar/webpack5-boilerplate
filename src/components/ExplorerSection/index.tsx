import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import SwitchTabs from "./SwitchTabs";
import TabPanel from "./TabPanel";
import { AnimateButton, ChainComponent } from "components";
import { DoubleArrows } from "assets/Icons";
import {
  ExplorerSectionProps as PROPS,
  RootState,
  TokenHistory,
} from "interfaces";
import TxHistory from "./TxHistory";
import MainAccordion from "../TokenAccordion/Accordion/MainAccordion";
import { addSelectedToken } from "@slices/sendTransaction";

const ExplorerSection: FC<PROPS> = ({ swap, setToken, token }) => {
  /* global-state */
  const { tokensHistory } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [transactionsContainerTabList] = useState([
    "Tokens",
    "NFTS",
    "Activity",
  ]);
  const [activeToken, setActiveToken] = useState({
    chainId: -1,
    index: -1,
  });
  const [toggleNetwork, setToggleNetwork] = useState<{
    [key: number]: boolean;
  }>({});
  const [transactionsContainerActiveTab, setTransactionsContainerActiveTab] =
    useState("Tokens");

  /* hooks */
  const dispatch = useDispatch();

  /* functions */
  const handleToggle = (value: number) => {
    console.log("clicked", +value);
    setToggleNetwork({
      ...toggleNetwork,
      [+value]: !toggleNetwork[+value as keyof typeof toggleNetwork],
    });
    setActiveToken({ chainId: value, index: -1 });
  };

  const fetchTokenDetails = async (chain: number, value: string) => {
    if (token) {
      const price =
        tokensHistory[+chain][value].priceInUSD /
        tokensHistory[+chain][value].tokenBalance;

      setToken({
        open: true,
        address: `${tokensHistory[+chain][value].tokenAddress}`,
        chain: +chain,
        name: `${tokensHistory[+chain][value].tokenSymbol}`,
        price,
        priceChange: 0,
        time: "1d",
      });

      dispatch(
        addSelectedToken({
          tokenName: tokensHistory[+chain][value].tokenSymbol,
          tokenAddress: tokensHistory[+chain][value].tokenAddress,
          tokenAmount: tokensHistory[+chain][value].tokenBalance,
          tokenDecimal: tokensHistory[+chain][value].tokenDecimal,
          tokenNetwork: +chain,
          address: Object.keys(tokensHistory[+chain][value].accounts)[0],
          usdAmount: tokensHistory[+chain][value].priceInUSD,
          multiAccountExist: false,
        })
      );
    }
  };

  const handleAccordionClick = async (
    index: number,
    chainId: number,
    value: string
  ) => {
    const accounts = Object.keys(tokensHistory[chainId][value].accounts);

    if (accounts.length === 1) {
      fetchTokenDetails(chainId, value);
    }
    if (activeToken.chainId === chainId && activeToken.index === index) {
      setActiveToken({
        chainId: -1,
        index: -1,
      });
    } else {
      setActiveToken({
        chainId,
        index,
      });
    }
  };

  /* effects */
  useEffect(() => {
    let myKeys = {};
    Object.keys(tokensHistory).forEach((element) => {
      myKeys = {
        ...myKeys,
        [+element]: true,
      };
    });
    setToggleNetwork(myKeys);
  }, [tokensHistory]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0px 16px 0px 0px",
          // marginTop: "16px",
          // backgroundColor: "#000",
          // borderRadius: "10px",
          // border: "1px solid rgba(255,255,255, 0.1)",
          // outline: "none",
        }}
      >
        <SwitchTabs
          tabs={transactionsContainerTabList}
          activeTab={transactionsContainerActiveTab}
          setActiveTab={setTransactionsContainerActiveTab}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <AnimateButton
            text="Transactions"
            icon={DoubleArrows}
            buttonStyle={{ marginRight: 10 }}
            imgStyle={{ width: "30px", height: "30px", cursor: "pointer" }}
            textStyle={{
              fontSize: "13px",
              opacity: 0.8,
            }}
            iconPosition="left"
          />
        </div>
      </div>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <TabPanel
          value={transactionsContainerTabList.indexOf(
            transactionsContainerActiveTab
          )}
          index={0}
        >
          <div
            style={{
              height: 474,
              paddingTop: 10,
              paddingBottom: 20,
              overflowY: "scroll",
            }}
          >
            {Object.keys(tokensHistory).map((value, i) => {
              let data: TokenHistory = {
                [+value]: tokensHistory[+value],
              };
              if (
                toggleNetwork[+value as keyof typeof toggleNetwork] === true
              ) {
                return (
                  <ChainComponent
                    key={i}
                    value={+value}
                    onClick={() => {
                      handleToggle(+value);
                    }}
                  />
                );
              } else
                return (
                  <MainAccordion
                    key={i}
                    tokensHistory={data}
                    handleAccordionClick={handleAccordionClick}
                    isDashboard={true}
                    activeToken={activeToken}
                    handleToggle={handleToggle}
                    toggle={toggleNetwork[+value as keyof typeof toggleNetwork]}
                    setActiveToken={(arg) => {
                      if (setActiveToken) {
                        setActiveToken(arg);
                      }
                    }}
                    setTokenDetail={setToken}
                  />
                );
            })}
          </div>
        </TabPanel>
        <TabPanel
          value={transactionsContainerTabList.indexOf(
            transactionsContainerActiveTab
          )}
          index={1}
        >
          Coming soon...
        </TabPanel>
        <TabPanel
          value={transactionsContainerTabList.indexOf(
            transactionsContainerActiveTab
          )}
          index={2}
        >
          <TxHistory height={474} />
        </TabPanel>
      </Box>
    </>
  );
};

export default ExplorerSection;
