import {
  AccordionSummary,
  styled,
  ToggleButtonGroup,
  Tab,
  Tabs,
  Accordion,
  AccordionDetails,
  Switch,
  InputBase,
  Slider,
  FormControlLabel,
} from "@mui/material";
import { isActive } from "../../interfaces";
import { motion } from "framer-motion";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import common from "../../utils/common";
import React from "react";

export const RainbowBoxDiv = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "borderWidth" && prop !== "borderRadius" && prop !== "fullWidth",
})<{
  borderWidth: string;
  borderRadius: string;
  fullWidth?: boolean | undefined;
}>(({ theme, borderWidth, borderRadius, fullWidth }) => ({
  padding: borderWidth,
  borderRadius: borderRadius,
  overflow: "hidden",
  width: fullWidth ? "100%" : "fit-content",
  height: "fit-content",
}));

export const RainbowBackground = styled("div", {
  shouldForwardProp: (prop) => prop !== "visible",
})<{ visible: boolean }>(({ theme, visible }) => ({
  position: "relative",
  zIndex: 1,
  "&&:after": {
    content: '""',
    position: "absolute",
    left: "calc(-50rem + 50%)",
    top: "calc(-50rem + 50%)",
    zIndex: 0,
    width: "100rem",
    height: "100rem",
    backgroundRepeat: "no-repeat",
    backgroundImage:
      visible === true
        ? "conic-gradient(from 0.31turn,rgb(90, 71, 211),rgb(53, 223, 75) 0.18turn,rgb(255, 178, 0) 0.47turn,rgb(239, 24, 174) 0.67turn,rgb(90, 71, 211))"
        : "none",
    animation: "1s linear 0s infinite normal none running rotate",
  },
  "@keyframes rotate": {
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const BackgroundShadow = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "borderwidth" &&
    prop !== "borderradius" &&
    prop !== "height" &&
    prop !== "width" &&
    prop !== "height" &&
    prop !== "shadow" &&
    prop !== "visible",
})<{
  borderwidth: string;
  borderradius: string;
  visible: boolean;
  height: number;
  width: number;
  shadow: boolean;
}>(({ theme, borderradius, borderwidth, visible, width, height, shadow }) => ({
  width: width,
  height: height,
  padding: borderwidth,
  borderRadius: borderradius,
  position: "absolute",
  backgroundImage:
    visible === true
      ? "conic-gradient(from 0.31turn,rgb(90, 71, 211),rgb(53, 223, 75) 0.18turn,rgb(255, 178, 0) 0.47turn,rgb(239, 24, 174) 0.67turn,rgb(90, 71, 211))"
      : "none",
  filter: visible === true ? `blur(10px)` : "none",
  zIndex: 0,
  opacity: "1",
  display: shadow ? "block" : "none",
}));

export const GenericBox = styled(motion.div)<{
  Heightstyle?: React.CSSProperties;
}>(({ theme, Heightstyle }) => ({
  padding: "14px",
  width: "fit-content",
  boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.0367952)",
  borderRadius: "16px",
  background:
    "linear-gradient(180deg, rgba(0, 255, 93, 0.02) 0%, rgba(0, 0, 0, 0.0061462) 100%), rgba(255, 255, 255, 0.05);",
  fontWeight: "bold",
  fontSize: "12px",
  textAlign: "center",
  cursor: "pointer",
  // fontFamily:"Inter",
  color: "#FFFFFF",
  margin: "auto",
  "&:hover": {
    background:
      "linear-gradient(202.26deg, rgba(232, 142, 255, 0.096) -15.35%, rgba(0, 254, 224, 0.141346) 118.93%);",
  },
  ...common.c_c_sb,
  ...Heightstyle,
}));
export const ImageContent = styled("img", {
  shouldForwardProp: (prop) =>
    prop !== "top" && prop !== "Opacity" && prop !== "Logo" && prop !== "Size",
})<{
  top?: boolean;
  Opacity?: boolean;
  Logo?: boolean;
  Size?: React.CSSProperties;
}>(({ theme, top, Opacity, Logo, Size }) =>
  top
    ? { width: "7px", height: "13px" }
    : Opacity
    ? {
        fontWeight: 900,
        fontSize: "24px",
        lineHeight: "24px",
      }
    : Logo
    ? {
        height: "30px",
        width: "30px",
        borderRadius: "30px",
        marginRight: "5px",
      }
    : { width: "12px", height: "12px", ...Size }
);

export const ChartButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  borderRadius: 0,
  "& .MuiToggleButton-root:not(:last-of-type)": {
    marginRight: "4px",
  },
  height: "72px",
  padding: "20px 20px 20px 20px",
  background: "rgba(236, 255, 239, 0.05)",
}));
export const ChartHeader = styled("div")(({ theme }) => ({
  width: "100%",
  marginTop: "10px",
  marginBottom: "10px",
  ...common.r_c_sb,
}));
export const DefaultItemSpan = styled("span")<{
  FontSize?: React.CSSProperties;
  DisableNumber?: boolean;
  marginPlusColor?: boolean;
  LargeDisable?: boolean;
  OpcaityRight?: boolean;
  noMargin?: boolean;
}>(
  ({
    theme,
    DisableNumber,
    marginPlusColor,
    LargeDisable,
    OpcaityRight,
    noMargin,
    FontSize,
  }) =>
    DisableNumber
      ? { color: "#FFFF", marginRight: "2px" }
      : marginPlusColor
      ? {
          color: "rgba(255, 255, 255, 0.3)",
          fontSize: "10px",
          marginLeft: "2px",
          marginTop: "7px",
        }
      : noMargin
      ? {
          fontWeight: 400,
          fontSize: "13px",

          color: "#FFFFFF",
        }
      : LargeDisable
      ? {
          fontWeight: 400,
          fontSize: "13px",

          color: "rgba(255, 255, 255, 0.4)",
        }
      : OpcaityRight
      ? {
          color: "rgba(255, 255, 255, 0.37)",
          marginRight: "5px",
          fontWeight: 200,
          fontSize: "11px",
          letterSpacing: "0.5px",
          ...FontSize,
        }
      : {
          width: "100px",
          height: "20px",
          margin: "0 3px 0 0",
          opacity: "0.8",
          fontfamily: "SFProText",
          fontSize: "15px",
          fontWeight: 500,
          fontStretch: "normal",
          fontStyle: "normal",
          lineHeight: "normal",
          letterSpacing: " -0.41px",
          color: theme.palette.text.blackForest,
        }
);
export const SwitchTabDiv = styled(Tabs)(({ theme }) => ({
  display: "flex",
  padding: "0px 10px",
  color: "#FFFF",
  [theme.breakpoints.down("sm")]: {
    marginLeft: "-10px",
  },
  backgroundColor: "transparent",
  position: "relative",
  overflow: "visible",
  "& *": {
    overflow: "visible !important",
    animation: "none",
  },
}));

