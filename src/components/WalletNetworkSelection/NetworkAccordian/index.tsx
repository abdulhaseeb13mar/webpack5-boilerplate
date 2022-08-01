import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Accordian from "../Accordian";
import AccordianRow from "../AccordianRow";
import { AccordianRowsStyled, Text } from "@styled";
import {
  ACCOUNTS,
  CHAINS,
  LOGO,
  NEAR,
  NEAR_TESTNET,
  NETWORKCHAIN,
  SOLANA_DEVNET,
  SupportedChainId,
} from "utils/constants";
import { RootState, USERINFO } from "interfaces";
import { getStorageSyncValue } from "@constants";
import { filterByNetwork } from "@slices/appSlice";
import { setNearAccountId, setNearAccountNetwork } from "@slices/walletSlice";
import { changeNetwork } from "@slices/walletSlice/wallet.actions";

const NetworkAccordian: FC<{
  handleClose: () => void;
}> = ({ handleClose }) => {
  /* global-state */
  const { switchNetwork, isLoading } = useSelector(
    (state: RootState) => state.app
  );
  const { network } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [selectedChainIndex, setSelectedChainIndex] = useState<number>(
    Object.keys(NETWORKCHAIN).indexOf(network.toString())
  );

  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* functions */
  const switchToNearChain = async (
    value: number,
    selectedChainIndex: number
  ) => {
    dispatch(setNearAccountNetwork(value));
    let currentNetwork = "";
    if (value === SupportedChainId.NEAR) currentNetwork = NEAR;
    else currentNetwork = NEAR_TESTNET;
    // if (value === currentNetwork) {
    const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;
    console.log(isUserExist);
    const accountAddress = Object.keys(
      isUserExist[`wallet${1}`][CHAINS][currentNetwork][ACCOUNTS]
    )[0];
    const accountId =
      isUserExist[`wallet${1}`][CHAINS][currentNetwork][ACCOUNTS][
        accountAddress
      ].address;
    console.log(accountId);
    if (accountId.length === 0) {
      console.log("accountId is empty");
      navigate("/near");
      // navigate("/seedphrase");
    } else {
      console.log(
        "near account already exist, now ypu have to change the chain",
        value,
        selectedChainIndex
      );

      dispatch(setNearAccountId(accountId));
      dispatch(changeNetwork(value, selectedChainIndex));
    }
    // }
    //  else {
    //   if (nearMainnetAccountId.length === 0) {
    //     console.log("you have sekletd mainnet");
    //     navigate("/near");
    //   } else {
    //     dispatch(changeNetwork(value, selectedChainIndex));
    //   }
    // }
  };

  /* effects */

  return (
    <Accordian
      summary="Network"
      switchChecked={switchNetwork}
      handleSwitchChange={() => {
        dispatch(filterByNetwork(!switchNetwork));
        // if (switchNetwork === true)
        //   dispatch(changeNetwork(ETHEREUM_MAINNET, 1));
      }}
      expanded={switchNetwork}
    >
      <div
        style={{
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "all",
        }}
      >
        <Text
          primary={false}
          style={{
            textAlign: "left",
            paddingLeft: 10,
          }}
          size={13}
          weight={600}
        >
          CHAINS
        </Text>
        <AccordianRowsStyled>
          {Object.keys(NETWORKCHAIN).map((value, index) => {
            return (
              <AccordianRow
                key={index}
                onClick={() => {
                  setSelectedChainIndex(index);
                  console.log(value, "value on click", value !== NEAR_TESTNET);
                  if (
                    +value === SupportedChainId.NEAR_TESTNET ||
                    +value === SupportedChainId.NEAR
                  ) {
                    console.log("near account checking");
                    switchToNearChain(+value, selectedChainIndex);
                  }
                  if (value === SOLANA_DEVNET) {
                    dispatch(changeNetwork(+value, selectedChainIndex));
                  } else {
                    dispatch(changeNetwork(+value, selectedChainIndex));
                  }
                  handleClose();
                }}
                text={NETWORKCHAIN[+value as keyof typeof NETWORKCHAIN].NAME}
                logo={NETWORKCHAIN[+value as keyof typeof NETWORKCHAIN][LOGO]}
                selected={selectedChainIndex === index ? true : false}
              />
            );
          })}
        </AccordianRowsStyled>
      </div>
    </Accordian>
  );
};

export default NetworkAccordian;
