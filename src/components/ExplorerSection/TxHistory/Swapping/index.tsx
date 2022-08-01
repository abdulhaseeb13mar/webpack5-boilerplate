import { FC } from "react";
import millify from "millify";
import { Divider } from "@mui/material";

import { useTransaction } from "hooks/sendTransaction";
import { NETWORKCHAIN, NODE_URL } from "utils/constants";
import { ImageContent, Text } from "@styled";
import SpeedupCancelBtn from "../components/SpeedupCancelBtn";
import Title from "../components/Title";
import { TxHistorySwappingProps as PROPS } from "interfaces";

const Swapping: FC<PROPS> = ({ item: { hash, rough, TxType } }) => {
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
        TxType={"Swap"}
        toOrFrom={rough.transactionObject.from}
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
          alt="image2"
          Size={{ width: "18px", height: "18px", borderRadius: "50%" }}
        />
        <Text
          customStyle={{ marginLeft: "10px", opacity: "0.7" }}
          weight={400}
          size={16}
        >
          {Number(rough.makerAmount) > 1
            ? millify(Number(rough.makerAmount))
            : Number(rough.makerAmount).toFixed(4)}
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
          {rough.makerTokenSymbol} for
        </Text>
        <ImageContent
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLRNKdvRshSfqksWf3S8dUy7r6qWu7d96buQ&usqp=CAU"
          }
          alt="image1"
          Size={{
            width: "18px",
            height: "18px",
            marginLeft: "8px",
            borderRadius: "50%",
          }}
        />
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
          {Number(rough.takerAmount) > 1
            ? millify(Number(rough.takerAmount))
            : Number(rough.takerAmount).toFixed(4)}
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
          {rough.takerTokenSymbol}
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
export default Swapping;
