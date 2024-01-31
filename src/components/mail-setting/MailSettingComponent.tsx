import { Avatar, Box, Typography, Button, Chip, InputLabel, InputBase } from "@mui/material";
import React, { useState, useEffect } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";

import ButtonComponent from "src/components/common/ButtonComponent";
import PopupOptionRecommendComponent from "src/components/mail-setting/PopupOptionRecommendComponent";
// eslint-disable-next-line import/order
import theme from "src/theme";
import "typeface-roboto";

import { REGEX_RULES, VALIDATE_MESSAGE_FORM_REGISTER } from "src/messages/validate";
import { userSettingEmail, userSettingNotification } from "src/services/user";
import { IStoreState } from "src/constants/interface";
import actionTypes from "src/store/actionTypes";

import { notifyMess, notifyRecommend } from "./mockData";

const TabPanel = (props) => {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const TitleTab = styled(Tab)({
  fontWeight: 500,
  color: theme.navy,
  lineHeight: "23.17px",
  fontSize: "16px",
  marginTop: "30px",
  "&.Mui-selected": {
    background: theme.blue,
    color: "#fff",
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",
    fontWeight: 700,
  },
  "@media (max-width: 1200px)": {
    height: "78px",
    background: "#fff",
    width: "50%",
    border: "1px solid rgba(196, 196, 196, 0.4)",
    "&.Mui-selected": {
      borderRadius: "0",
    },
  },
});

const InputCustom = styled(InputBase)({
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: "white",
    border: `1px solid ${theme.blue}`,
    fontSize: 16,
    padding: "10px 12px",
    borderRadius: 12,
    fontFamily: "Noto Sans",
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
    },
  },
});

const IcQuestion = styled(Avatar)({
  width: "18px",
  height: "22px",
  marginLeft: "8px",
  cursor: "pointer",
});

const BtnSave = styled(Button)({
  width: "200px",
  height: "48px",
  marginTop: "80px",
  borderRadius: "24px",
  "@media (max-width: 1200px)": {
    marginBottom: "31px",
    marginTop: "66px",
  },
});

const MailSettingComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state: IStoreState) => state.user);

  const [value, setValue] = React.useState(1);
  const [isNotifyMess, setIsNotifyMess] = React.useState(true);
  const [valueOnchange, setValueOnchange] = React.useState(false);
  const [mailOnChange, setMailOnChange] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState(false);
  const [newRecommended, setNewRecommended] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [settingNotificationRequest, setSettingNotificationRequest] = useState({
    new_message_email_notify: auth?.setting?.new_message_email_notify,
    new_recommended_user_email_notify: auth?.setting?.new_recommended_user_email_notify,
  });

  useEffect(() => {
    setNewMessage(auth?.setting?.new_message_email_notify);
    setNewRecommended(auth?.setting?.new_recommended_user_email_notify);
    // setEmail(auth?.email);
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopupNotifyMess = () => {
    setShowPopup(true);
    setIsNotifyMess(true);
  };

  const handleShowPopupNotifyRecommend = () => {
    setShowPopup(true);
    setIsNotifyMess(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [settingMailRequest, setSettingMailRequest] = useState({
    email: null,
  });

  const errorMessages = {
    email: null,
  };

  const [errorValidates, setErrorValidates] = useState({
    email: null,
  });

  // setting notification
  const onChangeSettingNotificationRequest = (key: string, valueRequest: any) => {
    setValueOnchange(true);
    if (key === "new_message_email_notify") {
      setNewMessage(valueRequest);
    }
    if (key === "new_recommended_user_email_notify") {
      setNewRecommended(valueRequest);
    }
    setSettingNotificationRequest({
      ...settingNotificationRequest,
      [key]: typeof valueRequest === "string" ? valueRequest.trim() : valueRequest,
    });
  };
  // submit setting notification
  const handleSaveSettingNotification = async () => {
    const res = await userSettingNotification(settingNotificationRequest);
    if (res) {
      setValueOnchange(false);
      auth.setting = settingNotificationRequest;
      dispatch({ type: actionTypes.UPDATE_PROFILE, payload: auth });
    }
  };

  // on chage email
  const onChangeSettingMailRequest = (key: string, valueRequest: any) => {
    setEmail(valueRequest);
    setMailOnChange(true);
    setSettingMailRequest({
      ...settingMailRequest,
      [key]: typeof valueRequest === "string" ? valueRequest.trim() : valueRequest,
    });
  };

  // validate form
  const handleValidateForm = () => {
    let isValidForm = true;
    // validate purpose;
    if (!settingMailRequest?.email || settingMailRequest?.email?.length === 0) {
      isValidForm = false;
      errorMessages.email = VALIDATE_MESSAGE_FORM_REGISTER.email.required;
    } else if (!REGEX_RULES.email.test(settingMailRequest.email)) {
      isValidForm = false;
      errorMessages.email = VALIDATE_MESSAGE_FORM_REGISTER.email.invalid;
    }
    setErrorValidates(errorMessages);
    return isValidForm;
  };

  // submit setting mail
  const submitSettingMailRequest = async () => {
    if (handleValidateForm()) {
      const res = await userSettingEmail(settingMailRequest);
      if (res === true) {
        setMailOnChange(false);
        auth.email = settingMailRequest.email;
        dispatch({ type: actionTypes.UPDATE_PROFILE, payload: auth });
      }
    }
  };

  // @ts-ignore
  return (
    <Box
      sx={{
        background: theme.whiteBlue,
        p: { xs: "0 0 0 0", lg: "40px 200px 129px 40px" },
        mt: "65px",
      }}
    >
      <Box sx={{ mb: { xs: "80%", lg: "200px" } }}>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "block", lg: "flex" },
            height: { xs: "375px", lg: "475px" },
          }}
        >
          <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            sx={{
              width: { xs: "100%", lg: "20%" },
              background: theme.whiteBlue,
              border: "none",
              "& .MuiTabs-flexContainer": {
                display: { xs: "block", lg: "flex" },
                marginTop: { xs: "30px", lg: "0" },
                flexDirection: { xs: "row", lg: "column" },
              },
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: "transparent",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", lg: "start" } }}>
              <Avatar
                src="/assets/images/icon/ic_setting_black.png"
                sx={{ width: "18px", height: "22px", mr: "8px" }}
              />
              <Typography fontWeight={700} fontSize={20} lineHeight="28.96px" color={theme.navy}>
                {t("mail-setting:configuration")}
              </Typography>
            </Box>
            <TitleTab
              label={
                <Typography component="span" sx={{ width: "100%", textAlign: { xs: "center", lg: "left" } }}>
                  {t("mail-setting:email-address-setting")}
                </Typography>
              }
              {...a11yProps(0)}
            />
            <TitleTab
              label={
                <Typography component="span" sx={{ width: "100%", textAlign: { xs: "center", lg: "left" } }}>
                  {t("mail-setting:notification-settings")}
                </Typography>
              }
              {...a11yProps(1)}
            />
          </Tabs>
          <Box
            sx={{
              background: "#fff",
              borderRadius: "12px",
              m: { xs: "24px 20px 0px 20px", lg: "0" },
              width: { xs: "unset", lg: "80%" },
            }}
          >
            <TabPanel value={value} index={1}>
              <Box sx={{ p: { xs: "0", lg: "6px 0 0 59px" } }}>
                <Box
                  sx={{
                    mb: "19px",
                    display: "block",
                    textAlign: { xs: "center", lg: "start" },
                  }}
                >
                  <Typography component="span" fontSize={20} fontWeight={700} lineHeight="28.96px" color={theme.navy}>
                    {t("mail-setting:email-address-setting")}
                  </Typography>
                </Box>
                <Typography
                  fontFamily="Roboto"
                  fontWeight={400}
                  lineHeight="28.96px"
                  color={theme.navy}
                  sx={{
                    fontSize: { xs: 14, lg: 16 },
                  }}
                >
                  {t("mail-setting:mail-setting-description")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: "40px" }}>
                  <Typography component="div" fontSize={14} fontWeight={500} lineHeight="18.75px" color={theme.navy}>
                    {t("mail-setting:your-current-email-address")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: "18px" }}>
                  <Typography component="div" fontSize={14} fontWeight={400} lineHeight="18.75px" color={theme.navy}>
                    {auth?.email}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mt: "39px" }}>
                  <InputLabel
                    shrink
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    <Box display="flex">
                      {t("mail-setting:new-email-address")}
                      <Chip
                        label="必須"
                        sx={{
                          display: "",
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
                </Box>
                <InputCustom
                  onChange={(e) => onChangeSettingMailRequest("email", e.target.value)}
                  placeholder={auth?.email}
                  id="mail"
                  value={email}
                />
                <Box sx={{ color: "#FF9458", fontSize: "10px" }}>{errorValidates.email}</Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: "55px",
                    justifyContent: { xs: "center", lg: "start" },
                  }}
                >
                  <ButtonComponent
                    sx={{
                      background: mailOnChange ? "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)" : theme.gray,
                      color: "#fff",
                      "&:hover": {
                        background: mailOnChange ? "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)" : theme.gray,
                      },
                    }}
                    props={{
                      mode: "gradient",
                      dimension: "x-medium",
                    }}
                    onClick={submitSettingMailRequest}
                  >
                    {t("mail-setting:send")}
                  </ButtonComponent>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Box sx={{ p: { xs: "0", lg: "6px 0 0 59px" } }}>
                <Box sx={{ mb: "40px", display: { xs: "none", lg: "block" } }}>
                  <Typography component="span" fontSize={20} fontWeight={700} lineHeight="28.96px" color={theme.navy}>
                    {t("mail-setting:notification-settings")}
                  </Typography>
                </Box>
                <Typography
                  component="span"
                  fontWeight={700}
                  color={theme.gray}
                  sx={{ fontSize: { xs: "20px", lg: "24px" }, lineHeight: { xs: "23.44px", lg: "28.13px" } }}
                >
                  {t("mail-setting:email-reception-settings")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: "23px" }}>
                  <Typography component="span" fontSize={16} fontWeight={300} lineHeight="18.75px" color={theme.navy}>
                    {t("mail-setting:message-notification")}
                  </Typography>
                  <IcQuestion src="/assets/images/icon/ic_question_blue.png" onClick={handleShowPopupNotifyMess} />
                  <Checkbox
                    checked={newMessage}
                    sx={{
                      ml: "65px",
                      color: theme.blue,
                      "&.Mui-checked": {
                        color: theme.blue,
                      },
                    }}
                    onChange={(e) => onChangeSettingNotificationRequest("new_message_email_notify", e.target.checked)}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: { xs: "40px", lg: "0" } }}>
                  <Typography component="span" fontSize={16} fontWeight={300} lineHeight="18.75px" color={theme.navy}>
                    {t("mail-setting:recommendation-notification")}
                  </Typography>
                  <IcQuestion src="/assets/images/icon/ic_question_blue.png" onClick={handleShowPopupNotifyRecommend} />
                  <Checkbox
                    checked={newRecommended}
                    sx={{
                      ml: "65px",
                      color: theme.blue,
                      "&.Mui-checked": {
                        color: theme.blue,
                      },
                    }}
                    onChange={(e) =>
                      onChangeSettingNotificationRequest("new_recommended_user_email_notify", e.target.checked)
                    }
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: { xs: "center", lg: "start" } }}>
                  <BtnSave
                    sx={{
                      background: valueOnchange ? "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)" : theme.gray,
                      color: "#fff",
                      "&:hover": {
                        background: valueOnchange ? "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)" : theme.gray,
                      },
                    }}
                    onClick={handleSaveSettingNotification}
                  >
                    {t("mail-setting:save-changes")}
                  </BtnSave>
                </Box>
              </Box>
            </TabPanel>
          </Box>
        </Box>
      </Box>
      <PopupOptionRecommendComponent
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        contentPopup={isNotifyMess ? notifyMess : notifyRecommend}
      />
    </Box>
  );
};
export default MailSettingComponent;
