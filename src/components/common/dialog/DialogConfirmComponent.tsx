import React from "react";
import { Avatar, Box, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Typography } from "@mui/material";

import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";

interface IDialogConfirmProps {
  isShow: boolean;
  title: string;
  content?: string;
  content1?: string;
  content2?: string;
  avatar?: string;
  btnLeft: string;
  btnRight: string;
  bgColorBtnRight?: string;
  handleClose: () => void;
  handleCancel?: () => void;
  handleOK?: () => void;
}

const DialogConfirmComponent: React.SFC<IDialogConfirmProps> = ({
  isShow,
  title,
  content,
  content1,
  content2,
  btnLeft,
  btnRight,
  handleClose,
  handleCancel,
  handleOK,
  avatar,
  bgColorBtnRight,
}) => {
  const [fullWidth] = React.useState(true);

  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: 12,
          maxWidth: "640px",
        },
      }}
      sx={{ "& .MuiPaper-root": { margin: "32px 20px", width: "100%" } }}
      open={isShow}
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
          position: "relative",
        }}
      >
        <Fab
          variant="circular"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: ["7px", "10px"],
            right: ["7px", "15px"],
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
              width: ["24px", "22px"],
              height: ["24px", "22px"],
              display: "flex",
              justifyContent: "center",
            }}
            src="/assets/images/svg/delete-x.svg"
          />
        </Fab>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: theme.whiteBlue,
          px: ["14px", "40px"],
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            pt: ["35px", "37px"],
            px: [0, "50px"],
            mb: ["22px", 0],
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              component="span"
              sx={{
                px: ["15px", "10px"],
                color: theme.navy,
                fontSize: [16, 20],
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: avatar ? "none" : "center",
              }}
            >
              <Avatar
                src={avatar}
                sx={{
                  mr: "11px",
                  display: avatar ? "block" : "none",
                  ".MuiAvatar-img": {
                    objectFit: avatar === "/assets/images/logo/logo.png" ? "contain" : "cover",
                    borderRadius: "50%",
                    border: "1px #c2c2c2 solid",
                  },
                }}
              />
              {title}
            </Typography>

            <Typography
              component="span"
              sx={{
                mt: ["35px"],
                px: ["24px", "50px"],
                fontSize: [14, 16],
                color: theme.navy,
              }}
            >
              {content}
              <Box sx={{ fontSize: "12px", lineHeight: "17.38px", fontWeight: "400" }}>{content1}</Box>
              <Box sx={{ fontSize: "12px", lineHeight: "17.38px", fontWeight: "400" }}>{content2}</Box>
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: theme.whiteBlue,
          display: "flex",
          flexDirection: ["column", "row"],
          alignItems: "center",
          justifyContent: ["center", "space-around"],
          p: ["30px 45px 60px 45px", "30px 45px 55px 45px"],
          "&.MuiDialogActions-root": {
            "& > :not(:first-of-type)": {
              marginLeft: 0,
            },
          },
        }}
      >
        <ButtonComponent
          props={{
            dimension: "medium",
            bgColor: theme.gray,
          }}
          sx={{
            height: "56px",
          }}
          onClick={handleCancel}
        >
          {btnLeft}
        </ButtonComponent>

        <ButtonComponent
          props={{
            dimension: "medium",
            bgColor: bgColorBtnRight ?? theme.blue,
          }}
          sx={{
            height: "56px",
            mt: ["40px", 0],
          }}
          onClick={handleOK}
        >
          {btnRight}
        </ButtonComponent>
      </DialogActions>
    </Dialog>
  );
};
export default DialogConfirmComponent;
