/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { LeftUnit } from "assets/images";
import { RootState } from "interfaces";
import { numFormatter } from "@constants";
import { FlexBox, ImageContent, Text } from "@styled";

function ChartBalance() {
  /* global-state */
  const { tokensHistory, nativeTokenBalance } = useSelector(
    (state: RootState) => state.wallet
  );
  const { isLoading } = useSelector((state: RootState) => state.app);

  /* local-state */
  const [loading, setLoading] = useState(true);
  const [nativeSum, setNativeSum] = useState({
    amount: 0,
    symbol: "",
  });

  /* hooks */

  /* functions */
  const calculateBalance = useCallback(() => {
    let sum = 0;
    Object.keys(tokensHistory).forEach((value) => {
      Object.keys(tokensHistory[+value]).forEach((element) => {
        sum += +tokensHistory[+value][element].priceInUSD;
      });
    });
    setLoading(false);
    return Number(sum);
  }, [nativeTokenBalance, tokensHistory]);

  /* effects */
  useEffect(() => {
    const totalBalance = numFormatter(calculateBalance());
    if (Object.keys(tokensHistory).length > 0) {
      setNativeSum({
        amount: totalBalance.amount,
        symbol: totalBalance.symbol,
      });
    } else {
      setNativeSum({
        amount: 0,
        symbol: "",
      });
    }
  }, [calculateBalance, tokensHistory]);

  return (
    <FlexBox paddingTrue={false} onlyFlex={false} FlexStart={true}>
      <ImageContent style={{ width: "13px", height: "39px" }} src={LeftUnit} />
      <Text size={32} style={{ marginRight: "1px", marginLeft: "3px" }}>
        {loading || isLoading ? 0 : nativeSum.amount}
      </Text>
      <Text size={22} lineHeight={1.9} primary={false} dim={true}>
        {nativeSum.symbol}
      </Text>
    </FlexBox>
  );
}

export default ChartBalance;
