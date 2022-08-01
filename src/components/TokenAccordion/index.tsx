/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, FC, useCallback } from "react";
import { Box } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";

import {
  RootState,
  TokenAccordianProps as PROPS,
  TokenHistory,
} from "interfaces";

import { Text } from "@styled";

import { addSelectedToken } from "@slices/sendTransaction";

import MainAccordion from "./Accordion/MainAccordion";

const TokenAccordions: FC<PROPS> = ({
  value,
  setCurrentStep,
  isSwap,
  setToken,
  tokensHistory: userTokens,
  handleClose,
  isShow,
  setFromToken,
}) => {
  /* global-state */
  // const { toTokens } = useSelector((state: RootState) => state.wallet);
  const { selectedToken } = useSelector(
    (state: RootState) => state.sendTransaction
  );
  const { tokensHistory } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [filteredList, setFilteredList] = useState(userTokens);
  const [activeToken, setActiveToken] = useState({
    chainId: -1,
    index: 0,
  });

  /* hooks */
  const dispatch = useDispatch();

  /* functions */
  const getFilteredList = (string: string, list: TokenHistory) => {
    let filterObject: TokenHistory = {};

    Object.keys(list).forEach((element) => {
      Object.keys(list[+element as keyof typeof list]).forEach((key) => {
        if (key.toLowerCase().includes(string.toLowerCase())) {
          if (filterObject[+element]) {
            filterObject = {
              ...filterObject,
              [element]: {
                ...filterObject[+element],
                [key]: list[+element][key],
              },
            };
          } else {
            filterObject = {
              ...filterObject,
              [element]: {
                [key]: list[+element][key],
              },
            };
          }
        }
      });
    });
    return filterObject;
  };

  const selectFromToken = (
    tokenName: string,
    tokenBalance: number,
    priceInUSD: number,
    tokenAddress: string,
    tokenDecimal: number
  ) => {
    console.log(tokenBalance, "tokenBalance", priceInUSD, "price in usd");
    if (setToken) {
      setToken({
        tokenName,
        tokenBalance,
        tokenBalanceInUsd: priceInUSD,
        tokenAddress,
        tokenDecimal: +tokenDecimal,
      });
    }
    if (handleClose) handleClose();
  };

  const handleAccordionClick = (
    index: number,
    chainId: number,
    value: string
  ) => {
    if (chainId === activeToken.chainId && index === activeToken.index) {
      setActiveToken({
        chainId: -1,
        index: 0,
      });
    } else {
      setActiveToken({
        chainId,
        index,
      });
    }

    console.log(chainId, index, "check me out>>>in acordion click");
    console.log(chainId, index, filteredList, "hello222", value);
    const accounts = Object.keys(filteredList[+chainId][value].accounts);
    if (accounts.length === 1) {
      if (!isSwap) {
        selectToken(
          filteredList[+chainId][value].tokenName,
          filteredList[+chainId][value].tokenBalance,
          filteredList[+chainId][value].tokenAddress,
          filteredList[+chainId][value].tokenDecimal,
          +chainId,
          accounts[0],
          filteredList[+chainId][value].priceInUSD
        );
        setCurrentStep(2);
      } else if (isSwap && isShow) {
        if (
          filteredList[+chainId][value].tokenAddress !==
          selectedToken.tokenAddress
        ) {
          selectFromToken(
            filteredList[+chainId][value].tokenSymbol,
            filteredList[+chainId][value].tokenBalance || 0,
            0,
            filteredList[+chainId][value].tokenAddress,
            +filteredList[+chainId][value].tokenDecimal
          );
          dispatch(
            addSelectedToken({
              address: accounts[0],
              usdAmount: 1,
              tokenNetwork: +chainId,
              tokenAddress: filteredList[+chainId][value].tokenAddress,
            })
          );
        } else if (handleClose) handleClose();
      } else if (isSwap) {
        const filter = getFilteredList(
          `${filteredList[+chainId][value].tokenAddress}_${
            filteredList[+chainId][value].tokenSymbol
          }`,
          tokensHistory
        );

        selectFromToken(
          filteredList[+chainId][value].tokenSymbol,
          Object.keys(filter).length === 0
            ? 0
            : tokensHistory[+chainId][Object.keys(filter[+chainId])[0]]
                .tokenBalance,
          0,
          filteredList[+chainId][value].tokenAddress,
          +filteredList[+chainId][value].tokenDecimal
        );

        if (handleClose) handleClose();
      }
    }
  };

  /* effects */
  // dont delete
  useEffect(() => {
    // setFilteredArray(
    //   isShow ? tokensHistory?.slice(0, 30) : toTokens?.slice(0, 30)
    // );
    setFilteredList(userTokens);
  }, [userTokens]);

  useEffect(() => {
    const filterObject = getFilteredList(value, userTokens);
    setFilteredList(filterObject);
  }, [value]);

  const selectToken = useCallback(
    (
      tokenName: string,
      tokenAmount: number,
      tokenAddress: string,
      tokenDecimal: string,
      tokenNetwork: number,
      address: string,
      usdAmount: number
    ) => {
      dispatch(
        addSelectedToken({
          tokenName,
          tokenAmount,
          tokenAddress,
          tokenDecimal,
          tokenNetwork,
          address,
          usdAmount,
          multiAccountExist: false,
        })
      );
    },
    []
  );

  return (
    <div className="c-fs-fs" style={{ overflowY: "scroll", height: "404px" }}>
      <Box className="r-c-sb">
        <Text
          size={13}
          customColor="#5E5E64"
          style={{ margin: "20px 0px 10px 20px" }}
          weight={600}
        >
          ALL
        </Text>
      </Box>

      <MainAccordion
        tokensHistory={filteredList}
        handleAccordionClick={handleAccordionClick}
        activeToken={activeToken}
        setCurrentStep={setCurrentStep}
        setToken={setToken}
        setFromToken={setFromToken}
        isShow={isShow}
        isSwap={isSwap}
        handleClose={handleClose}
        isDashboard={false}
      />
    </div>
  );
};

export default TokenAccordions;
