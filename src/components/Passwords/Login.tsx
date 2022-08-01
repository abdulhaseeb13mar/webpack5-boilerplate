/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { useNavigate } from "react-router";

import { Text } from "@styled";
import Input from "./input";
import { decryptMessage, keyDownListener } from "utils";
import { Key } from "assets/Icons";
import { getStorageSyncValue, setStorageSyncValue } from "@constants";
import { PasswordStepProps as PROPS, RootState, USERINFO } from "interfaces";
import { RainbowBox } from "components";
import {
  ACCOUNTS,
  CHAINS,
  EVM,
  LOGIN_EXPIRY,
  SECRET,
  STATIC_WALLET_NUMBER,
} from "utils/constants";
import { setUserLoggedIn } from "@slices/appSlice";

const Login: FC<PROPS> = ({ changeStep, currentStep }) => {
  /* global-state */
  const { isUserSavedMnemonic } = useSelector((state: RootState) => state.app);
  // const { accountNumber } = useSelector((state: RootState) => state.app);

  /* local-state */
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wrongPassword, setwrongPassword] = useState(false);
  const [alert, setAlert] = useState({
    message: "No message",
    status: false,
  });

  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* functions */
  const onEnterPress = () => {
    document.removeEventListener("keydown", onKeyDown);
    if (!isLoading) {
      Login();
    }
  };

  const onBackSpacePress = () => setPassword((prev) => prev.slice(0, -1));

  const onValidKeyPress = (key: string) => {
    setwrongPassword(false);
    setPassword((prev) => prev + key);
    const passwordDIV = document.querySelector(".editable-div");
    passwordDIV?.scrollTo(passwordDIV.scrollWidth, 0);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    keyDownListener(
      e,
      currentStep,
      1,
      onEnterPress,
      onBackSpacePress,
      onValidKeyPress
    );
  };

  const Login = async () => {
    try {
      console.log("password", password);
      if (password.length > 0) {
        setIsLoading(true);
        const isUserExists = (await getStorageSyncValue(
          "userInfo"
        )) as USERINFO;
        console.log("isUserExists", isUserExists);
        let hashedPassword = ethers.utils.hashMessage(password);
        const publicAddress = Object.keys(
          isUserExists[`wallet${STATIC_WALLET_NUMBER}`][CHAINS][EVM][ACCOUNTS]
        )[0];
        const data =
          isUserExists[`wallet${STATIC_WALLET_NUMBER}`][CHAINS][EVM][ACCOUNTS][
            publicAddress
          ][SECRET];
        console.log("data", data);
        const decryptResult = await decryptMessage(data, hashedPassword);
        console.log("decryptResult", decryptResult);
        if (decryptResult !== undefined) {
          await setStorageSyncValue(
            "expiry",
            new Date().getTime() + LOGIN_EXPIRY
          );

          // dispatch(
          //   setUserAddress(
          //     Object.keys(
          //       isUserExists[`wallet${STATIC_WALLET_NUMBER}`][CHAINS][EVM][
          //         ACCOUNTS
          //       ]
          //     )[accountNumber]
          //   )
          // );
          dispatch(setUserLoggedIn(true));
        } else
          setAlert({
            message: "Password is incorrect",
            status: true,
          });
        setwrongPassword(false);
        setIsLoading(false);
      } else
        setAlert({
          message: "Please enter your password",
          status: true,
        });
      setwrongPassword(true);
    } catch (error) {
      console.log("user is not autheticated", error);
      setAlert({
        message: "Password is incorrect",
        status: true,
      });
      setwrongPassword(false);
      setIsLoading(false);
    }
  };

  /* effects */
  useEffect(() => {
    const alertTime = setTimeout(() => {
      setAlert({
        message: "no message",
        status: false,
      });
    }, 2000);
    return () => {
      clearTimeout(alertTime);
    };
  }, [alert]);

  useEffect(() => {
    const checkUser = async () => {
      const userInfo = (await getStorageSyncValue("userInfo")) as USERINFO;
      const accountCount = Object.keys(userInfo).length;
      if (accountCount !== 0 && !isUserSavedMnemonic) {
        navigate("/seedphrase");
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentStep, password, wrongPassword, isLoading]);

  return (
    <div className="c-c-c" style={{ pointerEvents: "all" }}>
      <Text size={18} weight={400}>
        Enter password to login
      </Text>
      <Input
        currentStep={1}
        stepNumber={1}
        icon={Key}
        showCaret={password.length !== 0}
      >
        <>
          {password.length === 0 && (
            <>
              <div
                className="input-caret"
                style={{
                  display: currentStep === 1 ? "unset" : "none",
                }}
              />
              <Text style={{ color: "grey" }}>Enter your password</Text>
            </>
          )}
          {[...password].map((char, index) => (
            <Text
              key={index}
              size={23}
              style={{ height: "90%", outline: "none" }}
            >
              *
            </Text>
          ))}
        </>
      </Input>
      <Text
        size={14}
        weight={400}
        customColor="#F76684"
        style={{ marginTop: 10, opacity: alert.status ? 1 : 0 }}
        onClick={() => console.log("on Click")}
      >
        {alert.message}
      </Text>
      <Text
        className="r-c-c"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          padding: "9px 16px",
          marginTop: 22,
          cursor: "pointer",
          pointerEvents: isLoading ? "none" : "all",
          zIndex: 100,
        }}
        size={14}
        customColor="rgba(255,255,255,0.7)"
        onClick={Login}
      >
        Ok let’s go
        <div style={{ marginLeft: "5px" }}>
          {isLoading ? (
            <RainbowBox>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                }}
              ></div>
            </RainbowBox>
          ) : (
            ""
          )}
        </div>
      </Text>
      <Text
        size={16}
        weight={400}
        style={{ marginTop: 15, textDecoration: "underline" }}
        primary={false}
      >
        Forgot Password
      </Text>
    </div>
  );
};
export default Login;
// 0x59Cea9C7245276c06062d2fe3F79EE21fC70b53c
