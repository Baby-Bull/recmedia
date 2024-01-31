import React from "react";
import { Box, Grid, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "src/theme";

export const InputCustom = styled(InputBase)({
  backgroundColor: theme.whiteBlue,
  borderRadius: "6px",
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  "&.MuiInputBase-root": {
    marginLeft: "0px",
    "& .MuiInputBase-input": {
      "@media (max-width: 425px)": {
        fontSize: 14,
      },
      "&::-webkit-input-placeholder": {
        color: theme.gray,
        opacity: 1,
      },
      height: 36,
      paddingTop: 0,
      paddingBottom: 0,
      border: `2px solid transparent !important`,
      paddingLeft: "18px",
      "&:focus": {
        border: `2px solid ${theme.blue}`,
        borderRadius: "6px",
      },
    },
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

export const Field: React.SFC<ILayoutComponentProps> = ({ error, onChangeInput, id, placeholder, value }) => (
  <Box
    sx={{
      flexGrow: 1,
      backgroundColor: "white",
      color: theme.navy,
      borderRadius: "12px",
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <InputCustom
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeInput(id, e.target.value)}
          sx={{ ml: 1, flex: 1, border: error ? "solid 1px #FF9458" : "none" }}
        />
        {error ? <BoxTextValidate>{error}</BoxTextValidate> : null}
      </Grid>
    </Grid>
  </Box>
);
