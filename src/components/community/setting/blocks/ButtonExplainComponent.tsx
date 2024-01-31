import React from "react";
import { Avatar, IconButton, Menu, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";

import theme from "src/theme";
import useViewport from "src/helpers/useViewport";

const ButtonExplainComponent = () => {
  const { t } = useTranslation();

  const viewPort = useViewport();
  const isMobile = viewPort.width <= 425;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{ p: 0 }}
      >
        <Avatar
          sx={{
            width: 24,
            height: 24,
          }}
          src="/assets/images/svg/help.svg"
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="explain-admin-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
        PaperProps={{
          elevation: 0,
          style: {
            width: isMobile ? 190 : 320,
            height: isMobile ? 48 : 64,
            overflow: "visible",
            border: `1px solid ${theme.blue}`,
            borderRadius: "16px",
            marginLeft: "30px",
          },
        }}
      >
        <Typography
          sx={{
            pl: "13px",
            pr: "20px",
            color: theme.gray,
            fontSize: [10, 16],
          }}
        >
          {t("community:setting.form.explain")}
        </Typography>
      </Menu>
    </React.Fragment>
  );
};

export default ButtonExplainComponent;