export const SwitchTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== "active",
})<isActive>(({ theme, active }) => ({
  height: "fit-content",
  width: "fit-content",
  color: "#FFFFFF",
  cursor: "pointer",
  backgroundColor: "transparent",

  textTransform: "capitalize",
  transition: "font-weight 0.3s ease-in-out",
  opacity: active ? 1 : 0.4,
  letterSpacing: "0.4px",
  fontSize: active ? "17px" : "15px",
  fontWeight: active ? 500 : 400,

  "& *": {
    overflow: "visible !important",
  },

  "&.Mui-selected": {
    opacity: active ? 1 : 0.4,
    fontSize: "17px",
  },

  ...(active && {
    color: "#FFFF !important",
    "&&:after": {
      content: '""',
      position: "absolute",
      width: "90%",
      height: "60%",
      marginLeft: "20px",
      marginRight: "10px",
      backgroundImage:
        "conic-gradient(from 0.31turn,rgba(90, 71, 211, 1),rgb(53, 223, 75) 0.18turn,rgb(255, 178, 0) 0.47turn,rgb(239, 24, 174) 0.67turn,rgb(90, 71, 211))",
      filter: "blur(10px)",
      opacity: "0.15",
      transition: "0.4s",
    },
  }),

  ...(!active && {
    "&&:before": {
      content: '""',
      backgroundColor: "none",
      boxShadow: "0 8px 8px 0 rgba(0, 0, 0, 0.04)",
      position: "absolute",
      width: "55px",
      height: "28px",
      borderRadius: "10px",
      zIndex: -1,
      transition: "0.4s",
      color: "#FFFF",
    },
  }),

  "&:hover:before": {
    backgroundColor: "rgba(216, 216, 216, 0.215)",
    transition: "all 0.5s",
    color: "#FFFF",
    borderRadius: "10px",
  },
}));

export const FlexBox = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "FlexStart" &&
    prop !== "onlyFlex" &&
    prop !== "paddingTrue" &&
    prop !== "Padding",
})<{
  FlexStart?: boolean;
  onlyFlex?: boolean;
  paddingTrue?: boolean;
  Padding?: boolean;
}>(({ theme, FlexStart, onlyFlex, paddingTrue, Padding }) =>
  FlexStart
    ? { ...common.r_fs_fs }
    : onlyFlex
    ? {
        display: "flex",
      }
    : paddingTrue
    ? {
        padding: "0px",
        ...common.r_fs_sb,
      }
    : Padding
    ? {
        paddingBottom: "13px",
      }
    : {
        padding: "0px",
        position: "static",
        width: "225px",
        height: "44px",
        left: "102px",
        ...common.r_c_fe,
      }
);

