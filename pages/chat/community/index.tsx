import * as React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parseCookies } from "nookies";
import dynamic from "next/dynamic";

import { IS_PROFILE_EDITED, USER_TOKEN } from "src/helpers/storage";
import { NextPageWithLayout } from "pages/_app";

const CommunityChatComponent = dynamic(() => import("src/components/chat/Community/CommunityChatComponent"), {
  ssr: false,
});

const ChatCommunityPage: NextPageWithLayout = () => <CommunityChatComponent />;

ChatCommunityPage.getLayout = React.Fragment;

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
      ...(await serverSideTranslations(locale, ["common", "chat"])),
    },
  };
};

export default ChatCommunityPage;
