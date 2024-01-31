import React from "react";
import { Avatar, IconButton, Menu, MenuItem, Divider, Typography, Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import theme from "src/theme";
import DialogConfirmComponent from "src/components/common/dialog/DialogConfirmComponent";

interface IButtonDropDownComponentProps {
  top?: string[];
  right?: string;
  index?: string;
  handleCallbackRemove?: any;
  handleCallbackUpdateComment?: any;
  data?: any;
  comment?: any;
}

const ButtonDropDownComponent: React.SFC<IButtonDropDownComponentProps> = ({
  top,
  right,
  handleCallbackRemove,
  handleCallbackUpdateComment,
  index,
  comment,
  data,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  // const [isComment, setIsComment] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openDialog, setOpen] = React.useState(false);
  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => setOpen(false);
  const handleDialogCancel = () => {
    handleCloseDialog();
    setOpen(false);
  };
  const handleDialogOK = () => {
    handleCallbackRemove(index, comment?.id);
    handleCloseDialog();
  };

  const redirectUpdatePost = () => {
    const community = router.query;
    router.push(`/community/${community?.id}/post/update/${community?.detailId}`);
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
          position: "absolute",
          top: top || 13,
          right: right || 30,
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
            border: `1px solid ${theme.blue}`,
            borderRadius: "16px",
            width: "106px",
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {(comment ? comment?.can_edit : data?.can_edit) && (
          <MenuItem sx={{ py: "0px" }} onClick={comment ? () => handleCallbackUpdateComment(true) : redirectUpdatePost}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src="/assets/images/icon/edit_blue.svg"
                variant="square"
                sx={{ width: "11px", height: "11px", mr: "8px" }}
              />
              <Typography
                sx={{
                  color: theme.gray,
                  fontSize: 14,
                }}
              >
                {t("community:button.dropdown.edit")}
              </Typography>
            </Box>
          </MenuItem>
        )}
        {comment?.can_delete && comment?.can_edit && <Divider />}
        <MenuItem sx={{ py: "0px" }} onClick={handleOpenDialog}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src="/assets/images/icon/delete_blue.svg"
              variant="square"
              sx={{ width: "11px", height: "11px", mr: "8px" }}
            />
            <Typography
              sx={{
                color: theme.gray,
                fontSize: 14,
              }}
            >
              {t("community:button.dropdown.delete")}
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      <DialogConfirmComponent
        title={
          comment
            ? t("community:detail.comment.delete-community")
            : data.title + t("community:dialog.confirm-delete-title")
        }
        content={comment ? t("community:detail.comment.delete-content") : t("community:dialog.note-delete-title")}
        btnLeft={t("community:button.dialog.cancel")}
        btnRight={t("community:button.dialog.delete-comment")}
        isShow={openDialog}
        handleClose={handleCloseDialog}
        handleCancel={handleDialogCancel}
        handleOK={handleDialogOK}
      />
    </React.Fragment>
  );
};

export default ButtonDropDownComponent;
