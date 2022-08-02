import { useSelector } from "react-redux";

import { Trend } from "assets/images";
import { GenericBox, FlexBox, Text, ImageContent } from "@styled";
import { AnimateAlternate } from "components";
import { NegeativeTrend } from "assets/Icons";
import { RootState } from "interfaces";

const ChangeBox = () => {
  /* global-state */
  const {
    profit: { amount, symbol, status },
    tokensHistory,
  } = useSelector((state: RootState) => state.wallet);

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  return (
    <FlexBox paddingTrue={false} onlyFlex={false} FlexStart={false}>
      <FlexBox paddingTrue={false} FlexStart={false} onlyFlex={true}>
        {Object.keys(tokensHistory).length > 0 ? (
          <>
            <ImageContent
              style={{
                width: "9px",
                height: "27px",
                marginRight: "3px",

                color: "red",
              }}
              src={status ? Trend : NegeativeTrend}
            />
            <Text dim={true} weight={500} lineHeight={1.8}>
              <AnimateAlternate
                firstText={`${amount}`}
                secondText={`${amount}`}
              />
            </Text>
            <Text
              dim={true}
              size={11.5}
              weight={200}
              lineHeight={2.5}
              style={{ marginLeft: "1px" }}
            >
              {symbol}
            </Text>

            <Text
              lineHeight={2.5}
              size={11}
              primary={false}
              dim
              weight={400}
              style={{ marginLeft: "8px", marginRight: "6px" }}
            >
              in
            </Text>
            <GenericBox
              Heightstyle={{
                padding: "3px 9px",
                height: "24px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text weight={400} size={11} primary>
                1
              </Text>
              <Text
                size={10}
                weight={400}
                primary={false}
                dim={true}
                style={{ marginLeft: "2px" }}
              >
                month
              </Text>
            </GenericBox>
          </>
        ) : (
          ""
        )}
      </FlexBox>
    </FlexBox>
  );
};

export default ChangeBox;
