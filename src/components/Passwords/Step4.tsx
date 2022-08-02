import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Bip39 from "bip39";
import { useNavigate } from "react-router";
import { ethers } from "ethers";

import { ColoredBack } from "assets/images";
import { Text } from "@styled";
import { PasswordStepProps as PROPS, RootState } from "interfaces";
import Input from "./input";
import { RainbowBox } from "components";
import { addUserWallet } from "utils/addWallet";

const Step4: FC<PROPS> = ({ changeStep, currentStep }) => {
  /* global-state */
  const { password } = useSelector((state: RootState) => state.app);

  /* local-state */
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "No message",
    status: false,
  });

  /* hooks */
  const navigate = useNavigate();

  /* functions */
  const createWallet = async () => {
    const generatedMnemonic = Bip39.generateMnemonic();
    let hashedPassword = ethers.utils.hashMessage(password);
    await addUserWallet(generatedMnemonic, hashedPassword, false);
    navigate("/seedphrase");
  };

  const Login = async () => {
    try {
      setIsLoading(true);
      setIsClicked(true);
      createWallet();
    } catch (error) {
      console.log(error);
    }
  };

  /* effects */
  useEffect(() => {
    const initialTime = setTimeout(() => {
      setAlert({
        message: "No message",
        status: false,
      });
    }, 3000);
    return () => clearTimeout(initialTime);
  }, [alert.status]);

  return (
    <div className="c-c-c">
      <img
        src={ColoredBack}
        alt="coloredBack"
        className="colored-back-button"
        onClick={() => currentStep === 4 && changeStep(currentStep - 1)}
      />
      <Input
        inputStyle={{
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "2px solid #5bd67e",
          marginTop: 0,
        }}
        currentStep={currentStep}
        showCaret={false}
        stepNumber={4}
        password={password}
        setAlert={setAlert}
      >
        {[...password].map((char, index) => (
          <Text key={index} size={23} style={{ height: "90%" }}>
            *
          </Text>
        ))}
      </Input>
      <Text
        size={17}
        weight={400}
        customColor="#3DF2BC"
        style={{ marginTop: 10, opacity: alert.status ? 1 : 0 }}
      >
        {alert.message}
      </Text>
      <Text size={18} weight={500} style={{ marginTop: 30 }}>
        That’s a nice password...
      </Text>
      <Text
        size={14}
        weight={400}
        style={{ marginTop: 10 }}
        primary={false}
        dim
      >
        Please store it safely.
      </Text>
      <Text size={14} weight={400} style={{ marginTop: 5 }} primary={false} dim>
        You will need this to access the app.
      </Text>
      <Text
        className="step4-btn r-c-c"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          padding: "9px 16px",
          marginTop: 22,
          cursor: "pointer",

          pointerEvents: isClicked ? "none" : "all",
        }}
        size={14}
        customColor="rgba(255,255,255,0.7)"
        onClick={Login}
      >
        {isLoading ? "Creating..." : " Ok let’s go"}
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
    </div>
  );
};

export default Step4;
