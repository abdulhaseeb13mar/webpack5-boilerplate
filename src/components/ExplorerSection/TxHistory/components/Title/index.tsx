import { FC } from "react";

// import { truncateAddress } from "background-related/lib/utils";
import { NETWORKCHAIN, TxHistoryTitle } from "utils/constants";
import { ImageContent, Text } from "@styled";
import { TxHistoryTitleProps as PROPS } from "interfaces";

const Title: FC<PROPS> = ({ TxType, toOrFrom, chainId, status }) => {
  return (
    <div style={{ display: "flex" }}>
      <ImageContent
        src={TxHistoryTitle[TxType as keyof typeof TxHistoryTitle].icon}
        alt="Icon"
        Size={{ width: "16px", height: "16px" }}
      />

      <Text
        customStyle={{
          marginLeft: "10px",
        }}
        weight={400}
        size={16}
      >
        {status === "pending"
          ? TxType === "Swap"
            ? "Swapping"
            : "Sending"
          : TxHistoryTitle[TxType as keyof typeof TxHistoryTitle].title}
      </Text>

      <div style={{ marginLeft: "auto" }} />

      <Text
        weight={400}
        dim
        size={14}
        customStyle={{
          opacity: "0.3",
        }}
      >
        {TxHistoryTitle[TxType as keyof typeof TxHistoryTitle].subtitle}
      </Text>
      <Text
        customStyle={{
          marginLeft: "6px",
          opacity: "0.7",
        }}
        weight={400}
        size={16}
      >
        {/* {truncateAddress(toOrFrom)} */}
      </Text>
      {/* require update after pull */}
      <ImageContent
        src={NETWORKCHAIN[chainId as keyof typeof NETWORKCHAIN].LOGO}
        alt="logo"
        Size={{ width: "16px", height: "16px", marginLeft: "6px" }}
      />
    </div>
  );
};

export default Title;
