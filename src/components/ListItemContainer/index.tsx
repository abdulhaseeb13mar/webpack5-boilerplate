/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";

import { LogoBNB } from "assets/images";
import { numFormatter } from "@constants";
import { GenericBox, FlexBox, ImageContent, Text } from "@styled";
import { ListItemContainerProps as PROPS } from "interfaces";

const ListItemContainer: FC<PROPS> = ({
  tokenName,
  tokenSymbol,
  priceInUSD,
  tokenBalance,
  swap,
}) => {
  /* global-state */

  /* local-state */
  const [amounts, setAmounts] = useState({
    tokenBalance: 0,
    priceInUSD: 0,
    priceInUSDStatus: true,
    tokenSymbol: "",
    priceInUSDSymbol: "",
  });

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    const token = numFormatter(tokenBalance || 0, 5);
    const price = numFormatter(parseInt(priceInUSD) || 0, 4);
    setAmounts({
      tokenBalance: token.amount,
      priceInUSD: price.amount,
      tokenSymbol: token.symbol,
      priceInUSDStatus: token.status,
      priceInUSDSymbol: price.symbol,
    });
  }, [swap]);

  return (
    <FlexBox Padding={true}>
      <GenericBox
        Heightstyle={{
          height: "54px",
          flexDirection: "row",
          padding: " 0px 21px 0px 16px",
          width: "90%",
        }}
      >
        <ImageContent Logo={true} top={false} Opacity={false} src={LogoBNB} />
        <div className="token-balance-box">
          <Text
            size={11}
            primary={false}
            dim={false}
            weight={200}
            style={{ letterSpacing: "0.5px", marginRight: "5px" }}
          >
            {tokenName}
          </Text>
          <div className="token-figure">
            <Text
              weight={400}
              size={13}
              primary={true}
              style={{ marginRight: "2px" }}
            >
              {amounts.tokenBalance}
            </Text>
            <Text
              size={14}
              weight={200}
              primary={false}
              dim={false}
              style={{ marginRight: "5px" }}
            >
              {amounts.tokenSymbol}
            </Text>
            <Text weight={400} size={13} primary={false} dim={false}>
              {` ${tokenSymbol}`}
            </Text>
          </div>
        </div>
        <div className="token-balance-2">
          {amounts.priceInUSD === 0 || !amounts.priceInUSDStatus ? (
            ""
          ) : (
            <>
              <Text
                primary={false}
                dim={false}
                size={11.5}
                weight={200}
                lineHeight={2.5}
              >
                $
              </Text>
              <Text
                size={14}
                lineHeight={1.8}
                style={{
                  marginRight: "3px",
                  marginLeft: "3px",
                }}
              >
                {amounts.priceInUSD}
              </Text>
              <Text primary={false} dim={false} size={11.5} weight={200}>
                {` ${amounts.priceInUSDSymbol}`}
              </Text>
            </>
          )}
        </div>
      </GenericBox>
    </FlexBox>
  );
};

export default ListItemContainer;
