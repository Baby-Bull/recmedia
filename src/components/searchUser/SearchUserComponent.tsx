import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { connect } from "react-redux";

import styles from "src/components/searchUser/search_user.module.scss";
import theme from "src/theme";
import { jobs, employeeStatus, lastLogins, reviews } from "src/constants/searchUserConstants";
import useViewport from "src/helpers/useViewport";
import {
  UserSearch,
  getUserFavoriteTags,
  getUserProvince,
  getUserRecentlyLogin,
  getUserNewMembers,
} from "src/services/user";
import { searchUserActions } from "src/store/actionTypes";
import { SearchFormStatus } from "src/constants/constants";

import BoxItemUserComponent from "./BoxItemUserComponent";
import PopupSearchUser from "./block/PopupSearchUser";

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
  "& .MuiCheckbox-root": {
    padding: "0 8px 0 9px",
    color: "#989EA8",
  },
  "& .MuiButtonBase-root-MuiCheckbox-root": {
    color: theme.gray,
  },
  "& .Mui-checked": {
    color: "#03BCDB !important",
  },
});

const initalFormData = {
  job: jobs[0]?.value,
  employeeStatus: employeeStatus[0]?.value,
  lastLogin: lastLogins[0]?.value,
  review: reviews[0]?.value,
  statusCanTalk: false,
  statusLookingForFriend: false,
  statusNeedConsult: false,
};

type Props = {
  scrollPosition: number;
  formStatus: SearchFormStatus;
  form: {
    job: string | number;
    employeeStatus: string | number;
    lastLogin: number;
    review: number;
    statusCanTalk: boolean;
    statusLookingForFriend: boolean;
    statusNeedConsult: boolean;
    tags: string[];
  };
  result: {
    limit: number;
    cursor: string;
    items: any[];
    sort: string;
    hasMore: boolean;
  };
  // eslint-disable-next-line no-unused-vars
  updateForm: (formData: any) => void;
  // eslint-disable-next-line no-unused-vars
  updateResult: (result: any) => void;
  // eslint-disable-next-line no-unused-vars
  updateScrollPosition: (position: number) => void;
  clearForm: () => void;
};

