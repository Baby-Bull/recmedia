import { Avatar, Box, Button, Checkbox, Typography } from "@mui/material";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Radio from "@mui/material/Radio";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useTranslation } from "next-i18next";

import { userReview } from "src/services/user";
import theme from "src/theme";
import { VALIDATE_FORM_USER_REVIEW } from "src/messages/validate";
import TwitterShareButton from "lib/ShareButtons/TwitterShareButton";

interface IReportUserProps {
  showPopup: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowPopup: (status: boolean) => void;
  user?: any;
}

/* event change select option */
const DialogReview = styled(Dialog)({
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
  },
  "@media (max-width: 1200px)": {
    "& .MuiDialog-paper": {
      width: "93%",
      paddingLeft: "20px",
      paddingRight: "20px",
    },
  },
});

const TypoTitleReview = styled(Typography)({
  fontSize: "20px",
  fontWeight: 700,
  lineHeight: "24px",
  color: theme.navy,
  width: "100px",
  display: "flex",
  alignItems: "center",
  "@media (max-width: 1200px)": {
    fontSize: "16px",
    marginBottom: "14px",
  },
});

const TypoContentReview = styled(Typography)({
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "24px",
  color: theme.navy,
  display: "flex",
  alignItems: "center",
  "@media (max-width: 1200px)": {
    alignItems: "unset",
  },
});

const FieldTextAreaReview = styled(TextareaAutosize)({
  width: "440px",
  border: "1px solid #03BCDB",
  backgroundColor: "#fff",
  fontSize: 16,
  fontFamily: "Noto Sans JP",
  padding: "9px 16px",
  borderRadius: "12px",
  "&:placeholder": { color: theme.gray },
  "@media (max-width: 1200px)": {
    fontSize: 14,
    width: "293px",
  },
});

const FieldTextAreaCheck = styled(TextareaAutosize)({
  width: "440px",
  fontSize: 16,
  fontFamily: "Noto Sans JP",
  background: theme.whiteBlue,
  border: "none",
  "@media (max-width: 1200px)": {
    width: "293px",
  },
});

const BoxContentReview = styled(Box)({
  display: "flex",
  marginBottom: "25px",
  "@media (max-width: 1200px)": {
    display: "block",
    marginBottom: "40px",
  },
});

const BoxContentReviewIsCheck = styled(Box)({
  display: "flex",
  marginBottom: "25px",
  "@media (max-width: 1200px)": {
    display: "flex",
    marginBottom: "40px",
  },
});

