import { FC, useEffect, useState } from "react";
import { faSortDown, faSortUp } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl, RadioGroup } from "@mui/material";

import { Bnb } from "assets/images";
import { getStorageSyncValue, numFormatter } from "@constants";
import { AccordionProps as PROPS, USERINFO } from "interfaces";
import { ACCOUNTS, CHAINS, SUPPORTEDCHAINS } from "utils/constants";
import {
  AccordionStyle,
  TokenAccordion,
  TokenAccordionDetails,
  TokenAccordionSummary,
  Text,
  ImageContent,
  LeftBox,
  RightBox,
  ArrowStyled,
} from "@styled";
import AccordionRow from "../AccordionRow";

const SingleAccordion: FC<PROPS> = ({
  symbolSrc,
  tokenInfo,
  value,
  accordionRows,
  active,
  chainId,
  setCurrentStep,
  setToken,
  isSwap,
  handleClose,
  setFromToken,
  isShow,
  isDashboard,
  setActiveToken,
  setTokenDetail,
  handleAccordionClick,
}) => {
  /* global-state */
  const {
    tokenName,
    usdAmount,
    tokenAmount,
    tokenSymbol,
    tokenDecimal,
    tokenAddress,
    tokenNetwork,
    image,
  } = tokenInfo;

  /* local-state */
  const [user, setUser] = useState<{
    [key: string]: string;
  }>({});

  /* hooks */

  /* functions */
  const tokenAmountFormat = numFormatter(tokenAmount, 3);
  const usdAmountFormat = numFormatter(usdAmount, 2);

  /* effects */
  useEffect(() => {
    let accountsWithName: {
      [key: string]: string;
    } = {};
    (async () => {
      const user = (await getStorageSyncValue("userInfo")) as USERINFO;

      Object.keys(user).forEach((element) => {
        Object.keys(SUPPORTEDCHAINS).forEach((chain) => {
          Object.keys(user[element][CHAINS][chain][ACCOUNTS]).forEach(
            (account) => {
              accountsWithName = {
                ...accountsWithName,
                [user[element][CHAINS][chain][ACCOUNTS][account].address]:
                  user[element][CHAINS][chain][ACCOUNTS][account].name,
              };
            }
          );
        });
      });
      setUser(accountsWithName);
    })();
  }, []);

  return (
    <AccordionStyle
      value={value || 0}
      style={{
        opacity: isDashboard ? 1 : chainId === -1 ? 1 : active ? 1 : 0.5,
      }}
    >
      <TokenAccordion
        disableGutters
        expanded={Object.keys(accordionRows).length > 1 ? active : false}
        sx={{
          "&:before": {
            display: "none",
          },
        }}
      >
        <TokenAccordionSummary
          onClick={() => {
            handleAccordionClick();
          }}
        >
          <ImageContent
            src={image}
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              borderRadius: "50%",
            }}
          />

          {/* token left box */}
          <LeftBox>
            <Text size={17} weight={500}>
              {tokenSymbol}
            </Text>
            <Text
              size={14}
              weight={400}
              dim={true}
              customStyle={{ marginTop: "2px", opacity: "0.3" }}
            >
              {tokenName}
            </Text>
          </LeftBox>
          {Object.keys(accordionRows).length > 1 && (
            <ArrowStyled>
              <FontAwesomeIcon
                icon={
                  chainId === -1
                    ? faSortDown
                    : Object.keys(accordionRows).length > 1
                    ? active === true
                      ? faSortUp
                      : faSortDown
                    : faSortUp
                }
                style={{
                  fontSize: "19px",
                  marginTop: `${
                    chainId === -1
                      ? "0px"
                      : Object.keys(accordionRows).length > 1
                      ? active === true
                        ? "8px"
                        : "0px"
                      : "8px"
                  }`,
                }}
              />
            </ArrowStyled>
          )}

          {tokenAmountFormat.amount > 0 ? (
            <RightBox>
              <Text size={17} weight={500}>
                {tokenAmountFormat.amount} {tokenAmountFormat.symbol}
              </Text>
              <Text
                size={14}
                weight={400}
                dim={true}
                customStyle={{ marginTop: "2px", opacity: "0.3" }}
              >
                {usdAmountFormat.amount} {usdAmountFormat.symbol} USD
              </Text>
            </RightBox>
          ) : (
            ""
          )}
        </TokenAccordionSummary>
        <TokenAccordionDetails>
          <FormControl style={{ width: "100%" }}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="Account1"
              name="radio-buttons-group"
            >
              {Object.keys(accordionRows)?.map((value, index) => {
                if (+accordionRows[value].tokenBalance.toFixed(5) > 0) {
                  return (
                    <AccordionRow
                      key={index}
                      value={user[value]}
                      imageSrc={Bnb}
                      tokenInfo={{
                        tokenName: tokenName,
                        tokenAmount: accordionRows[value].tokenBalance,
                        usdAmount: accordionRows[value].priceInUSD,
                        tokenNetwork: tokenNetwork || 1,
                        tokenDecimal: tokenDecimal || 0,
                        tokenAddress: tokenAddress || "",
                        tokenSymbol,
                        image,
                      }}
                      address={value}
                      setCurrentStep={setCurrentStep}
                      isLast={
                        index === Object.keys(accordionRows).length - 1
                          ? true
                          : false
                      }
                      setToken={setToken}
                      isSwap={isSwap}
                      handleClose={handleClose}
                      setFromToken={setFromToken}
                      isShow={isShow}
                      isDashboard={isDashboard}
                      setTokenDetail={setTokenDetail}
                    />
                  );
                }
                return null;
              })}
            </RadioGroup>
          </FormControl>
        </TokenAccordionDetails>
      </TokenAccordion>
    </AccordionStyle>
  );
};

export default SingleAccordion;
