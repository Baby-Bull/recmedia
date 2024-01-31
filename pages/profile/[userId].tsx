/* eslint-disable */
import * as React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parseCookies } from "nookies";
import Head from "next/head";

import { IS_PROFILE_EDITED, USER_TOKEN } from "src/helpers/storage";
import { getOrtherUserProfile } from "src/services/user";
import ProfileComponent from "../../src/components/profile/ProfileComponent";

const sampleUserId = "624cf8551b8a720009e2e1db";

const Profile = ({ url, profileSkill, userId, isAuth }) => (
  <React.Fragment>
    <Head>
      <meta property="og:type" content="article" key="og-type" />
      <meta property="og:title" content={`goodhub user: ${profileSkill.username}`} key="og-title" />
      <meta property="og:description" content={profileSkill.self_description} key="og-description" />
      <meta property="og:url" content={url} key="og-url" />
      <meta property="og:image" content={profileSkill.ogp_image} key="og-img" />
      <meta property="og:site_name" content="goodhub" key="og-type" />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="315" />
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:url" content={url} key="twitter-url" />
      <meta name="twitter:image" content={profileSkill.ogp_image} key="twitter-image" />
      <meta name="twitter:title" content={`goodhub user: ${profileSkill.username}`} key="twitter-title" />
      <meta name="twitter:description" content={profileSkill.self_description} key="twitter-description" />
      {/* Inject MUI styles first to match with the prepend: true configuration. */}
    </Head>
    <ProfileComponent userId={userId} isAuth={isAuth} />
  </React.Fragment>
);

export const getServerSideProps = async (ctx) => {
  const { locale } = ctx;
  const { userId } = ctx.params;
  const cookies = parseCookies(ctx);
  const isAuth = cookies[USER_TOKEN];
  if (isAuth && cookies[IS_PROFILE_EDITED] === "false") {
    return {
      redirect: {
        destination: "/register/form",
        permanent: false,
      },
    };
  }
  const [profileSkill, translation] = await Promise.all([
    getOrtherUserProfile(userId),
    serverSideTranslations(locale, ["common", "profile", "user-search", "home"]),
  ]);

  return {
    props: {
      ...translation,
      url: `${process.env.NEXT_PUBLIC_URL_PROFILE}${ctx.resolvedUrl}`,
      userId,
      profileSkill,
      isAuth,
      paths: [{ params: { userId: sampleUserId } }],
      fallback: true, // 上記以外のパスでアクセスした場合は 404 ページにしない
    },
  };
};

export default Profile;
