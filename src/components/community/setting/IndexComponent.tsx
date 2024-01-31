import React from "react";
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
  SelectChangeEvent,
  Tabs,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { styled } from "@mui/material/styles";

import theme, { themeSelect } from "src/theme";
import { TabPanel, a11yProps, TabCustom } from "src/components/common/Tab/BlueTabVerticalComponent";
import { TextArea } from "src/components/community/blocks/Form/TextAreaComponent";
import { InputCustom } from "src/components/community/blocks/Form/InputComponent";
import ButtonComponent from "src/components/common/ButtonComponent";
import DialogConfirmComponent from "src/components/common/dialog/DialogConfirmComponent";
import ButtonExplainComponent from "src/components/community/setting/blocks/ButtonExplainComponent";
import ParticipatedMemberComponent from "src/components/community/setting/blocks/ParticipatedMemberComponent";
import MemberComponent from "src/components/community/setting/blocks/MemberComponent";

import { admins, tabsCommunitySetting, infoCommunitySetting } from "../mockData";

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
const CommunityCreateComponent = () => {
  const { t } = useTranslation();

  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const handleSaveSuccess = () => setSaveSuccess(true);

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSaveSuccess(false);
    setValue(newValue);
  };

  const [disableBtnSubmit, setDisableBtnSubmit] = React.useState(true);
  const [showBtnRemoveAdmin, setBtnRemoveAdmin] = React.useState(false);
  const [adminSelected, setAdmin] = React.useState("");
  const handleChangeAdmin = (event: SelectChangeEvent) => {
    setAdmin(event.target.value);
    setBtnRemoveAdmin(true);
    setDisableBtnSubmit(false);
  };

  const handleRemoveAdmin = () => {
    setAdmin("");
    setBtnRemoveAdmin(false);
    setDisableBtnSubmit(true);
  };

  const [roleCreatePostSelected, setRoleCreatePost] = React.useState("");
  const handleChangeRoleCreatePost = (event: SelectChangeEvent) => {
    setRoleCreatePost(event.target.value);
  };

  const [roleJoinSelected, setRoleJoin] = React.useState(infoCommunitySetting.rolesJoin[0].value);
  const handleChangeRoleJoin = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setRoleJoin((event.target as HTMLInputElement).value);
  };

  const [tagData, setTagData] = React.useState(infoCommunitySetting.tags);
  const handleDeleteTag = (chipToDelete) => () => {
    setTagData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const [openDialog, setOpen] = React.useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleDialogCancel = () => {
    handleCloseDialog();
    setOpen(false);
  };
  const handleDialogOK = () => {
    handleCloseDialog();
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: saveSuccess ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          width: "100%",
          height: ["40px", "80px"],
          backgroundColor: theme.blue,
          opacity: 0.8,
          fontSize: [16, 20],
          fontWeight: 700,
          color: "white",
          zIndex: 99999,
        }}
      >
        {t("community:setting.form.save-success")}
      </Box>

      <Box
        sx={{
          mt: ["20px", "38px"],
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
              mb: ["20px", "23px"],
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
                  display: "flex",
                  justifyContent: ["center", "flex-start"],
                }}
              >
                <Avatar
                  variant="square"
                  sx={{
                    mb: 0,
                    width: "160px",
                    height: "160px",
                  }}
                  src={infoCommunitySetting.avatar}
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

                <ButtonComponent
                  props={{
                    square: true,
                    dimension: "medium",
                    bgColor: theme.gray,
                  }}
                  sx={{
                    mt: "12px",
                    mb: "20px",
                    height: "56px",
                  }}
                >
                  {t("community:button.setting.upload")}
                </ButtonComponent>

                <TypographyButton mb={["28px", "33px"]}>{t("community:setting.form.delete-img")}</TypographyButton>
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
                }}
              >
                <InputCustom
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={t("community:setting.form.placeholder.name")}
                  inputProps={{ "aria-label": t("community:setting.form.placeholder.name") }}
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
                      backgroundColor: theme.whiteBlue,
                      height: "100%",
                      border: "2px solid transparent",
                      outline: "none",
                      borderRadius: "6px",
                      pb: "8px",
                      pr: { sm: "20%" },
                    },
                    "& div:focus-visible": {
                      border: `2px solid ${theme.blue}`,
                    },
                  }}
                >
                  <TextArea aria-label="write-comment" placeholder={t("community:place-holder")} />
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
                    variant="square"
                    sx={{
                      mb: 0,
                      width: "32px",
                      height: "32px",
                    }}
                    src={infoCommunitySetting.admin.avatar}
                  />

                  <Box
                    sx={{
                      fontWeight: 500,
                      ml: "8px",
                    }}
                  >
                    {infoCommunitySetting.admin.name}
                  </Box>
                </Box>
              </GridContent>

              <GridTitle item xs={12} sm={3}>
                <BoxTitle
                  sx={{
                    display: "flex",
                  }}
                >
                  <Box mr="6px">{t("community:setting.form.administrator")}</Box>
                  <ButtonExplainComponent />
                </BoxTitle>
              </GridTitle>
              <GridContent item xs={12} sm={9}>
                <ThemeProvider theme={themeSelect}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <SelectCustom
                      value={adminSelected}
                      onChange={handleChangeAdmin}
                      displayEmpty
                      inputProps={{ "aria-label": "Role create post" }}
                    >
                      <MenuItem disabled value="">
                        <span>{t("community:setting.form.placeholder.administrator")}</span>
                      </MenuItem>
                      {admins &&
                        admins.map((option, index) => (
                          <MenuItem key={index.toString()} value={option.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                variant="square"
                                sx={{
                                  mb: 0,
                                  width: "32px",
                                  height: "32px",
                                }}
                                src={option.avatar}
                              />

                              <Box
                                sx={{
                                  ml: "8px",
                                  color: theme.navy,
                                  fontSize: 14,
                                }}
                              >
                                {option.label}
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                    </SelectCustom>

                    <ButtonComponent
                      props={{
                        bgColor: theme.lightGray,
                        color: theme.navy,
                        square: true,
                      }}
                      sx={{
                        display: !showBtnRemoveAdmin && "none",
                        ml: "20px",
                        width: "54px",
                        height: "32px",
                        fontWeight: 400,
                        fontSize: 14,
                      }}
                      onClick={handleRemoveAdmin}
                    >
                      {t("community:setting.form.remove")}
                    </ButtonComponent>
                  </Box>
                </ThemeProvider>

                <TypographyButton
                  sx={{
                    mt: "20px",
                    fontSize: 14,
                  }}
                >
                  {t("community:setting.form.add")}
                </TypographyButton>
              </GridContent>

              <GridTitle item xs={12} sm={3}>
                <BoxTitle>{t("community:setting.form.role-create-post")}</BoxTitle>
              </GridTitle>
              <GridContent item xs={12} sm={9}>
                <ThemeProvider theme={themeSelect}>
                  <SelectCustom
                    value={roleCreatePostSelected}
                    onChange={handleChangeRoleCreatePost}
                    displayEmpty
                    inputProps={{ "aria-label": "Role join" }}
                  >
                    <MenuItem disabled value="">
                      <span>{t("community:setting.form.placeholder.role-create-post")}</span>
                    </MenuItem>
                    {infoCommunitySetting.rolesCreatePost &&
                      infoCommunitySetting.rolesCreatePost.map((option, index) => (
                        <MenuItem key={index.toString()} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </SelectCustom>
                </ThemeProvider>
              </GridContent>

              <GridTitle item xs={12} sm={3}>
                <BoxTitle>{t("community:setting.form.role-join")}</BoxTitle>
              </GridTitle>
              <GridContent item xs={12} sm={9}>
                <RadioGroup
                  aria-label="gender"
                  name="controlled-radio-buttons-group"
                  value={roleJoinSelected}
                  onChange={handleChangeRoleJoin}
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
              <Grid item xs={12} sm={9}>
                <InputCustom
                  sx={{
                    display: ["none", "inherit"],
                    ml: 1,
                    flex: 1,
                  }}
                  placeholder={t("community:setting.form.placeholder.tag")}
                  inputProps={{ "aria-label": t("community:setting.form.placeholder.tag") }}
                />

                <InputCustom
                  sx={{
                    display: { sm: "none" },
                    ml: 1,
                    flex: 1,
                  }}
                  placeholder={t("community:setting.form.placeholder.tag-SP")}
                  inputProps={{ "aria-label": t("community:setting.form.placeholder.tag-SP") }}
                />

                <Box>
                  <Paper
                    sx={{
                      mt: "12px",
                      display: "flex",
                      flexWrap: "wrap",
                      listStyle: "none",
                      boxShadow: "none",
                    }}
                  >
                    {tagData?.map((data) => (
                      <ListItem
                        key={data.key}
                        sx={{
                          px: "3px",
                          width: "auto",
                        }}
                      >
                        <Chip
                          label={data.label}
                          onDelete={handleDeleteTag(data)}
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
                onClick={!disableBtnSubmit ? handleSaveSuccess : null}
              >
                {t("community:button.setting.save")}
              </ButtonComponent>

              <TypographyButton
                sx={{
                  mt: "40px",
                }}
                onClick={handleOpenDialog}
              >
                {t("community:setting.form.delete-community")}
              </TypographyButton>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <MemberComponent />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ParticipatedMemberComponent />
        </TabPanel>
      </Box>

      <DialogConfirmComponent
        title={t("community:setting.form.dialog.title")}
        content={t("community:setting.form.dialog.content")}
        btnLeft={t("community:button.dialog.cancel-2")}
        btnRight={t("community:button.dialog.delete-community")}
        isShow={openDialog}
        handleClose={handleCloseDialog}
        handleCancel={handleDialogCancel}
        handleOK={handleDialogOK}
      />
    </React.Fragment>
  );
};
export default CommunityCreateComponent;
