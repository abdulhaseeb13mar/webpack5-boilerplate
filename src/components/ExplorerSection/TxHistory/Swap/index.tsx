import { Divider, Collapse } from "@mui/material";
import { FC, useState } from "react";
import millify from "millify";

import { ImageContent, Text } from "@styled";
import Amount from "../components/Amount";
import Buttons from "../components/Buttons";
import ResultingBalance from "../components/ResultingBalance";
import Route from "../components/Route";
import Title from "../components/Title";
import TokenPrices from "../components/TokenPrices";
import Transaction from "../components/Transaction";
import { TxHistorySwapProps as PROPS } from "interfaces";
import { Title as ArrowIcon } from "assets/Icons/index";

const Swap: FC<PROPS> = ({
  item: {
    TxType,
    from,
    to,
    contractAddress1,
    contractAddress2,
    amount1,
    amount2,
    network,
    symbol1,
    symbol2,
    txHash,
    amountInUSD1,
    amountInUSD2,
    image1,
    image2,
    gasFeeInUSD,
    tokenPrice1,
    tokenPrice2,
    balance1,
    balance2,
  },
}) => {
  /* global-state */

  /* local-state */
  const [expandStatus, setExpandStatus] = useState<boolean>(false);

  /* hooks */

  /* functions */

  /* effects */

  return (
    <div
      style={{ width: "100%" }}
      onClick={() => setExpandStatus(!expandStatus)}
    >
      <Title TxType="Swap" toOrFrom={from} chainId={network} />

      <Divider
        sx={{ borderBottomWidth: 2, marginTop: "8px", marginBottom: "8px" }}
      />

      <Collapse in={!expandStatus}>
        <div style={{ display: "flex" }}>
          <ImageContent
            src={image2}
            alt="image2"
            Size={{ width: "16px", height: "16px", borderRadius: "50%" }}
          />

          <ImageContent
            src={ArrowIcon}
            alt="ArorwIcon"
            Size={{ width: "12px", height: "14px", marginLeft: "5px" }}
          />

          <ImageContent
            src={image1}
            alt="image1"
            Size={{
              width: "16px",
              height: "16px",
              marginLeft: "5px",
              borderRadius: "50%",
            }}
          />

          <div style={{ marginLeft: "auto" }} />

          <Text customStyle={{ opacity: "0.7" }} weight={400} size={16}>
            {Number(amount2) > 1 ? Number(amount2).toFixed(2) : amount2}
          </Text>
          <Text
            dim
            weight={400}
            size={14}
            customStyle={{
              opacity: "0.3",
              marginLeft: "6px",
            }}
          >
            {symbol2}
          </Text>

          <Text
            weight={400}
            dim
            size={14}
            customStyle={{
              opacity: "0.3",
              marginLeft: "6px",
            }}
          >
            for
          </Text>

          <Text
            weight={500}
            size={16}
            customStyle={{
              opacity: "0.7",
              marginLeft: "6px",
            }}
          >
            {Number(amount1) > 1 ? millify(Number(amount1)) : amount1}
          </Text>
          <Text
            dim
            weight={400}
            size={14}
            customStyle={{
              opacity: "0.3",
              marginLeft: "6px",
            }}
          >
            {symbol1}
          </Text>
        </div>
      </Collapse>

      <Collapse in={expandStatus}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Amount
            TxType="Swap"
            amount=""
            symbol=""
            image=""
            amount0={amount1}
            amount2={amount2}
            symbol0={symbol1}
            symbol2={symbol2}
            image0={image1}
            image2={image2}
          />
          <TokenPrices
            symbol0={symbol1}
            symbol2={symbol2}
            tokenPrice0={tokenPrice1}
            tokenPrice2={tokenPrice2}
          />
          <ResultingBalance
            amount0={amount1}
            amount2={amount2}
            symbol0={symbol1}
            symbol2={symbol2}
            amountInUSD0={amountInUSD1}
            amountInUSD2={amountInUSD2}
            balance0={balance1}
            balance2={balance2}
          />
          <Transaction
            amountInUSD={amountInUSD1 + amountInUSD2}
            gasFeeInUSD={gasFeeInUSD}
          />
          <Route from={from} to={to} />
          <Buttons txHash={txHash} network={network} />
        </div>
      </Collapse>
    </div>
  );
};

export default Swap;
