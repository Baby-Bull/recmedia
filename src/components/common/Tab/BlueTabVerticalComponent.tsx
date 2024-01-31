import React from "react";
import { Box, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "src/theme";
import useViewport from "src/helpers/useViewport";

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel = (props: ITabPanelProps) => {
  const { children, value, index } = props;

  const viewPort = useViewport();
  const isMobile = viewPort.width <= 425;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{
        backgroundColor: theme.whiteBlue,
        width: "100%",
        paddingBottom: isMobile ? "40px" : "170px",
      }}
    >
      {value === index && <Box> {children}</Box>}
    </div>
  );
};

export const a11yProps = (index: number) => ({
  id: `vertical-tab-${index}`,
  "aria-controls": `vertical-tabpanel-${index}`,
});

interface ITabCustomProps {
  props?: {
    xsWidth?: string;
    smWidth?: string;
  };
}

export const TabCustom = styled(Tab)<ITabCustomProps>(({ props }) => ({
  height: "48px",
  color: theme.navy,
  fontWeight: 500,
  minWidth: props?.smWidth || "20%",
  maxWidth: props?.smWidth || "20%",
  "&.Mui-selected": {
    "&": {
      backgroundColor: theme.blue,
      fontWeight: 700,
    },
    color: "white",
  },
  "@media (max-width: 425px)": {
    "&:first-of-type": {
      borderLeft: `1px solid ${theme.lightGray}`,
    },
    height: "78px",
    backgroundColor: "white",
    borderTop: `1px solid ${theme.lightGray}`,
    borderBottom: `1px solid ${theme.lightGray}`,
    borderRight: `1px solid ${theme.lightGray}`,
    minWidth: props?.xsWidth,
    maxWidth: props?.xsWidth,
  },
  "@media (min-width: 768px)": {
    marginBottom: "20px",
    borderRadius: "12px 0 0 12px",
    paddingLeft: "26px",
    alignItems: "flex-start",
  },
}));
