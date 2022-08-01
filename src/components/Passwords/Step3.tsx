/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { ColoredBack } from "assets/images";
import { Text } from "@styled";
import { Key, RoundCheckBlack } from "assets/Icons";
import { RootState, PasswordStepProps as PROPS } from "interfaces";
import { keyDownListener } from "utils";
import Input from "./input";

const Step3: FC<PROPS> = ({ changeStep, currentStep }) => {
  /* global-state */
  const { password } = useSelector((state: RootState) => state.app);

  /* local-state */
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSomethingWrong, setIsSomethingWrong] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  /* hooks */

  /* functions */
  const onEnterPress = async () => changeStep(4);

  const onBackSpacePress = () =>
    setConfirmPassword((prev) => prev.slice(0, -1));

  const onValidKeyPress = (key: string) => {
    setConfirmPassword((prev) => prev + key);
    const passwordDIV = document.querySelector(".editable-div");
    passwordDIV?.scrollTo(passwordDIV.scrollWidth, 0);
  };

  /* effects */
  useEffect(() => {
    if (confirmPassword.length > 0) {
      let flag = false;
      for (let i = 0; i < confirmPassword.length; i++) {
        if (confirmPassword[i] !== password[i]) {
          flag = true;
          break;
        }
      }
      if (confirmPassword === password) {
        setAllCorrect(true);
        setIsSomethingWrong(false);
      } else {
        setAllCorrect(false);
        setIsSomethingWrong(flag);
      }
    }
  }, [confirmPassword, password]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Enter" || e.key === "NumpadEnter") &&
        currentStep === 3 &&
        password !== confirmPassword
      ) {
        setIsSomethingWrong(true);
      }

      keyDownListener(
        e,
        currentStep,
        3,
        onEnterPress,
        onBackSpacePress,
        onValidKeyPress,
        password,
        confirmPassword
      );
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentStep, confirmPassword, password]);

  return (
    <div className="c-c-c">
      <img
        src={ColoredBack}
        alt="coloredBack"
        className="colored-back-button"
        onClick={() => {
          if (currentStep === 3) {
            changeStep(currentStep - 1);
            setIsSomethingWrong(false);
            setConfirmPassword("");
            setAllCorrect(false);
          }
        }}
      />

      <Text size={18} weight={400}>
        Nice. Please type it again.
      </Text>
      <Input
        currentStep={currentStep}
        inputStyle={{
          backgroundColor: allCorrect ? "#5bd67e" : "rgba(0,0,0,0.2)",
        }}
        stepNumber={3}
        icon={allCorrect ? RoundCheckBlack : Key}
        showCaret={confirmPassword.length !== 0}
      >
        <>
          {confirmPassword.length === 0 && (
            <>
              <div
                className="input-caret"
                style={{
                  display: currentStep === 3 ? "unset" : "none",
                }}
              />
              <Text style={{ color: "grey" }}>Confirm your password</Text>
            </>
          )}
          {[...confirmPassword].map((char, index) => (
            <Text
              key={index}
              size={23}
              style={{ height: "90%" }}
              customColor={
                allCorrect
                  ? "black"
                  : char === password[index]
                  ? "#5bd67e"
                  : "#f76684"
              }
            >
              *
            </Text>
          ))}
        </>
      </Input>
      <Text
        size={14}
        weight={400}
        customColor="#f76684"
        style={{ marginTop: 10, opacity: isSomethingWrong ? 1 : 0 }}
      >
        Something looks wrong
      </Text>
    </div>
  );
};

export default Step3;