export const DataBarContainer = styled("div")(({ theme }) => ({
  paddingTop: "5px",
  ...common.r_c_c,
}));

export const BalanceText = styled("span")<{
  whiteText?: boolean;
  Font?: React.CSSProperties;
}>(({ theme, whiteText, Font }) =>
  whiteText
    ? {
        height: "40px",
        fontStyle: "normal",
        fontWeight: 540,
        fontSize: "16px",
        lineHeight: "40px",
        top: "calc(50% - 40px/2)",
        color: "#FFFFFF",
        ...Font,
      }
    : {
        height: "40px",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "22px",
        top: "calc(50% - 40px/2)",
        alignItems: "center",
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.3)",
      }
);

export const Text = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "size" &&
    prop !== "weight" &&
    prop !== "primary" &&
    prop !== "dim" &&
    prop !== "lineHeight" &&
    prop !== "customColor" &&
    prop !== "customStyle",
})<{
  size?: number;
  weight?: number;
  primary?: boolean;
  dim?: boolean;
  lineHeight?: number | string;
  customColor?: string;
  customStyle?: React.CSSProperties;
  isNumber?: boolean;
}>(
  ({
    theme,
    size = 15,
    weight = 500,
    primary = true,
    dim = false,
    lineHeight = "normal",
    customColor,
    customStyle,
  }) => ({
    fontWeight: weight,
    // fontFamily: "Inter",
    fontSize: size,
    lineHeight: lineHeight,
    ...customStyle,
    opacity: dim ? 0.5 : 1,
    color: customColor
      ? customColor
      : primary
      ? dim
        ? theme.palette.text.dimPrimary
        : theme.palette.text.primary
      : dim
      ? theme.palette.text.dimSecondary
      : theme.palette.text.secondary,
  })
);

export const StyledModal = styled(ModalUnstyled)<{ top?: number }>(
  ({ theme, top }) => ({
    position: "fixed",
    zIndex: 1300,
    right: 0,
    bottom: 0,
    top: top || 0,
    left: 0,
    outline: "none",
    ...common.r_c_c,
  })
);

export const Backdrop = styled("div")(({ theme }) => ({
  position: "fixed",
  zIndex: -1,
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  WebkitTapHighlightColor: "transparent",
}));

export const AccordionSummaryStyled = styled(AccordionSummary)(({ theme }) => ({
  borderTop: "1.5px solid rgba(255,255,255,0.1)",
  backgroundColor: theme.palette.background.modal,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(0deg)",
  },
  padding: "0px 0px 0px 8px",
}));

export const AccordionStyled = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
}));

export const AccordionDetailsStyled = styled(AccordionDetails)(({ theme }) => ({
  color: "black",
  padding: 0,
  backgroundColor: theme.palette.background.modal,
}));

export const HudStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "initiallyAnimated",
})<{
  initiallyAnimated?: boolean;
}>(({ theme, initiallyAnimated }) => ({
  height: initiallyAnimated ? "240px" : "100vh",
  color: "white",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0px 12px 24px rgba(0,0,0, 0.3)",
  backgroundColor: "hsl(257, 34%, 12%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  borderRadius: "0px 0px 12px 12px",
}));

export const LoadingAssetsStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "initiallyAnimated",
})<{
  initiallyAnimated?: boolean;
}>(({ theme, initiallyAnimated }) => ({
  opacity: 0.2,
  color: "white",
  zIndex: 2,
  position: "absolute",
  textAlign: "center",
  width: "100%",
  top: initiallyAnimated ? 50 : 14,
}));

export const ChartDataBarStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "initiallyAnimated",
})<{
  initiallyAnimated?: boolean;
}>(({ theme, initiallyAnimated }) => ({
  zIndex: 2,
  // width: "100%",
  marginLeft: "10px",
  position: "absolute",
  top: initiallyAnimated ? 0 : 50,
  opacity: initiallyAnimated ? 1 : 0,
  overflow: "visible",
}));

export const TokenSectionStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "initiallyAnimated",
})<{
  initiallyAnimated?: boolean;
}>(({ theme, initiallyAnimated }) => ({
  opacity: initiallyAnimated ? 1 : 0,
  color: "white",
  zIndex: 2,
  display: initiallyAnimated ? "block" : "none",
  marginTop: initiallyAnimated ? `20px` : "40px",
}));

