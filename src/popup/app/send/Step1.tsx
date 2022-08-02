import { FC, memo } from "react";
import { motion } from "framer-motion";

import { BottomLayoutComponent } from "components";
import { StepsProps as PROPS } from "interfaces";

const Step1: FC<PROPS> = ({ setCurrentStep, tokensHistory }) => {
  return (
    <motion.div>
      <BottomLayoutComponent
        setCurrentStep={setCurrentStep}
        isSwap={false}
        tokensHistory={tokensHistory}
        isShow={true}
      />
    </motion.div>
  );
};

export default memo(Step1);
