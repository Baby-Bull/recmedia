import * as React from "react";
import {
  InputLabel,
  InputBase,
  FormControl,
  Select,
  MenuItem,
  FormGroup,
  Checkbox,
  Link,
  Box,
  Typography,
  Chip,
  Paper,
  Avatar,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DatePicker";
import { styled } from "@mui/material/styles";
import { ja } from "date-fns/locale";
import dayjs from "dayjs";

import theme from "src/theme";
import { VALIDATE_MESSAGE_FORM_REGISTER } from "src/messages/validate";

type Editor = "textbox" | "dropdown" | "checkbox" | "multi-selection" | "date-picker";

export interface IOptionProps {
  label: string;
  value: string;
}
export interface IFieldProps {
  required?: boolean;
  id: string;
  label?: string;
  placeholder?: string;
  editor?: Editor;
  /* The drop down items for the field */
  options?: IOptionProps[];
  value?: any;
  // eslint-disable-next-line no-unused-vars
  onChangeValue?: (key: string, value: any) => void;
  onChangeCheckbox?: () => void;
  error?: string;
}

interface IPlaceholderProps {
  children: any;
}
const Placeholder: React.SFC<IPlaceholderProps> = ({ children }) => (
  <div style={{ fontSize: "14px", color: "#989EA8" }}>{children}</div>
);

const InputCustom = styled(InputBase)({
  "& ::placeholder": {
    color: "black!important",
  },
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: "white",
    border: `1px solid ${theme.blue}`,
    fontSize: "14px",
    height: "fit-content!important",
    padding: "10px 12px",
    borderRadius: "12px",
    fontFamily: "Noto Sans JP",
    "@media (max-width: 425px)": {
      width: 294,
      height: 38,
    },
    "@media (min-width: 769px)": {
      width: 360,
      height: 18,
    },
    "&:focus": {
      boxShadow: `${theme.blue} 0 0 0 0.1rem`,
      borderColor: theme.blue,
      borderRadius: "12px",
    },
  },
});

const SelectCustom = styled(Select)({
  marginTop: "0!important",
  borderRadius: "12px",
  borderColor: theme.blue,
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "400",
  "&:hover": {
    borderRadius: 12,
    borderColor: theme.blue,
  },
  "& .MuiSelect-select": {
    position: "relative",
    backgroundColor: "white",
    border: `1px solid ${theme.blue}`,
    fontSize: 14,
    padding: "10px 12px",
    borderRadius: 12,
    fontFamily: "Noto Sans JP",
    "@media (max-width: 425px)": {
      height: "fit-content",
    },
    "@media (min-width: 769px)": {
      height: 18,
    },
    "&:focus": {
      boxShadow: `${theme.blue} 0 0 0 0.1rem`,
      borderColor: theme.blue,
      borderRadius: "12px",
    },
  },
});

const ListItem = styled("li")({
  margin: "2px 2px",
  cursor: "pointer",
});

