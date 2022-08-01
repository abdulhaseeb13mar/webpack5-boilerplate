import { useMemo, FC, CSSProperties } from "react";

import { PaletteMode, ThemeOptions } from "@mui/material";
import { useSelector } from "react-redux";
import {
  SFProDisplayBold,
  SFProDisplayMedium,
  SFProDisplayRegular,
  SFProDisplaySemiBold,
  SFProTextBold,
  SFProTextRegular,
} from "./typography";
import { RootState } from "../interfaces";
import { alpha, createTheme, ThemeProvider } from "@mui/material/styles";

declare module "@mui/material/ButtonGroup" {
  interface ButtonGroupPropsVariantOverrides {
    sonarDefault: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    sonarDefault: true;
    sonarBorder: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    sonarTransparent: true;
    sonarFlat: true;
    sonarMatteSoft: true;
  }
}

declare module "@mui/material/Select" {
  interface SelectPropsVariantOverrides {
    sonarFlat: true;
  }
}
declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    transparentColor?: CSSProperties["color"];
    whiteLilac?: CSSProperties["color"];
    whiteLilacone?: CSSProperties["color"];
    sweetPink?: CSSProperties["color"];
    lochmara?: CSSProperties["color"];
    tokenBackground?: CSSProperties["color"];
    lightGrey?: CSSProperties["color"];
    bluishGrey?: CSSProperties["color"];
    modal?: CSSProperties["color"];
    gray?: CSSProperties["color"];
    mainWrapper?: CSSProperties["color"];
    buttonColor?: CSSProperties["color"];
    buttonHoverColor?: CSSProperties["color"];
    listItem?: CSSProperties["color"];
    listItemHoverColor?: CSSProperties["color"];
    tokenColor?: CSSProperties["color"];
    tokenHoverColor?: CSSProperties["color"];
    SecondaryColor?: CSSProperties["color"];
    SearchBox?: CSSProperties["color"];
    bottomLayout?: CSSProperties["color"];
  }

  interface TypeText {
    default?: CSSProperties["color"];
    danger?: CSSProperties["color"];
    check?: CSSProperties["color"];
    iconcolor?: CSSProperties["color"];
    lochmaraText?: CSSProperties["color"];
    blackForest?: CSSProperties["color"];
    Gray?: CSSProperties["color"];
    Gray30?: CSSProperties["color"];
    mediumGray?: CSSProperties["color"];
    graniteGray?: CSSProperties["color"];
    textColor?: CSSProperties["color"];
    dimPrimary?: CSSProperties["color"];
    dimSecondary?: CSSProperties["color"];
    success?: CSSProperties["color"];
  }
}
const sonarRadius = {
  "&:not(.MuiButtonGroup-grouped)": {
    borderRadius: 12,
  },
};
const sonarBorderDark = {
  ...sonarRadius,
  border: "solid 1px rgba(255, 255, 255, 0.1)",
};
const sonarRaisedDark = {
  ...sonarRadius,
  boxShadow: "0 12px 10px 0 rgba(0, 0, 0, 0.1)",
  backgroundColor: "rgba(255,255,255,0.1)",
};
const sonarBorderLight = {
  ...sonarRadius,
  border: "solid 1px rgba(255, 255, 255, 0.6)",
};
const sonarRaisedLight = {
  ...sonarRadius,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "#FFFF",

  mixBlendMode: "normal",
};
const sonarDefaultDark = {
  ...sonarRadius,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
  backgroundColor: "rgba(255, 255, 255, 0.01)",
  padding: "0px 8px",
  width: "39px",
  height: "28px",
};
const sonarDefaultLight = {
  ...sonarRadius,
  boxShadow: "0 8px 16px 0 rgba(28, 23, 42, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.23)",
  padding: "0px 8px",
  width: "39px",
  height: "28px",
};

