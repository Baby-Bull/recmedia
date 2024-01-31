import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parseCookies } from "nookies";

import HomeIndexComponents from "src/components/home/IndexComponent";
import { IS_PROFILE_EDITED, USER_TOKEN } from "src/helpers/storage";

const Home: NextPage = () => <HomeIndexComponents />;

export const getServerSideProps = async (ctx) => {
  const { locale } = ctx;
  const cookies = parseCookies(ctx);
  if (!cookies[USER_TOKEN]) {
    return {
      redirect: {
        destination: `${process.env.NEXT_PUBLIC_URL_LANDING_PAGE}?oldUrl=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  if (cookies[IS_PROFILE_EDITED] !== "true") {
    return {
      redirect: {
        destination: "/register/form",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "home", "footer"])),
    },
  };
};

export default Home;
