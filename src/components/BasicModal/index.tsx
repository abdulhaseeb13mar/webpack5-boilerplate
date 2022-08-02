import { FC } from "react";
import { Zoom, Slide } from "@mui/material";

import { StyledModal, Backdrop } from "@styled";
import { BasicModal as Props } from "interfaces";

const BasicModal: FC<Props> = ({ children, open, handleClose, top, zoom }) => {
  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      components={{
        Backdrop: Backdrop,
      }}
      top={top}
    >
      {zoom ? (
        <Zoom in={open} {...(open ? { timeout: 500 } : {})}>
          {children}
        </Zoom>
      ) : (
        <Slide in={open} direction="up" {...(open ? { timeout: 500 } : {})}>
          {children}
        </Slide>
      )}
    </StyledModal>
  );
};

export default BasicModal;
