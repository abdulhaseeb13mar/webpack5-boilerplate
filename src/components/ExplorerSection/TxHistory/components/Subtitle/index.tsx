import { FC } from "react";
import { truncateAddress } from "../../../../../background-related/lib/utils";
import { ImageContent, Text } from "../../../../styled";

const Subtitle: FC<{
  image: string;
  amount: string;
  symbol: string;
  from: string;
}> = ({ image, amount, symbol, from }) => {
  return (
    <div style={{ display: "flex" }}>
      <ImageContent
        src={image}
        alt="icon"
        Size={{ width: "16px", height: "16px", borderRadius: "50%" }}
      />
      <Text
        customStyle={{
          marginLeft: "10px",
          opacity: "0.7",
        }}
        weight={400}
        size={16}
      >
        {amount}
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
        {symbol}
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
        from
      </Text>
      <Text
        weight={500}
        size={16}
        customStyle={{
          opacity: "0.7",
          marginLeft: "6px",
        }}
      >
        {truncateAddress(from)}
      </Text>
    </div>
  );
};

export default Subtitle;
