import { FC } from "react";
import millify from "millify";

import { MinusSign, PlusSign } from "assets/Icons";
import { ImageContent, Text } from "@styled";
import { TxHistoryAmountProps as PROPS } from "interfaces";

const Amount: FC<PROPS> = ({
  TxType,
  amount,
  symbol,
  image,
  amount0,
  amount2,
  symbol0,
  symbol2,
  image0,
  image2,
}) => {
  const renderItem = (
    TxType: string,
    image: string | undefined,
    amount: string | undefined,
    symbol: string | undefined
  ) => {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ImageContent
          src={TxType === "Received" ? PlusSign : MinusSign}
          alt="PlusMinusSign"
          Size={{
            width: "14px",
            height: "14px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        />
        <ImageContent
          src={image}
          alt="icon"
          Size={{
            width: "28px",
            height: "28px",
            marginLeft: "10px",
            borderRadius: "50%",
          }}
        />
        <Text
          customStyle={{
            marginLeft: "10px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
          weight={400}
          size={20}
        >
          {Number(amount) > 1 ? millify(Number(amount)) : amount}
        </Text>
        <Text
          dim
          weight={400}
          size={14}
          customStyle={{
            opacity: "0.3",
            marginLeft: "6px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          {symbol}
        </Text>
      </div>
    );
  };

  return (
    <div>
      {TxType === "Swap" ? (
        <div>
          {renderItem(TxType, image0, amount0, symbol0)}

          <Text
            dim
            customStyle={{
              opacity: "0.3",
              textAlign: "left",
              marginLeft: "10px",
            }}
            weight={400}
            size={14}
          >
            for
          </Text>
          {/* for icon */}
          {renderItem("Received", image2, amount2, symbol2)}
        </div>
      ) : (
        renderItem(TxType, image, amount, symbol)
      )}
    </div>
  );
};

export default Amount;
