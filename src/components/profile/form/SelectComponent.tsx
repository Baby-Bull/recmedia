import * as React from "react";
import { Box, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";

import theme from "src/theme";

export interface FieldProps {
  id?: string;
  /* The drop down items for the field */
  value?: any;
  error?: string;
  onChangeValue: Function;
  options?: Array<any>;
}

const SelectCustom = styled(Select)({
  borderRadius: 6,
  width: "46%",
  height: "40px",
  "& fieldset": {
    border: "none",
  },
  borderColor: theme.whiteBlue,
  "&:hover": {
    borderRadius: 6,
    borderColor: theme.whiteBlue,
  },
  "@media (max-width: 1200px)": {
    width: "100%",
  },
  "& .MuiSelect-select": {
    position: "relative",
    backgroundColor: `${theme.whiteBlue}`,
    border: `1px solid ${theme.whiteBlue}`,
    fontSize: 16,
    padding: "9px 16px",
    borderRadius: 6,
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

export const FieldSelect: React.SFC<FieldProps> = ({ id, value, error, onChangeValue, options }) => (
  <Box>
    <SelectCustom
      value={value}
      defaultValue={options[0]?.value}
      onChange={(e) => onChangeValue(id, e.target.value)}
      displayEmpty
      sx={{ color: value ? "#1A2944" : "#b8bfc0", border: error ? "solid 1px #FF9458" : "none", height: "45px" }}
    >
      {options &&
        options.map((option, index) => (
          <MenuItem sx={{ fontSize: "14px" }} key={index} value={option?.value}>
            {option?.label}
          </MenuItem>
        ))}
    </SelectCustom>
    {error ? <BoxTextValidate>{error}</BoxTextValidate> : null}
  </Box>
);
