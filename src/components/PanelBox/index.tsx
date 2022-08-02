import { FC } from "react";

import { PanelBoxProps as PROPS } from "interfaces";
import { PanelBoxStyled, Text } from "@styled";

const PanelBox: FC<PROPS> = ({
  title,
  value,
  Icon,
  borderStyle,
  customColor,
  setStep,
}) => {
  return (
    <PanelBoxStyled style={borderStyle}>
      <Text
        size={13}
        weight={500}
        customStyle={{ marginBottom: "1px", opacity: "0.6" }}
        customColor={customColor}
      >
        {title}
      </Text>
      <div className="r-c-fs">
        <Text weight={400} customColor={customColor} size={17}>
          {value}
        </Text>
        <span
          onClick={() => {
            if (setStep) setStep(2);
          }}
        >
          {Icon}
        </span>
      </div>
    </PanelBoxStyled>
  );
};

export default PanelBox;
