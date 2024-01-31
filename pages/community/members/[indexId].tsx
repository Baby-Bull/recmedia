import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parseCookies } from "nookies";

import CommunityMemberComponent from "src/components/community/MemberComponent";
import { IS_PROFILE_EDITED, USER_TOKEN } from "src/helpers/storage";

const CommunityMember: NextPage = () => <CommunityMemberComponent />;
const sampleCommunityId = "624cf8551b8a720009e2e1db";

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

  if (cookies[IS_PROFILE_EDITED] === "false") {
    return {
      redirect: {
        destination: "/register/form",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "community"])),
      paths: [{ params: { communityId: sampleCommunityId } }],
      fallback: true, // 上記以外のパスでアクセスした場合は 404 ページにしない
    },
  };
};

export default CommunityMember;
