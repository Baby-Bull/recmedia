import React from "react";
import { Box } from "@mui/material";

interface ILayoutComponentProps {
  children: React.ReactNode;
}

const LayoutComponent: React.SFC<ILayoutComponentProps> = ({ children }) => (
  <Box
    sx={{
      minHeight: "60vh",
      mt: ["86px", "66px"],
      mb: ["80px", "141px"],
      mx: ["20px", "8.4%"],
    }}
  >
    {children}
  </Box>
);
export default LayoutComponent;
