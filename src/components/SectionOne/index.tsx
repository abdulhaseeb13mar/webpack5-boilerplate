import { FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RecieveSVG, ShapeSVG, PathSVG } from "assets/images";
import { ImageContent, TabButton, Text } from "@styled";
import { SectionOneProps as PROPS } from "interfaces";
import { addSelectedToken } from "@slices/sendTransaction";

const SectionOne: FC<PROPS> = ({ token, setToken }) => {
  /* global-state */

  /* local-state */

  /* hooks */
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* functions */

  /* effects */

  return (
    <div className="navigators">
      {token.name.length > 0 && (
        <TabButton
          onClick={() => {
            setToken({
              open: false,
              address: "",
              chain: 1,
              name: "",
              price: 0,
              priceChange: 0,
              time: "1d",
            });
            dispatch(
              addSelectedToken({
                tokenName: "",
                tokenAddress: "",
                tokenAmount: 0,
                amount: "0",
                recieverAddress: "",
                tokenDecimal: 0,
                tokenNetwork: 1,
                address: "",
                usdAmount: 0,
                nativeTokenInUsd: 0,
              })
            );
          }}
        >
          <ImageContent
            Logo={false}
            Opacity={false}
            top={false}
            src={ShapeSVG}
            Size={{
              width: "15px",
              height: "15px",
            }}
            alt=""
          />
          <Text size={14} primary={true} style={{ marginTop: "5px" }}>
            Back
          </Text>
        </TabButton>
      )}
      <TabButton
        onClick={() => {
          navigate("/send");
        }}
      >
        <ImageContent
          Logo={false}
          Opacity={false}
          top={false}
          src={PathSVG}
          Size={{
            width: "15px",
            height: "15px",
          }}
          alt=""
        />
        <Text size={14} primary={true} style={{ marginTop: "5px" }}>
          Send
        </Text>
      </TabButton>
      <TabButton
        onClick={() => {
          navigate("/swap");
        }}
      >
        <ImageContent
          Logo={false}
          Opacity={false}
          top={false}
          src={RecieveSVG}
          Size={{
            width: "15px",
            height: "15px",
          }}
          alt=""
        />
        <Text size={14} primary={true} style={{ marginTop: "5px" }}>
          Recieve
        </Text>
      </TabButton>
      <TabButton
        onClick={() => {
          navigate("/swap");
        }}
      >
        <ImageContent
          Logo={false}
          Opacity={false}
          top={false}
          src={ShapeSVG}
          Size={{
            width: "15px",
            height: "15px",
          }}
          alt=""
        />
        <Text size={14} primary={true} style={{ marginTop: "5px" }}>
          Swap
        </Text>
      </TabButton>
    </div>
  );
};

export default SectionOne;
