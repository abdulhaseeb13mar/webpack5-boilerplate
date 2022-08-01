import { FC } from "react";

import { OptionBoxProps as PROPS } from "interfaces";
import { OptionBoxStyled } from "@styled";

const OptionBox: FC<PROPS> = ({
  children,
  active,
  handleOption,
  index,
  handleSelection,
}) => {
  return (
    <OptionBoxStyled
      layout
      active={active}
      onClick={() => {
        if (index !== undefined) handleOption(index);
        if (handleSelection) handleSelection();
      }}
    >
      {children}
    </OptionBoxStyled>
  );
};

export default OptionBox;
