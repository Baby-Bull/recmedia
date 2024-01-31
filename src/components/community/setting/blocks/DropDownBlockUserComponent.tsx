import React from "react";
import { Avatar, IconButton, Menu, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";

import theme from "src/theme";
import DialogConfirmComponent from "src/components/common/dialog/DialogConfirmComponent";

interface IDialogConfirmProps {
  handleOK?: () => void;
  title?: string;
  avatar?: string;
}
const DropDownBlockUserComponent: React.SFC<IDialogConfirmProps> = ({ handleOK, title, avatar }) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openDialog, setOpen] = React.useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleApproveBlock = () => {
    setOpen(false);
    handleOK();
  };
  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          display: { sm: "none" },
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
        }}
      >
        <Avatar
          sx={{
            width: 24,
            height: 24,
          }}
          src="/assets/images/svg/three_dot.svg"
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            border: `1px solid ${theme.gray}`,
            borderRadius: "16px",
            width: "190px",
            mt: 0.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography
          sx={{
            color: theme.gray,
            fontSize: [12, 14],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          onClick={handleOpenDialog}
        >
          <img style={{ paddingRight: "5px" }} src="/assets/images/svg/none.svg" alt="" />
          {t("community:button.setting.member.block-SP")}
        </Typography>
      </Menu>

      <DialogConfirmComponent
        title={title}
        avatar={avatar}
        content1={t("community:dialog.note-delete-title1")}
        content2={t("community:dialog.note-delete-title2")}
        btnLeft={t("community:button.dialog.cancel")}
        btnRight={t("community:button.dialog.block")}
        bgColorBtnRight={theme.red}
        isShow={openDialog}
        handleClose={handleCloseDialog}
        handleCancel={handleCloseDialog}
        handleOK={handleApproveBlock}
      />
    </React.Fragment>
  );
};

export default DropDownBlockUserComponent;
