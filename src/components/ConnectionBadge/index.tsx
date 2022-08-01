import { FC } from "react";
import { useSelector } from "react-redux";

import { RainbowBox } from "components";
import { ThreeDots, Bnb } from "assets/images";
import { ConnectionBadgeProps as PROPS, RootState } from "interfaces";
import { ConnectionBoxStyled } from "@styled";

const ConnectionBadge: FC<PROPS> = ({
  animation,
  pending,
  loading,
  connected,
}) => {
  /* global-state */
  const { initiallyAnimated } = useSelector((state: RootState) => state.app);

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  return (
    <ConnectionBoxStyled
      layout
      variants={{
        visible: { right: "-50px" },
      }}
      animate={animation}
      transition={{
        duration: 0.8,
        ease: "easeIn",
        delay: 0.3,
      }}
      initiallyAnimated={initiallyAnimated}
    >
      <RainbowBox>
        <div
          className="r-c-c connection-badge-circle"
          style={{
            backgroundImage: connected ? `url(${Bnb})` : "none",
          }}
        >
          {(pending || loading) && (
            <div
              className="connection-badge-loading"
              style={{
                backgroundImage: `url(${ThreeDots})`,
              }}
            />
          )}
        </div>
      </RainbowBox>
    </ConnectionBoxStyled>
  );
};

export default ConnectionBadge;
