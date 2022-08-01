import { FC } from "react";

import { TokenValuesProps as PROPS } from "interfaces";
import { numFormatter } from "@constants";
import { Text } from "@styled";

const TokenValues: FC<PROPS> = ({ usdAmount, tokenAmount, tokenSymbol }) => {
  /* global-state */

  /* local-state */

  /* hooks */

  /* functions */
  const usdAmountFormat = numFormatter(usdAmount, 2);
  const tokenAmountFormat = numFormatter(tokenAmount, 5);

  /* effects */

  return (
    <div className="r-c-sb tokenAmountStyle">
      <Text size={15} weight={400} customStyle={{ opacity: "0.5" }}>
        <span style={{ color: "#919195" }}>~</span>
        {usdAmountFormat.amount}
        {usdAmountFormat.symbol}
        <span style={{ color: "#919195" }}>$</span>
      </Text>
      <Text
        size={17}
        weight={400}
      >{`${tokenAmountFormat.amount} ${tokenAmountFormat.symbol}`}</Text>
    </div>
  );
};

export default TokenValues;
