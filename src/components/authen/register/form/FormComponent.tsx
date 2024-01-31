import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Card,
  CardActions,
  CardContent,
  Button,
  Paper,
  Chip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";
import GridLeftComponent from "src/components/authen/register/GridLeftComponent";
import { updateProfile } from "src/services/user";
import { REGEX_RULES, VALIDATE_MESSAGE_FORM_REGISTER } from "src/messages/validate";
import { USER_STATUS_OPTIONS } from "src/components/constants/constants";
import { JAPAN_PROVINCE_OPTIONS } from "src/constants/constants";
import RegisterPageHeaderComponent from "src/components/layouts/RegisterPageHeaderComponent";

import { Field } from "./Field";

const ListItem = styled("li")({
  marginRight: theme.spacing(0),
});

const FormRegisterComponents = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [isTutorialDone, setStep] = React.useState(false);
  const [hasAgree, setHasAgree] = useState(false);

  const [userInfo, setUserInfo] = useState({
    username: null,
    birthday: null,
    status: null,
    email: null,
    address: null,
    tags: [],
  });

  const [errorValidate, setErrorValidates] = useState({
    username: null,
    birthday: null,
    status: null,
    email: null,
    address: null,
    tags: null,
    checkbox: null,
  });

  const onChangeUserInfo = (key: string, value: any) => {
    setUserInfo({
      ...userInfo,
      [key]: typeof value === "string" ? value.trim() : value,
    });
  };

  const handleClickOpen = () => {
    setStep(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTutorialDone = () => {
    if (isTutorialDone) {
      setOpen(false);
    }
    setStep(true);
  };

  const [listChipData] = React.useState([
    { key: 0, label: "React" },
    { key: 1, label: "PHP勉強中" },
    { key: 2, label: "コードレビュー" },
    { key: 3, label: "駆け出しエンジニアと繋がりたい" },
    { key: 4, label: "要件定義" },
  ]);

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const onChangeCheckbox = () => {
    setHasAgree(!hasAgree);
  };

  const handleValidateForm = () => {
    let isValidForm = true;
    const errorMessages = {
      username: null,
      birthday: null,
      status: null,
      email: null,
      address: null,
      tags: null,
      checkbox: null,
    };
    // validate username;
    if (!userInfo?.username || userInfo?.username?.length === 0) {
      isValidForm = false;
      errorMessages.username = VALIDATE_MESSAGE_FORM_REGISTER.username.required;
    } else if (userInfo?.username?.length === 50) {
      isValidForm = false;
      errorMessages.username = VALIDATE_MESSAGE_FORM_REGISTER.username.max_length;
    } else if (!REGEX_RULES.username_register.test(userInfo?.username)) {
      isValidForm = false;
      errorMessages.username = VALIDATE_MESSAGE_FORM_REGISTER.username.invalid;
    }

    // validate birthday
    if (!userInfo?.birthday || userInfo?.birthday?.length === 0) {
      isValidForm = false;
      errorMessages.birthday = VALIDATE_MESSAGE_FORM_REGISTER.birthday.required;
    } else if (userInfo?.birthday?.length !== 0 && userInfo?.birthday?.error_invalid) {
      isValidForm = false;
      errorMessages.birthday = VALIDATE_MESSAGE_FORM_REGISTER.birthday.invalid_date;
    } else if (
      userInfo?.birthday?.length !== 0 &&
      dayjs(userInfo?.birthday?.dob_value).isAfter(dayjs().subtract(1, "day"))
    ) {
      isValidForm = false;
      errorMessages.birthday = VALIDATE_MESSAGE_FORM_REGISTER.birthday.future_input;
    }

    // validate email
    if (!userInfo?.email || userInfo?.email?.length === 0) {
      isValidForm = false;
      errorMessages.email = VALIDATE_MESSAGE_FORM_REGISTER.email.required;
    } else if (!REGEX_RULES.email.test(userInfo?.email)) {
      isValidForm = false;
      errorMessages.email = VALIDATE_MESSAGE_FORM_REGISTER.email.invalid;
    }

    // validate address
    if (!userInfo?.address || userInfo?.address?.length === 0) {
      isValidForm = false;
      errorMessages.address = VALIDATE_MESSAGE_FORM_REGISTER.address.required;
    }

    // validate status
    if (!userInfo?.status || userInfo?.status?.length === 0) {
      isValidForm = false;
      errorMessages.status = VALIDATE_MESSAGE_FORM_REGISTER.status.required;
    }

    // validate tags
    if (!userInfo?.tags || userInfo?.tags?.length === 0) {
      isValidForm = false;
      errorMessages.tags = VALIDATE_MESSAGE_FORM_REGISTER.tags.required;
    } else if (userInfo?.tags?.length < 2) {
      isValidForm = false;
      errorMessages.tags = VALIDATE_MESSAGE_FORM_REGISTER.tags.min_count;
    }

    // validate checkbox
    if (!hasAgree) {
      isValidForm = false;
      errorMessages.checkbox = VALIDATE_MESSAGE_FORM_REGISTER.checkbox;
    }

    setErrorValidates(errorMessages);
    return isValidForm;
  };

  const submitUpdateProfile = async () => {
    if (handleValidateForm()) {
      userInfo.birthday = userInfo?.birthday?.dob_value || userInfo.birthday;
      setIsLoading(true);
      const resUpdate = await updateProfile(userInfo);
      setIsLoading(false);
      if (resUpdate && !resUpdate?.error_code) {
        handleClickOpen();
      }
    }
  };

  return (
    <React.Fragment>
      <React.Fragment>
        {isLoading && (
          <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}

        <RegisterPageHeaderComponent />
        <Box sx={{ marginTop: "55px" }}>
          <Grid container>
            <GridLeftComponent smAndUp />

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  pt: [5, 9],
                  px: ["5%", "10%"],
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    pb: ["20px", "23px"],
                    fontSize: 20,
                    fontWeight: 700,
                    color: theme.navy,
                  }}
                >
                  {t("register:form.title")}
                </Typography>

                <form style={{ textAlign: "center", marginBottom: "63px" }}>
                  <Field
                    id="username"
                    required
                    label={t("register:form.label.name")}
                    placeholder={t("register:form.placeholder.name")}
                    editor="textbox"
                    onChangeValue={onChangeUserInfo}
                    error={errorValidate.username}
                  />

                  <Field
                    id="birthday"
                    required
                    label={t("register:form.label.birthday")}
                    placeholder={t("register:form.placeholder.birthday")}
                    onChangeValue={onChangeUserInfo}
                    editor="date-picker"
                    error={errorValidate.birthday}
                  />

                  <Field
                    id="status"
                    required
                    label={t("register:form.label.status")}
                    placeholder={t("register:form.placeholder.status")}
                    options={USER_STATUS_OPTIONS}
                    editor="dropdown"
                    onChangeValue={onChangeUserInfo}
                    error={errorValidate.status}
                  />
                  <Field
                    id="email"
                    required
                    label={t("register:form.label.email")}
                    placeholder={t("register:form.placeholder.email")}
                    editor="textbox"
                    onChangeValue={onChangeUserInfo}
                    error={errorValidate.email}
                  />
                  <Field
                    id="address"
                    required
                    label={t("register:form.label.place")}
                    placeholder={t("register:form.placeholder.place")}
                    editor="dropdown"
                    options={JAPAN_PROVINCE_OPTIONS}
                    onChangeValue={onChangeUserInfo}
                    error={errorValidate.address}
                  />
                  <Field
                    id="tags"
                    required
                    label={t("register:form.label.tag")}
                    placeholder={t("register:form.placeholder.tag")}
                    editor="multi-selection"
                    value={userInfo?.tags || []}
                    onChangeValue={onChangeUserInfo}
                    error={errorValidate.tags}
                  />
                  <Field
                    id="checkbox"
                    label={t("register:form.label.checkbox")}
                    editor="checkbox"
                    value={hasAgree}
                    onChangeCheckbox={onChangeCheckbox}
                    error={errorValidate.checkbox}
                  />

                  <ButtonComponent
                    props={{
                      mode: "gradient",
                      dimension: "x-medium",
                    }}
                    sx={{ marginTop: "8px" }}
                    onClick={submitUpdateProfile}
                  >
                    {t("register:form.submit")}
                  </ButtonComponent>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </React.Fragment>

      <Dialog
        PaperProps={{
          style: { borderRadius: 12 },
        }}
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth={fullWidth}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          id="scroll-dialog-title"
          sx={{
            backgroundColor: theme.whiteBlue,
            textAlign: "right",
            p: [0, "27px"],
            position: "relative",
          }}
        >
          <Fab
            variant="circular"
            // onClick={handleTutorialDone}
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: ["7px", "20px"],
              right: ["7px", "20px"],
              width: ["30px", "inherit"],
              height: ["30px", "inherit"],
              backgroundColor: "transparent",
              boxShadow: "unset",
              "&:hover": {
                backgroundColor: "transparent",
                opacity: 0.8,
              },
            }}
          >
            <Avatar
              variant="square"
              sx={{
                width: ["24px", "56px"],
                height: ["24px", "56px"],
                display: "flex",
                justifyContent: "center",
              }}
              // src={
              //   !isTutorialDone ? "/assets/images/svg/arrow-right-circle.svg" : "/assets/images/svg/delete-circle.svg"
              // }
              src="/assets/images/svg/delete-circle.svg"
            />
          </Fab>
        </DialogTitle>

        {!isTutorialDone ? (
          <DialogContent
            sx={{
              pb: "46px",
              backgroundColor: theme.whiteBlue,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: ["column-reverse", "row"],
                alignItems: "center",
                mt: ["53px", 0],
                position: "relative",
              }}
            >
              <Box sx={{ maxWidth: 320, flex: 2 }}>
                <Card
                  variant="outlined"
                  sx={{
                    display: ["none", "inherit"],
                    px: "8px",
                    pb: "16px",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        sx={{
                          fontSize: 10,
                          width: 130,
                          height: 20,
                          color: "white",
                          backgroundColor: theme.orange,
                          "&:hover": {
                            opacity: 0.9,
                            backgroundColor: theme.orange,
                          },
                        }}
                      >
                        {t("register:form.tutorial.button-status")}
                      </Button>

                      <Typography
                        sx={{
                          color: "#D8D8D8",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {t("register:form.tutorial.last-login")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        pt: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box height={80}>
                        <Avatar
                          sx={{
                            width: ["56px", "56px"],
                            height: ["56px", "56px"],
                            display: "flex",
                            justifyContent: "center",
                          }}
                          src="/assets/images/svg/goodhub.svg"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          sx={{
                            pl: "13px",
                            pb: "5px",
                            color: "#262A30",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {t("register:form.tutorial.name")}
                        </Typography>

                        <Typography
                          sx={{
                            pl: "13px",
                            pb: "5px",
                            color: theme.blue,
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          {t("register:form.tutorial.major")}
                        </Typography>

                        <Typography
                          sx={{
                            pl: "13px",
                            color: "#262A30",
                            fontSize: 10,
                            fontWeight: 400,
                          }}
                        >
                          {t("register:form.tutorial.vote")}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        color: theme.navy,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {t("register:form.tutorial.intro")}
                    </Typography>

                    <Typography
                      sx={{
                        color: theme.navy,
                        fontSize: 12,
                        fontWeight: 400,
                        textTransform: "",
                      }}
                    >
                      <Paper
                        sx={{
                          pl: 0,
                          mt: 1,
                          mb: 4,
                          maxWidth: "360px",
                          display: "flex",
                          flexWrap: "wrap",
                          listStyle: "none",
                          boxShadow: "none",
                        }}
                        component="ul"
                      >
                        {listChipData.map((data) => {
                          let icon;

                          return (
                            <ListItem key={data.key}>
                              <Chip
                                variant="outlined"
                                size="small"
                                icon={icon}
                                label={data.label}
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 400,
                                  backgroundColor: theme.whiteBlue,
                                  border: "none",
                                  color: theme.navy,
                                  borderRadius: "4px",
                                }}
                              />
                            </ListItem>
                          );
                        })}
                      </Paper>
                    </Typography>

                    <Box
                      sx={{
                        pt: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img src="/assets/images/svg/message.svg" alt="message" />

                      <Typography
                        sx={{
                          pl: "13px",
                          color: "#000",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        {t("register:form.tutorial.pr")}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        pt: "5px",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "#262A30",
                      }}
                    >
                      {t("register:form.tutorial.text-demo")}
                    </Typography>

                    <Box
                      sx={{
                        pt: "20px",
                        textAlign: "center",
                      }}
                    >
                      <ButtonComponent
                        variant="outlined"
                        props={{
                          dimension: "medium",
                          color: theme.blue,
                          borderColor: theme.blue,
                        }}
                        sx={{
                          height: 32,
                          textAlign: "center",
                        }}
                        startIcon={
                          <Avatar
                            variant="square"
                            sx={{ width: "100%", height: "100%" }}
                            src="/assets/images/svg/heart_outlined.svg"
                          />
                        }
                      >
                        {t("register:form.tutorial.button-add")}
                      </ButtonComponent>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <ButtonComponent
                      props={{
                        bgColor: theme.green,
                      }}
                      sx={{
                        "&:hover": { backgroundColor: theme.green },
                      }}
                    >
                      {t("register:form.tutorial.send-request")}
                    </ButtonComponent>
                  </CardActions>
                </Card>

                <Avatar
                  variant="square"
                  sx={{
                    pt: "17px",
                    width: "100%",
                    height: "100%",
                    display: ["", "none"],
                  }}
                  src="/assets/images/svg/register_tutorial_card.svg"
                />
              </Box>

              <Typography
                component="span"
                sx={{
                  flex: 1,
                  pl: [0, 3],
                  color: "black",
                  fontSize: [16, 20],
                  fontWeight: 700,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    display: ["none", "flex"],
                    flexDirection: "column",
                  }}
                >
                  <Typography component="span" fontWeight={700} fontSize={[16, 20]}>
                    まずは
                  </Typography>
                  <Typography component="span" fontWeight={700} fontSize={[16, 20]}>
                    マッチングリクエスト
                  </Typography>
                  <Typography component="span" fontWeight={700} fontSize={[16, 20]}>
                    を送って気になる人と
                  </Typography>
                  <Typography component="span" fontWeight={700} fontSize={[16, 20]}>
                    マッチしてみよう！
                  </Typography>
                </Typography>
                <Typography component="span" display={["inherit", "none"]}>
                  {t("register:form.tutorial.description")}
                </Typography>
              </Typography>

              <Box
                sx={{
                  display: ["none", "inherit"],
                  position: "absolute",
                  height: "30%",
                  bottom: "8%",
                  right: "28%",
                }}
              >
                <img src="/assets/images/svg/line-white.svg" alt="line-white" />
              </Box>
            </Box>
            <div
              style={{
                textAlign: "center",
                marginTop: "40px",
              }}
            >
              <ButtonComponent
                onClick={handleTutorialDone}
                props={{
                  dimension: "medium",
                  color: "white",
                  bgColor: theme.blue,
                }}
                sx={{
                  height: "56px",
                  "&:hover": { backgroundColor: theme.lightBlue },
                }}
              >
                {t("register:form.tutorial.next-tutorial")}
              </ButtonComponent>
            </div>
          </DialogContent>
        ) : (
          <React.Fragment>
            <DialogContent
              sx={{
                backgroundColor: theme.whiteBlue,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  pt: ["63px", "85px"],
                  display: "flex",
                  color: "black",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography pb="10px" fontWeight={700} fontSize={[16, 20]}>
                  マッチングが成立したら、メッセージで日程調整をして
                </Typography>
                <Typography fontWeight={700} fontSize={[16, 20]}>
                  ビデオ通話でお話ししてみましょう！
                </Typography>

                <Avatar
                  variant="square"
                  sx={{
                    pt: "35px",
                    width: ["80%", "40%"],
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  src="/assets/images/svg/account_with_phone.svg"
                />
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                backgroundColor: theme.whiteBlue,
                display: "flex",
                justifyContent: "center",
                pt: ["39px", "inherit"],
                pb: ["80px", "50px"],
              }}
            >
              <ButtonComponent
                props={{
                  bgColor: theme.blue,
                  dimension: "medium",
                  color: "white",
                }}
                sx={{
                  height: "56px",
                }}
                onClick={() => router.push("/")}
              >
                {t("register:form.tutorial.button-redirect-home")}
              </ButtonComponent>
            </DialogActions>
          </React.Fragment>
        )}
      </Dialog>
    </React.Fragment>
  );
};
export default FormRegisterComponents;
