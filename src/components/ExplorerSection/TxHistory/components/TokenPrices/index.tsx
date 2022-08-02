import { FC } from "react";

import { Text } from "@styled";
import { TxHistoryTokenPricesProps as PROPS } from "interfaces";

const TokenPrices: FC<PROPS> = ({
  symbol0,
  symbol2,
  tokenPrice0,
  tokenPrice2,
}) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <Text
        weight={500}
        size={14}
        customStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          textAlign: "left",
          borderRadius: "6px",
          padding: "4px 6px",
          opacity: "0.7",
        }}
      >
        Token Prices (when swapped)
      </Text>

      <br />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div>
            <Text
              weight={500}
              size={14}
              customStyle={{
                textAlign: "left",
                opacity: "0.4",
              }}
            >
              {symbol0}
            </Text>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "4px",
              }}
            >
              <Text
                weight={500}
                size={16}
                customStyle={{
                  textAlign: "left",
                  marginLeft: "2px",
                }}
              >
                {tokenPrice0}
              </Text>
              <Text
                dim
                weight={500}
                size={14}
                customStyle={{
                  opacity: "0.4",
                  textAlign: "left",
                  marginLeft: "2px",
                }}
              >
                USD
              </Text>
            </div>
          </div>
        </div>
        <div>
          <div>
            <Text
              weight={500}
              size={14}
              customStyle={{
                textAlign: "left",
                opacity: "0.4",
              }}
            >
              {symbol2}
            </Text>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "4px",
              }}
            >
              <Text
                weight={500}
                size={16}
                customStyle={{
                  textAlign: "left",
                  marginLeft: "2px",
                }}
              >
                {tokenPrice2}
              </Text>
              <Text
                dim
                weight={500}
                size={14}
                customStyle={{
                  opacity: "0.4",
                  textAlign: "left",
                  marginLeft: "2px",
                }}
              >
                USD
              </Text>
            </div>
          </div>
        </div>
        <div>
          <Text
            weight={400}
            size={14}
            customStyle={{
              textAlign: "left",
              opacity: "0.4",
            }}
          >
            {" "}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TokenPrices;
