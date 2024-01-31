/* eslint-disable no-console */
import React, { useRef, useState, useEffect } from "react";
import { Box, Grid, Typography, Link, AppBar, Toolbar } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";
import GridLeftComponent from "src/components/authen/register/GridLeftComponent";
import { authWithProvider } from "src/services/auth";
import { login } from "src/store/store";
import SplashScreen from "src/components/common/SplashScreen";

import { LoginSocialTwitterV1, LoginSocialGithub, IResolveParams } from "../loginSocial";
import LoginSocialGoogle from "../loginSocial/google/LoginSocialGoogle";

const RegisterComponents = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState<any>();
  const githubRef = useRef(null!);

  const onLoginStart = () => {};

  const onLogoutFailure = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    const registerAccount = async (providerAuth: string, credentials: any) => {
      setIsLoading(true);
      const resAuth = await authWithProvider(providerAuth, credentials);
      if (resAuth?.data?.access_token) {
        dispatch(login(resAuth?.data?.user));
        if (resAuth?.data?.user?.is_profile_edited) {
          router.push(`/${router.query?.oldUrl || ""}`);
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
  }, [profile]);

  return isLoading ? (
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
        <Grid container>
          <GridLeftComponent />

          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                pt: [5, 9],
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
                {t("register:title")}
              </Typography>

              <Typography
                sx={{
                  pt: "20px",
                  fontWeight: 300,
                  color: theme.navy,
                  textAlign: "center",
                }}
              >
                {t("register:sub-title")}
              </Typography>

              <Box pt="63px">
                <LoginSocialTwitterV1
                  ref={githubRef}
                  redirect_uri={process.env.NEXT_PUBLIC_REDIRECT_URL_REGISTER}
                  onResolve={({ provider: twitterProvider, data }: IResolveParams) => {
                    setProvider(twitterProvider);
                    setProfile(data);
                  }}
                  onLoginStart={onLoginStart}
                  onReject={() => {
                    setIsLoading(false);
                  }}
                >
                  <ButtonComponent props={{ mode: "twitter" }}>{t("register:register-twitter")}</ButtonComponent>
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
                  onError={onLogoutFailure}
                >
                  <ButtonComponent props={{ mode: "google" }}>{t("register:register-google")}</ButtonComponent>
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
                  onReject={() => {
                    setIsLoading(false);
                  }}
                >
                  <ButtonComponent props={{ mode: "github" }}>{t("register:register-git")}</ButtonComponent>
                </LoginSocialGithub>
              </Box>

              <Link
                href="/login"
                color="secondary"
                sx={{
                  textDecoration: "none",
                }}
              >
                <Box
                  sx={{
                    pt: ["48px", "102px"],
                    pb: ["80px", "0px"],
                    fontSize: 16,
                    fontWeight: 400,
                    color: theme.navy,
                    display: "flex",
                  }}
                >
                  <Typography>{t("register:login-text-1")}</Typography>
                  <Typography color={theme.blue}>{t("register:login-text-2")}</Typography>
                </Box>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};
export default RegisterComponents;
