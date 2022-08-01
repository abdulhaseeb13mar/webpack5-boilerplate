import { FC } from "react";
import { Radio } from "@mui/material";

import { AccountSelectionAccordianRowProps as PROPS } from "interfaces";
import { Text } from "@styled";

const AccordianRow: FC<PROPS> = ({ value, controlProps, showLine }) => {
  return (
    <div className="r-c-fs">
      <Radio {...controlProps(value)} color="success" />
      <div
        className="r-c-sb"
        style={{
          width: "100%",
          borderBottom: showLine
            ? "2px solid rgba(255, 255, 255, 0.05)"
            : "none",
          padding: "15px 15px 15px 0px",
        }}
      >
        <Text size={16} customStyle={{ opacity: "0.7" }}>
          {value}
        </Text>
        <Text size={15} customStyle={{ opacity: "0.5" }}>
          ~432$
        </Text>
      </div>
    </div>
  );
};

export default AccordianRow;
