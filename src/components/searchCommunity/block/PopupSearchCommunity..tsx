import {
  Avatar,
  Grid,
  Box,
  Button,
  Checkbox,
  Typography,
  Select,
  MenuItem,
  FormControlLabel,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import { numberOfLogins, numberOfParticipants } from "src/constants/searchCommunityConstants";
import styles from "src/components/searchUser/search_user.module.scss";
import theme from "src/theme";

interface ISearchCommunityProps {
  inputTags: any;
  statusOrder: any;
  formSearch: any;
  showPopup: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowPopup: (status: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setFormSearch: Function;
  // eslint-disable-next-line no-unused-vars
  setInputTags: Function;
  // eslint-disable-next-line no-unused-vars
  fetchCommunity: Function;
}

/* event change select option */
const DialogSearch = styled(Dialog)({
  "& .MuiPaper-root": {
    maxWidth: "100%",
  },
  "& .MuiDialog-paper": {
    backgroundColor: `${theme.whiteBlue}`,
    borderRadius: "12px",
    width: "44.44%",
    margin: 0,
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingBottom: "40px",
  },
  "@media (max-width: 1200px)": {
    "& .MuiDialog-paper": {
      width: "93%",
      paddingLeft: "20px",
      paddingRight: "20px",
    },
  },
});

const SelectCustom = styled(Select)({
  borderRadius: 6,
  width: "100%",
  height: "40px",
  color: theme.gray,
  marginBottom: "20px",
  "&:hover": {
    borderRadius: 6,
  },
  "& .MuiSelect-select": {
    position: "relative",
    fontSize: 14,
    padding: "10px 11px",
    borderRadius: "12px",
    fontFamily: "Noto Sans",
    background: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #989EA8",
  },
});
const FormControlLabelCustom = styled(FormControlLabel)({
  paddingTop: "16px",
  "& .MuiCheckbox-root": {
    padding: "0px 8px 0 9px",
    color: "#989EA8",
  },
  "& .MuiButtonBase-root-MuiCheckbox-root": {
    color: theme.gray,
  },
  "& .Mui-checked": {
    color: "#03BCDB !important",
  },
});

const PopupSearchCommunity: React.SFC<ISearchCommunityProps> = ({
  inputTags,
  formSearch,
  statusOrder,
  showPopup,
  fetchCommunity,
  setShowPopup,
  setInputTags,
  setFormSearch,
}) => {
  const { t } = useTranslation();
  const [valueInput, setValueInput] = useState<any>(null);

  const handleFetchCommunity = async () => {
    fetchCommunity([], "", statusOrder);
    setShowPopup(false);
  };

  const removeSearchTag = (indexRemove) => {
    setInputTags(inputTags.filter((_, index) => index !== indexRemove));
  };

  const onKeyPress = (e) => {
    if (valueInput?.length <= 20) {
      if (e.key === "Enter" && e.target.value) {
        setInputTags([...inputTags, e.target.value]);
        (document.getElementById("input_search_tag") as HTMLInputElement).value = "";
      }
    }
  };

  const handleChangeInputSearch = (e, key) => {
    setFormSearch({
      ...formSearch,
      [key]: e.target.value,
    });
  };

  // @ts-ignore
  return (
    <Box>
      <DialogSearch
        open={showPopup}
        onClose={() => setShowPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            m: { xs: "8px -14px 0 0", lg: "8px -32px 0 0" },
            cursor: "pointer",
          }}
          onClick={() => setShowPopup(false)}
        >
          <Avatar sx={{ float: "right" }} src="/assets/images/icon/ic_close.png" />
        </Box>
        <DialogTitle sx={{ p: "0 0 40px 0" }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: "24px",
              textAlign: "center",
            }}
          >
            詳細検索
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: "0" }}>
          <Grid sx={{ p: "0!important" }} className={styles.boxContainer}>
            <Box>
              <Box className={styles.boxSearchLeft}>
                <div className={styles.blockInputTag}>
                  <Paper
                    className="paper-search-tag"
                    sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: { sm: "100%", md: 240 } }}
                  >
                    <IconButton sx={{ p: "10px" }} aria-label="menu">
                      <img src="/assets/images/svg/ic_search_blue.svg" alt="ic_search" width="18px" height="22px" />
                    </IconButton>
                    <InputBase
                      className="input-search-tag"
                      id="input_search_tag"
                      onKeyPress={onKeyPress}
                      sx={{ flex: 1 }}
                      placeholder={t("community-search:input-tag-placeholder")}
                      onChange={(e) => setValueInput(e.target.value)}
                    />
                  </Paper>
                  {valueInput?.length > 20 && (
                    <p style={{ color: "red", fontSize: "12px", margin: "5px 0px" }}>
                      {t("community-search:validate-search-form.input-length")}
                    </p>
                  )}
                  <div className="tags">
                    <ul>
                      {inputTags?.map((tag, index) => (
                        <li key={index}>
                          {tag}{" "}
                          <IconButton className="button-remove-icon" onClick={() => removeSearchTag(index)}>
                            <img src="/assets/images/svg/delete-x-white.svg" alt="ic_delete" width="8px" height="8px" />
                          </IconButton>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* numberOfLogin */}
                <SelectCustom
                  value={formSearch?.login_count}
                  onChange={(e) => handleChangeInputSearch(e, "login_count")}
                >
                  {numberOfLogins.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </SelectCustom>

                {/* numberOfParticipant */}
                <SelectCustom
                  value={formSearch?.member_count}
                  onChange={(e) => handleChangeInputSearch(e, "member_count")}
                >
                  {numberOfParticipants.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </SelectCustom>

                <FormControlLabelCustom
                  control={
                    <Checkbox
                      checked={formSearch?.excludejoinedCommunities}
                      onChange={() =>
                        setFormSearch({
                          ...formSearch,
                          excludejoinedCommunities: !formSearch?.excludejoinedCommunities,
                        })
                      }
                    />
                  }
                  label={t("community-search:label-checkbox-1").toString()}
                />

                <Button className="btn-user-search btn-search" fullWidth onClick={handleFetchCommunity}>
                  {t("community-search:btn-search")}
                </Button>
              </Box>
            </Box>
          </Grid>
        </DialogContent>
      </DialogSearch>
    </Box>
  );
};
export default PopupSearchCommunity;
