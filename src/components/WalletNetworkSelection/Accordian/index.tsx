import { FC } from "react";

import {
  AccordionDetailsStyled,
  AccordionStyled,
  AccordionSummaryStyled,
  Text,
} from "@styled";
import { WalletNetworkAccordian as Props } from "interfaces";
import { Switch } from "components";
import { CaretDown } from "assets/Icons";

const WalletNetworkAccordian: FC<Props> = ({
  children,
  summary,
  switchChecked,
  handleSwitchChange,
  expanded,
}) => {
  return (
    <AccordionStyled expanded={expanded}>
      <AccordionSummaryStyled
        expandIcon={
          <Switch
            checked={switchChecked}
            handleSwitchChange={handleSwitchChange}
          />
        }
      >
        <div className="r-c-c">
          <img
            src={CaretDown}
            alt="CaretDown"
            className="caret-down-accordian"
          />
          <Text primary={false} style={{ marginLeft: 6 }} size={13}>
            Filter by
          </Text>
          <Text style={{ marginLeft: 5 }} size={16} weight={600}>
            {summary}
          </Text>
        </div>
      </AccordionSummaryStyled>
      <AccordionDetailsStyled>{children}</AccordionDetailsStyled>
    </AccordionStyled>
  );
};

export default WalletNetworkAccordian;
