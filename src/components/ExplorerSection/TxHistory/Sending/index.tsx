import { FC } from "react";
import { Divider } from "@mui/material";

import { TxHistorySendingProps as PROPS } from "interfaces";
// import { truncateAddress } from "background-related/lib/utils";
import { useTransaction } from "hooks/sendTransaction";
import { NETWORKCHAIN, NODE_URL } from "utils/constants";
import { ImageContent, Text } from "@styled";
import SpeedupCancelBtn from "../components/SpeedupCancelBtn";
import Title from "../components/Title";

const Sending: FC<PROPS> = ({ item: { hash, rough, TxType } }) => {
  /* global-state */

  /* local-state */

  /* hooks */
  const { speedUpOrCancelTransaction } = useTransaction();

  /* functions */
  const handleSpeedUpFn = async () => {
    console.log("speed up");
    await speedUpOrCancelTransaction(
      hash,
      rough,
      TxType,
      NETWORKCHAIN[rough.network as keyof typeof NETWORKCHAIN][NODE_URL],
      "speedup"
    );
  };

  const handleCancelFn = async () => {
    console.log("cancel");
    await speedUpOrCancelTransaction(
      hash,
      rough,
      TxType,
      NETWORKCHAIN[rough.network as keyof typeof NETWORKCHAIN][NODE_URL],
      "cancel"
    );
  };

  /* effects */

  return (
    <div style={{ width: "100%" }}>
      <Title
        TxType={"Sent"}
        toOrFrom={rough.transactionObject.to}
        chainId={rough.network}
        status={"pending"}
      />

      <Divider
        sx={{ borderBottomWidth: 2, marginTop: "8px", marginBottom: "8px" }}
      />

      <div style={{ display: "flex" }}>
        <ImageContent
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLRNKdvRshSfqksWf3S8dUy7r6qWu7d96buQ&usqp=CAU"
          }
          alt="icon"
          Size={{ width: "18px", height: "18px", borderRadius: "50%" }}
        />
        <Text
          customStyle={{ marginLeft: "10px", opacity: "0.7" }}
          weight={400}
          size={16}
        >
          {rough.amount}
        </Text>
        <Text
          weight={400}
          size={16}
          customStyle={{
            opacity: "0.3",
            marginLeft: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {rough.tokenSymbol} from
        </Text>
        <Text
          weight={500}
          size={16}
          customStyle={{
            opacity: "0.7",
            marginLeft: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* {truncateAddress(rough.transactionObject.from)} */}
        </Text>
      </div>

      <SpeedupCancelBtn
        speedUpFn={() => {
          handleSpeedUpFn();
        }}
        cancelFn={() => {
          handleCancelFn();
        }}
      />
    </div>
  );
};

export default Sending;