export const BottomLayoutStyled = styled(motion.div)(({ theme }) => ({
  color: "white",
  zIndex: 2,
  height: "555px",
  border: "2px solid rgba(255,255,255,0.03)",
  outline: "none",
  borderRadius: "12px 12px 0px 0px",
  mixBlendMode: "normal",
  boxSizing: "border-box",
  boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.70206)",
  width: "100%",
  marginTop: "0px",

  paddingTop: "20px",
  background: theme.palette.background.bottomLayout,
  backgroundSize: "cover",
}));

export const PasswordBackStyled = styled("div")(({ theme }) => ({
  backgroundColor: "rgba(255,255,255, 0.1)",
  width: "100%",
  height: 55,
}));

export const ConnectionBoxStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "initiallyAnimated",
})<{
  initiallyAnimated?: boolean;
}>(({ theme, initiallyAnimated }) => ({
  position: "absolute",
  right: initiallyAnimated ? "-50px" : "15px",
  top: "15px",
}));

export const DashboardContainerStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "initiallyAnimated",
})<{
  initiallyAnimated?: boolean;
}>(({ theme, initiallyAnimated }) => ({
  position: "fixed",
  top: initiallyAnimated ? 0 : -40,
  zIndex: 4,
  maxHeight: 40,
  height: 40,
  width: "100%",
  padding: "0px 10px",
  ...common.r_c_sb,
}));

export const ScreenHeaderStyled = styled(motion.div)(({ theme }) => ({
  height: 50,
  padding: "0px 15px",
  position: "relative",
  overflow: "hidden",
  ...common.r_c_sb,
}));

export const PasswordBackdropStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "currentStep",
})<{
  currentStep?: number;
}>(({ theme, currentStep }) => ({
  backgroundPosition: "center",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  height: "67%",
  width: "100%",
  position: "absolute",
  bottom: 0,
  opacity:
    currentStep === 2 || currentStep === 3 || currentStep === 4 ? 0.4 : 0.8,
}));

export const AnimatorStyled = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  bottom: -230,
  opacity: 0,
}));

export const PasswordInputStyled = styled("div")(({ theme }) => ({
  backgroundColor: "rgba(0,0,0,0.2)",
  height: 50,
  borderRadius: 12,
  padding: "13px 20px",
  marginTop: "40px",
  width: "80%",
  ...common.r_c_fs,
}));

export const SwitchStyled = styled(Switch)(({ theme }) => ({
  width: 58,
  height: 43,
  padding: "12px 5px 12px 12px",
  "& .MuiSwitch-switchBase": {
    margin: 1,
    "&.Mui-checked": {
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#2f2f34",
      },
    },
    "&.Mui-disabled": {
      "& + .MuiSwitch-track": {
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#2f2f34",
    borderRadius: 43 / 2,
  },
}));

export const AccordianRowsStyled = styled("div")(({ theme }) => ({
  backgroundColor: "rgba(216, 216, 216, 0.06)",
  borderRadius: 14,
  marginTop: 15,
}));

export const NetworkSelectionStyled = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.modal,
  width: "90%",
  height: "94%",
  outline: "none",
  borderRadius: 12,
  padding: "10px 10px",
  // border: "2px solid red",
  // overflow: "hidden",
}));

export const WrapperBackgroundStyled = styled("div")(({ theme }) => ({
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 0,
  backgroundColor: theme.palette.background.mainWrapper,
}));
export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: theme.palette.background.SearchBox,
  width: "95%",
  margin: "auto",
  fontSize: "16px",
  color: "#fff",
  border: "2px solid rgba(255, 255, 255, 0.08)",
  padding: "6px 4px",
}));

