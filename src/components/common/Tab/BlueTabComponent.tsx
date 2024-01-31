import React from "react";
import { Box, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "src/theme";

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel = (props: ITabPanelProps) => {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ backgroundColor: "white" }}
    >
      {value === index && <Box> {children}</Box>}
    </div>
  );
};

export const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

interface ITabCustomProps {
  props?: {
    xsColor?: string;
    xsFontSize?: string;
    xsWidth?: string;
    xsHeight?: string;
    xsBorderColor?: string;
    xsBorderRadius?: string;
    mdWidth?: string;
    lgWidth?: string;
  };
}

export const TabCustom = styled(Tab)<ITabCustomProps>(({ props }) => ({
  height: "56px",
  paddingLeft: "7px",
  paddingRight: "7px",
  "& img": {
    width: "29px",
    minHeight: "32px",
    objectFit: "contain",
    filter: theme.filter.blue,
  },
  "&.Mui-selected": {
    "&": {
      backgroundColor: theme.blue,
    },
    "& img": {
      filter: theme.filter.white,
    },
    color: "white",
  },
  "@media (max-width: 768px)": {
    justifyContent: "flex-start",
    display: "flex",
    color: props?.xsColor || "black",
    fontWeight: 500,
    fontSize: props?.xsFontSize || "8px",
    minWidth: props?.xsWidth || "20%",
    maxWidth: props?.xsWidth || "20%",
    height: props?.xsHeight || "",
    borderTop: props?.xsBorderColor ? `1px solid ${props?.xsBorderColor}` : "none",
    borderBottom: props?.xsBorderColor ? `1px solid ${props?.xsBorderColor}` : "none",
    borderRight: props?.xsBorderColor ? `1px solid ${props?.xsBorderColor}` : "none",
    borderRadius: props?.xsBorderRadius || "none",
    "&:first-of-type": {
      borderLeft: props?.xsBorderColor ? `1px solid ${props?.xsBorderColor}` : "none",
    },
  },
  "@media (min-width: 768px)": {
    color: theme.blue,
    fontSize: "14px",
    fontWeight: 700,
    minHeight: "50px",
    border: `1px solid ${theme.blue}`,
    borderLeft: "none",
    borderRadius: "12px 12px 0px 0px;",
    "&:first-of-type": {
      borderLeft: `1px solid ${theme.blue}`,
    },
    "& img": {
      display: "none",
    },
    minWidth: props?.mdWidth || "20%",
    maxWidth: props?.mdWidth || "20%",
  },
  "@media (min-width: 1024px)": {
    minWidth: props?.mdWidth || "20%",
    maxWidth: props?.mdWidth || "20%",
  },
  "@media (min-width: 1440px)": {
    fontSize: "20px",
    minWidth: props?.lgWidth || "20%",
    maxWidth: props?.lgWidth || "20%",
  },
}));
