/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AccordianRowsStyled, Text } from "@styled";
import Accordian from "../Accordian";
import AccordianRow from "../AccordianRow";
import { RootState, USERINFO } from "interfaces";
import { getStorageSyncValue } from "@constants";
import { ACCOUNTS, CHAINS } from "utils/constants";
import {
  setAccountNumber,
  setWalletFilter,
  setWalletNumber,
} from "@slices/appSlice";

const WalletAccordian: FC<{
  handleClose: () => void;
}> = ({ handleClose }) => {
  /* global-state */
  const { accountNumber, switchWallet, walletNumber, switchNetwork } =
    useSelector((state: RootState) => state.app);
  const { chain } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [copyIndex, setCopyIndex] = useState({
    walletIndex: 0,
    accountIndex: 0,
  });
  const [wallets, setWallets] = useState<{
    [key: string]: string[];
  }>({});
  const [copied, setCopied] = useState(false);
  // const [currentAccountIndex, setCurrentAccountIndex] = useState({
  //   walletIndex: 0,
  //   accountIndex: 0,
  // });
  // const [user, setUser] = useState<USERINFO>();

  /* hooks */
  const dispatch = useDispatch();

  /* functions */

  /* effects */
  useEffect(() => {
    let copyInterval: NodeJS.Timeout;
    if (copied) {
      copyInterval = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => clearTimeout(copyInterval);
  }, [copied]);

  useEffect(() => {
    (async () => {
      const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;

      let chains = Object.keys(isUserExist.wallet1[CHAINS]);
      console.log({ chains });
      // setUser(isUserExist);
      let wallets = Object.keys(isUserExist);
      let addresses: {
        [key: string]: string[];
      } = {};
      console.log(wallets, "wallets", isUserExist.wallet1.chains[chain]);
      if (!switchNetwork && switchWallet) {
        wallets.forEach((wallet) => {
          for (let i = 0; i < chains.length; i++) {
            if (addresses[wallet]) {
              addresses = {
                ...addresses,
                [wallet]: [
                  ...addresses[wallet],
                  ...Object.keys(
                    isUserExist[wallet][CHAINS][chains[i]][ACCOUNTS]
                  ).map(
                    (account) =>
                      isUserExist[wallet][CHAINS][chains[i]][ACCOUNTS][account]
                        .address
                  ),
                ],
              };
            } else {
              addresses = {
                ...addresses,
                [wallet]: Object.keys(
                  isUserExist[wallet][CHAINS][chains[i]][ACCOUNTS]
                ).map(
                  (account) =>
                    isUserExist[wallet][CHAINS][chains[i]][ACCOUNTS][account]
                      .address
                ),
              };
            }
          }
        });
      } else {
        console.log(wallets, chain, "test it is");
        wallets.forEach((wallet) => {
          addresses = {
            ...addresses,
            [wallet]: Object.keys(
              isUserExist[wallet][CHAINS][chain][ACCOUNTS]
            ).map(
              (account) =>
                isUserExist[wallet][CHAINS][chain][ACCOUNTS][account].address
            ),
          };
        });
      }
      console.log("addresses and chains", addresses, chains);
      setWallets(addresses);
    })();
  }, [switchNetwork, switchWallet]);

  return (
    <Accordian
      summary="Wallet"
      switchChecked={switchWallet}
      handleSwitchChange={() => {
        dispatch(setWalletFilter(!switchWallet));
        if (switchWallet === true) {
          console.log("set my account number to -1");
          dispatch(setAccountNumber(-1));
          dispatch(setWalletNumber(1));
        }
        // do something
      }}
      expanded={switchWallet}
    >
      <>
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
        {Object.keys(wallets).map((wallet, walletIndex) => {
          // wallet looping
          // console.log(wallets[wallet], "walltes of");
          return (
            <AccordianRowsStyled key={walletIndex}>
              <AccordianRow
                text={wallet.replace(wallet, `Wallet ${walletIndex + 1}`)}
                selected={walletNumber === walletIndex + 1 ? true : false}
                isHeading
              />

              {wallets[wallet].map((address, index) => {
                /// acount looping in wallet
                // console.log(address, "address");
                return (
                  <>
                    <AccordianRow
                      key={index}
                      text={
                        address.length === 0
                          ? "Click to create Account id"
                          : `Account ${index + 1}: ${address.slice(
                              0,
                              4
                            )}...${address.slice(
                              address.length - 4,
                              address.length
                            )} `
                      }
                      copy={address.length > 0 ? true : false}
                      isLast
                      setCopied={setCopied}
                      address={address}
                      isChecked={
                        index === accountNumber &&
                        walletIndex + 1 === walletNumber
                          ? true
                          : false
                      }
                      setCurrentAccountIndex={setCopyIndex}
                      index={index}
                      walletIndex={walletIndex + 1}
                      setCopyIndex={setCopyIndex}
                      onClick={() => {
                        console.log("handle close is runiing");
                        handleClose();
                      }}
                    />
                    <div>
                      <Text style={{ color: "#5bd67e" }}>
                        {copied &&
                        copyIndex.walletIndex === walletIndex &&
                        copyIndex.accountIndex === index
                          ? "Address is copied!"
                          : "   "}
                      </Text>
                    </div>
                  </>
                );
              })}
            </AccordianRowsStyled>
          );
        })}
      </>
    </Accordian>
  );
};

export default WalletAccordian;
