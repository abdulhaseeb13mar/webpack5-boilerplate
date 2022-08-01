import { FC, useState, useEffect, useRef } from "react";

import { RainbowBoxProps } from "interfaces";
import { BackgroundShadow, RainbowBackground, RainbowBoxDiv } from "@styled";

const RainbowBox: FC<RainbowBoxProps> = ({
  borderwidth = "1.5px",
  borderradius = "100%",
  children,
  visible = true,
  fullwidth,
  renderShadow = true,
  shadow = true,
}) => {
  /* global-state */
  const myRef = useRef<HTMLInputElement>(null);

  /* local-state */
  const [width, setWidth] = useState(myRef.current?.clientWidth);
  const [height, setHeight] = useState(myRef.current?.clientHeight);

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    setWidth(myRef.current?.clientWidth);
    setHeight(myRef.current?.clientHeight);
  }, [renderShadow]);

  return (
    <>
      <BackgroundShadow
        borderwidth={borderwidth}
        borderradius={borderradius}
        visible={visible}
        height={height ? height : 0}
        width={width ? width : 0}
        shadow={shadow !== undefined ? shadow : true}
      />
      <RainbowBoxDiv
        borderWidth={borderwidth}
        borderRadius={borderradius}
        // fullWidth
        className={"rainbow-box"}
        ref={myRef}
      >
        <RainbowBackground visible={visible}>
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </RainbowBackground>
      </RainbowBoxDiv>
    </>
  );
};

export default RainbowBox;
