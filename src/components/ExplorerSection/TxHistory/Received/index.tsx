import { FC, useState } from "react";
import { Collapse, Divider } from "@mui/material";

import Amount from "../components/Amount";
import Buttons from "../components/Buttons";
import Route from "../components/Route";
import Subtitle from "../components/Subtitle";
import Title from "../components/Title";
import Transaction from "../components/Transaction";
import { TxHistoryReceivedProps as PROPS } from "interfaces";

const Received: FC<PROPS> = ({
  item: {
    TxType,
    from,
    to,
    contractAddress,
    amount,
    network,
    symbol,
    txHash,
    amountInUSD,
    image,
    gasFeeInUSD,
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
      <Title TxType={TxType} toOrFrom={to} chainId={network} />

      <Divider
        sx={{ borderBottomWidth: 2, marginTop: "8px", marginBottom: "8px" }}
      />

      <Collapse in={!expandStatus} timeout={0}>
        <Subtitle image={image} amount={amount} symbol={symbol} from={from} />
      </Collapse>

      <Collapse in={expandStatus}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Amount
            TxType={TxType}
            amount={amount}
            symbol={symbol}
            image={image}
          />
          <Transaction amountInUSD={amountInUSD} gasFeeInUSD={gasFeeInUSD} />
          <Route from={from} to={to} />
          <Buttons txHash={txHash} network={network} />
        </div>
      </Collapse>
    </div>
  );
};

export default Received;
