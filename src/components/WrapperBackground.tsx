import { ReactNode } from "react";
import { useSelector } from "react-redux";

import { BgLayoutGradients } from "assets/images";
import { RootState } from "interfaces";
import { HEIGHT } from "theme/constants";
import { WrapperBackgroundStyled } from "@styled";

const WrapperBackground = ({
  children,
  style,
  boxHeight,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  boxHeight?: number;
}) => {
  /* global-state */
  const { isLoggedIn } = useSelector((state: RootState) => state.app);

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  return (
    <WrapperBackgroundStyled
      style={{
        height: boxHeight || HEIGHT,
        backgroundImage: isLoggedIn ? `url(${BgLayoutGradients})` : "unset",
        // backgroundColor: isLoggedIn ? "#181621" : "rgb(26, 20, 41)",
        // overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </WrapperBackgroundStyled>
  );
};

export default WrapperBackground;
