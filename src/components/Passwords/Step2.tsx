/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, FC } from "react";
import { useDispatch } from "react-redux";

import { Text } from "@styled";
import Input from "./input";
import { keyDownListener } from "utils";
import { Key } from "assets/Icons";
import { PasswordStepProps as PROPS } from "interfaces";
import { setPassword as SETPASSWORD } from "@slices/appSlice";

const Step2: FC<PROPS> = ({ changeStep, currentStep }) => {
  /* global-state */

  /* local-state */
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    message: "No message",
    status: false,
  });

  /* hooks */
  const dispatch = useDispatch();

  /* functions */
  const onEnterPress = async () => {
    if (password.length >= 8) {
      dispatch(SETPASSWORD(password));
      changeStep(3);
    } else {
      setAlert({
        message: "Password must be at least 8 characters long",
        status: true,
      });
    }
  };

  const onBackSpacePress = () => setPassword((prev) => prev.slice(0, -1));

  const onValidKeyPress = (key: string) => {
    setPassword((prev) => prev + key);

    const passwordDIV = document.querySelector(".editable-div");
    passwordDIV?.scrollTo(passwordDIV.scrollWidth, 0);
  };

  /* effects */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keyDownListener(
        e,
        currentStep,
        2,
        onEnterPress,
        onBackSpacePress,
        onValidKeyPress
      );
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentStep, password]);

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

  return (
    <div className="c-c-c">
      <Text size={18} weight={400}>
        Let's create a password to
      </Text>
      <Text size={18} weight={400}>
        keep things safe...
      </Text>
      <Input
        currentStep={currentStep}
        stepNumber={2}
        icon={Key}
        showCaret={password.length !== 0}
      >
        <>
          {password.length === 0 && (
            <>
              <div
                className="input-caret"
                style={{
                  display: currentStep === 2 ? "unset" : "none",
                }}
              />
              <Text style={{ color: "grey" }}>Enter your password</Text>
            </>
          )}
          {[...password].map((char, index) => (
            <Text key={index} size={23} style={{ height: "90%" }}>
              *
            </Text>
          ))}
        </>
      </Input>
      <Text
        size={14}
        weight={400}
        customColor="#f76684"
        style={{ marginTop: 10, opacity: alert.status ? 1 : 0 }}
      >
        {alert.message}
      </Text>
    </div>
  );
};

export default Step2;
