/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import {
  faExclamation,
  faChartLine,
  faCircleInfo,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SwitchTabs from "../ExplorerSection/SwitchTabs";
import {
  ButtonBoxStyled,
  ButtonWrapper,
  PriceChangeStyled,
  Text,
  TokenDetailBoxStyled,
} from "@styled";
import TxHistory from "../ExplorerSection/TxHistory";
import { TokenDetailSectionProps as PROPS } from "interfaces";
import { getPriceChange } from "utils";

const TokenDetailSection: FC<PROPS> = ({ token, setToken }) => {
  /* global-state */

  /* local-state */
  const [tabs] = useState([
    {
      title: "Info",
      icon: faCircleInfo,
    },
    {
      title: "Chart",
      icon: faChartLine,
    },
    {
      title: "News",
      icon: faExclamation,
    },
  ]);
  const [transactionsContainerTabList] = useState(["Activity"]);
  const [transactionsContainerActiveTab, setTransactionsContainerActiveTab] =
    useState("Activity");

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    (async () => {
      if (token?.address) {
        const priceChange = await getPriceChange(token.address);
        setToken({
          ...token,
          priceChange,
        });
      }
    })();
  }, []);

  return (
    <>
      <TokenDetailBoxStyled>
        <Text
          style={{ opacity: 0.9 }}
          size={14}
          weight={400}
          customStyle={{ marginBottom: "5px" }}
        >
          About {token?.name}
        </Text>
        <Text style={{ opacity: 0.8 }} size={14} weight={400}>
          Price: {token?.price}{" "}
          <PriceChangeStyled success={token?.priceChange ? true : false}>
            {" "}
            {token?.priceChange.toFixed(4)}%
          </PriceChangeStyled>{" "}
          {token?.time}
        </Text>
      </TokenDetailBoxStyled>
      <ButtonWrapper>
        {tabs.map((element, index) => {
          return (
            <ButtonBoxStyled key={index}>
              <FontAwesomeIcon
                icon={element.icon}
                style={{
                  fontSize: "20px",
                  color: "rgba(255,255,255,0.4)",
                }}
              />
              <Text customStyle={{ marginLeft: "10px" }}>{element.title}</Text>
            </ButtonBoxStyled>
          );
        })}
      </ButtonWrapper>
      <SwitchTabs
        tabs={transactionsContainerTabList}
        activeTab={transactionsContainerActiveTab}
        setActiveTab={setTransactionsContainerActiveTab}
      />

      <TxHistory tokenSymbol={token?.name} chain={token?.chain} height={120} />
    </>
  );
};

export default TokenDetailSection;
