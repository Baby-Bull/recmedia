import * as React from "react";
import { InputLabel, InputBase, FormControl, Select, MenuItem, Box, Grid, Typography } from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DatePicker";
import { styled } from "@mui/material/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { ja } from "date-fns/locale";

import theme from "src/theme";

type Editor = "textbox" | "dropdown" | "checkbox" | "multi-selection" | "textarea" | "date-picker";

export interface FieldProps {
  required?: boolean;
  id: string;
  label?: string;
  placeholder?: string;
  editor?: Editor;
  /* The drop down items for the field */
  options?: Array<any>;
  value?: any;
  error?: string;
  onChangeValue: Function;
  readOnly?: boolean;
}

const InputCustom = styled(InputBase)({
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: "white",
    border: `1px solid ${theme.blue}`,
    fontSize: 14,
    padding: "10px 8px",
    borderRadius: 12,
    fontFamily: "Noto Sans JP",
    "&:focus": {
      boxShadow: `${theme.blue} 0 0 0 0.1rem`,
      borderColor: theme.blue,
    },
  },
});

const SelectCustom = styled(Select)({
  borderRadius: 12,
  borderColor: theme.blue,
  "&:before": {
    display: "none",
  },
  "&:hover": {
    borderRadius: 12,
    borderColor: theme.blue,
  },
  "&:focus-visible": {
    outline: "none",
  },
  "& .MuiSelect-select": {
    position: "relative",
    backgroundColor: "white",
    border: `1px solid ${theme.blue}`,
    fontSize: 14,
    padding: "8px 10px",
    borderRadius: 12,
    fontFamily: "Noto Sans JP",
    "&:focus": {
      borderRadius: 12,
      boxShadow: `${theme.blue} 0 0 0 0.1rem`,
      borderColor: theme.blue,
    },
  },
});

const labelStyle = {
  display: "flex",
  alignItems: "center",
  color: "black",
  fontWeight: "bold",
  fontSize: "16px",
  lineHeight: "48px",
};
export const Field: React.SFC<FieldProps> = ({
  required,
  id,
  label,
  placeholder,
  editor,
  options,
  value,
  error,
  onChangeValue,
}) => {
  const [date, setDate] = React.useState(new Date());

  return (
    <React.Fragment>
      <Box
        className="form-group"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "32px",
        }}
      >
        {editor!.toLowerCase() === "textbox" && (
          <FormControl variant="standard" fullWidth>
            <Grid container>
              <Grid item md={3} xs={12} sx={{ height: "40px" }}>
                <InputLabel shrink htmlFor={id} sx={labelStyle}>
                  <Box display="flex">
                    {label}
                    {required && <span className="input-required-mark">＊</span>}
                  </Box>
                </InputLabel>
              </Grid>
              <Grid item md={9} xs={12}>
                <InputCustom
                  placeholder={placeholder}
                  defaultValue={value}
                  id={id}
                  onChange={(e) => onChangeValue(id, e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>
        )}

        {editor!.toLowerCase() === "textarea" && (
          <FormControl variant="standard" fullWidth>
            <Grid container>
              <Grid item md={12} xs={12} sx={{ height: "40px" }}>
                <InputLabel shrink htmlFor={id} sx={labelStyle}>
                  <Box display="flex">
                    {label}
                    {required && <span className="input-required-mark">＊</span>}
                  </Box>
                </InputLabel>
              </Grid>
              <Grid item md={12} xs={12}>
                <InputCustom
                  multiline
                  rows={10}
                  placeholder={placeholder}
                  defaultValue={value}
                  id={id}
                  onChange={(e) => onChangeValue(id, e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>
        )}

        {editor!.toLowerCase() === "dropdown" && (
          <FormControl variant="standard" fullWidth>
            <Grid container>
              <Grid item md={12} xs={12} sx={{ height: "40px" }}>
                <InputLabel shrink htmlFor={id} sx={labelStyle}>
                  <Box display="flex">
                    {label}
                    {required && <span className="input-required-mark">＊</span>}
                  </Box>
                </InputLabel>
              </Grid>
              <Grid item md={12} xs={12}>
                <SelectCustom
                  autoWidth={false}
                  value={value}
                  defaultValue={options[0]?.value}
                  placeholder={placeholder}
                  onChange={(e) => onChangeValue(id, e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  {options &&
                    options.map((option, index) => (
                      <MenuItem sx={{ fontSize: "14px" }} key={index} value={option?.value}>
                        {option?.label}
                      </MenuItem>
                    ))}
                </SelectCustom>
              </Grid>
            </Grid>
          </FormControl>
        )}

        {editor!.toLowerCase() === "date-picker" && (
          <FormControl variant="standard" fullWidth>
            <Grid container>
              <Grid item md={3} xs={12} sx={{ height: "40px" }}>
                <InputLabel shrink htmlFor={id} sx={labelStyle}>
                  <Box display="flex">
                    {label}
                    {required && <span className="input-required-mark">＊</span>}
                  </Box>
                </InputLabel>
              </Grid>
              <Grid item md={9} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja}>
                  <DesktopDatePicker
                    minDate={new Date()}
                    value={date}
                    inputFormat="yyyy/MM/dd"
                    onChange={(newValue) => {
                      onChangeValue(id, newValue?.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }));
                      setDate(newValue);
                    }}
                    // renderInput={(params) => (
                    //   <Box
                    //     sx={{
                    //       backgroundColor: "white",
                    //       border: `1px solid ${theme.blue}`,
                    //       padding: "10px 12px",
                    //       borderRadius: "12px",
                    //       fontFamily: "Noto Sans JP",
                    //       alignItems: "center",
                    //       display: "flex",
                    //     }}
                    //   >
                    //     <TextField
                    //       fullWidth
                    //       {...params}
                    //       inputProps={{
                    //         ...params.inputProps,
                    //         placeholder: "日日/月月/年年年年"
                    //       }}
                    //       variant="standard"
                    //       InputProps={{
                    //         disableUnderline: true,
                    //       }}
                    //     />
                    //     {params.InputProps?.endAdornment}
                    //   </Box>
                    // )}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <Box
                        sx={{
                          backgroundColor: "white",
                          border: `1px solid ${theme.blue}`,
                          padding: "10px 12px",
                          borderRadius: "12px",
                          fontFamily: "Noto Sans JP",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <input
                          style={{
                            outlineStyle: "none",
                            borderStyle: "none",
                            fontSize: "16px",
                            width: "100%",
                          }}
                          placeholder="クリックして日付を選択"
                          ref={inputRef}
                          {...inputProps}
                          readOnly
                        />
                        {InputProps?.endAdornment}
                      </Box>
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </FormControl>
        )}
      </Box>
      {error && (
        <Typography
          sx={{
            fontSize: "10px",
            color: theme.orange,
            textAlign: editor === "checkbox" ? "center" : "left",
            "&": {
              "@media (max-width: 425px)": {
                maxWidth: 320,
              },
              "@media (min-width: 768px)": {
                maxWidth: 220,
              },
              "@media (min-width: 1024px)": {
                maxWidth: 320,
              },
              "@media (min-width: 900px)": {
                marginLeft: "150px",
              },
            },
          }}
        >
          {error}
        </Typography>
      )}
    </React.Fragment>
  );
};
