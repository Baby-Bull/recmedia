/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Tabs, Typography, Avatar, Select, MenuItem, SelectChangeEvent, Grid } from "@mui/material";
import { useTranslation } from "next-i18next";

import theme from "src/theme";
import { TabPanel, a11yProps, TabCustom } from "src/components/common/Tab/BlueTabComponent";
import EmptyMatchingComponent from "src/components/matching/blocks/EmptyMatchingComponent";
import ThreadComponent from "src/components/matching/blocks/ThreadComponent";
import useViewport from "src/helpers/useViewport";
// import ChildTabComponent, { IDataChild } from "src/components/matching/blocks/ChildTabComponent";
import ChildTabComponent from "src/components/matching/blocks/ChildTabComponent";
import { getMatchedRequest } from "src/services/matching";
import { TAB_VALUE_BY_KEY } from "src/constants/matching";

import PaginationCustomComponent from "../common/PaginationCustomComponent";
import { getUserFavorite } from "src/services/user";
import { getListCommunities } from "src/services/community";

// interface IData {
//   avatar: string;
//   name: string;
//   count_member: string;
// }

// interface ITabComponentData {
//   children: IDataChild[];
//   data: IData[];
//   text: string;
//   icon: string;
// }

interface ITabComponentProps {
  // data: ITabComponentData[];
  data: any;
  setKeyRefetchData: Function;
  tabValue: number;
  setTabValue: Function;
  checkLoadingFavorite?: boolean;
  checkLoadingCommunity?: boolean;
  checkLoadingReceived?: boolean;
  checkLoadingSend?: boolean;
}

const OPTIONS = [
  { value: "newest", label: "新しい順" },
  { value: "oldest", label: "古い順" },
  { value: "name-asc", label: "名前順" },
];

