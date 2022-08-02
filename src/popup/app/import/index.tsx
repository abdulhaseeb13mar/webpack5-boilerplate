/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@mui/material";
import * as Bip39 from "bip39";
import { useNavigate } from "react-router";

import { ImportProps as PROPS, RootState, USERINFO } from "interfaces";
import { Text, CustomBox, PasswordInputStyled } from "@styled";
import { Key } from "assets/Icons";
import { decryptMessage } from "utils";
import { ButtonBox } from "components";
import { SupportedChainId } from "utils/constants";
import { getStorageSyncValue } from "@constants";
import { addUserWallet } from "utils/addWallet";
import { useImportAccount } from "hooks/useImportAccount";

const Import: FC<PROPS> = ({ accountImport }) => {
  /* global-state */
  const { network } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [input, setInput] = useState("");
  const [isMemonicTrue, setIsMemonicTrue] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [alert, setAlert] = useState({
    status: false,
    message: "",
  });

  /* hooks */
  const navigate = useNavigate();
  const { importEvmAccount, importSolanaAccount } = useImportAccount();

  /* functions */
  const onRecover = () => {
    try {
      console.log("on here", input);
      const isValidMnemonic = Bip39.validateMnemonic(input);
      setButtonClicked(true);
      if (isValidMnemonic) {
        setIsMemonicTrue(true);
        setAlert({
          status: true,
          message: "Ready to import",
        });
      } else {
        setAlert({
          status: true,
          message: "This does not seem to be a valid",
        });
        setIsMemonicTrue(false);
      }

      // addWallet(password, mnemonicWallet, EVM);
    } catch (e) {
      console.log(e);
      setIsMemonicTrue(false);
    }
  };

  const RecoverAccount = useCallback(async (key: string) => {
    try {
      console.log("account has been imported", key);
      if (!key) {
        setAlert({ status: true, message: "Please enter a key" });
        alertChange();
      } else {
        if (
          network === SupportedChainId.NEAR_TESTNET ||
          network === SupportedChainId.NEAR
        ) {
          console.log("near");
        } else if (
          network === SupportedChainId.SOLANA_DEVNET ||
          network === SupportedChainId.SOLANA_MAINNET
        ) {
          console.log("solana");
          const result = await importSolanaAccount(key);
          console.log("result", result);
          setAlert(result);
        } else {
          console.log("evm");

          const result = (await importEvmAccount(key)) as {
            status: boolean;
            message: string;
          };
          setAlert(result);
        }
      }
    } catch (error) {
      console.log(error);
      setAlert({ status: true, message: "Please enter a valid key" });
      alertChange();
    }
  }, []);

  const alertChange = useCallback(() => {
    const alertTime = setTimeout(() => {
      setAlert({ status: false, message: "" });
    }, 3000);
    return () => clearTimeout(alertTime);
  }, [alert.status]);

  /* effects */

  return (
    <CustomBox padding="50px 30px" className="c-c-c">
      {/* <ImageContent
        onClick={() => {
          navigate("/settings");
        }}
        src={BackIcon}
        alt="<"
        Size={{
          width: "10px",
          height: "19px",
          position: "absolute",
          top: "13px",
          left: "12px",
          cursor: "pointer",
        }}
      /> */}
      <Text size={18}>
        {accountImport ? "Import Account" : "Import Wallet"}
      </Text>

      <Text size={13} customColor="#807989" style={{ marginTop: "30px" }}>
        {accountImport
          ? "Enter your private key"
          : "Insert your Seed Phrase to import"}
      </Text>

      <PasswordInputStyled
        style={{
          backgroundColor: accountImport
            ? alert.status
              ? alert.message !== "Account imported successfully"
                ? "#FF375E"
                : "#33D285"
              : ""
            : isMemonicTrue && buttonClicked
            ? "#33D285"
            : buttonClicked
            ? "#FF375E"
            : "rgba(0,0,0,0.2)",
        }}
      >
        <img
          style={{ marginLeft: "-10px" }}
          src={Key}
          alt="key"
          className="password-input-icon"
        />
        <Input
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.length === 0) {
              setButtonClicked(false);
              setAlert({ status: false, message: "" });
            }
          }}
          style={{ fontSize: "14px" }}
          disableUnderline
          placeholder={accountImport ? "Private Key" : "Secret Recovery Phrase"}
        ></Input>
      </PasswordInputStyled>

      <Text
        size={14}
        weight={400}
        customColor={
          accountImport
            ? alert.message === "Account imported successfully"
              ? "#33D285"
              : "#f76684"
            : isMemonicTrue
            ? "#33D285"
            : "#f76684"
        }
        style={{ margin: "30px 0px" }}
      >
        {alert.status ? alert.message : ""}
      </Text>

      <ButtonBox
        title={
          accountImport
            ? "Import"
            : isMemonicTrue && buttonClicked
            ? "Import"
            : !isMemonicTrue && buttonClicked
            ? "Try again"
            : "Find my wallet"
        }
        customColor="rgba(255, 255, 255, 0.04)"
        handleClick={async () => {
          if (accountImport) {
            RecoverAccount(input);
          } else {
            const isUserExists = (await getStorageSyncValue(
              "userInfo"
            )) as USERINFO;
            const hashedPassword = (await getStorageSyncValue(
              "hashedPassword"
            )) as string;

            const isMemonicExists = await Promise.all(
              Object.keys(isUserExists).filter((wallet) => {
                return (
                  decryptMessage(
                    isUserExists[wallet].seedphrase,
                    hashedPassword
                  ) === input
                );
              })
            );
            console.log({ isMemonicExists });
            if (isMemonicExists.length > 0) {
              setAlert({ status: true, message: "Wallet already exists" });
            } else if (isMemonicTrue) {
              (async () => {
                const hashedPassword = (await getStorageSyncValue(
                  "hashedPassword"
                )) as string;
                console.log("hashedPassword", hashedPassword);
                await addUserWallet(input, hashedPassword, true);
                navigate("/index.html");
              })();
            } else onRecover();
          }
        }}
        customStyle={{ width: "fitContent", padding: "10px 14px" }}
      />
    </CustomBox>
  );
};

export default Import;
