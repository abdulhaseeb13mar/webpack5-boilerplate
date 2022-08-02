import { FC, useState } from "react";
import { motion } from "framer-motion";

import { RainbowButtonProps as PROPS } from "interfaces";
import { RainbowButtonStyled, Text, InternalRainbowBoxStyled } from "@styled";
import useLongPress from "hooks/useLongPress";

const RainbowHoldButton: FC<PROPS> = ({
  onHoldComplete = () => {},
  children,
  width,
}) => {
  /* global-state */

  /* local-state */
  const [isHoldFinish, setIsHoldFinish] = useState(false);
  const [slideAnimation, setSlideAnimation] = useState<undefined | string>(
    undefined
  );

  /* hooks */
  const longPress = useLongPress(
    () => setIsHoldFinish(true),
    1000,
    () => setSlideAnimation("expand"),
    () => setSlideAnimation("contract")
  );

  /* functions */

  /* effects */

  return (
    <RainbowButtonStyled {...longPress} width={width}>
      <InternalRainbowBoxStyled isHoldFinish={isHoldFinish} className="r-c-c">
        {!isHoldFinish && (
          <motion.div
            animate={slideAnimation}
            onAnimationComplete={() => {
              if (slideAnimation === "expand") {
                onHoldComplete();
              }
            }}
            variants={{ expand: { width: "100%" }, contract: { width: "0%" } }}
            initial={{ width: "0%" }}
            className="onHold-loading"
            transition={{ duration: 1, ease: "linear" }}
          />
        )}
        <Text
          size={17}
          weight={600}
          style={{
            width: "100%",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          {isHoldFinish ? (
            "confirmed"
          ) : (
            <>
              <span style={{ opacity: 0.7 }}>Hold to </span>confirm
            </>
          )}
        </Text>
      </InternalRainbowBoxStyled>
    </RainbowButtonStyled>
  );
};

export default RainbowHoldButton;
