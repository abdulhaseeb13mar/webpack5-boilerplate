import { FC, useState } from "react";
import { Button, Tooltip, ClickAwayListener } from "@mui/material";

import { MicroscopeIcon, CopyWhite } from "assets/Icons";
import { ImageContent } from "@styled";
import { NETWORKCHAIN, SCAN_LINK } from "utils/constants";
import { TxHistoryButtonsProps as PROPS } from "interfaces";

const Buttons: FC<PROPS> = ({ txHash, network }) => {
  /* global-state */

  /* local-state */
  const [open, setOpen] = useState(false);

  /* hooks */

  /* functions */
  const handleTooltipClose = () => setOpen(false);

  const handleTooltipOpen = () => {
    navigator.clipboard.writeText(txHash);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  const onlick_handler = (e: any) => {
    e.stopPropagation();
  };

  /* effects */

  return (
    <div
      style={{
        marginTop: "30px",
        display: "flex",
        border: "none",
      }}
      onClick={onlick_handler}
    >
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title="Copied"
          >
            <Button
              onClick={() => {
                handleTooltipOpen();
              }}
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
                  src={CopyWhite}
                  alt="CopyWhite"
                  Size={{
                    width: "16px",
                    height: "16px",
                  }}
                />
              }
            >
              Copy Hash
            </Button>
          </Tooltip>
        </div>
      </ClickAwayListener>

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
            src={MicroscopeIcon}
            alt="MicroscopeIcon"
            Size={{
              width: "16px",
              height: "16px",
            }}
          />
        }
        onClick={() => {
          window.open(
            `${
              NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][SCAN_LINK]
            }/${txHash}`,
            "_blank"
          );
        }}
      >
        See in Explorer
      </Button>
    </div>
  );
};

export default Buttons;
