import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTranslation } from "next-i18next";

import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";

interface IEmptyMatchingComponentProps {
  text: string;
  mode?: string;
}

const EmptyMatchingComponent: React.SFC<IEmptyMatchingComponentProps> = ({ text, mode }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mx: ["48px", 0],
        // height: { sm: "490px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: [theme.whiteBlue, "white"],
      }}
    >
      <Typography
        sx={{
          my: "40px",
          fontSize: ["16px", "20px"],
          fontWeight: 400,
        }}
      >
        {text}
      </Typography>
      <Box display={mode === "community" && "none"}>
        <img src="/assets/images/svg/account_with_phone.svg" width="156px" alt="account_with_phone" />
      </Box>
      <Link underline="none" href={mode === "community" ? "/search_community" : "/search_user"}>
        <ButtonComponent
          props={{
            mode: "gradient",
          }}
          sx={{
            mt: ["30px", "15px"],
          }}
        >
          {mode === "community" ? t("matching:button.find-community") : t("matching:button.find-engineer")}
        </ButtonComponent>
      </Link>

      <Link underline="none" href="/community/create">
        <ButtonComponent
          props={{
            dimension: "medium",
            bgColor: theme.orange,
          }}
          sx={{
            mt: "40px",
            display: mode !== "community" && "none",
            borderRadius: "4px",
          }}
        >
          {t("matching:button.create-community")}
        </ButtonComponent>
      </Link>
    </Box>
  );
};
export default EmptyMatchingComponent;
