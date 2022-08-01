import { FC } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { useNavigate } from "react-router";

import { binanceRainbow, Hamburger, ThreeLines } from "assets/Icons";
import { AnimateButton } from "components";
import { DashboardHeaderProps as PROPS, RootState } from "interfaces";
import { DashboardContainerStyled, ImageContent } from "@styled";

const DashboardHeader: FC<PROPS> = ({ animation = "hidden", onExpand }) => {
  /* global-state */
  const { initiallyAnimated, address } = useSelector(
    (state: RootState) => state.app
  );
  const { network } = useSelector((state: RootState) => state.wallet);
  const { transactions } = useSelector(
    (state: RootState) => state.sendTransaction
  );

  /* local-state */

  /* hooks */
  const navigate = useNavigate();

  /* functions */

  /* effects */

  return (
    <DashboardContainerStyled
      layout
      variants={{ visible: { top: 0 } }}
      animate={animation}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.8 }}
      initiallyAnimated={initiallyAnimated}
    >
      <ImageContent
        onClick={() => navigate("/settings")}
        src={Hamburger}
        Size={{ width: "22px", height: "18px", cursor: "pointer" }}
      />

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          onClick={() => {
            onExpand();
          }}
          style={{ cursor: "pointer" }}
        >
          <AnimateButton
            text="Showing all wallets"
            icon={ThreeLines}
            buttonStyle={{
              zIndex: 2,
              padding: "5px 12px 5px 12px",
            }}
            imgStyle={{ width: 14, height: 21 }}
            textStyle={{ fontSize: 14 }}
            iconPosition="right"
            animateHover
          />
        </Box>
        {transactions[`${network}${address}`]?.length > 0 && (
          <ImageContent
            style={{ marginTop: "7px" }}
            src={binanceRainbow}
            Size={{ width: "38px", height: "38px" }}
          />
        )}
      </Box>
    </DashboardContainerStyled>
  );
};

export default DashboardHeader;
