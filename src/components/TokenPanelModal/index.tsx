import { FC } from "react";

import { ModalProps as PROPS } from "interfaces";
import { BasicModal, BottomLayoutComponent } from "components";
import { BottomLayoutStyled } from "@styled";

const TokenPanelModal: FC<PROPS> = ({
  open,
  handleClose,
  isSwap,
  setToken,
  tokensHistory,
  isShow,
  setFromToken,
}) => {
  return (
    <BasicModal open={open} handleClose={handleClose} top={140} zoom={false}>
      <BottomLayoutStyled key="bottomLayout">
        <BottomLayoutComponent
          setCurrentStep={() => {}}
          isSwap
          setToken={setToken}
          tokensHistory={tokensHistory}
          handleClose={handleClose}
          isShow={isShow}
        />
      </BottomLayoutStyled>
    </BasicModal>
  );
};

export default TokenPanelModal;
