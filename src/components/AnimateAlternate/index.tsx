/* eslint-disable react-hooks/exhaustive-deps */
import { useState, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { AnimateAlternate as Props } from "interfaces";
import useInterval from "hooks/useInterval";

const AnimateAlternate: FC<Props> = ({
  firstText,
  secondText,
  interval = 3000,
  style,
  transition = { duration: 0.15 },
}) => {
  /* global-state */

  /* local-state */
  const [currentText, setCurrentText] = useState<string>(firstText);

  /* hooks */

  /* functions */

  /* effects */
  useInterval(() => {
    setCurrentText((prev) => (prev === firstText ? secondText : firstText));
  }, interval);

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={currentText}
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ ...transition }}
        style={{ ...style }}
      >
        {currentText}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimateAlternate;
