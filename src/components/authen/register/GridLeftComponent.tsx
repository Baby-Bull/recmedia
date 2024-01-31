import React from "react";
import { Box, Grid, Typography, Avatar, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import theme from "src/theme";

const Item = styled(Paper)`
  display: flex;
  align-items: center;
  border-radius: 10px;
  ${(props) => props.theme.breakpoints.up("xs")} {
    height: 96px;
    padding-left: 8px;
    padding-right: 8px;
  }
  ${(props) => props.theme.breakpoints.up("sm")} {
    height: 64px;
  }
  ${(props) => props.theme.breakpoints.up("md")} {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const TypoNumber = styled(Typography)`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.blue};
`;

const BoxDescription = styled(Box)`
  color: #000;
  display: flex;
  align-items: center;
`;

const TypoCustom = styled(Typography)`
  letter-spacing: 6px;
`;

const TypoContent = styled(TypoCustom)`
  font-weight: 700;
  ${(props) => props.theme.breakpoints.up("xs")} {
    padding-left: 14px;
  }
  ${(props) => props.theme.breakpoints.up("md")} {
    padding-left: 20px;
  }
`;

interface IGridLeftComponentProps {
  smAndUp?: boolean;
}

const GridLeftComponent: React.SFC<IGridLeftComponentProps> = ({ smAndUp }) => {
  const { t } = useTranslation();

  return (
    <Grid
      item
      xs={12}
      sm={6}
      sx={{
        background: theme.whiteGray,
        display: [smAndUp ? "none" : "block", "block"],
      }}
    >
      <Box
        sx={{
          pt: [5, 9],
          pb: [5, "186px"],
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            pb: ["40px", "48px"],
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "7px",
          }}
        >
          {t("register:description.title")}
        </Typography>
        <Avatar
          variant="square"
          sx={{
            width: ["50.2%", "43.5%"],
            height: "100%",
          }}
          src="/assets/images/svg/register_account.svg"
        />
        <Stack
          spacing={{ xs: "20px", sm: 4 }}
          sx={{
            pt: ["40px", "57px"],
            px: { sm: "60px" },
            width: ["90%", "100%"],
            height: "100%",
          }}
        >
          <Item>
            <BoxDescription color="#000">
              <TypoNumber>01</TypoNumber>
              <Box
                sx={{
                  pl: ["14px", "14px", 0],
                  color: "#000",
                  display: "flex",
                  flexDirection: ["column", "column", "row"],
                  alignItems: ["space-between", "space-between", "center"],
                  justifyContent: ["space-between", "space-between", "center"],
                }}
              >
                <TypoCustom fontWeight="700" pl={{ md: "20px" }}>
                  {t("register:description.text-1.1")}
                </TypoCustom>
                <Typography fontSize="12px" mt="6px" fontWeight="400" pl={{ md: "5px" }}>
                  {t("register:description.text-1.2")}
                </Typography>
              </Box>
            </BoxDescription>
          </Item>

          <Item>
            <BoxDescription color="#000">
              <TypoNumber>02</TypoNumber>
              <TypoContent>{t("register:description.text-2")}</TypoContent>
            </BoxDescription>
          </Item>

          <Item>
            <BoxDescription color="#000">
              <TypoNumber>03</TypoNumber>
              <TypoContent>{t("register:description.text-3")}</TypoContent>
            </BoxDescription>
          </Item>
        </Stack>
      </Box>
    </Grid>
  );
};
export default GridLeftComponent;
