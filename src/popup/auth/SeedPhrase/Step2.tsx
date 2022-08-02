/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { BackIcon } from "assets/Icons";
import { Text, GenericBox, CustomBox, ImageContent } from "@styled";
import { getStorageSyncValue } from "@constants";
import { RootState, USERINFO } from "interfaces";
import { arraysAreIdentical, decryptMessage, shuffle } from "utils";
import { SEEDPHRASE } from "utils/constants";
import { ConvertMnemonicToArray } from "utils/SeedPhrase";
import {
  isMnemonicSaved,
  setNewWallet,
  setUserLoggedIn,
} from "@slices/appSlice";

const Step1 = () => {
  /* global-state */
  const { isLoggedIn, walletNumber, isNewWallet } = useSelector(
    (state: RootState) => state.app
  );

  /* local-state */
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [seedPhraseIndex, setSeedPhraseIndex] = useState<number[]>([]);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [shuffledMnemonic, setShuffledMnemonic] = useState<string[]>([]);
  const [isSeedPhraseCorrect, setIsSeedPhraseCorrect] = useState(false);

  /* hooks */
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* functions */
  const ConfirmSeedPhrase = (value: string, index: number) => {
    const itemCountInSeedPhrase = mnemonic.filter(
      (item: string) => item === value
    ).length;
    const userItemCountInSeedPhrase = seedPhrase.filter(
      (item: string) => item === value
    ).length;
    console.log(userItemCountInSeedPhrase, itemCountInSeedPhrase);

    if (userItemCountInSeedPhrase < itemCountInSeedPhrase) {
      setSeedPhrase([...seedPhrase, value]);
      setSeedPhraseIndex([...seedPhraseIndex, index]);
    }
  };

  const handleSeedPhrase = () => {
    if (isSeedPhraseCorrect && seedPhrase.length === 12) {
      dispatch(setUserLoggedIn(true));
      dispatch(isMnemonicSaved(true));

      if (isLoggedIn && !isNewWallet) {
        navigate("/near");
      } else {
        dispatch(setNewWallet(false));
        navigate("/index.html");
      }
    } else {
      setSeedPhrase([]);
      setSeedPhraseIndex([]);
    }
  };

  /* effects */
  useEffect(() => {
    (async () => {
      const data = (await getStorageSyncValue("userInfo")) as USERINFO;
      const hashedPassword = (await getStorageSyncValue(
        "hashedPassword"
      )) as string;
      const decryptedMnemonic = decryptMessage(
        data[`wallet${walletNumber}`][SEEDPHRASE],
        hashedPassword
      );
      setMnemonic(ConvertMnemonicToArray(decryptedMnemonic));
    })();
  }, []);

  useEffect(() => {
    let arr = [...mnemonic];
    const shuffledArray = shuffle(arr);
    setShuffledMnemonic(shuffledArray);
  }, [mnemonic]);

  useEffect(() => {
    if (seedPhrase.length >= 1) {
      if (arraysAreIdentical(seedPhrase, mnemonic)) {
        setIsSeedPhraseCorrect(true);

        console.log("seed phrase is correct");
      } else {
        setIsSeedPhraseCorrect(false);
        console.log("seed phrase is incorrect");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedPhrase, mnemonic]);

  return (
    <CustomBox
      backgroundColor={"#1d0531"}
      height={"100%"}
      style={{
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
      }}
    >
      <Text size={20} style={{ paddingTop: "70px" }}>
        Confirm SeedPhrase
      </Text>

      <CustomBox
        margin={"20px 25px"}
        height={"125px"}
        padding={"10px"}
        backgroundColor={"rgba(0, 0, 0, 0.2)"}
        style={{
          display: "grid",
          position: "relative",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(3, 30px)",
        }}
      >
        {seedPhrase.map((value, index) => {
          return (
            <Text
              key={index}
              customStyle={{ margin: "3px" }}
              customColor={
                index === seedPhrase.length - 1
                  ? isSeedPhraseCorrect
                    ? "#3DF2BC"
                    : "red"
                  : "#fff"
              }
            >
              {value}
            </Text>
          );
        })}
        <Text customStyle={{ margin: "3px 0px 0px -30px" }}>...</Text>
        {seedPhrase.length > 0 && (
          <CustomBox
            onClick={() => {
              setSeedPhrase((value) =>
                value.filter((_, index) => index !== seedPhrase.length - 1)
              );
              setSeedPhraseIndex((value) =>
                value.filter((_, index) => index !== seedPhraseIndex.length - 1)
              );
            }}
            style={{
              position: "absolute",
              right: "8px",
              bottom: "5px",
              cursor: "pointer",
            }}
          >
            <ImageContent
              src={BackIcon}
              alt="<"
              Size={{ width: "16px", height: "16px", color: "#fff" }}
            />
          </CustomBox>
        )}
      </CustomBox>

      <Text size={13} customColor="#807989" style={{ marginTop: "30px" }}>
        Tap the words below in the correct order
      </Text>

      <CustomBox
        className="r-c-c"
        margin={"40px 0 0 0"}
        width={"100%"}
        style={{ flexWrap: "wrap" }}
      >
        {shuffledMnemonic.map((value: string, index: number) => {
          return (
            <GenericBox
              key={index}
              style={{
                backgroundColor: seedPhraseIndex.includes(index)
                  ? "#E7E8EA"
                  : "rgba(0, 0, 0, 0.2)",
                color: seedPhraseIndex.includes(index) ? "black" : "white",
                margin: "3px 8px",
                padding: "9px 12px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (!seedPhraseIndex.includes(index)) {
                  ConfirmSeedPhrase(value, index);
                }
              }}
            >
              {value}
            </GenericBox>
          );
        })}
      </CustomBox>
      {seedPhrase.length > 0 && (
        <CustomBox className="r-c-c" margin="50px 0px 0px 0px">
          <GenericBox style={{ cursor: "pointer" }} onClick={handleSeedPhrase}>
            {isSeedPhraseCorrect && seedPhrase.length === 12
              ? "Ok let's go"
              : "Reset Selection"}
          </GenericBox>
          {/* Text to be change after completion of Seedphrase */}
        </CustomBox>
      )}
    </CustomBox>
  );
};

export default Step1;
