import * as React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { parseCookies } from "nookies";

import { IS_PROFILE_EDITED, USER_TOKEN } from "src/helpers/storage";
import { NextPageWithLayout } from "pages/_app";
import ContentComponent from "src/components/layouts/ContentComponent";

const FormComponent = dynamic(() => import("src/components/authen/register/form/FormComponent"), { ssr: false });

const Form: NextPageWithLayout = () => <FormComponent />;

Form.getLayout = ({ children }) => (
  <ContentComponent authPage registerPage showHeader={false}>
    {children}
  </ContentComponent>
);

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
  if (cookies[IS_PROFILE_EDITED] === "true") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "register"])),
    },
  };
};

export default Form;
