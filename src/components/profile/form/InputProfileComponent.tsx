import * as React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import theme from "src/theme";

export interface FieldProps {
  id?: any;
  placeholder?: string;
  /* The drop down items for the field */
  value?: any;
  error?: string;
  onChangeValue: Function;
  type?: string;
  event?: any;
}

const InputCustom = styled(TextField)({
  width: "100%",
  fontFamily: "Noto Sans JP",
  borderRadius: "6px",
  "& fieldset": {
    border: "none",
  },
  "&:placeholder": {
    color: "red",
  },
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: "#F4FDFF",
    fontSize: 16,
    padding: "9px 16px",
    borderRadius: "6px",
    fontFamily: "Noto Sans JP",
    "@media (max-width: 1200px)": {
      fontSize: 14,
    },
    "&:focus": {
      boxShadow: `${theme.blue} 0 0 0 0.1rem`,
      borderColor: theme.blue,
    },
  },
});

const BoxTextValidate = styled(Box)({
  color: "#FF9458",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
});

export const Field: React.SFC<FieldProps> = ({ id, placeholder, value, error, onChangeValue, type, event }) => (
  <Box>
    <InputCustom
      placeholder={placeholder}
      onChange={(e) => onChangeValue(id, e.target.value, event)}
      value={value}
      id={id}
      sx={{ border: error ? "solid 1px #FF9458" : "none" }}
      type={type}
    />
    {error ? <BoxTextValidate>{error}</BoxTextValidate> : null}
  </Box>
);
