import React from "react";
import { Box, Typography } from "@mui/material";

import theme from "src/theme";

interface IEmptyComponentProps {
  text: string;
  text2?: string;
  text3?: string;
  text4?: string;
  text5?: string;
  handleChangeTab?: any;
}

const EmptyComponent: React.SFC<IEmptyComponentProps> = ({ text, text2, text3, text4, text5, handleChangeTab }) => (
  <Box
    sx={{
      mx: ["20px", 0],
      height: { sm: "490px" },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: ["12px", "0px 0px 12px 12px"],
    }}
  >
    <Typography
      sx={{
        my: "80px",
        fontSize: [14, 16],
        fontWeight: 400,
        textAlign: "center",
        px: "10px",
      }}
    >
      {text}
      <br />
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {text2}
        <Box sx={{ color: theme.blue, cursor: "pointer" }} onClick={() => handleChangeTab(0)}>
          {text3}
        </Box>
        {text4}
        <Box>{text5}</Box>
      </Box>
    </Typography>
  </Box>
);
export default EmptyComponent;
