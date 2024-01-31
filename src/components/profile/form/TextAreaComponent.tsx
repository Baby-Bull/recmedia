import * as React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import theme from "../../../theme";

export interface FieldProps {
  id?: string;
  placeholder?: string;
  /* The drop down items for the field */
  value?: any;
  error?: string;
  onChangeValue: Function;
  minRows?: number;
}

const FieldTextArea = styled(TextareaAutosize)({
  width: "100%",
  border: "none",
  backgroundColor: "#F4FDFF",
  fontSize: 16,
  fontFamily: "Noto Sans JP",
  padding: "9px 16px",
  borderRadius: "6px",
  resize: "vertical",
  "&::placeholder": {
    color: "#bdbdbd",
  },
  "@media (max-width: 1200px)": {
    fontSize: 14,
  },
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

export const FieldArea: React.SFC<FieldProps> = ({ id, placeholder, value, error, onChangeValue, minRows }) => (
  <Box>
    <FieldTextArea
      placeholder={placeholder}
      onChange={(e) => onChangeValue(id, e.target.value)}
      value={value}
      id={id}
      sx={{ border: error ? "solid 1px #FF9458" : "none" }}
      minRows={minRows}
    />
    {error ? <BoxTextValidate>{error}</BoxTextValidate> : null}
  </Box>
);
