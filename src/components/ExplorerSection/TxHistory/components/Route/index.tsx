import { FC } from "react";

import { Avatar } from "assets/Icons";
import { truncateAddress } from "background-related/lib/utils";
import { ImageContent, Text } from "@styled";
import { TxHistoryRouteProps as PROPS } from "interfaces";

const Route: FC<PROPS> = ({ from, to }) => {
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
        Route
      </Text>

      <br />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div>
          <div>
            <Text
              weight={400}
              size={14}
              customStyle={{
                textAlign: "left",
                opacity: "0.4",
              }}
            >
              Sender
            </Text>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "4px",
              }}
            >
              <ImageContent
                src={Avatar}
                alt="Avatar"
                Size={{
                  width: "17px",
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
                {truncateAddress(from)}
              </Text>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <div>
            <Text
              weight={400}
              size={14}
              customStyle={{
                textAlign: "left",
                opacity: "0.4",
              }}
            >
              Receiver
            </Text>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "4px",
              }}
            >
              <ImageContent
                src={Avatar}
                alt="Avatar"
                Size={{
                  width: "17px",
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
                {truncateAddress(to)}
              </Text>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
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

export default Route;