const getColorThemes = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#fff",
            paper: "white",
            transparentColor: "#ffffff00",
            whiteLilac: "#e8e7e9",
            whiteLilacone: "rgb(245, 243, 247)",
            sweetPink: "rgb(251, 251, 251)",
            lochmara: "rgb(3, 125, 214)",
            tokenBackground: "rgb(232, 220, 243)",
            lightGrey: "#c2cad3",
            bluishGrey: "rgb(238, 243, 247)",
            gray: "#25232A",
            mainWrapper: "#391621",
            buttonColor: "#1c1c23",
            buttonHoverColor: "rgba(255,255,255,0.5)",
            listItem: "rgba(255, 255, 255, 0.04)",
            listItemHoverColor: "rgba(255, 255, 255,0.1)",
            tokenColor: "#1f1f25",
            SecondaryColor: "#272727",
            SearchBox: "rgba(0,0,0,0.4)",
            bottomLayout: "#101017",
          },
          text: {
            default: "#fff",
            primary: "#000",
            secondary: "#808080",
            danger: "#fb113e ",
            check: "#00de39 ",
            iconcolor: "#0a0f1a",
            lochmaraText: "rgb(3, 125, 214)",
            blackForest: "#1a192a",
            Gray: "#808080",
            Gray30: "#4d4d4d",
            mediumGray: "#aeaeae",
            graniteGray: "#5b5b5b",
            success: "rgba(61, 242, 188, 1)",
          },
        }
      : {
          primary: {
            main: "#000",
          },
          background: {
            default: "#000000",
            paper: "#fff",
            modal: "#1f1e24",
            gray: "#25232A",
            mainWrapper: "#101017", //391621
            buttonColor: "#1c1c23",
            buttonHoverColor: "rgba(255,255,255,0.1)",
            listItem: "#ffffff0a",
            listItemHoverColor: "rgba(255, 255, 255,0.1)",
            tokenColor: "#1f1f25",
            SecondaryColor: "#272727",
            SearchBox: "rgba(0,0,0,0.4)",
            bottomLayout: "#101017",
          },
          text: {
            primary: "rgba(255,255,255,1)",
            dimPrimary: "rgba(255,255,255,0.8)",
            secondary: "rgba(255,255,255,0.4)",
            dimSecondary: "rgba(255,255,255,0.3)",
            success: "rgba(61, 242, 188, 1)",
          },
        }),
  },
  typography: {
    // fontFamily: "Inter",
    h1: {
      fontWeight: 800,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.7rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.6rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.4rem",
    },
    subtitle1: {
      fontWeight: 800,
      fontSize: "1.2rem",
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: "1rem",
    },
    body1: {
      fontWeight: 600,
      fontSize: "1.2rem",
    },
    body2: {
      fontWeight: 400,
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "sonarDefault" },
          style: {
            fontSize: "10px",
            borderRadius: 12,
            "&.MuiButtonGroup-groupedSonarDefault:last-of-type:not(:nth-of-type(1))":
              {
                padding: "0 8px",
              },
            "& img": {
              opacity: 0.5,
              transition: "opacity 0.3s ease-in-out",
            },
            ...(mode === "dark"
              ? {
                  color: "rgba(255, 255, 255, 0.5)",
                  ...sonarDefaultDark,
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.1)",
                    "& img": {
                      opacity: 1,
                    },
                  },
                  "&.MuiButtonGroup-groupedSonarDefault:not(:last-of-type)": {
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                  },
                }
              : {
                  color: "rgb(24,20,40)",
                  ...sonarDefaultLight,
                  "&:hover": {
                    "& img": {
                      opacity: 1,
                    },
                  },
                  "& img": {
                    transition: "opacity 0.3s ease-in-out",
                    opacity: 0.5,
                    filter:
                      "brightness(0) saturate(100%) invert(9%) sepia(25%) saturate(621%) hue-rotate(220deg) brightness(96%) contrast(93%)",
                  },
                  "&.MuiButtonGroup-groupedSonarDefault:not(:last-of-type)": {
                    borderRight: "1px solid rgb(24,20,40, 0.1)",
                  },
                }),
          },
        },
        {
          props: { variant: "sonarBorder" },
          style: {
            ...(mode === "dark"
              ? {
                  ...sonarBorderDark,
                }
              : {
                  ...sonarBorderLight,
                }),
          },
        },
      ],
      styleOverrides: {
        root: {
          textTransform: "none",
          lineHeight: "normal",
          padding: "9px 13px",
          transition:
            "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, color 0.3s ease-in-out",
          "&.MuiButtonBase-root": {
            minWidth: "auto",
          },
          "&.paddingless": {
            padding: 0,
          },
          "&:hover": {
            border: "none",
            "& img": {
              opacity: 1,
            },
            ...(mode === "dark"
              ? {
                  ...sonarRaisedDark,
                }
              : {
                  ...sonarRaisedLight,
                }),
          },
          ...(mode === "light"
            ? {
                "& img": {
                  transition: "opacity 0.3s ease-in-out",
                  opacity: 0.5,
                  filter:
                    "brightness(0) saturate(100%) invert(9%) sepia(25%) saturate(621%) hue-rotate(220deg) brightness(96%) contrast(93%)",
                },
              }
            : {}),
        },
      },
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          transition:
            "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, color 0.3s ease-in-out",
          margin: 0,
          backgroundColor: "transparent",

          boxShadow: "none",
          minWidth: "5ch",
          height: "28px",

          "&:not(:last-of-type)": {
            borderRadius: 12,
            marginRight: ".5rem",
            height: "28px",
            color: "rgba(255, 255, 255, 0.4)",
          },
          "&:not(:first-of-type)": {
            borderRadius: 12,
            height: "28px",
            color: "rgba(255, 255, 255, 0.4)",
          },
          ...(mode === "dark"
            ? {
                "&.MuiToggleButtonGroup-grouped.border:not(:first-of-type)": {
                  ...sonarBorderDark,
                },

                color: "rgba(255, 255, 255, 0.5)",
                "& img": {
                  transition: "opacity 0.3s ease-in-out",
                  opacity: 0.5,
                },
                "&:hover, &.Mui-selected, &.Mui-selected:hover": {
                  color: "rgba(255, 255, 255, 0.5)",
                  ...sonarRaisedDark,
                  "& img": {
                    opacity: 0.5,
                  },
                },
              }
            : {
                "&.MuiToggleButtonGroup-grouped.border:not(:first-of-type)": {
                  ...sonarBorderLight,
                },
                color: alpha("#000", 0.5),
                "&:hover, &.Mui-selected, &.Mui-selected:hover": {
                  ...sonarRaisedLight,
                  "& img": {
                    opacity: 0.5,
                  },
                },
                "& img": {
                  transition: "opacity 0.3s ease-in-out",
                  opacity: 0.5,
                  filter:
                    "brightness(0) saturate(100%) invert(9%) sepia(25%) saturate(621%) hue-rotate(220deg) brightness(96%) contrast(93%)",
                },
              }),
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        sizeSmall: {
          textTransform: "none",
          border: 0,
          ...(mode === "dark"
            ? {
                "&.border": {
                  ...sonarBorderDark,
                },
                "&:hover": {
                  ...sonarRaisedDark,
                },
              }
            : {
                "&.border": {
                  ...sonarBorderLight,
                },
              }),
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "@font-faces": [
          SFProDisplayBold,
          SFProDisplayMedium,
          SFProDisplayRegular,
          SFProDisplaySemiBold,
          SFProTextBold,
          SFProTextRegular,
        ],
      },
    },
  },
});

const Theme: FC = ({ children }) => {
  const { colorTheme } = useSelector((state: RootState) => state.app);
  const theme = useMemo(
    () => createTheme(getColorThemes(colorTheme)),
    [colorTheme]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
