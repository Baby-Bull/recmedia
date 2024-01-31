import React from "react";
import { Box, Grid, TextareaAutosize } from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "src/theme";

export const TextareaAutosizeCustom = styled(TextareaAutosize)({
  backgroundColor: theme.whiteBlue,
  width: "100%",
  resize: "vertical",
  minHeight: "80px",
  border: `2px solid transparent`,
  borderRadius: "6px",
  fontFamily: "Noto Sans JP",
  color: theme.navy,
  fontSize: 14,
  paddingLeft: "18px",
  // height: "100% !important",
  "&::-webkit-input-placeholder": {
    color: theme.gray,
  },
  "@media (min-width: 768px)": {
    fontSize: 16,
  },
  "&:focus-visible": {
    border: `2px solid ${theme.blue}`,
    outline: "none",
  },
});

const BoxTextValidate = styled(Box)({
  color: "#FF9458",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
});

interface ILayoutComponentProps {
  error?: string;
  id?: string;
  placeholder?: string;
  onChangeInput?: Function;
  value?: string;
}

export const TextArea: React.SFC<ILayoutComponentProps> = ({ error, onChangeInput, id, placeholder, value }) => (
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
          <TextareaAutosizeCustom
            placeholder={placeholder}
            onChange={(e) => onChangeInput(id, e.target.value)}
            value={value}
            sx={{ border: error ? "solid 1px #FF9458" : "none", minHeight: ["240px", "80px"] }}
          />
        </Grid>
      </Grid>
    </Box>
    {error ? <BoxTextValidate>{error}</BoxTextValidate> : null}
  </Box>
);