export const StyledInputBase = styled(InputBase)<{
  padding?: number;
  containerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}>(({ theme, padding = 6, inputStyle, containerStyle }) => ({
  color: "white",
  width: "100%",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "500",

  "& .MuiInputBase-input": {
    padding: `${padding}px`,
    width: "100%",

    ...inputStyle,
  },

  "& .MuiInputBase-input::placeholder": {
    color: "#fff",
    fontSize: "13px",
    fontWeight: "400",
  },
  ...containerStyle,
}));
export const TokenAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  background: "none",
  width: "100%",
  borderRadius: "20px !important",

  "& 	.Mui-expanded": {
    minHeight: "20px !important",
  },
}));
export const TokenAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  // backgroundColor: "#24242C",
  borderRadius: "15px",

  ...common.r_c_fs,
}));
export const TokenAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  color: "black",
  padding: 0,
  marginTop: "20px",
  background: "none",
}));
export const AccordionStyle = styled("div")<{ value: number }>(
  ({ theme, value }) => ({
    padding: "0px",
    width: "95%",
    margin: "5px auto 0px auto",
    // marginTop: "10px",

    opacity: value === 0 ? 1 : 0.5,

    borderRadius: "12px",
    backgroundColor: theme.palette.background.buttonColor,
    cursor: "pointer",
  })
);
export const GenericBackgroundBox = styled("div")<{ margintop: number }>(
  ({ theme, margintop }) => ({
    width: "100%",
    height: "50px",
    borderRadius: "12px",
    margin: "auto",
    alignItems: "center",
    marginTop: `${margintop}px`,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    textAlign: "start",
    display: "flex",
    alignSelf: "center",
  })
);
export const WrapperStyled = styled(motion.div)<{ value: boolean }>(
  ({ theme, value }) => ({
    opacity: value ? 0.3 : 1,
    pointerEvents: value ? "none" : "all",
    padding: "0px 10px",
    overflow: "scroll",

    height: "405px",
  })
);
export const StartAdornmentStyled = styled("span")(({ theme }) => ({
  ...common.r_c_c,
  marginLeft: "10px",
}));
export const ButtonStyled = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "customColor" && prop !== "marginTop" && prop !== "customStyle",
})<{
  customColor: string;
  marginTop?: number;
  customStyle?: React.CSSProperties;
}>(({ theme, customColor, marginTop, customStyle }) => ({
  background: customColor,
  width: "95%",
  margin: "auto",
  height: "40px",
  cursor: "pointer",
  borderRadius: "12px",
  marginTop: `${marginTop}px`,
  ...common.r_c_c,
  ...customStyle,
}));
export const AddressInsertionStyled = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.modal,
  width: "90%",
  height: "65%",
  outline: "none",
  borderRadius: 12,
  padding: "10px 10px",
  fontSize: "10px",
  background:
    "linear-gradient(64.47deg, rgba(255, 104, 133, 0.1) 0%, rgba(255, 104, 133, 0) 53.05%), linear-gradient(154.83deg, rgba(0, 81, 66, 0.2) 0%, rgba(0, 0, 0, 0) 97.87%), #181621",
}));
export const SearchLayout = styled("div")(({ theme }) => ({
  width: "100px",
  paddingTop: "20px",
  height: "auto",

  ...common.c_c_c,
}));
export const StyledAmountInput = styled("input")(({ theme }) => ({
  color: "#fff",
  fontSize: "45px",
  fontWeight: "500",
  textDecoration: "underline",
  paddingLeft: "0px !important",
  outline: "none",
  border: "none",
  textAlign: "center",
  background: "none",
  width: "55%",
  textDecorationColor: "#46454E",
  textUnderlineOffset: "5px",
  position: "relative",
  // borderBottom: "2px solid rgba(255,255,255,0.6)",
  "&::placeholder": {
    color: "#fff",
  },
}));
export const TokenSelectionPanelStyled = styled("div")<{
  style?: React.CSSProperties;
}>(({ theme, style }) => ({
  height: "auto",
  width: "90%",
  margin: "auto",
  padding: "5px",
  borderRadius: "12px",
  backgroundColor: "#262833",
  ...style,
  ...common.c_fs_c,
}));
export const PanelBoxStyled = styled("div")(({ theme }) => ({
  height: "60px",
  padding: "10px 0px",
  width: "100%",
  backgroundColor: "transparent",
  fontWeight: "400",
  ...common.c_fs_fs,
}));
export const TransitionStyled = styled("div")(({ theme }) => ({
  padding: "0px 14px",
  color: "#fff",
  ...common.c_c_c,
}));
export const SingleBoxStyled = styled("div")<{ border: string }>(
  ({ theme, border }) => ({
    borderRight: border === "true" ? "2px solid #342F40" : "none",
    padding: "0px 10px",

    ...common.c_c_c,
  })
);
export const TransactionFeeStyled = styled("div")(({ theme }) => ({
  width: "90%",
  margin: "auto",
  marginTop: "25px",
  padding: "0px 0px",
  ...common.c_c_c,
}));
export const AdvanceButtonStyled = styled("div")<{
  width: number;
  left?: number;
}>(({ theme, width, left }) => ({
  backgroundColor: "#261F35",

  width: width,
  padding: "10px 10px",
  color: "#70677A",
  marginRight: "auto",

  borderRadius: "10px",
  cursor: "pointer",
  marginLeft: `${left}px` || "20px",
  "&:hover": {
    opacity: 0.8,
  },
  ...common.r_c_c,
}));
export const AdvanceOptionStyled = styled(motion.div)(({ theme }) => ({
  width: "100%",
  height: "310px",
  background:
    "linear-gradient(64.47deg, rgba(255, 104, 133, 0.1) 0%, rgba(255, 104, 133, 0) 53.05%), linear-gradient(154.83deg, rgba(0, 81, 66, 0.2) 0%, rgba(0, 0, 0, 0) 97.87%), #181621",
  border: "none",
  outline: "none",
  color: "#fff",
  padding: "18px 20px",
  borderTopLeftRadius: "18px",
  borderTopRightRadius: "18px",
}));
export const BackgroundBoxStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "customColor" && prop !== "marginTop",
})<{
  height: number;
  marginTop?: number;
}>(({ theme, height, marginTop }) => ({
  width: "100%",
  height: `${height}px`,
  backgroundColor: "#25242D",
  padding: "8px 4px",
  borderRadius: "17px",
  marginTop: `${marginTop}px`,
  ...common.r_c_sa,
}));
export const OptionBoxStyled = styled(motion.div)<{ active: boolean }>(
  ({ theme, active }) => ({
    width: "fit-content",
    height: "auto",
    padding: "5px 10px",
    cursor: "pointer",
    backgroundColor: `${active ? "#302E37" : "none"}`,
    borderRadius: "12px",
    ...common.c_c_c,
  })
);
export const FooterStyled = styled("div")(({ theme }) => ({
  marginTop: "58px",

  ...common.r_fs_c,
}));

