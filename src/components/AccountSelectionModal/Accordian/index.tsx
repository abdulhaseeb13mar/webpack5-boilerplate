import { useState, ChangeEvent } from "react";

import { CircleRounded } from "assets/Icons";
import { Bnb } from "assets/images";
import {
  AccordianWrapper,
  AccountSelectionAccordian,
  ImageContent,
  Text,
  AccountSelectionAccordionSummary,
  AccountSelectionAccordionDetails,
} from "@styled";
import AccordianRow from "./AccordianRow";

const Accordian = () => {
  /* global-state */

  /* local-state */
  const [selectedValue, setSelectedValue] = useState("Account1");

  /* hooks */

  /* functions */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
    checkedIcon: <CircleRounded />,
    icon: <CircleRounded />,
  });

  /* effects */

  /* constants */
  const accordianRows = [
    {
      value: "Account1",
    },
    {
      value: "Account2",
    },
  ];

  return (
    <AccordianWrapper>
      <AccountSelectionAccordian>
        <AccountSelectionAccordionSummary>
          <div className="r-c-sb" style={{ width: "100%" }}>
            <Text>Wallet 1</Text>
            <ImageContent
              src={Bnb}
              Size={{ width: "20px", height: "20px", borderRadius: "50%" }}
            />
          </div>
        </AccountSelectionAccordionSummary>
        <AccountSelectionAccordionDetails>
          {accordianRows.map((value, index) => {
            return (
              <AccordianRow
                value={value.value}
                controlProps={controlProps}
                key={index}
                showLine={index !== accordianRows.length - 1}
              />
            );
          })}
        </AccountSelectionAccordionDetails>
      </AccountSelectionAccordian>
    </AccordianWrapper>
  );
};

export default Accordian;
