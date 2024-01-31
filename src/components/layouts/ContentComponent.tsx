import React from "react";
import { Box } from "@mui/material";
import Head from "next/head";
import dynamic from "next/dynamic";

import styles from "src/components/layouts/layout.module.scss";

const HeaderComponent = dynamic(() => import("src/components/layouts/HeaderComponent"), {
  ssr: true,
}) as any;

const FooterComponent = dynamic(() => import("src/components/layouts/FooterComponent"), {
  ssr: true,
}) as any;

interface IContentComponentProps {
  children: any;
  showFooter?: boolean;
  showHeader?: boolean;
  authPage?: boolean;
  registerPage?: boolean;
}
const ContentComponent: React.SFC<IContentComponentProps> = ({
  children,
  showFooter = true,
  showHeader = true,
  authPage = false,
  registerPage = false,
}) => (
  <Box
    className={styles.contentLayout}
    sx={{
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "#F4FDFF",
      color: "#1A2944",
    }}
  >
    <Head>
      <title>goodhub</title>
    </Head>
    {showHeader && !registerPage && <HeaderComponent authPage={authPage} />}
    {children}
    {showFooter && <FooterComponent authPage={authPage} registerPage={registerPage} />}
  </Box>
);
export default ContentComponent;
