import { FC, useState } from "react";
import { Button } from "@mui/material";

import { SpeedUpIcon, CancelIcon } from "assets/Icons/index";
import { ImageContent } from "@styled";
import { TxHistorySpeedupCancelBtnProps as PROPS } from "interfaces";

const SpeedupCancelBtn: FC<PROPS> = ({ speedUpFn, cancelFn }) => {
  /* global-state */

  /* local-state */
  const [isClicked, setIsClicked] = useState(false);

  /* hooks */

  /* functions */

  /* effects */

  return (
    <div
      style={{
        marginTop: "30px",
        display: "flex",
        border: "none",
      }}
    >
      <Button
        style={{
          color: "#fff",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          opacity: "0.8",
        }}
        variant="outlined"
        startIcon={
          <ImageContent
            src={SpeedUpIcon}
            alt="SpeedUpIcon"
            Size={{
              width: "20px",
              height: "20px",
            }}
          />
        }
        onClick={() => {
          if (!isClicked) {
            speedUpFn();
            setIsClicked(true);
          }
        }}
        disabled={isClicked}
      >
        Speed Up
      </Button>

      <Button
        style={{
          color: "#fff",
          borderRadius: "12px",
          marginLeft: "10px",
          border: "none",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          opacity: "0.8",
        }}
        variant="outlined"
        startIcon={
          <ImageContent
            src={CancelIcon}
            alt="CancelIcon"
            Size={{
              width: "20px",
              height: "20px",
            }}
          />
        }
        onClick={() => {
          if (!isClicked) {
            cancelFn();
            setIsClicked(true);
          }
        }}
        disabled={isClicked}
      >
        Cancel
      </Button>
    </div>
  );
};

export default SpeedupCancelBtn;