const PopupReviewComponent: React.SFC<IReportUserProps> = ({ showPopup, setShowPopup, user }) => {
  const { t } = useTranslation();
  const [isCheck, setIsCheck] = React.useState(false);
  const [isPost, setIsPost] = React.useState(false);

  const isGood = "good";
  const isBad = "bad";
  const [selectedValueRating, setSelectedValueRating] = React.useState(isGood);
  const [selectedHideReviewer, setSelectedHideReviewer] = React.useState(false);
  const [selectedReportToAdmin, setSelectedReportToAdmin] = React.useState(false);
  const [valueComment, setValueComment] = React.useState("");
  const [userReviewRequest, setUserReviewRequest] = useState({
    rating: selectedValueRating,
    comment: valueComment,
    hide_reviewer: selectedHideReviewer,
    send_report_to_admin: selectedReportToAdmin,
  });

  const errorMessages = {
    comment: null,
  };

  const [errorValidates, setErrorValidates] = useState({
    comment: null,
  });

  const handleValidateForm = () => {
    let isValidForm = true;
    if (!userReviewRequest?.comment) {
      isValidForm = false;
      errorMessages.comment = VALIDATE_FORM_USER_REVIEW.comment.required;
    } else if (userReviewRequest?.comment && userReviewRequest?.comment?.length > 400) {
      isValidForm = false;
      errorMessages.comment = VALIDATE_FORM_USER_REVIEW.comment.max_length;
    }
    setErrorValidates(errorMessages);
    return isValidForm;
  };

  const handleRefetchData = () => {
    setSelectedValueRating(isGood);
    setSelectedHideReviewer(false);
    setSelectedReportToAdmin(false);
    setValueComment("");
    setUserReviewRequest({
      rating: isGood,
      comment: "",
      hide_reviewer: false,
      send_report_to_admin: false,
    });
  };
  const handleClose = () => {
    setShowPopup(false);
    setIsPost(false);
    setIsCheck(false);
    handleRefetchData();
  };

  const handleIsCheck = () => {
    if (handleValidateForm()) {
      setIsCheck(true);
    }
  };

  const onChangeReviewRequest = (key: string, value: any) => {
    if (key === "rating") {
      setSelectedValueRating(value);
    }

    if (key === "hide_reviewer") {
      setSelectedHideReviewer(value);
    }

    if (key === "send_report_to_admin") {
      setSelectedReportToAdmin(value);
    }

    if (key === "comment") {
      setValueComment(value?.trim());
    }

    // eslint-disable-next-line no-unreachable
    setUserReviewRequest({
      ...userReviewRequest,
      [key]: typeof value === "string" ? value.trim() : value,
    });
  };

  const submitUserReviewRequest = async () => {
    const res = await userReview(user?.id, userReviewRequest);
    setIsPost(true);
    handleRefetchData();
    return res.data;
  };

  // @ts-ignore
  return (
    <Box>
      <DialogReview
        open={showPopup}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ display: isPost ? "block" : "none" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            m: { xs: "8px -14px 0 0", lg: "24px -8px 0 0" },
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          <Avatar src="/assets/images/icon/ic_close.png" />
        </Box>
        <DialogContent>
          <Box sx={{ textAlign: { xs: "left", lg: "center" }, m: "30px 0 96px 0" }}>
            <Typography sx={{ fontSize: "20px", fontWeight: "700", lineHeight: "40px", color: theme.navy }}>
              {t("chat:popup.text-thanks-review")}
            </Typography>
            <Typography sx={{ fontSize: "20px", fontWeight: "700", lineHeight: "40px", color: theme.navy }}>
              {t("chat:popup.text-share-review")}
            </Typography>
            <TwitterShareButton
              title={`${user?.username} さんとお話ししてみました！ \n 気になる”あの人”と話してみよう！ \n`}
              url={`${process?.env?.NEXT_PUBLIC_URL_PROFILE}/profile/${user?.id} #goodhub`}
            >
              <Button
                sx={{
                  background: "#55ACEE",
                  color: "#fff",
                  width: "280px",
                  height: "48px",
                  mt: "37px",
                  borderRadius: "40px",
                  "&:hover": {
                    background: "#55ACEE",
                  },
                }}
              >
                <Avatar
                  src="/assets/images/logo/logo_twitter.png"
                  sx={{ width: "27px", height: "21.9px", mr: "13px" }}
                />
                {t("chat:popup.twitter")}
              </Button>
            </TwitterShareButton>
          </Box>
        </DialogContent>
      </DialogReview>
      <DialogReview
        open={showPopup}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ display: isPost ? "none" : "block" }}
      >
        <Box
          sx={{
            display: isCheck ? "none" : "flex",
            justifyContent: "end",
            m: { xs: "8px -14px 0 0", lg: "8px -32px 0 0" },
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          <Avatar src="/assets/images/icon/ic_close.png" />
        </Box>
        <DialogTitle sx={{ p: isCheck ? "40px 0 40px 0" : "0 0 40px 0" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={user?.profile_image} alt={user?.username} />
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "24px",
                ml: "20px",
              }}
            >
              {user?.username} {t("chat:popup.review")}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: "0", display: isCheck ? "none" : "block" }}>
          <DialogContentText id="alert-dialog-description">
            <BoxContentReview>
              <TypoTitleReview>{t("chat:popup.evaluation")}</TypoTitleReview>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Radio
                    checked={selectedValueRating === isGood}
                    onChange={(e) => onChangeReviewRequest("rating", e.target.value)}
                    value={isGood}
                    name="radio-buttons"
                    sx={{
                      color: theme.blue,
                      mr: "15px",
                      p: 0,
                      "&.Mui-checked": {
                        color: theme.blue,
                      },
                    }}
                  />
                  <Typography fontWeight={500} color={theme.navy}>
                    {t("chat:popup.form.it-was-good")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", ml: "29px" }}>
                  <Radio
                    checked={selectedValueRating === isBad}
                    onChange={(e) => onChangeReviewRequest("rating", e.target.value)}
                    value={isBad}
                    name="radio-buttons"
                    sx={{
                      color: theme.blue,
                      mr: "15px",
                      p: 0,
                      "&.Mui-checked": {
                        color: theme.blue,
                      },
                    }}
                  />
                  <Typography fontWeight={500} color={theme.navy}>
                    {t("chat:popup.form.it-was-bad")}
                  </Typography>
                </Box>
              </Box>
            </BoxContentReview>
            <BoxContentReview>
              <TypoTitleReview>{t("chat:popup.report")}</TypoTitleReview>
              <Box sx={{ display: "flex" }}>
                <Checkbox
                  onChange={(e) => onChangeReviewRequest("send_report_to_admin", e.target.checked)}
                  value
                  sx={{
                    p: 0,
                    mr: "15px",
                    color: theme.blue,
                    "&.Mui-checked": {
                      color: theme.blue,
                    },
                  }}
                />
                <Typography fontWeight={500} color={theme.navy}>
                  {t("chat:popup.form.report-management")}
                </Typography>
              </Box>
            </BoxContentReview>
            <BoxContentReview>
              <TypoTitleReview>{t("chat:popup.anonymous")}</TypoTitleReview>
              <Box sx={{ display: "flex" }}>
                <Checkbox
                  onChange={(e) => onChangeReviewRequest("hide_reviewer", e.target.checked)}
                  value
                  sx={{
                    p: 0,
                    mr: "15px",
                    color: theme.blue,
                    "&.Mui-checked": {
                      color: theme.blue,
                    },
                  }}
                />
                <Typography fontWeight={500} color={theme.navy}>
                  {t("chat:popup.form.post-anonymously")}
                </Typography>
              </Box>
            </BoxContentReview>
            <BoxContentReview>
              <TypoTitleReview sx={{ alignItems: "unset" }}>{t("chat:popup.comment")}</TypoTitleReview>
              <Box>
                <FieldTextAreaReview
                  minRows={12}
                  placeholder={t("chat:popup.form.placeholder.comment")}
                  onChange={(e) => onChangeReviewRequest("comment", e.target.value)}
                />
                <Box sx={{ color: "red" }}>{errorValidates.comment}</Box>
              </Box>
            </BoxContentReview>
          </DialogContentText>
        </DialogContent>
        <DialogContent sx={{ p: "0", display: isCheck ? "block" : "none" }}>
          <DialogContentText id="alert-dialog-description">
            <BoxContentReviewIsCheck>
              <TypoTitleReview>{t("chat:popup.evaluation")} </TypoTitleReview>
              <TypoContentReview>
                {selectedValueRating === isGood ? t("chat:popup.form.it-was-good") : t("chat:popup.form.it-was-bad")}
              </TypoContentReview>
            </BoxContentReviewIsCheck>
            <BoxContentReviewIsCheck>
              <TypoTitleReview>{t("chat:popup.report")}</TypoTitleReview>
              <TypoContentReview>
                {selectedReportToAdmin
                  ? t("chat:popup.form.report-management")
                  : t("chat:popup.form.report-management-null")}
              </TypoContentReview>
            </BoxContentReviewIsCheck>
            <BoxContentReviewIsCheck>
              <TypoTitleReview>{t("chat:popup.anonymous")}</TypoTitleReview>
              <TypoContentReview>
                {selectedHideReviewer
                  ? t("chat:popup.form.post-anonymously")
                  : t("chat:popup.form.post-anonymously-null")}
              </TypoContentReview>
            </BoxContentReviewIsCheck>
            <BoxContentReviewIsCheck sx={{ display: "display !important" }}>
              <TypoTitleReview sx={{ alignItems: "unset" }}>{t("chat:popup.comment")}</TypoTitleReview>
              <Box>
                <FieldTextAreaCheck minRows={12} value={valueComment} />
              </Box>
            </BoxContentReviewIsCheck>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ dislay: "flex", justifyContent: "center", pb: "31px" }}>
          <Box sx={{ display: isCheck ? "none" : "block" }}>
            <Button
              sx={{
                background: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
                color: "#fff",
                borderRadius: { xs: "28px", lg: "40px" },
                width: { xs: "240px", lg: "280px" },
                height: { xs: "56px", lg: "48px" },
              }}
              onClick={() => handleIsCheck()}
            >
              {t("chat:popup.check-review")}
            </Button>
          </Box>
          <Box sx={{ display: isCheck ? "block" : "none", textAlign: "center" }}>
            <Box>
              <Button
                sx={{
                  background: "linear-gradient(90deg, #03BCDB 0%, #03DBCE 100%)",
                  color: "#fff",
                  borderRadius: { xs: "28px", lg: "40px" },
                  width: { xs: "240px", lg: "280px" },
                  height: { xs: "56px", lg: "48px" },
                  mb: "20px",
                }}
                onClick={() => submitUserReviewRequest()}
              >
                {t("chat:popup.post-review")}
              </Button>
            </Box>
            <Button
              sx={{
                background: theme.gray,
                color: "#fff",
                borderRadius: "40px",
                width: "200px",
                height: "40px",
              }}
              onClick={() => setIsCheck(false)}
            >
              {t("chat:popup.to-fix")}
            </Button>
          </Box>
        </DialogActions>
      </DialogReview>
    </Box>
  );
};
export default PopupReviewComponent;
