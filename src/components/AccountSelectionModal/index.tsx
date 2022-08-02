import { FC } from "react";

import { ModalProps as PROPS } from "interfaces";
import { BasicModal } from "components";
import { AccountSelectionModalStyled, Text } from "@styled";
import Accordian from "./Accordian";

const AccountSelectionModal: FC<PROPS> = ({ open, handleClose }) => {
  return (
    <BasicModal open={open} handleClose={handleClose} top={290} zoom={false}>
      <AccountSelectionModalStyled>
        <Text size={19} weight={400} customStyle={{ marginTop: "20px" }}>
          Select Account
        </Text>
        <Accordian />
        <Accordian />
      </AccountSelectionModalStyled>
    </BasicModal>
  );
};

export default AccountSelectionModal;
