import { FC } from "react";

import { StartAdornmentProps as PROPS } from "interfaces";
import { ImageContent, StartAdornmentStyled } from "@styled";

const StartAdornment: FC<PROPS> = ({ Icon }) => {
  return (
    <StartAdornmentStyled>
      <ImageContent src={Icon} Size={{ width: "22px", height: "22px" }} />
    </StartAdornmentStyled>
  );
};

export default StartAdornment;
