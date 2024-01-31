/* eslint-disable react/jsx-no-useless-fragment */
import React, { useRef, useState, useEffect } from "react";
import { Box, Grid, Typography, Link, Toolbar, AppBar } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import ButtonComponent from "src/components/common/ButtonComponent";
import theme from "src/theme";
import GridLeftComponent from "src/components/authen/register/GridLeftComponent";
import SplashScreen from "src/components/common/SplashScreen";
import { authWithProvider } from "src/services/auth";
import { login } from "src/store/store";
import actionTypes from "src/store/actionTypes";

import { IResolveParams, LoginSocialGithub, LoginSocialTwitterV1 } from "../loginSocial";
import LoginSocialGoogle from "../loginSocial/google/LoginSocialGoogle";

const LoginComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState<any>();
  const githubRef = useRef(null!);

  const onLoginStart = () => {};

  useEffect(() => {
    const registerAccount = async (providerAuth: string, credentials: any) => {
      setIsLoading(true);
      const resAuth = await authWithProvider(providerAuth, credentials);
      if (resAuth?.data?.access_token) {
        dispatch(login(resAuth?.data?.user));
        dispatch({
          type: actionTypes.UPDATE_UNREAD_LISTROOMS_COUNT,
          payload: {
            count: resAuth?.data?.user?.profile?.chat_room_with_unread_messages,
          },
        });
        if (resAuth?.data?.user?.is_profile_edited) {
          router.push(`/${router.query?.oldUrl || ""}`);
          // router.back();
        } else {
          router.push("/register/form");
        }
      } else {
        setIsLoading(false);
      }
      return resAuth;
    };
    if (profile?.credentials) {
      registerAccount(provider, profile);
    }
    return () => {
      setProfile(null);
    };
  }, [profile]);

  return (
    <React.Fragment>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <React.Fragment>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="fixed"
              sx={{
                background: "#fff",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                p: { xs: 0, lg: "0 16px" },
              }}
            >
              <Toolbar
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: { xs: "100%", xl: "1440px" },
                  margin: "auto",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Link href="/">
                    <a>
                      <Box
                        component="img"
                        sx={{
                          width: { xs: "70px", lg: "141px" },
                          height: { xs: "20px", lg: "42px" },
                        }}
                        alt="avatar"
                        src="/assets/images/logo/logo.png"
                      />
                    </a>
                  </Link>
                </Box>
              </Toolbar>
            </AppBar>
          </Box>

          <Box sx={{ marginTop: "55px" }}>
            <Grid container sx={{ flexDirection: { xs: "column-reverse", sm: "unset" } }}>
              <GridLeftComponent />
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    pt: ["64px", "110px"],
                    px: ["8%", "20.7%"],
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: theme.navy,
                    }}
                  >
                    {t("login:right.title")}
                  </Typography>
                  <Box pt="68px">
                    <LoginSocialTwitterV1
                      ref={githubRef}
                      redirect_uri={process.env.NEXT_PUBLIC_REDIRECT_URL_REGISTER}
                      onResolve={({ provider: twitterProvider, data }) => {
                        setProvider(twitterProvider);
                        setProfile(data);
                      }}
                      onLoginStart={onLoginStart}
                      onReject={() => {}}
                    >
                      <ButtonComponent props={{ mode: "twitter" }}>{t("login:right.register-twitter")}</ButtonComponent>
                    </LoginSocialTwitterV1>
                  </Box>
                  <Box pt="48px">
                    <LoginSocialGoogle
                      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                      redirectUrl={process.env.NEXT_PUBLIC_REDIRECT_URL_REGISTER}
                      onSuccess={({ provider: googleProvider, data }) => {
                        setProvider(googleProvider);
                        setProfile(data);
                      }}
                      onError={() => {}}
                    >
                      <ButtonComponent props={{ mode: "google" }}>{t("login:right.register-google")}</ButtonComponent>
                    </LoginSocialGoogle>
                  </Box>
                  <Box pt="48px">
                    <LoginSocialGithub
                      ref={githubRef}
                      client_id={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || ""}
                      client_secret={process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET || ""}
                      redirect_uri={process.env.NEXT_PUBLIC_REDIRECT_URL_REGISTER}
                      onResolve={({ provider: githubProvider, data }: IResolveParams) => {
                        setProvider(githubProvider);
                        setProfile(data);
                      }}
                      onLoginStart={onLoginStart}
                      onReject={() => {}}
                    >
                      <ButtonComponent props={{ mode: "github" }}>{t("login:right.register-git")}</ButtonComponent>
                    </LoginSocialGithub>
                  </Box>
                  <Box
                    sx={{
                      pt: "80px",
                      pb: ["116px", "0"],
                      fontSize: 14,
                      fontWeight: 400,
                      color: theme.navy,
                      display: { xs: "block", sm: "block", lg: "-webkit-box" },
                    }}
                  >
                    <Box sx={{ display: "-webkit-box" }}>
                      <Box>{t("login:cannot-login")}</Box>
                      <Link href="/register" color="secondary">
                        <Box color={theme.blue}>{t("login:register")}</Box>
                      </Link>
                    </Box>
                    <Box sx={{ textAlign: { xs: "center", sm: "unset" } }}>{t("login:contact-us")}</Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default LoginComponent;
