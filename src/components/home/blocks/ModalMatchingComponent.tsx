import { Avatar, Box, Button, Grid, Modal } from "@mui/material";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ButtonComponent from "src/components/common/elements/ButtonComponent";
import { Field } from "src/components/common/Form/_Field";
import styles from "src/components/home/home.module.scss";
import { MATCHING_PURPOSE_OPTIONS } from "src/constants/constants";
import { IStoreState } from "src/constants/interface";
import { VALIDATE_FORM_MATCHING_REQUEST } from "src/messages/validate";
import actionTypes from "src/store/actionTypes";

interface IModalMatchingComponentProps {
  open: boolean;
  setOpen: Function;
  userRequestMatching?: any;
  handleSendMatchingRequest?: Function;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 640,
  boxShadow: 24,
  borderRadius: "12px",
  p: 5,
  pb: 4,
  maxWidth: "90%",
  marginTop: "5px",
  paddingTop: "60px",
  padding: "20px",
};

const ModalMatchingComponent: React.SFC<IModalMatchingComponentProps> = ({
  open,
  setOpen,
  userRequestMatching,
  handleSendMatchingRequest,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state: IStoreState) => state.user);

  const [matchingRequest, setMatchingRequest] = useState({
    purpose: "",
    // desired_match_date: new Date()?.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }),
    // meeting_link: "",
    message: null,
  });

  const [errorValidates, setErrorValidates] = useState({
    purpose: null,
    // desired_match_date: null,
    // meeting_link: null,
    message: null,
  });

  const onChangeMatchingRequest = (key: string, value: any) => {
    setMatchingRequest({
      ...matchingRequest,
      [key]: typeof value === "string" ? value.trim() : value,
    });
  };

  const handleValidateForm = () => {
    let isValidForm = true;
    const errorMessages = {
      purpose: null,
      // desired_match_date: null,
      // meeting_link: null,
      message: null,
    };
    // validate purpose;
    if (!matchingRequest?.purpose || matchingRequest?.purpose?.length === 0) {
      isValidForm = false;
      errorMessages.purpose = VALIDATE_FORM_MATCHING_REQUEST.purpose.required;
    }
    // validate message
    if (!matchingRequest?.message || matchingRequest?.message?.length === 0) {
      isValidForm = false;
      errorMessages.message = VALIDATE_FORM_MATCHING_REQUEST.message.required;
    } else if (matchingRequest?.message?.length > 1000) {
      isValidForm = false;
      errorMessages.message = VALIDATE_FORM_MATCHING_REQUEST.message.max_length;
    }
    // validate desired_match_date
    // if (matchingRequest?.desired_match_date) {
    //   if (
    //     JSON.stringify(matchingRequest?.desired_match_date) === "null" ||
    //     matchingRequest?.desired_match_date === "Invalid Date"
    //   ) {
    //     isValidForm = false;
    //     errorMessages.desired_match_date = VALIDATE_FORM_MATCHING_REQUEST.desired_match_date.invalid_date;
    //   }
    // } else {
    //   isValidForm = false;
    //   errorMessages.desired_match_date = VALIDATE_FORM_MATCHING_REQUEST.desired_match_date.required_date;
    // }

    // validate meeting_link
    // if (matchingRequest?.meeting_link?.length > 0 && !REGEX_RULES.url.test(matchingRequest?.meeting_link)) {
    //   isValidForm = false;
    //   errorMessages.meeting_link = VALIDATE_FORM_MATCHING_REQUEST.meeting_link.invalid_url;
    // }

    setErrorValidates(errorMessages);
    return isValidForm;
  };

  const submitMatchingRequest = async () => {
    if (handleValidateForm()) {
      await handleSendMatchingRequest(matchingRequest);
      setMatchingRequest({
        // desired_match_date: new Date()?.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }),
        purpose: "",
        // meeting_link: "",
        message: null,
      });
      dispatch({ type: actionTypes.ADD_MATCH_REQUEST_COUNT, payload: auth });
      dispatch({ type: actionTypes.ADD_MATCH_REQUEST_PENDING_COUNT, payload: auth });
      dispatch({ type: actionTypes.ADD_FAVORITE, payload: auth });
    }
  };

  const handleClose = () => {
    setMatchingRequest({
      // desired_match_date: new Date()?.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }),
      purpose: "",
      // meeting_link: "",
      message: null,
    });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ overflow: "scroll" }}
    >
      <Box sx={style} className={classNames(styles.modalMatchingRequest, "gth-modal")}>
        <Button className="icon-close" onClick={handleClose}>
          <img src="/assets/images/home_page/ic_close_modal.svg" alt="close-modal" />
        </Button>
        <div className="title-modal" id="modal-modal-title">
          <Avatar
            alt={userRequestMatching?.username}
            src={userRequestMatching?.profile_image || "/assets/images/home_page/ic_avatar_modal.svg"}
            sx={{ width: 32, height: 32 }}
          />
          <span className="name">{`${userRequestMatching?.username ?? ""} さんへのマッチングリクエスト`}</span>
        </div>

        <form className="form-content">
          <Field
            id="purpose"
            required
            label={t("home:modal-matching.purpose")}
            placeholder={t("home:modal-matching.purpose-placeholder")}
            editor="dropdown"
            value={matchingRequest?.purpose}
            options={MATCHING_PURPOSE_OPTIONS}
            onChangeValue={onChangeMatchingRequest}
            error={errorValidates.purpose}
          />

          {/* <Field
            id="meeting_link"
            label={t("home:modal-matching.frequency")}
            placeholder="https://www.〇〇.jp"
            editor="textbox"
            value={matchingRequest?.meeting_link}
            onChangeValue={onChangeMatchingRequest}
            error={errorValidates.meeting_link}
          /> */}

          {/* <Field
            id="desired_match_date"
            required
            label={t("home:modal-matching.frequency")}
            placeholder={t("home:modal-matching.frequency-placeholder")}
            editor="date-picker"
            value={matchingRequest?.desired_match_date}
            onChangeValue={onChangeMatchingRequest}
            error={errorValidates.desired_match_date}
          /> */}

          <Field
            id="message"
            required
            label={t("home:modal-matching.message")}
            placeholder={t("home:modal-matching.message-placeholder")}
            editor="textarea"
            value={matchingRequest?.message}
            onChangeValue={onChangeMatchingRequest}
            error={errorValidates.message}
          />

          <Grid container>
            <Grid item xs={12} sx={{ mt: 4, textAlign: "center" }}>
              <ButtonComponent mode="gradient" sx={{ width: "70%" }} onClick={() => submitMatchingRequest()}>
                {t("home:modal-matching.button")}
              </ButtonComponent>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalMatchingComponent;
