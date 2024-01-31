import React, { useState } from "react";
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
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import theme, { themeSelect } from "src/theme";
import { TabPanel, a11yProps, TabCustom } from "src/components/common/Tab/BlueTabVerticalComponent";
import { Field, InputCustom } from "src/components/community/blocks/Form/InputComponent";
import { TextArea } from "src/components/community/blocks/Form/TextAreaComponent";
import ButtonComponent from "src/components/common/ButtonComponent";
import DialogConfirmComponent from "src/components/common/dialog/DialogConfirmComponent";
import { VALIDATE_FORM_COMMUNITY, REGEX_RULES } from "src/messages/validate";
import { IStoreState } from "src/constants/interface";
import { createCommunity } from "src/services/community";

import { tabsCreateCommunity, infoCommunitySetting } from "./mockData";

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
  height: " 40px",
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

const CreateComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const rolePrivateCommunity = infoCommunitySetting.rolesCreatePost.slice(0, 2);
  const auth = useSelector((state: IStoreState) => state.user);
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [disableBtnSubmit, setDisableBtnSubmit] = useState(true);

  const [roleCreatePostSelected, setRoleCreatePost] = useState(infoCommunitySetting.rolesCreatePost[0].value);

  const [roleJoinSelected, setRoleJoin] = useState(infoCommunitySetting.rolesJoin[0].value);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gatherUrl, setGatherUrl] = useState("");
  const [communityRequest, setCommunityRequest] = useState({
    name,
    description,
    gather_url: gatherUrl,
    post_permission: roleCreatePostSelected,
    is_public: roleJoinSelected,
  });
  const [tagData, setTagData] = useState([]);
  const [profileImage, setProfileImage] = useState(infoCommunitySetting.avatar);
  const [isDeleteImage, setIsDeleteImage] = useState(false);
  const [srcProfileImage, setSrcProfileImage] = useState(infoCommunitySetting.avatar);
  const [tagDataValidate, setTagDataValidate] = useState(false);

  const onKeyPress = (e) => {
    if (e.target.value.length > 20) {
      setTagDataValidate(true);
      return false;
    }
    if (e.key === "Enter" && e.target.value) {
      setTagDataValidate(false);
      setTagData([...tagData, e.target.value]);
      (document.getElementById("input_tags") as HTMLInputElement).value = "";
    }
  };

  const handleDeleteTag = (indexRemove) => () => {
    setTagData(tagData.filter((_, index) => index !== indexRemove));
  };

  const [openDialog, setOpen] = useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleDialogCancel = () => {
    handleCloseDialog();
    setOpen(false);
  };
  const handleDialogOK = () => {
    router.push("/search_community");
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
      setRoleJoin(valueInput);
    }

    if (key === "gather_url") {
      setGatherUrl(valueInput);
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
      setProfileImage(file);
      setSrcProfileImage(URL.createObjectURL(file));
      setIsDeleteImage(false);

      // @ts-ignore
      document.getElementById("avatar").value = null;
      return true;
    }

    errorMessages.profile_image = VALIDATE_FORM_COMMUNITY.profile_image.format;
    setErrorValidates(errorMessages);
    return errorMessages;
  };

  const removeProfileImage = () => {
    setProfileImage(infoCommunitySetting.avatar);
    setSrcProfileImage(infoCommunitySetting.avatar);
    setIsDeleteImage(false);
    errorMessages.profile_image = null;
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

  const handleSaveForm = async () => {
    if (
      handleValidateFormCommunity() &&
      !errorValidates.profile_image &&
      (tagData.length === 0 || tagData.length > 1)
    ) {
      const formData = new FormData();
      // eslint-disable-next-line array-callback-return
      Object.keys(communityRequest).filter((key) => {
        formData.append(key, communityRequest[key]);
      });

      // eslint-disable-next-line array-callback-return
      Object.keys(tagData).filter((key) => {
        formData.append("tags[]", tagData[key]);
      });

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }
      if (isDeleteImage && !profileImage) {
        formData.append("profile_image", infoCommunitySetting.avatar);
      }
      const res = await createCommunity(formData);
      if (!res?.error_code) {
        setTimeout(() => router.push(`/community/${res?.id}`), 1000);
        return res;
      }
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          mt: ["20px", "38px"],
          pt: "60px",
          ml: [0, "40px"],
          bgcolor: "white",
          display: "flex",
          flexDirection: ["column", "row"],
          backgroundColor: theme.whiteBlue, // bg lg
        }}
      >
        <Box sx={{ backgroundColor: theme.whiteBlue }}>
          <Typography
            sx={{
              pl: "26px",
              mb: ["0", "23px"],
              mt: ["20px", 0],
              display: ["flex", "inherit"],
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {t("community:create.title")}
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
              display: ["none", "block"],
              "& .MuiTabs-flexContainer": {
                flexDirection: ["row", "column"],
              },
            }}
          >
            {tabsCreateCommunity?.map((tab, index) => (
              <TabCustom
                props={{
                  xsWidth: "33.33%",
                  smWidth: "239px",
                }}
                key={index.toString()}
                iconPosition="top"
                label={tab.text}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
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
                  mt: ["9px", 0],
                }}
              >
                <Field
                  onChangeInput={onChangeCommunityRequest}
                  id="name"
                  placeholder={t("community:setting.form.placeholder.name")}
                  error={errorValidates.name}
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
                    src={auth?.profile_image}
                    alt={auth?.username}
                  />

                  <Box
                    sx={{
                      fontWeight: 500,
                      ml: "8px",
                    }}
                  >
                    {auth?.username}
                  </Box>
                </Box>
              </GridContent>

              <GridTitle item xs={12} sm={3}>
                <BoxTitle>{t("community:setting.form.role-create-post")}</BoxTitle>
              </GridTitle>
              <GridContent item xs={12} sm={9}>
                <Box>
                  <ThemeProvider theme={themeSelect}>
                    <SelectCustom
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
                  mt: ["9px", "0"],
                }}
              >
                <Field
                  onChangeInput={onChangeCommunityRequest}
                  id="gather_url"
                  placeholder={t("community:setting.form.placeholder.virtual-room")}
                  error={errorValidates.gather_url}
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
                {t("community:setting.form.stop-create-community")}
              </TypographyButton>
            </Box>
          </Box>
        </TabPanel>
      </Box>

      <DialogConfirmComponent
        title={t("community:button.dialog.stop-create-community")}
        content={t("community:setting.form.dialog.content")}
        btnLeft={t("community:button.dialog.cancel-2")}
        btnRight={t("community:button.dialog.stop-create-community")}
        isShow={openDialog}
        handleClose={handleCloseDialog}
        handleCancel={handleDialogCancel}
        handleOK={handleDialogOK}
      />
    </React.Fragment>
  );
};
export default CreateComponent;
