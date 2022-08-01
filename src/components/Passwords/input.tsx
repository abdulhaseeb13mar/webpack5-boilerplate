import { FC } from "react";

import { Input as PROPS } from "interfaces";
import { PasswordInputStyled } from "@styled";
import { CopyWhite } from "assets/Icons";

const Input: FC<PROPS> = ({
  children,
  currentStep,
  stepNumber,
  icon,
  inputStyle,
  showCaret,
  password,
  setAlert,
}) => {
  return (
    <PasswordInputStyled style={{ ...inputStyle }}>
      {stepNumber !== 4 && (
        <img src={icon} alt="key" className="password-input-icon" />
      )}
      <div
        className="r-c-fs editable-div"
        tabIndex={0}
        style={{ outline: "none" }}
      >
        {children}
        {/* {password && password.length < 0 && (
          <Text style={{ color: "grey" }}>Enter your password</Text>
        )} */}
        {showCaret && (
          <div
            className="input-caret"
            style={{ display: currentStep === stepNumber ? "unset" : "none" }}
          />
        )}
      </div>
      {stepNumber === 4 && (
        <img
          src={CopyWhite}
          alt="key"
          style={{ marginLeft: 10, cursor: "pointer" }}
          onClick={() => {
            if (password && setAlert) {
              navigator.clipboard.writeText(password);
              setAlert({
                message: "Password copied to clipboard",
                status: true,
              });
            }
          }}
        />
      )}
    </PasswordInputStyled>
  );
};

export default Input;
