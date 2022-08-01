/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useState } from "react";
import _ from "lodash";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";
import { faSortDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Bnb } from "assets/images";
import { numFormatter } from "@constants";
import { RootState, SwapTokenBoxProps as PROPS } from "interfaces";
import { FROM, SEND } from "utils/constants";
import {
  BalanceBoxStyled,
  ImageContent,
  StyledAmountInput,
  SwapTokenBoxStyled,
  Text,
  TokenSelectionBoxStyled,
  TokenValueBoxStyled,
} from "@styled";

const SwapTokenBox: FC<PROPS> = ({
  title,
  amountInUsd,
  nativeAmount,
  tokenImageSrc,
  tokenName,
  handleClick,
  value,
  setValue,
  isPulsate,
}) => {
  /* global-state */
  const { selectedToken } = useSelector(
    (state: RootState) => state.sendTransaction
  );

  /* local-state */
  const [inputValue, setInputValue] = useState("");
  const [tokenAmount, setTokenAmount] = useState({
    priceInUsd: 0,
    tokenBalance: 0,
    priceInUsdSymbol: "",
    tokenBalanceSymbol: "",
  });
  const [swap, setSwapAmount] = useState({
    swapAmount: 0,
    swapAmountSymbol: "",
  });

  /* hooks */
  const debouncedChangeHandler = useCallback(
    debounce((e: any) => setValue(e), 1000),
    []
  );

  /* functions */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let amount: any = event.target.value.trim();

    if (
      _.isNumber(parseFloat(amount)) &&
      !isNaN(amount) &&
      !amount.includes("-")
    ) {
      console.log("amount");
      if (amount.length === 0) {
        setInputValue("");
        debouncedChangeHandler("0");
      } else if (parseFloat(amount) <= nativeAmount) {
        debouncedChangeHandler(event.target.value);

        setInputValue(amount);
      }
    }
  };

  /* effects */
  useEffect(() => {
    setInputValue("");
    debouncedChangeHandler(0);
  }, [selectedToken.usdAmount]);

  useEffect(() => {
    if (title === SEND) {
      console.log("reset my value to 0");
      setInputValue("");
    }
  }, [tokenName]);

  useEffect(() => {
    const usdAmount = numFormatter(amountInUsd);
    const tokenBalance = numFormatter(nativeAmount, 5);

    const swapTokenBalance = numFormatter(value, 5);
    setSwapAmount({
      swapAmount: swapTokenBalance.amount,
      swapAmountSymbol: swapTokenBalance.symbol,
    });
    setTokenAmount({
      priceInUsd: usdAmount.amount,
      tokenBalance: tokenBalance.amount,
      priceInUsdSymbol: usdAmount.symbol,
      tokenBalanceSymbol: tokenBalance.symbol,
    });
  }, [nativeAmount, amountInUsd, value]);

  return (
    <>
      <SwapTokenBoxStyled
        marginTop={10}
        style={{ height: `${title === FROM ? "50px" : "70px"}` }}
      >
        <TokenValueBoxStyled>
          <Text
            size={15}
            weight={400}
            customColor="#fff"
            customStyle={{ opacity: 0.4 }}
          >
            {title}
          </Text>
          {title !== FROM ? (
            title === SEND ? (
              <Text size={28}>
                <StyledAmountInput
                  placeholder="0"
                  onChange={handleChange}
                  value={inputValue}
                  className={`${isPulsate ? "animated" : ""}`}
                  style={{ width: "84%", textAlign: "start" }}
                />
              </Text>
            ) : (
              <Text
                size={28}
                className={`${isPulsate ? "animated" : ""}`}
              >{`${swap.swapAmount} ${swap.swapAmountSymbol}`}</Text>
            )
          ) : (
            ""
          )}
        </TokenValueBoxStyled>
        <TokenSelectionBoxStyled onClick={handleClick}>
          {tokenImageSrc !== undefined && (
            <ImageContent
              src={tokenImageSrc}
              Size={{ borderRadius: "50%", width: "25px", height: "25px" }}
            />
          )}

          <Text size={16} customStyle={{ marginLeft: "6px" }}>
            {tokenName}
          </Text>
          <FontAwesomeIcon icon={faSortDown} className="sortDownIcon" />
        </TokenSelectionBoxStyled>
      </SwapTokenBoxStyled>
      <BalanceBoxStyled>
        {title === FROM ? (
          <>
            <ImageContent
              src={Bnb}
              Size={{ width: "20px", height: "20px", borderRadius: "50%" }}
            />
            <Text>Wallet 1</Text>
          </>
        ) : (
          <>
            <Text>
              {`~ ${tokenAmount.priceInUsd} ${tokenAmount.priceInUsdSymbol} `}{" "}
              USD{" "}
            </Text>
            <Text>
              Balance: {tokenAmount.tokenBalance}{" "}
              {tokenAmount.tokenBalanceSymbol}{" "}
              {tokenName === "Select Token" ? "" : tokenName}
            </Text>
          </>
        )}
      </BalanceBoxStyled>
    </>
  );
};

export default React.memo(SwapTokenBox);
