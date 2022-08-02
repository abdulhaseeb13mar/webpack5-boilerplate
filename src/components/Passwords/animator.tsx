/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, FC } from "react";

import { AnimatePasswordStep as Props } from "interfaces";
import { AnimatorStyled } from "@styled";

const Animator: FC<Props> = ({ order, currentStep, children }) => {
  /* global-state */

  /* local-state */
  const [animateType, setAnimateType] = useState("");

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    if (order === currentStep) {
      setAnimateType("appear");
    } else if (currentStep === order + 1) {
      setAnimateType("fade");
    } else if (currentStep === order + 2) {
      setAnimateType("disappear");
    } else {
      setAnimateType("nothing");
    }
  }, [currentStep]);

  return (
    <AnimatorStyled
      layout
      variants={{
        nothing: { bottom: -230, opacity: 0 },
        appear: { bottom: 30, opacity: 1 },
        fade: { bottom: 160, opacity: 0.1, filter: "blur(5px)", scale: 0.85 },
        disappear: { bottom: 260, opacity: 0, scale: 0.6 },
      }}
      animate={animateType}
      transition={{ ease: "easeInOut", duration: 0.8 }}
    >
      {children}
    </AnimatorStyled>
  );
};

export default Animator;
