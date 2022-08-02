import { FC } from "react";
import { Grid } from "@mui/material";

import { DollarSign } from "assets/Icons";
import { ImageContent, Text } from "@styled";
import { TxHistoryTransactionProps as PROPS } from "interfaces";

const Transaction: FC<PROPS> = ({ amountInUSD, gasFeeInUSD }) => {
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
        Transaction
      </Text>

      <br />

      <div>
        <Grid container>
          <Grid item xs={5}>
            <div>
              <Text
                weight={400}
                size={14}
                customStyle={{
                  textAlign: "left",
                  opacity: "0.4",
                }}
              >
                Value
              </Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "4px",
                }}
              >
                <ImageContent
                  src={DollarSign}
                  alt="DollarSign"
                  Size={{
                    width: "14px",
                    height: "14px",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                />
                <Text
                  weight={500}
                  size={16}
                  customStyle={{
                    textAlign: "left",
                    marginLeft: "2px",
                  }}
                >
                  {amountInUSD}
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
          </Grid>
          <Grid item xs={5}>
            <div>
              <Text
                weight={400}
                size={14}
                customStyle={{
                  textAlign: "left",
                  opacity: "0.4",
                }}
              >
                Fees
              </Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "4px",
                }}
              >
                <ImageContent
                  src={DollarSign}
                  alt="DollarSign"
                  Size={{
                    width: "14px",
                    height: "14px",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                />
                <Text
                  weight={500}
                  size={16}
                  customStyle={{
                    textAlign: "left",
                    marginLeft: "2px",
                  }}
                >
                  {gasFeeInUSD}
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
          </Grid>
          <Grid item xs={2}>
            <Text
              weight={400}
              size={14}
              customStyle={{
                textAlign: "right",
                opacity: "0.4",
              }}
            >
              / Price
            </Text>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Transaction;
