/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { UpArrow } from "assets/Icons";
import { TopLayoutComponent } from "components";
import { BottomLayoutStyled, Text, TitleStyled } from "@styled";
import { RootState } from "interfaces";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const Send = () => {
  /* global-state */
  const { selectedToken } = useSelector(
    (state: RootState) => state.sendTransaction
  );
  const { tokenName } = selectedToken;
  const { tokensHistory } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [currentStep, setCurrentStep] = useState(1);

  /* hooks */
  const navigate = useNavigate();

  /* functions */
  const onTopImageClick = () => {
    if (currentStep === 1) {
      navigate("/index.html");
    }
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const Content = () => {
    if (currentStep === 1) {
      return (
        <Step1 setCurrentStep={setCurrentStep} tokensHistory={tokensHistory} />
      );
    } else if (currentStep === 2) {
      return (
        <Step2 setCurrentStep={setCurrentStep} tokensHistory={tokensHistory} />
      );
    }
    return (
      <Step1 setCurrentStep={setCurrentStep} tokensHistory={tokensHistory} />
    );
  };

  /* effects */
  useEffect(() => {
    if (tokenName.length > 0) {
      setCurrentStep(1);
    }
  }, []);

  return (
    <>
      {currentStep < 3 ? (
        <>
          <TopLayoutComponent
            text="Send Tokens"
            TopImage={`${UpArrow}`}
            onTopImageClick={onTopImageClick}
            isBackgroundImage={true}
          />

          <BottomLayoutStyled
            key="bottomLayout"
            layout
            initial={{ y: 130, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TitleStyled>
              <Text
                size={14}
                weight={400}
                dim={true}
                style={{ marginBottom: "5px" }}
              >
                {currentStep === 1
                  ? "What Currency do you want to deposit?"
                  : "Who is the recipient"}
              </Text>
              <Text size={20} weight={500}>
                {currentStep === 1 ? " Select token" : "Select address"}
              </Text>
            </TitleStyled>

            <Content />
          </BottomLayoutStyled>
        </>
      ) : (
        currentStep === 3 && <Step3 setStep={setCurrentStep} />
      )}
    </>
  );
};

export default memo(Send);
