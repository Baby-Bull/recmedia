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
      id={`simple-tabpanel-children-${index}`}
      aria-labelledby={`simple-tab-children-${index}`}
    >
      {value === index && <Box> {children}</Box>}
    </div>
  );
};

export const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

interface IChildTabCustomProps {
  props?: {
    fontSize: string;
    fontWeight?: number;
    smFontSize?: string;
    mdFontSize?: string;
    mdWidth?: string;
    xsFontSize?: string;
    xsWidth?: string;
  };
}

export const ChildTabCustom = styled(Tab)<IChildTabCustomProps>(({ props }) => ({
  padding: 0,
  color: "black",
  fontWeight: props?.fontWeight || 500,
  fontSize: props?.fontSize,
  "&.Mui-selected": {
    color: theme.blue,
    fontWeight: 700,
  },
  "@media (max-width: 425px)": {
    minWidth: props?.xsWidth || "",
    maxWidth: props?.xsWidth || "",
    fontSize: props?.xsFontSize || "",
  },
  "@media (min-width: 768px)": {
    fontSize: props?.smFontSize || "",
  },
  "@media (min-width: 1024px)": {
    marginRight: "12px",
    fontSize: props?.mdFontSize || "",
    minWidth: props?.mdWidth || "230px",
    maxWidth: "fit-content",
    "&.Mui-selected": {
      textDecoration: "underline",
    },
  },
}));
