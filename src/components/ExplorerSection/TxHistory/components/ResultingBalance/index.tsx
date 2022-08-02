import { FC } from "react";
import millify from "millify";

import { Text } from "@styled";
import { TxHistoryResultingBalanceProps as PROPS } from "interfaces";

const ResultingBalance: FC<PROPS> = ({
  amount0,
  amount2,
  symbol0,
  symbol2,
  amountInUSD0,
  amountInUSD2,
  balance0,
  balance2,
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
        Resulting balances (after swap)
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
                flexDirection: "column",
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
                {Number(balance0) > 1 ? millify(Number(balance0)) : balance0}
              </Text>
              <Text
                dim
                weight={500}
                size={14}
                customStyle={{
                  //   textAlign: "left",
                  marginLeft: "2px",
                  opacity: "0.4",
                }}
              >
                ~{amountInUSD0} USD
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
                flexDirection: "column",
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
                {Number(balance2) > 1 ? millify(Number(balance2)) : balance2}
              </Text>
              <Text
                dim
                weight={500}
                size={14}
                customStyle={{
                  //   textAlign: "left",
                  marginLeft: "2px",
                  opacity: "0.4",
                }}
              >
                ~{amountInUSD2} USD
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

export default ResultingBalance;
