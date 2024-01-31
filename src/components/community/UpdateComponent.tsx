import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  FormControlLabel,
  Grid,
  ListItem,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Tabs,
  Typography,
  OutlinedInput,
  FormControl,
  ThemeProvider,
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { styled, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import _without from "lodash/without";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import useViewport from "src/helpers/useViewport";
import { IStoreState } from "src/constants/interface";
import theme from "src/theme";
import { TabPanel, a11yProps, TabCustom } from "src/components/common/Tab/BlueTabVerticalComponent";
import { Field, InputCustom } from "src/components/community/blocks/Form/InputComponent";
import { TextArea } from "src/components/community/blocks/Form/TextAreaComponent";
import ButtonComponent from "src/components/common/ButtonComponent";
import DialogConfirmComponent from "src/components/common/dialog/DialogConfirmComponent";
import { REGEX_RULES, VALIDATE_FORM_COMMUNITY } from "src/messages/validate";
import {
  getCommunity,
  updateCommunity,
  CommunityMembers,
  deleteCommunity,
  checkMemberCommunity,
  leaveCommunity,
} from "src/services/community";

import { infoCommunitySetting, tabsCommunitySetting } from "./mockData";
import MemberComponent from "./setting/blocks/MemberComponent";
import ParticipatedMemberComponent from "./setting/blocks/ParticipatedMemberComponent";
import styles from "./update.module.scss";

const BoxTitle = styled(Box)({
  fontSize: 18,
  "@media (max-width: 425px)": {
    fontSize: 16,
  },
  fontWeight: 700,
});

const TypographyButton = styled(Typography)({
  color: theme.blue,
  "&:hover": {
    cursor: "pointer",
  },
});

const GridContent = styled(Grid)({
  marginBottom: "40px",
  "@media (max-width: 425px)": {
    marginBottom: "40px",
  },
});

const GridTitle = styled(Grid)({
  "@media (max-width: 425px)": {
    marginBottom: "4px",
  },
});

const SelectCustom = styled(Select)({
  color: theme.navy,
  fontWeight: 500,
  width: ["242px", "302px"],
  backgroundColor: theme.whiteBlue,
  fieldset: {
    border: "none",
  },
  "& span": {
    color: theme.gray,
  },
});

const BoxTextValidate = styled(Box)({
  color: "#FF9458",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
});

const UpdateComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const viewPort = useViewport();
  const isMobile = viewPort.width <= 992;
  const communityId = router.query;
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const LIMIT = 10;
  const IS_MEMBER = "member";
  const IS_OWNER = "owner";
  const rolePrivateCommunity = infoCommunitySetting.rolesCreatePost.slice(0, 2);
  const [isLoading, setIsLoading] = useState(false);
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const [hint, setHint] = useState(false);
  const getStyles = (name, personName) => ({
    color: personName.indexOf(name) === -1 ? theme.navy : theme.blue,
    background: personName.indexOf(name) === -1 ? "white" : theme.whiteBlue,
  });
  const themeSelect = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const [value, setValue] = useState(0);

  const [disableBtnSubmit, setDisableBtnSubmit] = useState(true);

  const [roleCreatePostSelected, setRoleCreatePost] = useState(infoCommunitySetting.rolesCreatePost[0].value);

  const [roleJoinSelected, setRoleJoin] = useState(infoCommunitySetting.rolesJoin[0].value);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [virtualLink, setVirtualLink] = useState(null);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [communityRequest, setCommunityRequest] = useState({
    name,
    description,
    post_permission: roleCreatePostSelected,
    is_public: roleJoinSelected,
    gather_url: virtualLink,
  });
  const [owner, setOwner] = useState({
    id: null,
    username: null,
    profile_image: null,
  });
  const [tagData, setTagData] = useState([]);
  const [profileImage, setProfileImage] = useState(infoCommunitySetting.avatar);
  const [isDeleteImage, setIsDeleteImage] = useState(false);
  const [srcProfileImage, setSrcProfileImage] = useState("/assets/images/logo/logo.png");
  const [openDialog, setOpen] = useState(false);
  const [tagDataValidate, setTagDataValidate] = useState(false);
  const [valueCursor, setValueCursor] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [checkMember, setCheckMember] = useState(false);
  const auth = useSelector((state: IStoreState) => state.user);
  const [userId] = useState(auth?.id);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mySelf, setMySelf] = useState({
    role: null,
  });

  const fetchData = async () => {
    const admins = [];
    const adminIds = [];
    const data = await getCommunity(communityId?.indexId);
    for (let i = 0; i < data?.admins?.length; i++) {
      admins.push(`${data?.admins[i].id},${data?.admins[i].username}`);
      adminIds.push(data?.admins[i].id);
    }
    setIsAdmin(adminIds.includes(userId));
    setIsPublic(data?.is_public);
    setPersonName(admins);
    setName(data?.name);
    setDescription(data?.description);
    setVirtualLink(data?.gather_url);
    setRoleCreatePost(data?.post_permission);
    setRoleJoin(data?.is_public);
    setSrcProfileImage(data?.profile_image);
    setProfileImage(data?.profile_image);
    setTagData(data?.tags);
    setOwner(data?.owner);
    setCommunityRequest({
      name: data?.name,
      description: data?.description,
      post_permission: data?.post_permission,
      is_public: data?.is_public,
      gather_url: data?.gather_url,
    });
    return data;
  };

  const fetchDataUsers = async () => {
    if (hasMore) {
      setIsLoading(true);
      const data = await CommunityMembers(communityId?.indexId, LIMIT, valueCursor);
      // eslint-disable-next-line no-unsafe-optional-chaining
      setCommunityMembers([...communityMembers, ...data?.items]);
      setValueCursor(data?.cursor);
      setHasMore(data?.hasMore);
      setIsLoading(false);
      return data;
    }
  };

  const checkRoleMemberCommunity = async () => {
    const data = await checkMemberCommunity(communityId?.indexId, userId);
    if (data?.id && data?.role !== IS_MEMBER) {
      setMySelf(data);
      fetchDataUsers();
      setCheckMember(true);
      fetchData();
      return data;
    }
    toast.warning(t("common:not_have_access"));
    setTimeout(() => router.push("/"), 1000);
  };

  useEffect(() => {
    checkRoleMemberCommunity();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCommunityMembers([]);
    setHasMore(true);
    setValueCursor("");
    if (newValue === 0) {
      fetchData();
      fetchDataUsers();
    }
    setValue(newValue);
  };

  const handleChangeTab = (valueTab) => {
    setValue(valueTab);
  };

  const onKeyPress = (e) => {
    if (e.target.value.length > 20) {
      setTagDataValidate(true);
      return false;
    }
    if (e.key === "Enter" && e.target.value) {
      setTagDataValidate(false);
      setDisableBtnSubmit(false);
      setTagData([...tagData, e.target.value]);
      (document.getElementById("input_tags") as HTMLInputElement).value = "";
    }
  };

  const handleDeleteTag = (indexRemove) => () => {
    setDisableBtnSubmit(false);
    setTagData(tagData.filter((_, index) => index !== indexRemove));
  };

  const handleChangeAdmins = (event) => {
    setDisableBtnSubmit(false);
    const {
      // eslint-disable-next-line no-shadow
      target: { value },
    } = event;
    if (value.length <= 10) {
      setPersonName(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value,
      );
    }
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleDialogCancel = () => {
    handleCloseDialog();
    setOpen(false);
  };
  const handleDeleteCommunity = async () => {
    const res = await deleteCommunity(communityId?.indexId);
    if (!res?.error_code) {
      setTimeout(() => router.push(`/search_community`), 1000);
      return res;
    }
  };

  const handleLeaveCommunity = async () => {
    const res = await leaveCommunity(communityId?.indexId);
    if (res) {
      setTimeout(() => router.push(`/community/${communityId?.indexId}`), 1000);
      setOpen(false);
    }
    return res;
  };

  const [errorValidates, setErrorValidates] = useState({
    name: null,
    description: null,
    post_permission: null,
    profile_image: null,
    gather_url: null,
  });

  const errorMessages = {
    name: null,
    description: null,
    post_permission: null,
    profile_image: null,
    gather_url: null,
  };

  const onChangeCommunityRequest = (key: string, valueInput: any) => {
    if (key === "name") {
      setName(valueInput);
    }
    if (key === "description") {
      setDescription(valueInput);
    }
    if (key === "post_permission") {
      setRoleCreatePost(valueInput);
    }
    if (key === "is_public") {
      if (valueInput === "false") {
        setRoleCreatePost(infoCommunitySetting.rolesCreatePost[0].value);
      } else {
        setRoleCreatePost(communityRequest?.post_permission);
      }
      setRoleJoin(valueInput);
    }
    if (key === "gather_url") {
      setVirtualLink(valueInput);
    }
    setDisableBtnSubmit(false);

    setCommunityRequest({
      ...communityRequest,
      [key]: typeof valueInput === "string" ? valueInput.trim() : valueInput,
    });
  };

  const uploadProfileImage = async (e) => {
    const file = e.currentTarget.files[0];
    if (file.size > 2097152) {
      errorMessages.profile_image = VALIDATE_FORM_COMMUNITY.profile_image.max_size;
      setErrorValidates(errorMessages);
      return errorMessages;
    }
    if (
      e.currentTarget.files[0].type === "image/jpg" ||
      e.currentTarget.files[0].type === "image/png" ||
      e.currentTarget.files[0].type === "image/jpeg"
    ) {
      setDisableBtnSubmit(false);
      setProfileImage(file);
      errorMessages.profile_image = null;
      setErrorValidates(errorMessages);
      setSrcProfileImage(URL.createObjectURL(file));
      setIsDeleteImage(false);

      // @ts-ignore
      document.getElementById("avatar").value = "";
      return true;
    }

    errorMessages.profile_image = VALIDATE_FORM_COMMUNITY.profile_image.format;
    setErrorValidates(errorMessages);
    return errorMessages;
  };

  const removeProfileImage = () => {
    setProfileImage(infoCommunitySetting.avatar);
    setSrcProfileImage("/assets/images/logo/logo.png");
    setIsDeleteImage(true);
    errorMessages.profile_image = null;
    setDisableBtnSubmit(false);
    setErrorValidates(errorMessages);
  };

  const handleValidateFormCommunity = () => {
    let isValidForm = true;
    if (!communityRequest?.name?.length || communityRequest?.name?.length > 40) {
      isValidForm = false;
      errorMessages.name = VALIDATE_FORM_COMMUNITY.name.max_length;
    }

    if (!communityRequest?.name?.length || communityRequest?.name?.length === 0) {
      isValidForm = false;
      errorMessages.name = VALIDATE_FORM_COMMUNITY.name.required;
    }

    if (!communityRequest?.description?.length || communityRequest?.description?.length > 1000) {
      isValidForm = false;
      errorMessages.description = VALIDATE_FORM_COMMUNITY.description.max_length;
    }

    if (!communityRequest?.description?.length || communityRequest?.description?.length === 0) {
      isValidForm = false;
      errorMessages.description = VALIDATE_FORM_COMMUNITY.description.required;
    }

    if (!communityRequest?.post_permission?.length) {
      isValidForm = false;
      errorMessages.post_permission = VALIDATE_FORM_COMMUNITY.post_permission.required;
    }

    if (communityRequest?.gather_url?.length && !REGEX_RULES.url.test(communityRequest?.gather_url)) {
      isValidForm = false;
      errorMessages.gather_url = VALIDATE_FORM_COMMUNITY.gather_url.format;
    }

    setErrorValidates(errorMessages);
    return isValidForm;
  };

  const handleDeleteChipAdmin = (e: React.MouseEvent, valueChipAdmin: string) => {
    setDisableBtnSubmit(false);
    e.preventDefault();
    setPersonName((current) => _without(current, valueChipAdmin));
  };

  const handleSaveForm = async () => {
    if (
      handleValidateFormCommunity() &&
      !errorValidates.profile_image &&
      (tagData.length === 0 || tagData.length > 1)
    ) {
      setIsLoading(true);
      const formData = new FormData();
      // eslint-disable-next-line array-callback-return
      Object.keys(communityRequest).filter((key) => {
        formData.append(key, communityRequest[key]);
      });
      // @ts-ignore
      if (communityRequest.is_public === "false" && communityRequest.post_permission === "all") {
        formData.delete("post_permission");
        formData.append("post_permission", infoCommunitySetting.rolesCreatePost[0].value);
      }
      // eslint-disable-next-line array-callback-return
      Object.keys(tagData).filter((key) => {
        formData.append("tags[]", tagData[key]);
      });

      if (!personName.length) {
        formData.append("admin_ids[]", "");
      } else {
        for (let i = 0; i < personName.length; i++) {
          if (personName[i]?.length !== undefined) {
            formData.append("admin_ids[]", personName[i]?.split(",")[0]);
          }
        }
      }

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      if (isDeleteImage && !profileImage) {
        formData.append("profile_image", infoCommunitySetting.avatar);
      }

      const res = await updateCommunity(communityId?.indexId, formData);
      setDisableBtnSubmit(true);
      setIsLoading(false);
      return res;
    }
  };
  return (
    <React.Fragment>
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!checkMember ? (
        <Box sx={{ minHeight: "74.6vh" }} />
      ) : (
        <Box
          sx={{
            mt: ["20px", "38px"],
            pt: "60px",
            ml: [0, "40px"],
            bgcolor: "white",
            display: checkMember ? "flex" : "none",
            flexDirection: ["column", "row"],
            backgroundColor: theme.whiteBlue, // bg lg
            minHeight: "74.6vh",
          }}
        >
          <Box sx={{ backgroundColor: theme.whiteBlue }}>
            <Typography
              sx={{
                pl: "26px",
                mb: ["20px", "23px"],
                mt: ["20px", 0],
                display: ["flex", "inherit"],
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {t("community:setting.title")}
            </Typography>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "transparent",
                },
              }}
              sx={{
                "& .MuiTabs-flexContainer": {
                  flexDirection: ["row", "column"],
                },
              }}
            >
              {tabsCommunitySetting?.map((tab, index) => (
                <TabCustom
                  props={{
                    xsWidth: isMobile ? "25%" : "33.33%",
                    smWidth: "239px",
                  }}
                  sx={{
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                  key={index.toString()}
                  iconPosition="top"
                  label={tab.text}
                  {...a11yProps(index)}
                />
              ))}
              {isMobile && (
                <TabCustom
                  props={{
                    xsWidth: "25%",
                    smWidth: "239px",
                  }}
                  sx={{ fontSize: "12px" }}
                  iconPosition="top"
                  label={t("community:setting.form.back-detail-community")}
                  onClick={() => router.push(`/community/${communityId?.indexId}`)}
                />
              )}
            </Tabs>
            {!isMobile && (
              <Typography
                className={styles.linkToDetail}
                onClick={() => router.push(`/community/${communityId?.indexId}`)}
              >
                {t("community:setting.form.back-detail-community")}
              </Typography>
            )}
          </Box>

          <TabPanel value={value} index={0}>
            <Box
              sx={{
                mt: "20px",
                mr: ["20px", "17.32%"],
                ml: ["20px", "0"],
                pt: ["20px ", "40px"],
                px: ["10px", "40px"],
                pb: "64px",
                backgroundColor: "white",
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  sx={{
                    marginBottom: "2em",
                    display: "flex",
                    justifyContent: ["center", "flex-start"],
                  }}
                >
                  <img
                    style={{
                      width: "160px",
                      height: "160px",
                      padding: srcProfileImage === "/assets/images/logo/logo.png" ? "1em" : "0",
                      objectFit: srcProfileImage === "/assets/images/logo/logo.png" ? "contain" : "cover",
                      border: "3px #80808014 solid",
                      background: "#F4FDFF",
                      borderRadius: "50%",
                    }}
                    src={srcProfileImage ?? "/assets/images/logo/logo.png"}
                    alt="image_avatar"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={9}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: ["center", "flex-start"],
                    justifyContent: ["center", "flex-start"],
                  }}
                >
                  <Typography>{t("community:setting.form.text-upload")}</Typography>
                  <Typography>{t("community:setting.form.max-upload")}</Typography>
                  <input
                    id="avatar"
                    name="profile_image"
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    hidden
                    onChange={uploadProfileImage}
                  />
                  <label htmlFor="avatar">
                    <Box
                      sx={{
                        mt: "12px",
                        mb: "5px",
                        height: "56px",
                        width: "240px",
                        backgroundColor: theme.gray,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "700",
                        lineHeight: "24.62",
                        fontSize: "17px",
                        color: "#fff",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      {t("community:button.setting.upload")}
                    </Box>
                  </label>

                  <BoxTextValidate sx={{ mb: "20px" }}>{errorValidates.profile_image}</BoxTextValidate>
                  {srcProfileImage !== infoCommunitySetting.avatar && srcProfileImage?.length > 0 ? (
                    <TypographyButton mb={["28px", "33px"]} onClick={removeProfileImage}>
                      {t("community:setting.form.delete-img")}
                    </TypographyButton>
                  ) : null}
                </Grid>
                <GridTitle item xs={12} sm={3}>
                  <BoxTitle>{t("community:setting.form.name")}</BoxTitle>
                </GridTitle>
                <Grid
                  item
                  xs={12}
                  sm={9}
                  sx={{
                    mb: ["36px", "30px"],
                    mt: ["20px", 0],
                  }}
                >
                  <Field
                    onChangeInput={onChangeCommunityRequest}
                    id="name"
                    placeholder={t("community:setting.form.placeholder.name")}
                    error={errorValidates.name}
                    value={name}
                  />
                </Grid>
                <GridTitle item xs={12} sm={3}>
                  <BoxTitle>{t("community:setting.form.detail")}</BoxTitle>
                </GridTitle>
                <GridContent item xs={12} sm={9}>
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: "6px",
                      marginBottom: "4px",
                      "& div": {
                        height: "100%",
                        outline: "none",
                        borderRadius: "6px",
                      },
                      "& div:focus-visible": {
                        border: `2px solid ${theme.blue}`,
                      },
                    }}
                  >
                    <TextArea
                      placeholder={t("community:place-holder")}
                      onChangeInput={onChangeCommunityRequest}
                      id="description"
                      error={errorValidates.description}
                      value={description}
                    />
                  </Box>
                </GridContent>

                <GridTitle item xs={12} sm={3}>
                  <BoxTitle>{t("community:setting.form.representative")}</BoxTitle>
                </GridTitle>
                <GridContent item xs={12} sm={9}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        mb: 0,
                        width: "32px",
                        height: "32px",
                      }}
                      src={owner?.profile_image}
                      alt={owner?.username}
                    />

                    <Box
                      sx={{
                        fontWeight: 500,
                        ml: "8px",
                      }}
                    >
                      {owner?.username}
                    </Box>
                  </Box>
                </GridContent>
                <GridTitle item xs={12} sm={3}>
                  <Box sx={{ display: "flex" }}>
                    <BoxTitle>{t("community:setting.form.administrator")}</BoxTitle>
                    <Box sx={{ ml: "4px" }}>
                      <Box className={styles.hintIconQuestion} onClick={() => setHint(!hint)}>
                        <img src="/assets/images/icon/ic_question_mark.png" alt="ic_question_mark" />
                      </Box>
                      <Box className={styles.hint}>{t("community:tooltip_update")}</Box>
                    </Box>
                  </Box>
                </GridTitle>
                <GridContent item xs={12} sm={9}>
                  <Box>
                    <FormControl sx={{ m: 1, margin: 0, width: "100%" }} size="small">
                      <SelectCustom
                        sx={{ width: "100%" }}
                        labelId="admin-multiple-chip-label"
                        id="admin-multiple-chip"
                        multiple
                        displayEmpty
                        value={personName}
                        onChange={handleChangeAdmins}
                        input={<OutlinedInput id="select-multiple-chip" />}
                        renderValue={(selected: any) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.length !== 0 ? (
                              selected?.map(
                                (valueOption) =>
                                  valueOption && (
                                    <Chip
                                      key={valueOption}
                                      label={valueOption?.split(",")[1]}
                                      clickable
                                      deleteIcon={
                                        userId !== valueOption?.split(",")[0] && (
                                          <Avatar
                                            onMouseDown={(event) => event.stopPropagation()}
                                            src="/assets/images/svg/delete_white.svg"
                                            sx={{
                                              width: "16px",
                                              height: "16px",
                                              backgroundColor: theme.blue,
                                              "& img": {
                                                p: "4px",
                                              },
                                            }}
                                          />
                                        )
                                      }
                                      onDelete={(e) => handleDeleteChipAdmin(e, valueOption)}
                                      sx={{
                                        background: theme.whiteBlue,
                                        border: `1px solid ${theme.blue}`,
                                        "& .MuiChip-label": { color: theme.blue },
                                      }}
                                    />
                                  ),
                              )
                            ) : (
                              <Box
                                sx={{
                                  color: theme.gray,
                                  fontWeight: 400,
                                }}
                              >
                                {t("community:setting.form.placeholder.administrator")}
                              </Box>
                            )}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        <MenuItem disabled value="">
                          {t("community:setting.form.placeholder.administrator")}
                        </MenuItem>
                        {communityMembers?.map(
                          (nameOption) =>
                            nameOption?.id !== owner?.id && (
                              <MenuItem
                                key={nameOption?.id}
                                value={`${nameOption?.id},${nameOption?.username}`}
                                style={getStyles(`${nameOption?.id},${nameOption?.username}`, personName)}
                                disabled={(isLoading || nameOption?.id === userId) ?? true}
                                sx={{
                                  "&:hover": {
                                    background: `${theme.blue} !important`,
                                    color: "white !important",
                                  },
                                }}
                              >
                                <Avatar
                                  src={nameOption?.profile_image}
                                  alt={nameOption?.username}
                                  sx={{
                                    width: "24px",
                                    height: "24px",
                                    marginRight: "8px",
                                  }}
                                />
                                {nameOption?.username}
                              </MenuItem>
                            ),
                        )}
                        {isLoading && (
                          <Box sx={{ color: theme.blue, marginTop: "-120px", textAlign: "center" }}>
                            <CircularProgress color="inherit" />
                          </Box>
                        )}
                        {hasMore && !isLoading ? (
                          <Button
                            variant="text"
                            onClick={fetchDataUsers}
                            sx={{ color: theme.blue, ml: "16px", fontSize: "14px" }}
                          >
                            {t("common:showMore")}
                          </Button>
                        ) : null}
                      </SelectCustom>
                    </FormControl>
                  </Box>
                  <BoxTextValidate>{errorValidates.post_permission}</BoxTextValidate>
                </GridContent>
                <GridTitle item xs={12} sm={3}>
                  <BoxTitle>{t("community:setting.form.role-create-post")}</BoxTitle>
                </GridTitle>
                <GridContent item xs={12} sm={9}>
                  <Box>
                    <ThemeProvider theme={themeSelect}>
                      <SelectCustom
                        size="small"
                        value={roleCreatePostSelected}
                        onChange={(e) => onChangeCommunityRequest("post_permission", e.target.value)}
                        inputProps={{ "aria-label": "Role join" }}
                        sx={{ border: errorValidates.post_permission ? "1px solid #FF9458" : "none" }}
                      >
                        {roleJoinSelected.toString() === "true"
                          ? infoCommunitySetting.rolesCreatePost.map((option, index) => (
                              <MenuItem key={index.toString()} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))
                          : rolePrivateCommunity.map((option, index) => (
                              <MenuItem key={index.toString()} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                      </SelectCustom>
                    </ThemeProvider>
                  </Box>
                  <BoxTextValidate>{errorValidates.post_permission}</BoxTextValidate>
                </GridContent>
                <GridTitle item xs={12} sm={3}>
                  <BoxTitle>{t("community:setting.form.role-join")}</BoxTitle>
                </GridTitle>
                <GridContent item xs={12} sm={9}>
                  <RadioGroup
                    aria-label="gender"
                    name="controlled-radio-buttons-group"
                    value={roleJoinSelected}
                    onChange={(e) => onChangeCommunityRequest("is_public", e.target.value)}
                    sx={{
                      flexDirection: "row",
                      justifyContent: ["space-between", "inherit"],
                    }}
                  >
                    {infoCommunitySetting.rolesJoin &&
                      infoCommunitySetting.rolesJoin.map((item, index) => (
                        <FormControlLabel
                          key={index.toString()}
                          value={item.value}
                          control={
                            <Radio
                              icon={
                                <Avatar
                                  sx={{
                                    mb: 0,
                                    width: "16px",
                                    height: "16px",
                                  }}
                                  src="/assets/images/svg/radio_off.svg"
                                />
                              }
                              checkedIcon={
                                <Avatar
                                  sx={{
                                    mb: 0,
                                    width: "16px",
                                    height: "16px",
                                  }}
                                  src="/assets/images/svg/radio_on.svg"
                                />
                              }
                            />
                          }
                          label={item.label}
                          sx={{
                            mr: [0, "40px"],
                            "& .MuiTypography-root": {
                              fontSize: 14,
                              fontWeight: 500,
                            },
                          }}
                        />
                      ))}
                  </RadioGroup>
                </GridContent>

                <GridTitle item xs={12} sm={3}>
                  <BoxTitle>{t("community:setting.form.tag")}</BoxTitle>
                </GridTitle>
                <GridContent item xs={12} sm={9}>
                  <InputCustom
                    sx={{
                      display: ["inherit", "inherit"],
                      ml: 1,
                      flex: 1,
                      border:
                        tagDataValidate || (tagData.length > 0 && tagData.length < 2) ? "1px solid #FF9458" : "none",
                    }}
                    placeholder={t("community:setting.form.placeholder.tag")}
                    inputProps={{ "aria-label": t("community:setting.form.placeholder.tag") }}
                    id="input_tags"
                    onKeyPress={onKeyPress}
                  />
                  {tagDataValidate && <BoxTextValidate>{t("community:max_length_tag")}</BoxTextValidate>}
                  <Box>
                    <Paper
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        listStyle: "none",
                        boxShadow: "none",
                      }}
                    >
                      {tagData?.map((tag, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            px: "3px",
                            width: "auto",
                          }}
                        >
                          <Chip
                            label={tag}
                            onDelete={handleDeleteTag(index)}
                            deleteIcon={
                              <Avatar
                                src="/assets/images/svg/delete.svg"
                                sx={{
                                  width: "16px",
                                  height: "16px",
                                  backgroundColor: "white",
                                  "& img": {
                                    p: "4px",
                                  },
                                }}
                              />
                            }
                            sx={{
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
                      ))}
                    </Paper>
                  </Box>
                  {tagData.length > 0 && tagData.length < 2 && (
                    <BoxTextValidate>{t("community:min_2_tag")}</BoxTextValidate>
                  )}
                </GridContent>
                <GridTitle item xs={12} sm={3}>
                  <BoxTitle>{t("community:setting.form.virtual-room")}</BoxTitle>
                </GridTitle>
                <Grid
                  item
                  xs={12}
                  sm={9}
                  sx={{
                    mb: ["36px", "30px"],
                    mt: ["20px", 0],
                  }}
                >
                  <Field
                    onChangeInput={onChangeCommunityRequest}
                    id="gather_url"
                    placeholder={t("community:setting.form.placeholder.virtual-room")}
                    error={errorValidates.gather_url}
                    value={virtualLink}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: ["40px", "69px"],
                  textAlign: "center",
                }}
              >
                <ButtonComponent
                  props={{
                    dimension: "medium",
                    bgColor: disableBtnSubmit ? theme.gray : theme.blue,
                  }}
                  sx={{
                    fontSize: { sm: 20 },
                    height: ["48px", "56px"],
                    "@media (max-width: 425px)": {
                      width: "200px",
                    },
                    "&:hover": {
                      cursor: disableBtnSubmit && "not-allowed",
                    },
                  }}
                  onClick={!disableBtnSubmit ? handleSaveForm : null}
                >
                  {t("community:button.setting.save")}
                </ButtonComponent>

                <TypographyButton
                  sx={{
                    mt: "40px",
                  }}
                  onClick={handleOpenDialog}
                >
                  {mySelf?.role === IS_OWNER
                    ? t("community:setting.form.delete-community")
                    : t("community:banner.withdraw")}
                </TypographyButton>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MemberComponent isAdmin={isAdmin} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ParticipatedMemberComponent isPublic={isPublic} handleChangeTab={handleChangeTab} />
          </TabPanel>
        </Box>
      )}
      {mySelf?.role === IS_OWNER ? (
        <DialogConfirmComponent
          title={t("community:setting.form.dialog.title")}
          content={t("community:setting.form.dialog.content")}
          btnLeft={t("community:button.dialog.cancel-2")}
          btnRight={t("community:button.dialog.delete-community")}
          isShow={openDialog}
          handleClose={handleCloseDialog}
          handleCancel={handleDialogCancel}
          handleOK={handleDeleteCommunity}
        />
      ) : (
        <DialogConfirmComponent
          title={`${communityRequest?.name}を本当に退会しますか？`}
          content={t("community:dialog.note")}
          btnLeft={t("community:button.dialog.cancel")}
          btnRight={t("community:button.dialog.withdraw")}
          isShow={openDialog}
          handleClose={handleCloseDialog}
          handleCancel={handleDialogCancel}
          handleOK={handleLeaveCommunity}
          avatar={srcProfileImage}
        />
      )}
    </React.Fragment>
  );
};
export default UpdateComponent;
