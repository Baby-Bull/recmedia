import { Box, Grid } from "@mui/material";
import React from "react";

interface BoxNodataProps {
  content: string;
}

const BoxNoDataComponent: React.SFC<BoxNodataProps> = ({ content }) => (
  <Box>
    <Grid item xs={12} sm={12} lg={12} xl={12}>
      <Box
        sx={{
          width: "100%",
          height: ["163px", "163px", "163px", "240px"],
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: ["16px", "16px", "16px", "18px"],
          fontWeight: 400,
        }}
      >
        {content}
      </Box>
    </Grid>
  </Box>
);
export default BoxNoDataComponent;
