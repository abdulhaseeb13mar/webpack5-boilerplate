import { FC } from "react";

import AnimationGroup from ".";
import { SonarWalletLogo } from "assets/images";
import { PasswordBackStyled } from "@styled";
import { WrapperBackground, Background } from "components";
import { PasswordMainProps as PROPS } from "interfaces";

const Main: FC<PROPS> = ({ ContentArray, currentStep }) => {
  return (
    <WrapperBackground>
      <Background />
      <div className="r-c-c landing-sonar-logo">
        <img
          className="sonar-img"
          src={SonarWalletLogo}
          alt="SonarWalletLogo"
        />
      </div>
      <div className="password-steps-wrapper">
        <AnimationGroup content={ContentArray} currentStep={currentStep} />
        <div className="chartline" />
        <PasswordBackStyled />
      </div>
    </WrapperBackground>
  );
};

export default Main;
