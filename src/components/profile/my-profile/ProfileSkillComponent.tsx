import { Box, Grid } from "@mui/material";
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

import theme from "src/theme";

interface ProfileSkillComponentProps {
  profileStatus: string;
  profileOneThing: string;
  profileSelfIntroduction: string;
  profileOccupation: string;
  profilePosition: string;
  profileEmploymentStatus: string;
  profileIntroduceYourself: string;
  profileAddress: string;
  profileTag: Array<string>;
  ProfileSkillLanguage: Array<any>;
  ProfileSkillFramework: Array<any>;
  ProfileSkillInfrastructure: string;
  ProfileSkillUpstreamProcess: string;
  ProfileSkillEnglishExperience: string;
  ProfileSkillLanguageExperience: string;
  myProfile: boolean;
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

const ProfileSkillComponent: React.SFC<ProfileSkillComponentProps> = ({
  profileStatus,
  profileOneThing,
  profileSelfIntroduction,
  profileOccupation,
  profilePosition,
  profileEmploymentStatus,
  profileIntroduceYourself,
  profileAddress,
  profileTag,
  ProfileSkillLanguage,
  ProfileSkillFramework,
  ProfileSkillInfrastructure,
  ProfileSkillUpstreamProcess,
  ProfileSkillEnglishExperience,
  ProfileSkillLanguageExperience,
  myProfile,
}) => {
  const { t } = useTranslation();
  return (
    <Grid item xs={12} sm={12} lg={12} xl={12}>
      <Box
        sx={{
          background: { xs: "unset", lg: "#ffffff" },
          p: { xs: "0", lg: "20px 80px 78px 80px" },
          m: { xs: "40px 0", lg: "0" },
        }}
      >
        <Box
          sx={{
            background: "#ffffff",
            border: "1px solid #03BCDB",
            borderRadius: "40px",
            width: "240px",
            height: "32px",
            margin: "0 auto",
            mb: "63px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#03BCDB",
            display: myProfile ? "none" : { xs: "none", lg: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src="/assets/images/icon/ic_heart.png" alt="" />

          <Box sx={{ ml: 1 }}>{t("profile:add-friend")}</Box>
        </Box>
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
                      background: "#FF9458",
                      borderRadius: "4px",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      width: "138.13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {profileStatus}
                  </Box>
                </Box>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:one-thing")}</TitleContentTab>
                  <ContentTab>{profileOneThing}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:self-introduction")}</TitleContentTab>
                  <ContentTab>{profileSelfIntroduction}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:occupation")}</TitleContentTab>
                  <ContentTab>{profileOccupation}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:position")}</TitleContentTab>
                  <ContentTab>{profilePosition}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:employment-status")}</TitleContentTab>
                  <ContentTab>{profileEmploymentStatus}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:discussion-topic")}</TitleContentTab>
                  <ContentTab>
                    {profileIntroduceYourself ??
                      "はじめまして。色々な方とお話をしたいと考えています！よろしくお願いします。"}
                  </ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:address")}</TitleContentTab>
                  <ContentTab>{profileAddress}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:tag")}</TitleContentTab>
                  <ContentTab>
                    <Box sx={{ display: "flex" }}>
                      {profileTag?.map((item) => (
                        <Box
                          sx={{
                            background: "#F4FDFF",
                            fontSize: "12px",
                            mr: 1,
                            px: 1,
                          }}
                        >
                          {item}
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: "flex", mt: 1 }}>
                      {profileTag?.map((item) => (
                        <Box
                          sx={{
                            background: "#F4FDFF",
                            fontSize: "12px",
                            mr: 1,
                            px: 1,
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
                    {ProfileSkillLanguage?.map((item) => (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <Box>
                            {item.star?.map((star) => (
                              <img src={star} alt="star" />
                            ))}
                          </Box>
                          <Box
                            sx={{
                              mx: 1,
                            }}
                          >
                            {item.language}
                          </Box>

                          <Box>
                            {item.languageExperience} {t("profile:year")}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:framework")}</TitleContentTab>
                  <ContentTab>
                    {ProfileSkillFramework?.map((item) => (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <Box>
                            {item.star?.map((star) => (
                              <img src={star} alt="star" />
                            ))}
                          </Box>
                          <Box
                            sx={{
                              mx: 1,
                            }}
                          >
                            {item.language}
                          </Box>

                          <Box>
                            {item.languageExperience} {t("profile:year")}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:infrastructure")}</TitleContentTab>
                  <ContentTab>{ProfileSkillInfrastructure}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:upstream-process")}</TitleContentTab>
                  <ContentTab>{ProfileSkillUpstreamProcess}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:english-experience")}</TitleContentTab>
                  <ContentTab>{ProfileSkillEnglishExperience}</ContentTab>
                </BoxContentTab>
                <BoxContentTab>
                  <TitleContentTab>{t("profile:language-experience")}</TitleContentTab>
                  <ContentTab>{ProfileSkillLanguageExperience}</ContentTab>
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
