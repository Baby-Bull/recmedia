/* eslint-disable no-unused-vars */
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    lightBlue: string;
    blue: string;
    whiteBlue: string;
    whiteGray: string;
    gray: string;
    lightGray: string;
    lightGray_1: string;
    green: string;
    orange: string;
    cleam: string;
    navy: string;
    red: string;
    gd: string;
    black: string;
    filter: {
      blue: string;
      white: string;
    };
  }

  interface ThemeOptions {
    lightBlue?: string;
    blue?: string;
    whiteBlue?: string;
    whiteGray?: string;
    gray?: string;
    lightGray?: string;
    lightGray_1?: string;
    green?: string;
    orange?: string;
    cleam?: string;
    navy?: string;
    red?: string;
    gd?: string;
    black?: string;
    filter?: {
      blue?: string;
      white?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            background: "#F5F5F5",
            color: "#989EA8",
          },
        },
        sizeSmall: {
          fontSize: "10px",
          height: "20px",
          lineHeight: "24px",
          fontWeight: 700,
        },
        sizeMedium: {
          fontSize: "16px",
          height: "48px",
          lineHeight: "24px",
          fontWeight: 700,
        },
      },
    },
  },
  typography: {
    fontFamily: ["Noto Sans JP", "sans-serif"].join(","),
  },
  lightBlue: "#A9F3FF",
  blue: "#03BCDB",
  whiteBlue: "#F4FDFF",
  whiteGray: "#F5F5F5",
  gray: "#989EA8",
  lightGray: "#E6E6E6",
  lightGray_1: "#C4C4C4",
  green: "#1BD0B0",
  orange: "#FF9458",
  cleam: "#FFF9E5",
  navy: "#1A2944",
  red: "#FF5454",
  black: "#262A30",
  gd: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
  filter: {
    // eslint-disable-next-line max-len
    blue: "brightness(0) saturate(100%) invert(68%) sepia(84%) saturate(4101%) hue-rotate(150deg) brightness(100%) contrast(98%)",
    white:
      // eslint-disable-next-line max-len
      "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(299deg) brightness(101%) contrast(100%)",
  },
});

export const themeSelect = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          "&": {
            borderRadius: "16px",
          },
        },
      },
    },
  },
});

export default theme;