export const Step4WrapperStyled = styled(motion.div)(({ theme }) => ({
  height: "600px",
  ...common.c_c_sb,
}));
export const HeaderStyled = styled("div")(({ theme }) => ({
  borderTopRightRadius: "10px",
  borderTopLeftRadius: "10px",
  width: "100%",
  backgroundColor: "#181621",
  color: "#fff",
  textAlign: "start",
  paddingLeft: " 15px",
  padding: "4px 10px",

  ...common.r_c_fs,
}));
export const StyledSlider = styled(Slider)(({ theme }) => ({
  width: "90%",
  position: "relative",
  margin: "5px 0px 20px 0px",
  padding: "0px !important",
  height: "45px",
  borderRadius: "17px",
  backgroundColor: "#EDEDED",

  "& .MuiSlider-thumb": {
    background:
      "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), linear-gradient(88.45deg, #FFB200 -17.34%, #EF18AE 47.97%, #5A47D3 111.04%)",
    height: "50px",
    width: "50px",
    marginLeft: "20px",
    zIndex: 20,
  },
  "& .MuiSlider-thumb.Mui-active": {
    boxShadow: "none",
  },

  "& .Mui-active": {
    zIndex: 20,
  },

  "& .MuiSlider-track": {
    height: "87%",
    backgroundColor: "#EDEDED",
    zIndex: "20",
    border: "none",
    outline: "none",
    borderRadius: "17px",
  },
  "& .MuiSlider-rail": {
    height: "unset",
  },
}));
export const Step3WrapperStyled = styled(motion.div)(({ theme }) => ({
  background: "#181621",
  overflowY: "hidden",
  height: "600px",
  textAlign: "start",
}));
export const FormControlLabelStyled = styled(FormControlLabel)(({ theme }) => ({
  fontSize: "17px",
  margin: "0px 0x 0x 1px",
  "& .MuiFormControlLabel-root": {
    border: "2px solid red",
  },
  "& .MuiTypography-root": {
    fontSize: "17px",
    fontWeight: "400",
  },
}));
export const CustomBox = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "customColor" &&
    prop !== "marginTop" &&
    prop !== "backgroundColor" &&
    prop !== "borderRadius",
})<{
  height?: string;
  margin?: string;
  width?: string;
  padding?: string;
  backgroundColor?: string;
  borderRadius?: string;
}>(
  ({
    theme,
    height,
    margin,
    padding,
    backgroundColor,
    borderRadius,
    width,
  }) => ({
    width,
    height,
    backgroundColor,
    padding,
    borderRadius,
    margin,
  })
);
export const SwapWrapperStyled = styled(motion.div)(({ theme }) => ({
  height: "600px",
  boxSizing: "border-box",

  background: "#181621",
}));
export const SwapTopLayout = styled("div")(({ theme }) => ({
  width: "90%",
  margin: "auto",

  paddingTop: "20px",
  ...common.r_c_fs,
}));
export const SwapIconStyled = styled("div")(({ theme }) => ({
  ...common.c_c_c,
  marginLeft: "25px",
  position: "relative",
}));
export const SwapTokenBoxStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "marginTop",
})<{ marginTop?: number }>(({ theme, marginTop }) => ({
  width: "90%",
  margin: "auto",
  marginTop: `${marginTop}px`,
  textAlign: "start",
  backgroundColor: "#181920",
  height: "90px",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  padding: "8px",
  paddingRight: "4px",
  ...common.r_c_fs,
}));
export const TokenValueBoxStyled = styled("div")(({ theme }) => ({
  width: "45%",
  height: "100%",
  ...common.c_fs_sa,
  paddingLeft: "5px",
}));
export const TokenSelectionBoxStyled = styled("div")(({ theme }) => ({
  width: "55,%",
  paddingRight: "5px",
  cursor: "pointer",

  marginTop: "auto",
  marginLeft: "auto",
  ...common.r_c_fe,
}));
export const BalanceBoxStyled = styled("div")(({ theme }) => ({
  width: "90%",
  margin: "auto",

  backgroundColor: "rgba(255, 255, 255, 0.02)",
  padding: "10px",
  borderBottomLeftRadius: "14px",
  borderBottomRightRadius: "14px",
  ...common.r_c_sb,
}));
export const AccountSelectionModalStyled = styled("div")(({ theme }) => ({
  height: "310px",

  width: "100%",
  border: "none",
  outline: "none",
  borderTopLeftRadius: "18px",
  borderTopRightRadius: "18px",
  background: "#191A22",
  overflowY: "scroll",
}));

