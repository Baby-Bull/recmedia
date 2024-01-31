import React, { useEffect, useState } from "react";
import { Box, Tabs, Stack, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";

import theme from "src/theme";
import { TabPanel, a11yProps, ChildTabCustom } from "src/components/common/Tab/BlueChildTabComponent";
import ListViewComponent, { IData } from "src/components/common/ListViewComponent";
import ButtonComponent from "src/components/common/ButtonComponent";
import { getListCommunityPost } from "src/services/community";
import PaginationCustomComponent from "src/components/common/PaginationCustomComponent";
import EmptyComponent from "src/components/community/blocks/EmptyComponent";

const TypographyCustom = styled(Typography)({
  fontSize: 16,
  "@media (max-width: 425px)": {
    fontSize: "14px!important",
  },
});

interface IDataChild {
  text: string;
  data: IData[];
}

interface IChildTabComponentProps {
  dataChild: IDataChild[];
  maxWidth?: string;
  dataCommunityDetail?: any;
}

const ChildTabComponent: React.SFC<IChildTabComponentProps> = ({ maxWidth, dataCommunityDetail }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const RoleAdmin = ["admin", "owner"];
  const tabs = [{ text: "新着順" }, { text: "オススメ順" }];
  const [checkRoleCreatPost, setCheckRoleCreatPost] = useState<any>(null);
  const LIMIT = 10;
  const recommended = "recommended";
  const latest = "latest";
  const [valueChildTab, setValueChildTab] = useState(0);
  const [posts, setPost] = useState([]);
  const [totalCommunityPost, setTotalCommunityPost] = useState(0);
  const [pagePost, setPagePost] = useState(1);
  const [perPagePost, setperPagePost] = useState(2);
  const [valueCursorPost, setCursorPost] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);

  const [postsRecommended, setPostRecommended] = useState([]);
  const [totalCommunityPostRecommended, setTotalCommunityPostRecommended] = useState(0);
  const [pagePostRecommended, setPagePostRecommended] = useState(1);
  const [perPagePostRecommended, setperPagePostRecommended] = useState(2);
  const [valueCursorPostRecommended, setCursorPostRecommended] = useState("");

  const communityPosts = async (cursor: string = "", sortOrder: string = latest) => {
    const communityId = router.query;
    const res = await getListCommunityPost(communityId?.id, LIMIT, cursor, sortOrder);
    setCheckLoading(true);
    if (!res?.error_code) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setPost([...posts, ...res?.items]);
      setTotalCommunityPost(res?.items_count);
      setCursorPost(res?.cursor);
      return res;
    }
  };

  const communityPostsRecomend = async (cursor: string = "", sortOrder: string = recommended) => {
    const communityId = router.query;
    const res = await getListCommunityPost(communityId?.id, LIMIT, cursor, sortOrder);
    if (!res?.error_code) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setPostRecommended([...postsRecommended, ...res?.items]);
      setTotalCommunityPostRecommended(res?.items_count);
      setCursorPostRecommended(res?.cursor);
      return res;
    }
  };

  const onChangeChildTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueChildTab(newValue);
  };

  const handleCallbackChangePagination = (event, value) => {
    setPagePost(value);
    if (perPagePost <= value) {
      setperPagePost(perPagePost + 1);
      communityPosts(valueCursorPost ?? "");
    }
  };

  const handleCallbackChangePaginationRecommended = (event, value) => {
    setPagePostRecommended(value);
    if (perPagePostRecommended <= value) {
      setperPagePostRecommended(perPagePostRecommended + 1);
      communityPostsRecomend(valueCursorPostRecommended ?? "");
    }
  };

  const redirectToCreatePost = () => {
    const community = router.query;
    router.push(`/community/${community?.id}/post/create`);
  };
  useEffect(() => {
    communityPosts();
    communityPostsRecomend();
  }, []);

  useEffect(() => {
    setCheckRoleCreatPost(
      RoleAdmin.includes(dataCommunityDetail?.community_role) ||
        dataCommunityDetail?.post_permission === dataCommunityDetail?.community_role ||
        dataCommunityDetail?.post_permission === "all",
    );
  }, [dataCommunityDetail?.community_role]);

  return (
    <Box>
      {checkLoading && (
        <Box>
          {posts.length > 0 ? (
            <Box>
              <Box
                sx={{
                  border: [`1px solid ${theme.blue}`, `2px solid ${theme.whiteGray}`],
                  borderRadius: "0 0 12px 12px",
                }}
              >
                <Box
                  sx={{
                    my: ["20px", 0],
                    display: "flex",
                    flexDirection: ["column-reverse", "row"],
                    alignItems: "center",
                    justifyContent: ["center", "space-between"],
                  }}
                >
                  <Tabs
                    variant="fullWidth"
                    value={valueChildTab}
                    onChange={onChangeChildTab}
                    aria-label="tab children"
                    sx={{
                      mx: { sm: "40px" },
                      mt: { sm: "38px" },
                      borderBottom: [`1px solid ${theme.lightGray}`, "none"],
                      ".MuiTabs-indicator": {
                        backgroundColor: [theme.blue, "transparent"],
                      },
                    }}
                  >
                    {tabs?.map((tab, index) => (
                      <ChildTabCustom
                        key={index.toString()}
                        props={{
                          fontSize: "14px",
                          fontWeight: 400,
                          mdWidth: maxWidth,
                        }}
                        iconPosition="top"
                        label={tab.text}
                        {...a11yProps(index)}
                      />
                    ))}
                  </Tabs>
                  {checkRoleCreatPost && (
                    <ButtonComponent
                      props={{
                        mode: "gradient",
                        dimension: "tiny",
                      }}
                      sx={{
                        height: "36px",
                        mr: "26px",
                        "@media (max-width: 425px)": {
                          fontSize: "12px",
                        },
                      }}
                      onClick={redirectToCreatePost}
                    >
                      {t("community:button.create-post")}
                    </ButtonComponent>
                  )}
                </Box>

                <TabPanel value={valueChildTab} index={0}>
                  <Box
                    sx={{
                      borderBottom: `1px solid ${theme.lightGray}`,
                    }}
                  >
                    {posts.length > 0 &&
                      posts.slice((pagePost - 1) * LIMIT, pagePost * LIMIT).map((tab, index) => (
                        <React.Fragment key={index.toString()}>
                          <Box>
                            <ListViewComponent
                              data={tab}
                              props={{
                                pl: ["10px", "42px"],
                                pr: ["10px", "19px"],
                              }}
                            />
                          </Box>
                        </React.Fragment>
                      ))}
                  </Box>
                  {totalCommunityPost > LIMIT && (
                    <Box
                      sx={{
                        py: "40px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Stack>
                        <PaginationCustomComponent
                          handleCallbackChangePagination={handleCallbackChangePagination}
                          page={pagePost}
                          perPage={perPagePost}
                          totalPage={Math.ceil(totalCommunityPost / LIMIT)}
                        />
                      </Stack>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={valueChildTab} index={1}>
                  <Box
                    sx={{
                      borderBottom: `1px solid ${theme.lightGray}`,
                    }}
                  >
                    {postsRecommended.length > 0 &&
                      postsRecommended
                        .slice((pagePostRecommended - 1) * LIMIT, pagePostRecommended * LIMIT)
                        .map((tab, index) => (
                          <React.Fragment key={index.toString()}>
                            <Box>
                              <ListViewComponent
                                data={tab}
                                props={{
                                  pl: ["10px", "42px"],
                                  pr: ["10px", "19px"],
                                }}
                              />
                            </Box>
                          </React.Fragment>
                        ))}
                  </Box>
                  {totalCommunityPostRecommended > LIMIT && (
                    <Box
                      sx={{
                        py: "40px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Stack>
                        <PaginationCustomComponent
                          handleCallbackChangePagination={handleCallbackChangePaginationRecommended}
                          page={pagePostRecommended}
                          perPage={perPagePostRecommended}
                          totalPage={
                            Math.floor(totalCommunityPostRecommended / LIMIT) < totalCommunityPostRecommended / LIMIT
                              ? Math.floor(totalCommunityPostRecommended / LIMIT) + 1
                              : Math.floor(totalCommunityPostRecommended / LIMIT)
                          }
                        />
                      </Stack>
                    </Box>
                  )}
                </TabPanel>
              </Box>
            </Box>
          ) : (
            <Box>
              <EmptyComponent
                hiddenButton={!checkRoleCreatPost}
                textButton={t("community:button.empty.create-post")}
                handleClick={redirectToCreatePost}
              >
                <TypographyCustom>{t("community:empty.no-post")}</TypographyCustom>
                <TypographyCustom display={["block", "flex"]}>
                  <Typography sx={{ fontSize: ["14px", "16px"] }}>{t("community:empty.create-post")}</Typography>
                  <Typography sx={{ fontSize: ["14px", "16px"] }}>{t("community:empty.talk-to-members")}</Typography>
                </TypographyCustom>
              </EmptyComponent>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
export default ChildTabComponent;