export const Field: React.SFC<IFieldProps> = ({
  required,
  id,
  label,
  placeholder,
  editor,
  options,
  value,
  error,
  onChangeValue,
  onChangeCheckbox,
}) => {
  const handleDeleteTagItem = (tag: string) => () => {
    const tags = value.filter((item: string) => item !== tag);
    if (onChangeValue) {
      onChangeValue("tags", tags);
    }
  };

  const [errorElement, setErrorElement] = React.useState(null);

  const onValidateDate = (tempValue: any) => {
    if (
      JSON.stringify(tempValue) === "null" ||
      new Date().getFullYear() < tempValue?.getFullYear() ||
      tempValue?.getFullYear() < 1900
    ) {
      onChangeValue("birthday", {
        dob_value: "",
        error_invalid: true,
      });
    } else {
      onChangeValue("birthday", {
        dob_value: dayjs(tempValue).format("YYYY-MM-DD"),
        error_invalid: false,
      });
    }
  };

  const onKeyPressInputTag = (e: any) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      if (onChangeValue && !value.includes(e.target.value.trim())) {
        if (e.target.value.length > 20) {
          setErrorElement(VALIDATE_MESSAGE_FORM_REGISTER.tags.max_length);
        } else {
          setErrorElement(null);
          onChangeValue("tags", [...value, e.target.value]);
          (document.getElementById("input_tag") as HTMLInputElement).value = "";
        }
      }
    }
  };
  const [listChipData] = React.useState([
    { key: 0, label: "React" },
    { key: 1, label: "Ruby on Rails" },
    { key: 2, label: "Python" },
    { key: 3, label: "要件定義" },
    { key: 4, label: "駆け出しエンジニアと繋がりたい" },
    { key: 5, label: "技術相談をしたい" },
    { key: 6, label: "サーバーサイドエンジニア" },
    { key: 7, label: "レビュー" },
  ]);
  const onClickTagChip = (tag: string) => {
    if (onChangeValue && !value.includes(tag)) {
      onChangeValue("tags", [...value, tag]);
    }
  };
  const checkTagSelected = (tag: string) => {
    if (onChangeValue && !value?.includes(tag)) {
      return false;
    }
    return true;
  };

  const [date, setDate] = React.useState(null);
  const [valueDropdown, setValueDropdown] = React.useState<any>();

  return (
    <React.Fragment>
      <Box
        className="form-group"
        sx={{
          display: "flex",
          justifyContent: "center",
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
          },
        }}
      >
        {editor!.toLowerCase() === "textbox" && (
          <FormControl sx={{ pt: "20px", mt: ["25px", "20px"] }} variant="standard">
            <InputLabel
              shrink
              htmlFor={id}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "black",
              }}
            >
              <Box
                sx={{
                  fontFamily: "Noto Sans JP",
                  fontSize: "18px",
                }}
                display="flex"
              >
                {label}
                <Chip
                  label="必須"
                  sx={{
                    display: required ? "" : "none",
                    ml: 1,
                    width: "54px",
                    height: "22px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "white",
                    backgroundColor: theme.orange,
                  }}
                />
              </Box>
            </InputLabel>
            <InputCustom
              placeholder={placeholder}
              defaultValue={value}
              id={id}
              onChange={(e) => onChangeValue(id, e.target.value)}
            />
          </FormControl>
        )}

        {editor!.toLowerCase() === "dropdown" && (
          <FormControl sx={{ pt: "20px", mt: ["25px", "20px"], width: "100%" }} variant="standard">
            <InputLabel
              shrink
              htmlFor={id}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "black",
              }}
            >
              <Box
                sx={{
                  fontFamily: "Noto Sans JP",
                  fontSize: "18px",
                  display: "flex",
                }}
              >
                {label}
                <Chip
                  label="必須"
                  sx={{
                    display: required ? "" : "none",
                    ml: 1,
                    width: "54px",
                    height: "22px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "white",
                    backgroundColor: theme.orange,
                  }}
                />
              </Box>
            </InputLabel>
            <SelectCustom
              disableUnderline
              autoWidth={false}
              value={value}
              onChange={(e) => {
                onChangeValue(id, e.target.value);
                setValueDropdown(e.target.value);
              }}
              displayEmpty
              renderValue={valueDropdown ? undefined : () => <Placeholder>選択してください</Placeholder>}
              // defaultValue={options[0]?.value}
            >
              {options &&
                options.map((option, index) => (
                  <MenuItem key={index} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                ))}
            </SelectCustom>
          </FormControl>
        )}

        {editor!.toLowerCase() === "multi-selection" && (
          <FormControl
            variant="standard"
            sx={{
              pt: "20px",
              mt: ["25px", "20px"],
            }}
          >
            <Paper
              sx={{
                pl: "18px",
                mt: 1,
                mb: 4,
                pb: "15px",
                maxWidth: "360px",
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                boxShadow: "none",
                borderRadius: "12px",
              }}
              component="ul"
            >
              <Box
                sx={{
                  width: "100%",
                  pl: "4px",
                  pt: "7px",
                  color: theme.blue,
                  fontSize: 12,
                  fontWeight: 400,
                  textAlign: "left",
                }}
              >
                よく使用されているタグ
              </Box>
              {listChipData.map((data) => {
                let icon;
                return (
                  <ListItem
                    key={data.key}
                    onClick={() => {
                      onClickTagChip(data.label);
                    }}
                  >
                    <Chip
                      variant={checkTagSelected(data.label) ? "filled" : "outlined"}
                      size="small"
                      icon={icon}
                      label={data.label}
                      sx={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: theme.gray,
                        borderRadius: "4px",
                      }}
                    />
                  </ListItem>
                );
              })}
            </Paper>

            <InputLabel
              shrink
              htmlFor={id}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "black",
              }}
            >
              <Box
                sx={{
                  fontFamily: "Noto Sans JP",
                  fontSize: "18px",
                  display: "flex",
                }}
              >
                {label}
                <Chip
                  label="必須"
                  sx={{
                    display: required ? "" : "none",
                    ml: 1,
                    width: "54px",
                    height: "22px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "white",
                    backgroundColor: theme.orange,
                  }}
                />
              </Box>
            </InputLabel>
            <InputCustom placeholder={placeholder} id="input_tag" onKeyPress={onKeyPressInputTag} />

            {errorElement && (
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "orange",
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
                  },
                }}
              >
                {errorElement}
              </Typography>
            )}
            {value?.length > 0 && (
              <Box
                sx={{
                  pl: 0,
                  mt: 1,
                  mb: 5,
                  display: "flex",
                  flexWrap: "wrap",
                  listStyle: "none",
                  boxShadow: "none",
                }}
                component="ul"
              >
                {value?.map((item) => {
                  let icon;

                  return (
                    <ListItem key={item}>
                      <Chip
                        icon={icon}
                        label={item}
                        onDelete={handleDeleteTagItem(item)}
                        deleteIcon={
                          <Avatar
                            src="/assets/images/svg/delete.svg"
                            sx={{
                              width: "16px",
                              height: "16px",
                              p: "4px",
                              backgroundColor: "white",
                            }}
                          />
                        }
                        sx={{
                          pr: 1,
                          fontSize: 12,
                          fontWeight: 500,
                          color: "white",
                          height: "22px",
                          backgroundColor: theme.blue,
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      />
                    </ListItem>
                  );
                })}
              </Box>
            )}
          </FormControl>
        )}

        {editor!.toLowerCase() === "checkbox" && (
          <FormGroup
            sx={{
              display: "-webkit-box!important",
            }}
          >
            <Checkbox
              onChange={onChangeCheckbox}
              size="small"
              sx={{
                marginTop: "3px",
                color: theme.blue,
                "&.Mui-checked": { color: theme.blue },
              }}
            />
            <p
              style={{
                fontSize: "12px",
                display: "flex",
              }}
            >
              <Link
                href="https://ruddy-muenster-a17.notion.site/f7dee0adb1d54cf59f025cd8cbc73c89"
                target="_blank"
                color="secondary"
              >
                <Box color={theme.blue}>利用規約</Box>
              </Link>
              {label}
            </p>
          </FormGroup>
        )}

        {editor!.toLowerCase() === "date-picker" && (
          <FormControl sx={{ pt: "20px", mt: ["25px", "20px"], width: "100%" }} variant="standard">
            <InputLabel
              shrink
              htmlFor={id}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "black",
              }}
            >
              <Box
                sx={{
                  fontFamily: "Noto Sans JP",
                  fontSize: "18px",
                  display: "flex",
                }}
              >
                {label}
                <Chip
                  label="必須"
                  sx={{
                    display: required ? "" : "none",
                    ml: 1,
                    width: "54px",
                    height: "22px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "white",
                    backgroundColor: theme.orange,
                  }}
                />
              </Box>
            </InputLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja}>
              <DesktopDatePicker
                maxDate={new Date()}
                value={date}
                inputFormat="yyyy/MM/dd"
                mask="____/__/__"
                onChange={(newValue) => {
                  onValidateDate(newValue);
                  setDate(newValue);
                }}
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
                      "& ::placeholder": {
                        color: "#989EA8",
                      },
                    }}
                  >
                    <input
                      style={{
                        outlineStyle: "none",
                        borderStyle: "none",
                        fontSize: "14px",
                        width: "100%",
                      }}
                      placeholder="クリックして日付を選択"
                      ref={inputRef}
                      {...inputProps}
                    />
                    {InputProps?.endAdornment}
                  </Box>
                )}
              />
            </LocalizationProvider>
          </FormControl>
        )}
      </Box>
      {error && (
        <Typography
          sx={{
            fontSize: "10px",
            color: "orange",
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
            },
          }}
        >
          {error}
        </Typography>
      )}
    </React.Fragment>
  );
};