const TabComponent: React.SFC<ITabComponentProps> = ({
  data,
  setKeyRefetchData,
  tabValue,
  setTabValue,
  checkLoadingFavorite,
  checkLoadingCommunity,
  checkLoadingSend,
  checkLoadingReceived,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const viewPort = useViewport();
  const isMobile = viewPort.width <= 992;
  const LIMITCOUNTPERPAGE = 10;
  const LIMITCOUNTPAGECOMMUNITY = isMobile ? 4 : 8;

  const onChangeParentTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [isFetchedMatchedUser, setIsFetchedMatchedUser] = useState(false);
  const [optionSelected, setOption] = React.useState("newest");
  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value);
    setIsFetchedMatchedUser(false);
  };

  const handleRedirectCommunity = (idComm: string) => {
    router.push(`/community/${idComm}`);
  };

  // Block render user-favorites ***** paginated
  const [allFavoritesRef, setAllFavoritesRef] = useState(data[2]?.data);
  const [cursorFavorite, setCursorFavorite] = useState(data[2]?.cursor);
  const [hasMoreFavorite, setHasMoreFavorite] = useState(data[2]?.hasMore);
  const [pageFavorite, setPageFavorite] = useState(1);
  const [countCurrentPagesFavorite, setCountCurrentPagesFavorite] = useState(2);
  const fetchUserFavorite = async () => {
    const res1 = await getUserFavorite(LIMITCOUNTPERPAGE, cursorFavorite);
    setCursorFavorite(res1?.cursor);
    setHasMoreFavorite(res1?.hasMore);
    setAllFavoritesRef([...allFavoritesRef, ...res1?.items]);
    return res1;
  };
  const handleCallbackChangePaginationFavorites = (event, value) => {
    setPageFavorite(value);
    if (countCurrentPagesFavorite <= value && hasMoreFavorite) {
      setCountCurrentPagesFavorite(countCurrentPagesFavorite + 1);
      fetchUserFavorite();
    }
  }; // end block paginate for user favorites

  // Block render user-matched ***** paginated
  const [allMatchedRef, setAllMatchedRef] = useState([]);
  const [cursorMatched, setCursorMatched] = useState('');
  const [hasMoreMatched, setHasMoreMatched] = useState(true);
  const [pageMatched, setPageMatched] = useState(1);
  const [countCurrentPagesMatched, setCountCurrentPagesMatched] = useState(2);
  const fetchUserMatched = async () => {
    const res2 = await getMatchedRequest(11, cursorMatched, optionSelected);
    setCursorMatched(JSON.stringify(res2?.cursor) === "null" ? "" : res2?.cursor);
    setHasMoreMatched(res2?.hasMore);
    hasMoreMatched && setAllMatchedRef([...allMatchedRef, ...res2?.items]);
    return res2;
  };
  const handleCallbackChangePaginationMatched = (event, value) => {
    setPageMatched(value);
    if (countCurrentPagesMatched <= value && hasMoreMatched) {
      setCountCurrentPagesMatched(countCurrentPagesMatched + 1);
      fetchUserMatched();
    }
  }; // end block paginate for user Matched

  // Block render user-Community ***** paginated
  const [allCommunityRef, setAllCommunityRef] = useState(data[4]?.data);
  const [cursorCommunity, setCursorCommunity] = useState(data[4]?.cursor);
  const [hasMoreCommunity, setHasMoreCommunity] = useState(data[4]?.hasMore);
  const [pageCommunity, setPageCommunity] = useState(1);
  const [countCurrentPagesCommunity, setCountCurrentPagesCommunity] = useState(2);
  const fetchUserCommunity = async () => {
    const res3 = await getListCommunities(LIMITCOUNTPAGECOMMUNITY, cursorCommunity);
    setCursorCommunity(res3?.cursor);
    setHasMoreCommunity(res3?.hasMore);
    setAllCommunityRef([...allCommunityRef, ...res3?.items]);
    return res3;
  };
  const handleCallbackChangePaginationCommunity = (event, value) => {
    setPageCommunity(value);
    if (countCurrentPagesCommunity <= value && hasMoreCommunity) {
      setCountCurrentPagesCommunity(countCurrentPagesCommunity + 1);
      fetchUserCommunity();
    }
  }; // end block paginate for user community

  //get data matchedUser for the first time.
  useEffect(() => {
    if (tabValue === TAB_VALUE_BY_KEY.matched && !isFetchedMatchedUser) {
      fetchUserMatched();
      setIsFetchedMatchedUser(true)
    }
  }, [optionSelected, tabValue]);

  useEffect(() => {
    setAllFavoritesRef(data[2]?.data);
    setCursorFavorite(data[2]?.cursor);
    setHasMoreFavorite(data[2]?.hasMore);
    setPageFavorite(1);
    setCountCurrentPagesFavorite(2);
  }, [data[2]?.data, data[2]?.cursor, data[2]?.hasMore])
  useEffect(() => {
    setAllCommunityRef(data[4]?.data);
    setCursorCommunity(data[4]?.cursor);
    setHasMoreCommunity(data[4]?.hasMore);
    setPageCommunity(1);
    setCountCurrentPagesCommunity(2);
  }, [data[4]?.data, data[4]?.cursor, data[4]?.hasMore])

  return (
    <React.Fragment>
      <Tabs
        value={tabValue}
        onChange={onChangeParentTab}
        aria-label="tab children"
        TabIndicatorProps={{
          style: {
            backgroundColor: "transparent",
          },
        }}
      >
        {data?.map((tab: any, index: number) => (
          <TabCustom
            key={index.toString()}
            props={{
              xsBorderColor: theme.lightGray,
            }}
            // onClick={() => setKeyForTabTitle(index)}
            iconPosition="top"
            icon={tab.icon}
            label={tab.text}
            {...a11yProps(index)}
            sx={{
              backgroundColor: "white",
              "@media (max-width: 768px)": {
                whiteSpace: "pre-line",
              },
            }}
          />
        ))}
      </Tabs>

      {checkLoadingReceived && (
        <TabPanel value={tabValue} index={TAB_VALUE_BY_KEY.received}>
          <ChildTabComponent
            dataId={1}
            dataType={data[0]?.type}
            dataChild={data[0]?.children ?? []}
            maxWidth="230px"
            setKeyRefetchData={setKeyRefetchData}
          />
        </TabPanel>
      )}

      {checkLoadingSend && (
        <TabPanel value={tabValue} index={TAB_VALUE_BY_KEY.sent}>
          <ChildTabComponent
            dataId={2}
            dataType={data[1]?.type}
            dataChild={data[1]?.children ?? []}
            maxWidth="160px"
            setKeyRefetchData={setKeyRefetchData}
          />
        </TabPanel>
      )}

      {checkLoadingFavorite && (
        <TabPanel value={tabValue} index={TAB_VALUE_BY_KEY.favorite}>
          <Box
            sx={{
              pb: ["120px", "98px"],
              paddingTop: ["20px", "0"],
              backgroundColor: theme.whiteBlue,
            }}
          >
            {data[2]?.data?.length ? (
              <React.Fragment>
                {allFavoritesRef
                  ?.slice(
                    (pageFavorite - 1) * LIMITCOUNTPERPAGE,
                    pageFavorite * LIMITCOUNTPERPAGE,
                  )
                  .map((tab, tabIndex) => (
                    <React.Fragment key={tabIndex.toString()}>
                      <Box
                        sx={{
                          px: [0, "40px"],
                          backgroundColor: "white",
                          "&:last-of-type": {
                            borderBottom: { sm: `2px solid ${theme.lightGray}` },
                          },
                        }}
                      >
                        <ThreadComponent data={tab} type="favorite" setKeyRefetchData={setKeyRefetchData} />
                      </Box>
                    </React.Fragment>
                  ))}
                <Box
                  sx={{
                    py: "40px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {data[2]?.hasMore && (
                    <PaginationCustomComponent
                      handleCallbackChangePagination={handleCallbackChangePaginationFavorites}
                      page={pageFavorite}
                      perPage={countCurrentPagesFavorite}
                      totalPage={hasMoreFavorite ? countCurrentPagesFavorite : countCurrentPagesFavorite - 1}
                    />
                  )}
                  {hasMoreFavorite}
                </Box>
              </React.Fragment>
            ) : (
              <EmptyMatchingComponent text={t("matching:text-empty.tab-4")} />
            )}
          </Box>
        </TabPanel>
      )}

      <TabPanel value={tabValue} index={TAB_VALUE_BY_KEY.matched}>
        <Box
          sx={{
            pb: ["120px", "98px"],
            backgroundColor: theme.whiteBlue,
          }}
        >
          {allMatchedRef?.length ? (
            <React.Fragment>
              <Box
                sx={{
                  py: "20px",
                  pl: { sm: "40px" },
                  display: ["flex", "inherit"],
                  justifyContent: "center",
                  backgroundColor: { sm: "white" },
                }}
              >
                <Select
                  value={optionSelected}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: theme.navy,
                    width: ["320px", "240px"],
                    height: "40px",
                    backgroundColor: "white",
                    fieldset: {
                      borderColor: [theme.lightGray, theme.gray],
                    },
                  }}
                >
                  {OPTIONS &&
                    OPTIONS.map((option, index) => (
                      <MenuItem key={index.toString()} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </Box>

              {allMatchedRef
                ?.slice(
                  (pageMatched - 1) * LIMITCOUNTPERPAGE, pageMatched * LIMITCOUNTPERPAGE,
                )
                .map((tab, tabIndex) => (
                  <React.Fragment key={tabIndex.toString()}>
                    <Box
                      sx={{
                        px: [0, "40px"],
                        backgroundColor: "white",
                        "&:last-of-type": {
                          borderBottom: { sm: `2px solid ${theme.lightGray}` },
                        },
                      }}
                    >
                      <ThreadComponent data={tab} type="matched" />
                    </Box>
                  </React.Fragment>
                ))}
              <Box
                sx={{
                  py: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {(allMatchedRef?.length > LIMITCOUNTPERPAGE) && (
                  <PaginationCustomComponent
                    handleCallbackChangePagination={handleCallbackChangePaginationMatched}
                    page={pageMatched}
                    perPage={countCurrentPagesMatched}
                    totalPage={hasMoreMatched ? countCurrentPagesMatched : countCurrentPagesMatched - 1}
                  />
                )}
              </Box>
            </React.Fragment>
          ) : (
            <EmptyMatchingComponent text={t("matching:text-empty.tab-4")} />
          )}
        </Box>
      </TabPanel>

      {checkLoadingCommunity && (
        <TabPanel value={tabValue} index={TAB_VALUE_BY_KEY.community}>
          <Box
            sx={{
              pb: ["120px", "98px"],
              backgroundColor: theme.whiteBlue,
            }}
          >
            {data[4]?.data?.length ? (
              <React.Fragment>
                <Box
                  sx={{
                    mt: ["30px", 0],
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    paddingBottom: "2em",
                    backgroundColor: "white",
                  }}
                >
                  {allCommunityRef
                    ?.slice(
                      (pageCommunity - 1) * LIMITCOUNTPAGECOMMUNITY,
                      pageCommunity * LIMITCOUNTPAGECOMMUNITY,
                    )
                    .map((tab, tabIndex) => (
                      <React.Fragment key={tabIndex.toString()}>
                        <Grid xs={6} md={3}>
                          <Box
                            onClick={() => handleRedirectCommunity(tab?.id)}
                            sx={{
                              cursor: "pointer",
                              mt: [0, "40px"],
                              mb: ["20px", 0],
                              mx: [0, "20px"],
                              // flex: ["0 0 50%", "0 0 25%"],
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Avatar
                              variant="circular"
                              sx={{
                                width: ["149px", "124px"],
                                height: ["149px", "124px"],
                                img: {
                                  objectFit:
                                    tab?.profile_image === "/assets/images/logo/logo.png" ? "contain" : "cover",
                                  border:
                                    tab?.profile_image === "/assets/images/logo/logo.png"
                                      ? "3px #e8ecf1 solid"
                                      : "none",
                                  borderRadius: "50%",
                                },
                              }}
                              src={tab?.profile_image}
                              alt={tab?.username}
                            />

                            <Typography
                              component="span"
                              pt="10px"
                              sx={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "black",
                                textAlign: "center",
                              }}
                            >
                              {tab?.name}
                            </Typography>
                            <Typography
                              component="span"
                              pt="8px"
                              sx={{
                                fontSize: [10, 14],
                                color: theme.gray,
                              }}
                            >
                              {t("matching:count-member")} {tab?.member_count} 人
                            </Typography>
                          </Box>
                        </Grid>
                      </React.Fragment>
                    ))}
                </Box>
                <Box
                  sx={{
                    py: "40px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {data[4]?.hasMore && (
                    <PaginationCustomComponent
                      handleCallbackChangePagination={handleCallbackChangePaginationCommunity}
                      page={pageCommunity}
                      perPage={countCurrentPagesCommunity}
                      totalPage={hasMoreCommunity ? countCurrentPagesCommunity : countCurrentPagesCommunity - 1}
                    />
                  )}
                </Box>
              </React.Fragment>
            ) : (
              <EmptyMatchingComponent text={t("matching:text-empty.tab-5")} mode="community" />
            )}
          </Box>
        </TabPanel>
      )}
    </React.Fragment>
  );
};
export default TabComponent;
