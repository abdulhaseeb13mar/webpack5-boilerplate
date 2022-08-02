/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";

import { Text } from "@styled";
import { PasswordStepProps as PROPS } from "interfaces";

const Step1: FC<PROPS> = ({ changeStep, currentStep }) => {
  /* global-state */

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    const time = setTimeout(() => changeStep(2), 2000);
    return () => clearTimeout(time);
  }, []);

  return (
    <Text size={18} weight={400}>
      I’ve never been on this system
    </Text>
  );
};

export default Step1;
