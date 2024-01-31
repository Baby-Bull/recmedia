import React from "react";
import { Box, Grid, TextareaAutosize } from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "src/theme";

export const TextareaAutosizeCustom = styled(TextareaAutosize)({
  width: "100%",
  border: "none",
  resize: "none",
  fontSize: "16px",
  color: theme.navy,
  fontFamily: "Noto Sans JP,sans-serif",
  lineHeight: 1.5,
  backgroundColor: "#fff",
});

interface ILayoutComponentProps {
  value?: string;
}

export const ShowTextArea: React.SFC<ILayoutComponentProps> = ({ value }) => (
  <Box>
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "white",
        color: theme.navy,
        borderRadius: "12px",
        width: "100%",
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={12}>
          <TextareaAutosizeCustom value={value} disabled />
        </Grid>
      </Grid>
    </Box>
  </Box>
);