export const AccordianWrapper = styled("div")(({ theme }) => ({
  padding: "0px",
  width: "95%",
  margin: "auto",
  borderRadius: "20px",
  overflow: "hidden",
  marginTop: "20px",
}));
export const AccountSelectionAccordian = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  background: "none",
  width: "100%",
  "& 	.Mui-expanded": {
    minHeight: "55px !important",
  },
}));
export const AccountSelectionAccordionSummary = styled(AccordionSummary)(
  ({ theme }) => ({
    backgroundColor: "#24242C",
    minHeight: 40,
    maxHeight: 40,
    borderTopLeftRadius: "14px",
    borderTopRightRadius: "14px",
    borderBottom: " 2px solid rgba(255, 255, 255, 0.05)",
    "& 	.Mui-expanded": {
      minHeight: 30,
      maxHeight: 35,
      width: "100%",
      ...common.r_c_sb,
      borderBottomRightRadisu: "0px",
    },
  })
);
export const AccountSelectionAccordionDetails = styled(AccordionDetails)(
  ({ theme }) => ({
    backgroundColor: "#24242C",
    padding: 0,
  })
);
export const CardBox = styled("div")(({ theme }) => ({
  width: "220px",

  background: theme.palette.background.gray,
  margin: "auto",
  padding: "13px",
  borderRadius: "12px",
  marginTop: "10px",
  ...common.r_c_fs,
}));
export const TransactionReceiptStyled = styled("div")(({ theme }) => ({
  width: "80%",
  height: "400px",
  borderRadius: "12px",
  outline: "none",
  border: "none",
  background:
    "linear-gradient(64.47deg, rgba(255, 104, 133, 0.1) 0%, rgba(255, 104, 133, 0) 53.05%), linear-gradient(154.83deg, rgba(0, 81, 66, 0.2) 0%, rgba(0, 0, 0, 0) 97.87%), #181621",
}));
export const LeftBox = styled("div")(({ theme }) => ({
  ...common.c_fs_c,
}));
export const RightBox = styled("div")(({ theme }) => ({
  marginLeft: "auto",
  ...common.c_fe_c,
})); // chnage hoga
export const TabButton = styled("button")(({ theme }) => ({
  outline: "none",
  border: "none",
  backgroundColor: theme.palette.background.buttonColor,
  borderRadius: "16px",
  padding: "14px",
  width: "70px",
  height: "60px",
  cusrsor: "pointer !important",
  ...common.c_c_c,
  margin: "5px",
  "&:hover": {
    // opacity: 0.7,
    backgroundColor: theme.palette.background.buttonHoverColor,
  },
}));
export const ListItemStyled = styled(motion.div)(({ theme }) => ({
  width: "90%",
  margin: "auto",
  marginTop: "10px",
  padding: "10px 5px",
  borderRadius: "10px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.listItem,
  ...common.r_c_fs,
  "&:hover": {
    backgroundColor: theme.palette.background.listItemHoverColor,
  },
}));
export const ListItemValueBoxStyled = styled("div")(({ theme }) => ({
  marginLeft: "auto",
  marginRight: "3px",
  ...common.r_c_c,
}));
export const NameBoxStyled = styled("div")(({ theme }) => ({
  ...common.c_c_c,
}));
export const HeadingBox = styled("div")(({ theme }) => ({
  height: "20px",
  ...common.r_c_c,
}));
export const AccordionRowStyled = styled("div")(({ theme }) => ({
  width: "95%",

  borderRadius: "16px",
  // border: "2px solid green",
  margin: "6px auto", //backvolor :" #1f1f25"
  backgroundColor: theme.palette.background.listItem,
  padding: "0px 3px",
  ...common.r_c_sb,
}));
export const ArrowStyled = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  marginLeft: "20px",
  backgroundColor: "#2d2d32",
  "&:hover": {
    backgroundColor: theme.palette.background.listItemHoverColor,
  },
}));
export const ChainHeading = styled("div")(({ theme }) => ({
  width: "95%",
  margin: "auto",
  padding: "0px 10px",
  height: "25px",
  marginTop: "15px",
  marginBottom: "15px",
  borderRadius: "12px",
  cursor: "pointer",
  ...common.r_c_sb,
  "&:hover": {
    backgroundColor: theme.palette.background.listItemHoverColor,
  },
}));
export const TokenDetailBoxStyled = styled("div")(({ theme }) => ({
  width: "80%",
  margin: "auto",
  marginTop: "10px",
  marginBottom: "10px",

  ...common.c_fs_c,
}));
export const PriceChangeStyled = styled("span")<{
  success: boolean;
}>(({ theme, success }) => ({
  color: success ? theme.palette.text.success : "red",
  opacity: 1.5,
}));
export const ButtonWrapper = styled("div")(({ theme }) => ({
  width: "90%",
  margin: "auto",

  ...common.r_c_fs,
}));
export const ButtonBoxStyled = styled("button")(({ theme }) => ({
  backgroundColor: theme.palette.background.buttonColor,
  outline: "none",
  border: "none",
  width: "100px",
  height: "40px",
  borderRadius: "12px",
  cursor: "pointer",
  padding: "10px",
  margin: "5px",
  marginLeft: "0px",
  ...common.r_c_fs,
  "&:hover": {
    backgroundColor: theme.palette.background.buttonHoverColor,
  },
}));
export const UpArrowStyled = styled("span")(({ theme }) => ({
  width: "35px",
  height: "35px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.SecondaryColor,
  borderRadius: "12px",
  ...common.r_c_c,
  "&:hover": {
    opacity: "0.7",
  },
}));

