import { FC } from "react";

import { WalletNetworkSelection as Props } from "interfaces";
import { CloseRoundBtn } from "assets/Icons";
import { NetworkSelectionStyled } from "@styled";
import WalletAccordian from "./WalletAccordian";
import { BasicModal } from "components";

const WalletNetworkSelection: FC<Props> = ({ open, handleClose }) => {
  return (
    <BasicModal open={open} handleClose={handleClose} zoom={true}>
      <NetworkSelectionStyled>
        <div className="network-selector-close-btn">
          <img
            src={CloseRoundBtn}
            alt="CloseRoundBtn"
            onClick={handleClose}
            className="network-selector-close-svg"
          />
        </div>
        <div
          style={{
            marginTop: 5,
            overflowY: "scroll",
            height: "500px",
          }}
        >
          <WalletAccordian handleClose={handleClose} />
        </div>
      </NetworkSelectionStyled>
    </BasicModal>
  );
};

export default WalletNetworkSelection;
