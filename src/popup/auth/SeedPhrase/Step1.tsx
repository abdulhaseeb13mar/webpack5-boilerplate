/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import { Text, GenericBox, CustomBox } from "@styled";
import { RootState, SeedPhraseS1Props as PROPS, USERINFO } from "interfaces";
import { getStorageSyncValue } from "@constants";
import { ACCOUNTS, CHAINS, SEEDPHRASE } from "utils/constants";
import { ConvertMnemonicToArray } from "utils/SeedPhrase";
import { setUserAddress } from "@slices/appSlice";
import { decryptMessage } from "utils";

const Step1: FC<PROPS> = ({ setStep }) => {
  /* global-state */
  const { walletNumber } = useSelector((state: RootState) => state.app);
  const { chain } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [reveal, setReveal] = useState(true);
  const [address, setAddress] = useState("");
  const [mnemonic, setMnemonic] = useState<string[]>([]);

  /* hooks */
  const dispatch = useDispatch();

  /* functions */

  /* effects */
  useEffect(() => {
    const getUserAddress = async () => {
      const data = (await getStorageSyncValue("userInfo")) as USERINFO;
      const publicAddress = Object.keys(
        data[`wallet${walletNumber}`][CHAINS][chain][ACCOUNTS]
      )[0];
      const hashedPassword = (await getStorageSyncValue(
        "hashedPassword"
      )) as string;
      const decryptedMnemonic = decryptMessage(
        data[`wallet${walletNumber}`][SEEDPHRASE],
        hashedPassword
      );
      setMnemonic(ConvertMnemonicToArray(decryptedMnemonic));
      setAddress(publicAddress);
    };
    getUserAddress();
  }, []);

  return (
    <CustomBox
      height={"100%"}
      padding="0px 10px"
      style={{
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        background:
          "linear-gradient(182.99deg, #200238 2.8%, #0D0F19 50.8%, #05161C 97.81%)",
      }}
    >
      <Text size={20} style={{ paddingTop: "70px" }}>
        SeedPhrase
      </Text>
      <Text size={13} customColor="#807989" style={{ marginTop: "30px" }}>
        This is the actual key to your wallet.
      </Text>
      <Text size={13} customColor="#807989" style={{ marginTop: "14px" }}>
        You will need this to restore access to it on a new device or
        application
      </Text>
      <CustomBox>
        <CustomBox
          className={`${reveal ? "r-c-c" : "r-fs-fs"}`}
          margin={"20px 15px"}
          height={"130px"}
          padding="15px"
          backgroundColor={"rgba(255, 255, 255, 0.1)"}
          style={{ flexWrap: "wrap" }}
        >
          {!reveal &&
            mnemonic.map((value: string, index: number) => {
              return (
                <motion.span
                  key={index}
                  layout
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ y: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    color: "white",
                    fontSize: "14px",
                    padding: "5px 10px 0px 0px",
                  }}
                >
                  {value}
                </motion.span>
              );
            })}

          {reveal && (
            <CustomBox
              backgroundColor={"rgba(255,255,255,0.1)"}
              padding={"8px"}
              borderRadius={"10px"}
              onClick={() => setReveal(false)}
              style={{ cursor: "pointer" }}
            >
              <Text size={13}>Tap to reveal</Text>
            </CustomBox>
          )}
        </CustomBox>
      </CustomBox>

      <Text size={13} customColor="#807989" style={{ marginTop: "30px" }}>
        Be sure you have complete privacy
      </Text>
      <Text size={13} customColor="#FF7448" style={{ margin: "30px 20px" }}>
        Never disclose it. Possessing this enables full control of your wallet.
      </Text>
      <CustomBox className="r-c-c" margin={"50px 0 0 0"}>
        <GenericBox
          style={{ cursor: "pointer" }}
          onClick={() => {
            setStep(2);

            dispatch(setUserAddress(address));
            //   if (!CURRENTLY_IN_DEVELOPMENT) {
            //       dispatch(setUserLoggedIn(true));
            //     dispatch({ type: IS_MNEMONIC_SAVED, payload: true });
            //     navigate("/index.html");
            //   }
          }}
        >
          I saved it
        </GenericBox>
      </CustomBox>
    </CustomBox>
  );
};
export default Step1;
// 0x0F928B051ff45234f657eD2595975ee606F0e667
// 0x6db6c29998bD4134e7D6B81f20139a33fEE8E037
