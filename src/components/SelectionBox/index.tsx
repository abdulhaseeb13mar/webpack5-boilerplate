import { FC } from "react";

import { SelectionBoxProps as PROPS } from "interfaces";
import { BackgroundBoxStyled, Text } from "@styled";
import { OptionBox } from "components";

const SelectionBox: FC<PROPS> = ({
  OptionList,
  handleOption,
  optionIndex,
  Icon,
  gasOptionList,
  height,
  showDollar,
  customSelection,
}) => {
  return (
    <BackgroundBoxStyled height={height} marginTop={15}>
      {OptionList.map((item, index) => {
        return (
          <OptionBox
            key={index}
            active={index === optionIndex ? true : false}
            handleOption={handleOption}
            index={index}
            handleSelection={() => {
              if (item.isIcon) customSelection();
            }}
          >
            <>
              {item.isIcon && !gasOptionList ? (
                ""
              ) : (
                <Text
                  customColor={`${index === optionIndex ? "#fff" : "#7C7B81"}`}
                >
                  {item.title}
                </Text>
              )}
              {item.isIcon ? (
                <Text
                  customColor={`${index === optionIndex ? "#fff" : "#7C7B81"}`}
                >
                  {Icon}
                </Text>
              ) : (
                <Text>
                  {item.value}
                  {showDollar && "$"}
                </Text>
              )}
            </>
          </OptionBox>
        );
      })}
    </BackgroundBoxStyled>
  );
};

export default SelectionBox;