const SearchUserComponent: FC<Props> = ({
  scrollPosition,
  form,
  result,
  formStatus,
  updateForm,
  updateResult,
  updateScrollPosition,
  clearForm,
}) => {
  const { t } = useTranslation();
  // Responsive
  const viewPort = useViewport();
  const isMobile = viewPort.width <= 992;
  const router = useRouter();
  const LIMIT = 6;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fullText = router.query?.fulltext;
  const { items: users, cursor: nextCursor, hasMore, sort } = result;
  const { tags, ...formSearch } = form;
  const [showPopupSearchUser, setShowPopupSearchUser] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState<any>(null);
  const [routerQuerySort, setRouterQuerySort] = useState<string | string[] | boolean>(router.query?.sortType);
  const [triggerTheFirstFetching, setTriggerTheFirstFetching] = React.useState<boolean>(true);

  const fetchData = async (typeSort: string = "", arrayResult: Array<any> = [], cursor: string = "") => {
    setIsLoading(true);
    const res = await UserSearch(formSearch, tags, fullText, typeSort, LIMIT, cursor);
    const items = arrayResult.concat(res?.items);
    setIsLoading(false);
    setRouterQuerySort(undefined);
    setTriggerTheFirstFetching(false);
    updateResult({
      items,
      cursor: res?.cursor,
      hasMore: res?.hasMore,
      sort: typeSort,
    });
  };

  const fetchDataWithOptionFromHomepage = async (arrayResult: Array<any> = [], cursor: string = "") => {
    setIsLoading(true);
    let res: any;
    if (routerQuerySort) {
      switch (routerQuerySort) {
        case "sortByTags":
          res = await getUserFavoriteTags(LIMIT, cursor);
          break;
        case "sortByArea":
          res = await getUserProvince(LIMIT, cursor);
          break;
        case "sortByLogin":
          res = await getUserRecentlyLogin(LIMIT, cursor);
          break;
        case "sortByRegistration":
          res = await getUserNewMembers(LIMIT, cursor);
          break;
        default:
          res = await UserSearch(formSearch, tags, fullText, "", LIMIT, "");
          break;
      }
      const items = arrayResult.concat(res?.items);
      setTriggerTheFirstFetching(false);
      setIsLoading(false);
      updateResult({
        items,
        cursor: res?.cursor,
        hasMore: res?.hasMore,
      });
    }
  };

  const handleClickHasMore = () => {
    setTriggerTheFirstFetching(false);
    if (routerQuerySort) {
      fetchDataWithOptionFromHomepage(users, nextCursor);
    } else if (triggerTheFirstFetching) fetchData(sort, users, "");
    else fetchData(sort, users, nextCursor);
  };

  const handleSort = async (typeSort: string) => {
    fetchData(typeSort, [], "");
  };

  const removeSearchTag = (indexRemove: number) => {
    const filterdTags = tags.filter((_, index) => index !== indexRemove);
    updateForm({ tags: filterdTags });
  };

  const onKeyPress = (e: any) => {
    if (valueInput?.length <= 20) {
      if (e.key === "Enter" && e.target.value) {
        const newTags = [...tags, e.target.value];
        updateForm({ tags: newTags });
        (document.getElementById("input_search_tag") as HTMLInputElement).value = "";
      }
    }
  };

  const handleChangeInputSearch = (e, key) => {
    const formSearchData = {
      ...formSearch,
      [key]: e.target.value,
    };
    updateForm(formSearchData);
  };

  const clearFormSearch = async () => {
    clearForm();
    setIsLoading(true);
    const res = await UserSearch(initalFormData, [], fullText, "", LIMIT, "");
    updateResult({
      items: res?.items,
      cursor: res?.cursor,
      hasMore: res?.hasMore,
      sort: "recommended",
    });
    setIsLoading(false);
  };

  const onPopupSetInput = (newTags) => {
    updateForm({ tags: newTags });
  };

  const onPopupSetFormSearch = (formData) => {
    updateForm(formData);
  };

  useEffect(() => {
    setTriggerTheFirstFetching(true);
    if (routerQuerySort) {
      fetchDataWithOptionFromHomepage([], "");
    } else {
      if (fullText !== undefined) {
        clearFormSearch();
      }
      if (formStatus === SearchFormStatus.Init) {
        fetchData(sort, [], "");
      }
    }
  }, [fullText, routerQuerySort]);

  useLayoutEffect(() => {
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
    return () => {
      updateScrollPosition(document.documentElement.scrollTop);
    };
  }, []);

  return (
    <React.Fragment>
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box
        sx={{
          mt: { xs: "80px", lg: "0" },
        }}
      >
        <Box className={styles.boxSearchLeft}>
          {!isMobile && (
            <React.Fragment>
              <div className={styles.blockInputTag}>
                <Paper
                  className="paper-search-tag"
                  sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: { sm: "100%", md: 240 } }}
                >
                  <IconButton sx={{ p: "10px" }} aria-label="menu">
                    <img src="/assets/images/svg/ic_user_search.svg" alt="ic_search" width="18px" height="22px" />
                  </IconButton>
                  <InputBase
                    className="input-search-tag"
                    id="input_search_tag"
                    onKeyPress={onKeyPress}
                    sx={{ flex: 1 }}
                    placeholder={t("user-search:input-tag-placeholder")}
                    onChange={(e) => setValueInput(e.target.value)}
                  />
                </Paper>
                {valueInput?.length > 20 && (
                  <p style={{ color: "red", fontSize: "12px", margin: "5px 0px" }}>
                    {t("user-search:validate-search-form.input-length")}
                  </p>
                )}
                <div className="tags">
                  <ul>
                    {tags?.map((tag, index) => (
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

              {/* Career */}
              <SelectCustom value={formSearch?.job} onChange={(e) => handleChangeInputSearch(e, "job")}>
                {jobs.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </SelectCustom>

              {/* Status */}
              <SelectCustom
                value={formSearch?.employeeStatus}
                onChange={(e) => handleChangeInputSearch(e, "employeeStatus")}
              >
                {employeeStatus.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </SelectCustom>

              {/* Last login */}
              <SelectCustom value={formSearch?.lastLogin} onChange={(e) => handleChangeInputSearch(e, "lastLogin")}>
                {lastLogins.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </SelectCustom>

              {/* Review */}
              <SelectCustom value={formSearch?.review} onChange={(e) => handleChangeInputSearch(e, "review")}>
                {reviews.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </SelectCustom>

              <FormControlLabelCustom
                control={
                  <Checkbox
                    value="can-talk"
                    checked={formSearch?.statusCanTalk}
                    onChange={() => {
                      const data = { ...formSearch, statusCanTalk: !formSearch?.statusCanTalk };
                      updateForm(data);
                    }}
                  />
                }
                label={t("user-search:label-checkbox-1").toString()}
              />
              <FormControlLabelCustom
                control={
                  <Checkbox
                    checked={formSearch?.statusLookingForFriend}
                    value="looking-for-friend"
                    onChange={() => {
                      const data = { ...formSearch, statusLookingForFriend: !formSearch?.statusLookingForFriend };
                      updateForm(data);
                    }}
                  />
                }
                label={t("user-search:label-checkbox-2").toString()}
              />
              <FormControlLabelCustom
                control={
                  <Checkbox
                    checked={formSearch?.statusNeedConsult}
                    value="needConsult"
                    onChange={() => {
                      const data = { ...formSearch, statusNeedConsult: !formSearch?.statusNeedConsult };
                      updateForm(data);
                    }}
                  />
                }
                label={t("user-search:label-checkbox-3").toString()}
              />
            </React.Fragment>
          )}

          {isMobile ? (
            <Button
              sx={{
                mt: "0px!important",
              }}
              className="btn-user-search btn-search"
              fullWidth
              onClick={() => setShowPopupSearchUser(true)}
            >
              {t("user-search:btn-search-SP")}
            </Button>
          ) : (
            <Button className="btn-user-search btn-search" fullWidth onClick={() => fetchData(sort, [], "")}>
              {t("user-search:btn-search")}
            </Button>
          )}
          <Button className="btn-user-search btn-clear" fullWidth onClick={clearFormSearch}>
            {t("user-search:btn-clear-condition")}
          </Button>
        </Box>

        <Box className={styles.boxContainer}>
          <Box className={styles.boxResultSearch}>
            <Grid container className={styles.titleResultSearch}>
              <Grid item md={6} xs={12}>
                <Typography className="title-search">
                  {t("user-search:title")}
                  <span className="item-total-result">
                    {isMobile && <br />} 全{users?.length ?? 0}件
                  </span>
                </Typography>
              </Grid>
              {!isMobile && (
                <Grid item xs={6} className="sort-by-block">
                  <Typography className="sort-by-label">{t("user-search:sort-by")}</Typography>
                  <Divider orientation="vertical" flexItem />
                  <Box
                    onClick={() => sort !== "recommended" && handleSort("recommended")}
                    className={sort === "recommended" ? "sort-link" : "sort-link active"}
                  >
                    {t("user-search:recommend-order")}
                  </Box>
                  <Box
                    onClick={() => sort !== "login_at" && handleSort("login_at")}
                    className={sort === "login_at" ? "sort-link" : "sort-link active"}
                  >
                    {t("user-search:last-register-order")}
                  </Box>
                  <Divider orientation="vertical" flexItem />
                </Grid>
              )}

              {isMobile && (
                <Grid item xs={12} className="sort-by-block-sp">
                  <Link
                    onClick={() => sort !== "recommended" && handleSort("recommended")}
                    className={sort === "recommended" ? "sort-link" : "sort-link active"}
                  >
                    {t("user-search:recommend-order")}
                  </Link>
                  <Link
                    onClick={() => sort !== "login_at" && handleSort("login_at")}
                    className={sort === "login_at" ? "sort-link" : "sort-link active"}
                  >
                    {t("user-search:last-register-order")}
                  </Link>
                </Grid>
              )}
            </Grid>

            <Grid
              container
              sx={{ minHeight: "30em" }}
              className={styles.resultSearch}
              spacing={{ md: "27px", xs: "20px" }}
            >
              {users?.map((item, index) => (
                <Grid item key={index} md={4} xs={12} sm={12}>
                  <BoxItemUserComponent data={item} />
                </Grid>
              ))}
            </Grid>
            {hasMore ? (
              <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Button onClick={handleClickHasMore} sx={{ color: "rgb(3, 188, 219)" }}>
                  {t("common:showMore")}
                </Button>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
      <PopupSearchUser
        isSort={sort}
        inputTags={tags}
        formSearch={formSearch}
        showPopup={showPopupSearchUser}
        fetchData={fetchData}
        setShowPopup={setShowPopupSearchUser}
        setInputTags={onPopupSetInput}
        setFormSearch={onPopupSetFormSearch}
      />
    </React.Fragment>
  );
};

export default connect(
  (state: any) => ({
    form: state.search_users.form,
    scrollPosition: state.search_users.scrollPosition,
    result: state.search_users.result,
    formStatus: state.search_users.formStatus,
  }),
  (dispatch) => ({
    updateForm: (formData) => dispatch({ type: searchUserActions.UPDATE_FORM, payload: formData }),
    clearForm: () => dispatch({ type: searchUserActions.CLEAR_FORM }),
    updateResult: (result) => dispatch({ type: searchUserActions.UPDATE_RESULT, payload: result }),
    updateScrollPosition: (position) =>
      dispatch({ type: searchUserActions.UPDATE_SCROLL_POSITION, payload: { scrollPosition: position } }),
  }),
)(SearchUserComponent);
