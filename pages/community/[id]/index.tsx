import * as React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import CommunityComponent from "src/components/community/IndexComponent";
import { getCommunity } from "src/services/community";

const Community = ({ communityInfo, url }) => (
  <React.Fragment>
    <Head>
      <meta property="og:type" content="article" key="og-type" />
      <meta property="og:title" content={`goodhub community: ${communityInfo.name}`} key="og-title" />
      <meta property="og:description" content={communityInfo.description} key="og-description" />
      <meta property="og:url" content={url} key="og-url" />
      <meta property="og:image" content={communityInfo.ogp_image} key="og-img" />
      <meta property="og:site_name" content="goodhub" key="og-type" />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="315" />
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      <meta name="twitter:url" content={url} key="twitter-url" />
      <meta name="twitter:image" content={communityInfo.ogp_image} key="twitter-image" />
      <meta name="twitter:title" content={`goodhub community: ${communityInfo.name}`} key="twitter-title" />
      <meta name="twitter:description" content={communityInfo.description} key="twitter-description" />
      {/* Inject MUI styles first to match with the prepend: true configuration. */}
    </Head>
    <CommunityComponent />
  </React.Fragment>
);

export const getServerSideProps = async (ctx) => {
  const { locale } = ctx;
  const { id } = ctx.params;
  const [community, translations] = await Promise.all([
    getCommunity(id),
    serverSideTranslations(locale, ["common", "community"]),
  ]);

  return {
    props: {
      ...translations,
      communityInfo: community,
      url: `${process.env.NEXT_PUBLIC_URL_PROFILE}${ctx.resolvedUrl}`,
      fallback: true, // 上記以外のパスでアクセスした場合は 404 ページにしない
    },
  };
};

export default Community;
