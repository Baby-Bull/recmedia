import * as React from "react";
import { FC } from "react";
import Script from "next/script";
import Head from "next/head";
import { NextPage } from "next";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { appWithTranslation } from "next-i18next";
import { parseCookies } from "nookies";
import Router from "next/router";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import createEmotionCache from "src/createEmotionCache";
import { AUTH_PAGE_PATHS } from "src/constants/constants";
import { getRefreshToken, getToken, USER_TOKEN } from "src/helpers/storage";
// eslint-disable-next-line import/order
import theme from "src/theme";

import "react-toastify/dist/ReactToastify.css";
import "src/styles/index.scss";
import * as gtag from "lib/gtag";
import { useStore } from "src/store/store";
import { fetchToken, setApiAuth } from "src/helpers/api";
import socket from "src/helpers/socket";
import ContentComponent from "src/components/layouts/ContentComponent";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: FC;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pathname: string;
  Component: NextPageWithLayout;
}

const SplashScreen = () => (
  <img
    alt="splash"
    src="/assets/images/bg_loading.gif"
    style={{ top: "40vh", bottom: 0, right: 0, left: "40%", width: "20%", position: "fixed" }}
  />
);

// eslint-disable-next-line no-undef
const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, pathname } = props;
  const [queryClient] = React.useState(() => new QueryClient());
  const Layout =
    Component.getLayout !== undefined
      ? // eslint-disable-next-line react/jsx-pascal-case, no-unused-vars
        ({ children, isAuth }) => <Component.getLayout>{children}</Component.getLayout>
      : ({ children, isAuth }) => <ContentComponent authPage={!isAuth}>{children}</ContentComponent>;
  const cookies = parseCookies();
  const isAuth = cookies[USER_TOKEN];

  React.useEffect(() => {
    if (socket.isClosed() && isAuth) {
      socket.reconnect();
    }
  }, [isAuth]);

  React.useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    Router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
      Router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [Router.events]);

  React.useEffect(() => {
    if (isAuth) {
      let updateLastSeenAtInterval = null;
      socket.on("connected", () => {
        socket.emit("user.last_seen_at", null);
        updateLastSeenAtInterval = setInterval(() => {
          if (!socket.isClosed()) {
            socket.emit("user.last_seen_at", null);
          }
        }, 60000); // 1minute
      });

      return () => {
        clearInterval(updateLastSeenAtInterval);
        updateLastSeenAtInterval = null;
        socket.off("connected");
      };
    }
  }, [isAuth]);

  React.useEffect(() => {
    if (!AUTH_PAGE_PATHS.includes(pathname) && !isAuth) {
      // Router.push("/login");
    }
    if (!AUTH_PAGE_PATHS.includes(pathname) && isAuth) {
      if (cookies.EXPIRES_IN) {
        const timeOutFreshToken = (parseInt(cookies.EXPIRES_IN, 10) - 30) * 1000;
        const intervalRef = setInterval(() => {
          fetchToken({
            accessToken: getToken(),
            refreshToken: getRefreshToken(),
          });
        }, timeOutFreshToken);
        return () => {
          clearInterval(intervalRef);
        };
      }
    }
  }, [isAuth]);

  const isServerRendering = typeof window === "undefined";
  const store = useStore(pageProps.initialReduxState);
  const persistor = persistStore(store);

  return (
    <React.Fragment>
      <Head>
        <title>goodhub</title>
        <meta property="og:type" content="website" key="og-type" />
        <meta property="og:title" content='ITエンジニアのための溜まり場 - "goodhub"' key="og-title" />
        <meta
          property="og:description"
          content="goodhubは業界初、新しい形のITエンジニアの憩いの場を提供するサービスです。
            コミュニティで新しい繋がりや仲間づくり、キャリアの相談など無料で全て使えます。"
          key="og-description"
        />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_URL_PROFILE} key="og-url" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_URL_PROFILE}/assets/images/home_page/ogp_home.png`}
          key="og-img"
        />
        <meta property="og:site_name" content="goodhub" key="og-type" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_URL_PROFILE} key="twitter-url" />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_URL_PROFILE}/assets/images/home_page/ogp_home.png`}
          key="twitter-image"
        />
        <meta name="twitter:title" content='ITエンジニアのための溜まり場 - "goodhub"' key="twitter-title" />
        <meta
          name="twitter:description"
          content="goodhubは業界初、新しい形のITエンジニアの憩いの場を提供するサービスです。
            コミュニティで新しい繋がりや仲間づくり、キャリアの相談など無料で全て使えます。"
          key="twitter-description"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width, maximum-scale=1" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="title" content="GOODHUB" />
        <meta
          name="description"
          content="goodhubは業界初、新しい形のITエンジニアの憩いの場を提供するサービスです。
            コミュニティで新しい繋がりや仲間づくり、キャリアの相談など無料で全て使えます。"
        />
        <meta name="keywords" content="キーワード, goodhub" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} strategy="afterInteractive" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {isServerRendering ? (
            <CacheProvider value={emotionCache}>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Hydrate state={pageProps.dehydratedState}>
                  <Layout isAuth={isAuth}>
                    <Component {...pageProps} />
                  </Layout>
                </Hydrate>
              </ThemeProvider>
            </CacheProvider>
          ) : (
            <PersistGate loading={<SplashScreen />} persistor={persistor}>
              <CacheProvider value={emotionCache}>
                <ThemeProvider theme={theme}>
                  {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                  <CssBaseline />
                  <Hydrate state={pageProps.dehydratedState}>
                    <Layout isAuth={isAuth}>
                      <Component {...pageProps} />
                    </Layout>
                  </Hydrate>
                </ThemeProvider>
              </CacheProvider>
            </PersistGate>
          )}
        </Provider>
      </QueryClientProvider>
    </React.Fragment>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  const { query, pathname, res } = ctx;

  const cookies = parseCookies(ctx);
  if (!AUTH_PAGE_PATHS.includes(pathname)) {
    if (!cookies[USER_TOKEN]) {
      if (!res) {
        Router.push("/login");
        return {};
      }
    }
    setApiAuth(cookies[USER_TOKEN]);
  }
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return {
    pageProps,
    query,
    pathname,
    cookies,
  };
};

export default appWithTranslation(MyApp);
