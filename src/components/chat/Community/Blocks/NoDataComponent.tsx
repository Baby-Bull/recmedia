import React from "react";
import { useTranslation } from "next-i18next";
import { Box, Grid, IconButton, InputBase, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import classNames from "classnames";
import Link from "next/link";

import styles from "src/components/chat/chat.module.scss";
import ButtonComponent from "src/components/common/elements/ButtonComponent";
import theme from "src/theme";

const InputCustom = styled(InputBase)({
  "&.MuiInputBase-root": {
    color: `${theme.gray}`,
  },
  "& .MuiInputBase-input": {
    padding: 0,
  },
});

const BlockNoDataComponent = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid container className={classNames(styles.chatContainerPC, "content-pc")}>
        <Grid item className={styles.chatBoxLeft}>
          <Box className="box-title">
            <Typography className="title">{t("chat:box-left-title")}</Typography>
          </Box>
          <Box className="box-search">
            <Paper
              component="form"
              className="input-search"
              sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}
            >
              <img alt="search" src="/assets/images/svg/ic_search.svg" />
              <InputCustom
                sx={{ ml: 1, flex: 1 }}
                placeholder={t("chat:box-left-input-search-placeholder")}
                inputProps={{ "aria-label": t("chat:box-left-input-search-placeholder") }}
              />
            </Paper>
          </Box>
          <Box className="box-content" />
        </Grid>
        <Grid item className={styles.chatBoxRight}>
          <Box className="box-title" />
          <Box className="box-content">
            <Box className={styles.boxNoData}>
              <Typography className="title">{t("chat:box-right-no-data")}</Typography>
              <img alt="no-data" src="/assets/images/chat-no-data.png" width={245} />

              <ButtonComponent className="btn-find" mode="gradient">
                {t("chat:box-right-button-find")}
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
      </Grid>

      <Grid container className={classNames(styles.chatContainerMobile, "content-mobile")}>
        <Grid item xs={12}>
          {/* <Box className="box-title">
            <Typography className="title">{t("chat:box-left-title")}</Typography>
          </Box>
          <Box className="box-search">
            <Paper
              component="form"
              className="input-search"
              sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}
            >
              <img alt="search" src="/assets/images/svg/ic_search.svg" />
              <InputCustom
                sx={{ ml: 1, flex: 1 }}
                placeholder={t("chat:box-left-input-search-placeholder")}
                inputProps={{ "aria-label": t("chat:box-left-input-search-placeholder") }}
              />
            </Paper>
          </Box> */}
          <Box className={styles.boxNoData}>
            <Typography className="title">{t("chat:box-right-no-data-mobile")}</Typography>
            <img alt="no-data" src="/assets/images/chat-no-data.png" width={137} />
            <Link href="/search_community">
              <ButtonComponent className="btn-find" mode="gradient">
                {t("chat:box-right-button-find")}
              </ButtonComponent>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default BlockNoDataComponent;
