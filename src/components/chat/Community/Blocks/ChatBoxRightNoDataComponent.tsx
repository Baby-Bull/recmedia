/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import styles from "src/components/chat/chat.module.scss";
import InputCustom from "src/components/chat/ElementCustom/InputCustom";
import ButtonComponent from "src/components/common/elements/ButtonComponent";

const ChatBoxRightNoDataComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const redirectToSearchCommunity = () => {
    router.push("/search_community");
  };

  return (
    <Grid item className={styles.chatBoxRight}>
      <Box className="box-title" />
      <Box className="box-content">
        <Box className={styles.boxNoData}>
          <Typography className="title">{t("chat:box-right-no-data")}</Typography>
          <img alt="no-data" src="/assets/images/chat-no-data.png" width={245} />

          <ButtonComponent className="btn-find" mode="gradient" onClick={redirectToSearchCommunity}>
            {t("chat:box-right-button-find-community")}
          </ButtonComponent>
        </Box>
        <Box className="box-chat">
          <Paper
            component="form"
            className="paper-chat"
            sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}
          >
            <InputCustom
              className="input-chat"
              sx={{ ml: 1, flex: 1 }}
              placeholder={t("chat:input-chat-placeholder")}
              inputProps={{ "aria-label": t("chat:input-chat-placeholder") }}
            />
            <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
              <img alt="search" src="/assets/images/svg/ic_attachment.svg" />
            </IconButton>

            <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
              <img alt="search" src="/assets/images/svg/ic_send_message.svg" />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </Grid>
  );
};

export default ChatBoxRightNoDataComponent;
