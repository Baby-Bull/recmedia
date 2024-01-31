import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import { Avatar, Box, Typography } from "@mui/material";

import theme from "src/theme";

interface IContent {
  title: string;
  content1: string;
  content2: string;
}

interface IReportUserProps {
  showPopup: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowPopup: (status: boolean) => void;
  contentPopup: IContent;
}

/* event change select option */
const DialogReport = styled(Dialog)({
  "& .MuiPaper-root": {
    maxWidth: "100%",
  },
  "& .MuiDialog-paper": {
    backgroundColor: `${theme.whiteBlue}`,
    borderRadius: "12px",
    width: "44.44%",
    margin: 0,
  },
  "@media (max-width: 1200px)": {
    "& .MuiDialog-paper": {
      width: "93%",
    },
  },
});

const IcQuestion = styled(Avatar)({
  width: "18px",
  height: "22px",
  marginLeft: "8px",
  cursor: "pointer",
});

const PopupOptionRecommendComponent: React.SFC<IReportUserProps> = ({ showPopup, setShowPopup, contentPopup }) => {
  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <Box>
      <DialogReport
        open={showPopup}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            m: { xs: "20px 20px 0 0", lg: "10px 10px 0 0" },
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          <Avatar
            src="/assets/images/icon/ic_close_2.png"
            sx={{ width: { xs: "25px", lg: "18px" }, height: { xs: "25px", lg: "22px" } }}
          />
        </Box>
        <DialogTitle id="alert-dialog-title" sx={{ mt: "4px", mb: "15px" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography fontWeight={300} color={theme.navy}>
              {contentPopup.title}
            </Typography>
            <IcQuestion src="/assets/images/icon/ic_question_blue.png" />
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: "0 10px 85px 10px", textAlign: "center" }}>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontSize: { xs: "16px", lg: "20px" }, lineHeight: { xs: "32px", lg: "40px" } }}
          >
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <Typography
                color={theme.navy}
                sx={{ fontSize: { xs: "16px", lg: "20px" }, lineHeight: { xs: "32px", lg: "40px" } }}
              >
                {contentPopup.content1}
              </Typography>
              <Typography
                color={theme.navy}
                sx={{ fontSize: { xs: "16px", lg: "20px" }, lineHeight: { xs: "32px", lg: "40px" } }}
              >
                {contentPopup.content2}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "block", lg: "none" } }}>
              <Typography
                color={theme.navy}
                sx={{ fontSize: { xs: "16px", lg: "20px" }, lineHeight: { xs: "32px", lg: "40px" } }}
              >
                {contentPopup.content1} {contentPopup.content2}
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
      </DialogReport>
    </Box>
  );
};

export default PopupOptionRecommendComponent;
