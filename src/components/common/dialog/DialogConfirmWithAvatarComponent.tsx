import React from "react";
import { Avatar, Box, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Typography } from "@mui/material";

import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";

interface IDialogConfirmWithAvatarProps {
  isShow: boolean;
  title: string;
  content?: string;
  content1?: string;
  content2?: string;
  btnLeft: string;
  btnRight: string;
  bgColorBtnLeft?: string;
  bgColorBtnRight?: string;
  handleClose: () => void;
  handleCancel?: () => void;
  handleOK?: () => void;
  avatar?: string;
}

const DialogConfirmWithAvatarComponent: React.SFC<IDialogConfirmWithAvatarProps> = ({
  isShow,
  title,
  content,
  content1,
  content2,
  btnLeft,
  btnRight,
  bgColorBtnLeft,
  bgColorBtnRight,
  handleClose,
  handleCancel,
  handleOK,
  avatar,
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
      open={isShow}
      onClose={handleClose}
      scroll="paper"
      fullWidth={fullWidth}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      sx={{ zIndex: 10001 }}
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
            display: "flex",
            pt: ["53px", "37px"],
            pr: { sm: "20px" },
            mb: ["22px", 0],
          }}
        >
          <Avatar
            sx={{
              width: ["40px", "64px"],
              height: "100%",
            }}
            src={avatar || "/assets/images/svg/account.svg"}
          />

          <Box
            sx={{
              ml: ["8px", "16px"],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              component="span"
              sx={{
                color: theme.navy,
                fontSize: [16, 20],
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>

            <Typography
              component="span"
              sx={{
                mt: ["35px"],
                display: ["none", "inherit"],
                color: theme.navy,
              }}
            >
              {content}
            </Typography>
            <Box>{content1}</Box>
            <Box>{content2}</Box>
          </Box>
        </Box>

        <Box
          component="span"
          sx={{
            display: { sm: "none" },
            color: theme.navy,
            fontSize: 14,
          }}
        >
          {content}
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
            bgColor: bgColorBtnLeft || theme.gray,
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
            bgColor: bgColorBtnRight || theme.blue,
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
export default DialogConfirmWithAvatarComponent;