export const TitleStyled = styled("div")(({ theme }) => ({
  width: "90%",
  margin: "auto",
  marginBottom: "10px",
  ...common.c_fs_c,
}));

export const TxHistoryWrapper = styled("div")<{
  height?: number;
}>(({ theme, height }) => ({
  height: height,
  paddingTop: 10,
  paddingBottom: 20,
  overflowY: "scroll",
}));
export const TransaactionTitleStyled = styled("div")(({ theme }) => ({
  width: "100%",
  paddingBottom: "8px",
  ...common.r_c_fe,
}));
export const TransactionFeeBottomLayout = styled("div")(({ theme }) => ({
  borderRadius: "12px",
  width: "100%",
  outline: "none",
  padding: "2px",
  border: "2px solid rgba(255, 255, 255, 0.08)",
  ...common.c_c_c,
}));
export const StatsSection = styled("div")(({ theme }) => ({
  marginTop: "15px",
  marginBottom: "10px",
  ...common.r_c_c,
}));
export const EditSection = styled("div")(({ theme }) => ({
  width: "100%",
  ...common.r_c_fe,
}));
export const ButtonSection = styled("div")(({ theme }) => ({
  marginTop: "30px",
  width: "100%",
  marginBottom: "10px",
  ...common.r_c_c,
}));
export const RainbowButtonStyled = styled("div")<{
  width?: number;
}>(({ theme, width }) => ({
  width: width ? width : "100%",
  height: 48,
  marginLeft: 30,
  padding: "2px",
  borderRadius: "14px",
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.396689)",
  mixBlendMode: "normal",
  rotate: "360deg",
  cusror: "pointer !important",
  background:
    "conic-gradient(from 90deg at 50% 50%, #EF18AE -9.1deg, #5A47D3 8.59deg, #35DF4B 171.41deg, #FFB200 188.48deg, #EF18AE 350.9deg, #5A47D3 368.59deg)",
  ...common.r_c_c,
}));
export const InternalRainbowBoxStyled = styled("div")<{
  isHoldFinish?: boolean;
}>(({ theme, isHoldFinish }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  position: "relative",
  overflow: "hidden",
  background: `linear-gradient(225deg,rgba(123, 0, 254, 0.120144) 0%, rgba(166, 246, 0, 0.0962751) 100%), ${
    isHoldFinish ? "#191721" : "#191721d4"
  }`,
}));
