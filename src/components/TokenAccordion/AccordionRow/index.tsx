import { FC } from "react";
import Radio from "@mui/material/Radio";
import { useDispatch, useSelector } from "react-redux";

import { AccordionRowProps as PROPS, RootState } from "interfaces";
import {
  AccordionRowStyled,
  FormControlLabelStyled,
  ImageContent,
  Text,
} from "@styled";
import { addSelectedToken } from "@slices/sendTransaction";
import { ListItemValueBox } from "components";

const AccordionRow: FC<PROPS> = ({
  value,
  imageSrc,
  isLast,
  address,
  setCurrentStep,
  setToken,
  isSwap,
  handleClose,
  tokenInfo,
  setFromToken,
  isShow,
  isDashboard,
  setTokenDetail,
}) => {
  /* global-state */
  const {
    tokenName,
    tokenAmount,
    usdAmount,
    tokenAddress,
    tokenDecimal,
    tokenNetwork,
    tokenSymbol,
    image,
  } = tokenInfo;
  const { selectedToken } = useSelector(
    (state: RootState) => state.sendTransaction
  );

  /* local-state */

  /* hooks */
  const dispatch = useDispatch();

  /* functions */
  const selectSellToken = () => {
    if (address !== selectedToken.address && !isDashboard) {
      console.log(
        "this token only exits in one account",
        999,
        tokenAddress,
        selectedToken.address
      );
      if (setToken && tokenDecimal && tokenNetwork)
        setToken({
          tokenName,
          tokenBalance: tokenAmount,
          tokenBalanceInUsd: 0,
          tokenAddress: tokenAddress || "",
          tokenDecimal: +tokenDecimal,
        });
      dispatch(
        addSelectedToken({
          address: address,
          usdAmount,
          // @ts-ignore
          tokenNetwork: +tokenNetwork || 1,
          tokenAddress: tokenAddress || "",
          tokenDecimal: tokenDecimal || "0",
          multiAccountExist: true,
        })
      );
    }
    if (handleClose) handleClose();
  };

  const saveTokenDetailsToRedux = () => {
    dispatch(
      addSelectedToken({
        tokenName,
        tokenAddress,
        tokenAmount,
        tokenDecimal,
        tokenNetwork,
        address,
        usdAmount,
        multiAccountExist: true,
      })
    );
  };

  const selectTransferToken = () => {
    saveTokenDetailsToRedux();
    if (setCurrentStep) setCurrentStep(2);
  };

  /* effects */

  return (
    <AccordionRowStyled
      onClick={() => {
        if (isSwap && isShow) {
          selectSellToken();
        } else if (isSwap) {
          console.log("this logic is for to tokens");
        } else if (isDashboard) {
          console.log("dashboard functionsaity", {
            tokenInfo,
          });
          if (setTokenDetail && tokenInfo.tokenAddress && tokenNetwork) {
            const price = +usdAmount / tokenAmount;
            if (price > 0) {
              console.log(
                "you can determine price chnage",
                usdAmount,
                tokenAmount,
                tokenAmount / +usdAmount
              );
            }
            setTokenDetail({
              address: tokenInfo.tokenAddress,
              chain: +tokenNetwork,
              name: tokenSymbol || "",
              open: true,
              price,
              priceChange: 10,
              time: "1d",
            });
          }
          saveTokenDetailsToRedux();
        } else {
          selectTransferToken();
        }
      }}
    >
      <div
        className="r-c-fs"
        style={{
          color: "#fff",
          paddingLeft: "2px",
          marginLeft: "10px",
          paddingTop: `${isDashboard ? "5px" : "0px"}`,
          paddingBottom: `${isDashboard ? "5px" : "0px"}`,
        }}
      >
        {" "}
        {isDashboard ? (
          <ImageContent
            src={image}
            Size={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
        ) : (
          <FormControlLabelStyled
            value={value}
            control={
              <Radio
                sx={{
                  color: "grey",
                  margin: "0px",
                  "&.Mui-checked": {
                    color: "darkgray",
                  },
                }}
              />
            }
            label={value}
          />
        )}
        <Text size={14} weight={400}>
          {tokenName}
        </Text>
      </div>
      <ListItemValueBox isChain={true} usdAmount={usdAmount} />
      {/* <TokenValues
        tokenName={tokenName}
        usdAmount={usdAmount}
        tokenAmount={tokenAmount}
      /> */}
    </AccordionRowStyled>
  );
};

export default AccordionRow;
