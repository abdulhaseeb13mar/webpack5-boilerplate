import { FC } from "react";
import { faSortUp } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SingleAccordion from ".";
import { MainAccordionProps as PROPS } from "interfaces";
import { NETWORKCHAIN } from "utils/constants";
import { ChainHeading, Text } from "@styled";

const MainAccordion: FC<PROPS> = ({
  tokensHistory,
  handleAccordionClick,
  activeToken,
  setCurrentStep,
  setToken,
  setFromToken,
  isShow,
  isSwap,
  handleClose,
  isDashboard,
  handleToggle,
  setActiveToken,
  toggle,
  setTokenDetail,
}) => {
  return (
    <>
      {Object.keys(tokensHistory)?.map((chain, i) => {
        console.log("chain INedx", activeToken?.chainId);
        return (
          <>
            {isDashboard ? (
              <ChainHeading
                key={i}
                onClick={() => {
                  if (handleToggle) handleToggle(+chain);
                }}
              >
                <Text
                  className="chainName"
                  weight={400}
                  size={14}
                  dim={true}
                  customStyle={{ margin: "0px" }}
                >
                  {NETWORKCHAIN[+chain as keyof typeof NETWORKCHAIN].NAME}
                </Text>
                <FontAwesomeIcon
                  icon={faSortUp}
                  style={{
                    fontSize: "19px",
                    color: "rgba(255, 255, 255, 0.3)",
                    marginTop: "10px",
                  }}
                />
              </ChainHeading>
            ) : (
              <Text key={i} className="chainName" weight={400} size={14}>
                {NETWORKCHAIN[+chain as keyof typeof NETWORKCHAIN].NAME}
              </Text>
            )}
            {Object.keys(
              tokensHistory[+chain as keyof typeof tokensHistory]
            )?.map((value, index) => {
              return (
                <SingleAccordion
                  key={index}
                  symbolSrc={tokensHistory[+chain][value].tokenSymbol}
                  tokenInfo={{
                    tokenSymbol: tokensHistory[+chain][value].tokenSymbol,
                    tokenName: tokensHistory[+chain][value].tokenSymbol,
                    usdAmount: tokensHistory[+chain][value].priceInUSD,
                    tokenDecimal: +tokensHistory[+chain][value].tokenDecimal,
                    tokenAddress: tokensHistory[+chain][value].tokenAddress,
                    tokenNetwork: +chain,
                    image: tokensHistory[+chain][value].image,
                    tokenAmount:
                      tokensHistory[+chain][value].tokenBalance < 1
                        ? parseFloat(
                            tokensHistory[+chain][value].tokenBalance.toFixed(4)
                          )
                        : parseFloat(
                            tokensHistory[+chain][value].tokenBalance.toFixed(2)
                          ),
                  }}
                  value={0}
                  accordionRows={tokensHistory[+chain][value].accounts}
                  chainName={
                    NETWORKCHAIN[+chain as keyof typeof NETWORKCHAIN].chain
                  }
                  active={
                    +chain === activeToken?.chainId &&
                    index === activeToken.index
                      ? true
                      : false
                  }
                  chainId={activeToken?.chainId}
                  setCurrentStep={setCurrentStep}
                  setToken={setToken}
                  isSwap={isSwap}
                  handleClose={handleClose}
                  setFromToken={setFromToken}
                  isShow={isShow}
                  isDashboard={isDashboard}
                  setActiveToken={(arg) => {
                    if (setActiveToken) {
                      setActiveToken(arg);
                    }
                  }}
                  setTokenDetail={setTokenDetail}
                  handleAccordionClick={() => {
                    console.log("check me out", index, chain, "-------");
                    handleAccordionClick(index, +chain, value);
                  }}
                />
              );
            })}
          </>
        );
      })}
    </>
  );
};

export default MainAccordion;
