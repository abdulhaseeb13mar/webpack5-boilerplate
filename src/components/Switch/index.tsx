import { FC } from "react";

import { RemoveCircle, CheckCircle } from "@mui/icons-material";
import { SwitchStyled } from "@styled";
import { Switch as Props } from "interfaces";

const Switch: FC<Props> = ({ checked, handleSwitchChange }) => {
  return (
    <SwitchStyled
      edge="start"
      checked={checked}
      onChange={handleSwitchChange}
      checkedIcon={<CheckCircle style={{ color: "#00D67D" }} />}
      icon={<RemoveCircle style={{ color: "rgba(255,255,255,0.2)" }} />}
    />
  );
};

export default Switch;
