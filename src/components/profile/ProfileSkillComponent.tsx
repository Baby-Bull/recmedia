import { Box, Grid, Avatar } from "@mui/material";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import TabsUnstyled from "@mui/base/TabsUnstyled";
// eslint-disable-next-line import/no-extraneous-dependencies
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
// eslint-disable-next-line import/no-extraneous-dependencies
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
// eslint-disable-next-line import/no-extraneous-dependencies
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import { useTranslation } from "next-i18next";
// eslint-disable-next-line import/no-extraneous-dependencies
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import theme from "src/theme";
import { USER_STATUS, JOBS, EMPLOYEES } from "src/components/constants/constants";
import { TEXT_ENGLISH_LEVEL_OPTIONS } from "src/constants/constants";
import { searchUserActions } from "src/store/actionTypes";

import { ShowTextArea } from "../common/ShowTextAreaComponent";

interface IProfileDataProps {
  data: any;
}

const BoxContentTab = styled(Box)`
  display: flex;
  margin-bottom: 35px;
  color: ${theme.navy};
  ${(props) => props.theme.breakpoints.up("xs")} {
    display: block;
  }

  ${(props) => props.theme.breakpoints.up("lg")} {
    display: flex;
  }
`;

const TitleContentTab = styled(Box)`
  width: 238px;
  font-size: 18px;
  font-weight: 700;
  ${(props) => props.theme.breakpoints.up("xs")} {
    font-size: 16px;
  }

  ${(props) => props.theme.breakpoints.up("lg")} {
    font-size: 18px;
  }
`;

const ContentTab = styled(Box)`
  width: 680px;
  ${(props) => props.theme.breakpoints.up("xs")} {
    font-size: 14px;
    width: 100%;
  }

  ${(props) => props.theme.breakpoints.up("lg")} {
    font-size: 16px;
    width: 65.38%;
  }
`;

const Tab = styled(TabUnstyled)`
  color: ${theme.blue};
  cursor: pointer;
  font-size: 20px;
  line-height: 29px;
  font-weight: bold;
  background-color: #fff;
  width: 240px;
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  border: 1px solid #03bcdb;
  border-radius: 12px 12px 0 0;
  border-bottom: none !important;
  height: 56px;

  &.${tabUnstyledClasses.selected} {
    background-color: ${theme.blue};
    color: #fff;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
`;

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  display: flex;
  align-items: center;
