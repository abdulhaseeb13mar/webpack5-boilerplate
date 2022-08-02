import { FC } from "react";

import Animator from "./animator";
import { AnimationGroupContent } from "interfaces";
import { PasswordBackdrop } from "assets/images";
import { PasswordBackdropStyled } from "@styled";

const AnimationGroup: FC<AnimationGroupContent> = ({
  content,
  currentStep,
  height = 350,
}) => {
  return (
    <div
      className="AnimationGroup-container"
      style={{
        height: height,
      }}
    >
      <PasswordBackdropStyled
        currentStep={currentStep}
        layout
        style={{
          backgroundImage: `url(${PasswordBackdrop})`,
        }}
      />
      {content.map((singleContent, index) => (
        <Animator key={index} order={index + 1} currentStep={currentStep}>
          {singleContent.content}
        </Animator>
      ))}
    </div>
  );
};

export default AnimationGroup;
