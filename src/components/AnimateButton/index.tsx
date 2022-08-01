import { useState, FC } from "react";
import { motion } from "framer-motion";

import { GenericBox } from "@styled";
import { AnimateButton as Props } from "interfaces";

const AnimateButton: FC<Props> = ({
  text,
  icon,
  buttonStyle,
  imgStyle,
  textStyle,
  onClose = () => {},
  onExpand = () => {},
  animateHover = false,
  iconPosition = "left",
}) => {
  /* global-state */

  /* local-state */
  const [expandType, setExpandType] = useState("close");

  /* hooks */

  /* functions */
  const handleClick = () => {
    if (expandType === "close") {
      onExpand();
    } else {
      onClose();
    }
  };

  /* effects */

  return (
    <div>
      <GenericBox
        onHoverStart={() => animateHover && setExpandType("expand")}
        onHoverEnd={() =>
          setTimeout(() => animateHover && setExpandType("close"), 2000)
        }
        onClick={handleClick}
        style={{
          padding: `2px ${expandType === "close" ? "3" : "7"}px 2px 3px`,
          flexDirection: iconPosition === "left" ? "row" : "row-reverse",
          zIndex: -1,
          ...buttonStyle,
        }}
      >
        <img
          src={icon}
          alt="icon"
          className="animatebtn-icon"
          style={{
            ...imgStyle,
          }}
        />
        <motion.div
          className="animatebtn-text"
          initial={expandType}
          variants={{
            close: { width: 0, marginLeft: 0, marginRight: 0 },
            expand: {
              width: "fit-content",
              marginRight: iconPosition === "left" ? 0 : 4,
              marginLeft: iconPosition === "left" ? 4 : 0,
            },
          }}
          animate={expandType}
          transition={{ type: "tween", duration: 0.25 }}
          style={{ ...textStyle }}
        >
          {text}
        </motion.div>
      </GenericBox>
    </div>
  );
};

export default AnimateButton;