`;

interface IRecommendMembersComponentProps {
  countStar?: number;
}

const ImgStar: React.SFC<IRecommendMembersComponentProps> = ({ countStar }) => {
  const rows = [];
  for (let i = 0; i < countStar; i++) {
    rows.push("/assets/images/star.svg");
  }

  for (let i = 0; i < 5 - countStar; i++) {
    rows.push("/assets/images/empty_star.svg");
  }
  return (
    <Box sx={{ display: "flex" }}>
      {rows?.map((value, key) => (
        <Box key={key}>
          <Avatar
            variant="square"
            src={value}
            alt="star"
            sx={{
              width: value === "/assets/images/star.svg" ? "16px" : "20px",
              height: value === "/assets/images/star.svg" ? "16px" : "20px",
              mt: value === "/assets/images/star.svg" ? "1px" : "0",
              mr: value === "/assets/images/star.svg" ? "2px" : "0",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

const ProfileSkillComponent: React.SFC<IProfileDataProps> = ({ data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const FRAMEWORK = "framework";
  const INFRASTRUCTURE = "infrastructure";
  const LANGUAGE = "programLanguage";

  const onUserTagClicked = (tag: string) => {
    dispatch({ type: searchUserActions.SEARCH_TAG_ONLY, payload: [tag] });
    router.push("/search_user");
  };

  return (
    <Grid item xs={12} sm={12} lg={12} xl={12}>
      <Box
        sx={{
          background: { xs: "unset", lg: "#ffffff" },
          p: { xs: "0", lg: "20px 80px 78px 80px" },
          m: { xs: "40px 0", lg: "0" },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <TabsUnstyled defaultValue={0}>
            <TabsList>
              <Tab sx={{ width: { xs: "169px", lg: "240px" }, height: { xs: "45.46px", lg: "56px" } }}>
                {t("profile:profile")}
              </Tab>
              <Tab sx={{ width: { xs: "169px", lg: "240px" }, height: { xs: "45.46px", lg: "56px" } }}>
                {t("profile:skill")}
              </Tab>
            </TabsList>
            <Box
              sx={{
                border: "2px solid #03BCDB",
                p: "37px 42px",
                background: "#fff",
              }}
            >
              <TabPanel value={0}>
                <Box
                  sx={{
                    display: { xs: "block", lg: "flex" },
                    marginBottom: "35px",
                    color: "#1A2944",
                  }}
                >
                  <TitleContentTab>{t("profile:status")}</TitleContentTab>
                  <Box
                    sx={{
                      background: USER_STATUS[data?.status]?.bg,
                      borderRadius: "4px",
                      color: USER_STATUS[data?.status]?.color,
                      fontSize: "10px",
                      fontWeight: 700,
                      width: "138.13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {USER_STATUS[data?.status]?.label}
                  </Box>
                </Box>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:one-thing")}</TitleContentTab>
                  <ContentTab>{data?.hitokoto}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:self-introduction")}</TitleContentTab>
                  <ContentTab>
                    <ShowTextArea value={data?.self_description} />
                  </ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:occupation")}</TitleContentTab>
                  <ContentTab>{JOBS[data?.job]?.label}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:position")}</TitleContentTab>
                  <ContentTab>{data?.job_position}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:employment-status")}</TitleContentTab>
                  <ContentTab>{EMPLOYEES[data?.employment_status]?.label}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:discussion-topic")}</TitleContentTab>
                  <ContentTab>
                    <ShowTextArea
                      value={
                        data?.discussion_topic ??
                        "はじめまして。色々な方とお話をしたいと考えています！よろしくお願いします。"
                      }
                    />
                  </ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:address")}</TitleContentTab>
                  <ContentTab>{data?.address}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:tag")}</TitleContentTab>
                  <ContentTab>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {data?.tags?.map((item, key) => (
                        <Box
                          onClick={() => onUserTagClicked(item)}
                          key={key}
                          sx={{
                            cursor: "pointer",
                            ":hover": {
                              background: "#dcf9ff",
                            },
                            background: "#F4FDFF",
                            fontSize: "12px",
                            mr: 1,
                            px: 1,
                            mt: 1,
                          }}
                        >
                          {item}
                        </Box>
                      ))}
                    </Box>
                  </ContentTab>
                </BoxContentTab>
              </TabPanel>
              <TabPanel value={1}>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:language")}</TitleContentTab>
                  <ContentTab>
                    {data?.skills?.code_skills?.map((item, key) => (
                      <Box
                        key={key}
                        sx={{
                          display: item.category === LANGUAGE ? "flex" : "none",
                        }}
                      >
                        <Box>
                          <ImgStar countStar={item?.level} />
                        </Box>
                        <Box
                          sx={{
                            mx: 1,
                          }}
                        >
                          {item?.name}
                        </Box>
                        <Box>{item?.experience_year > 0 && item.experience_year + t("profile:year")}</Box>
                        <Box>
                          {item?.experience_month} {t("profile:month")}
                        </Box>
                      </Box>
                    ))}
                  </ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:framework")}</TitleContentTab>
                  <ContentTab>
                    {data?.skills?.code_skills?.map((item, key) => (
                      <Box
                        key={key}
                        sx={{
                          display: item.category === FRAMEWORK ? "flex" : "none",
                        }}
                      >
                        <Box>
                          <ImgStar countStar={item?.level} />
                        </Box>
                        <Box
                          sx={{
                            mx: 1,
                          }}
                        >
                          {item?.name}
                        </Box>
                        <Box>{item?.experience_year > 0 && item.experience_year + t("profile:year")}</Box>
                        <Box>
                          {item?.experience_month} {t("profile:month")}
                        </Box>
                      </Box>
                    ))}
                  </ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:infrastructure")}</TitleContentTab>
                  <ContentTab>
                    {data?.skills?.code_skills?.map((item, key) => (
                      <Box
                        key={key}
                        sx={{
                          display: item.category === INFRASTRUCTURE ? "flex" : "none",
                        }}
                      >
                        <Box>
                          <ImgStar countStar={item?.level} />
                        </Box>
                        <Box
                          sx={{
                            mx: 1,
                          }}
                        >
                          {item?.name}
                        </Box>
                        <Box>{item?.experience_year > 0 && item.experience_year + t("profile:year")}</Box>
                        <Box>
                          {item?.experience_month} {t("profile:month")}
                        </Box>
                      </Box>
                    ))}
                  </ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:upstream-process")}</TitleContentTab>
                  <ContentTab>{data?.skills?.upstream_process}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:english-experience")}</TitleContentTab>
                  <ContentTab>{TEXT_ENGLISH_LEVEL_OPTIONS[data?.skills?.english_level]?.label}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:language-experience")}</TitleContentTab>
                  <ContentTab>{data?.skills?.other_language_level}</ContentTab>
                </BoxContentTab>
              </TabPanel>
            </Box>
          </TabsUnstyled>
        </Box>
      </Box>
    </Grid>
  );
};
export default ProfileSkillComponent;
