/* eslint-disable */
import React, { useState } from "react";
import { Box, Tabs } from "@mui/material";
import { useTranslation } from "next-i18next";

import theme from "src/theme";
import { TabPanel, a11yProps, ChildTabCustom } from "src/components/common/Tab/BlueChildTabComponent";
import EmptyMatchingComponent from "src/components/matching/blocks/EmptyMatchingComponent";
import ThreadComponent from "src/components/matching/blocks/ThreadComponent";
import PaginationCustomComponent from "src/components/common/PaginationCustomComponent";
import { getMatchingRequestReceived, getMatchingRequestSent } from "src/services/matching";

export interface IDataChild {
  data: string[];
  text: string;
  count: string;
  cursor: string;
  hasMore: boolean;
}

interface IChildTabComponentProps {
  dataId: number;
  dataType?: string;
  dataChild: IDataChild[];
  maxWidth?: string;
  setKeyRefetchData?: Function;
}

const ChildTabComponent: React.SFC<IChildTabComponentProps> = ({
  dataId,
  dataChild,
  dataType,
  maxWidth,
  setKeyRefetchData,
}) => {
  const LIMITCOUNTPERPAGE = 10;
  const { t } = useTranslation();
  const [valueChildTab, setValueChildTab] = React.useState(0);

  const onChangeChildTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueChildTab(newValue);
  };

  // Block render user-request(pending) ***** paginated
  const [allPendingRef, setAllPendingRef] = useState(dataChild[0]?.data);
  const [cursorPending, setCursorPending] = useState(dataChild[0]?.cursor);
  const [hasMorePending, setHasMorePending] = useState(dataChild[0]?.hasMore);
  const [pagePending, setPagePending] = useState(1);
  const [countCurrentPagesPending, setCountCurrentPagesPending] = useState(2);
  const fetchReceivedRequestPending = async () => {
    const data = (dataType === "1") ? await getMatchingRequestReceived(LIMITCOUNTPERPAGE, cursorPending, "pending") : await getMatchingRequestSent(LIMITCOUNTPERPAGE, cursorPending, "pending");
    setCursorPending(data?.cursor);
    setHasMorePending(data?.hasMore);
    setAllPendingRef([...allPendingRef, ...data?.items]);
    return data;
  };
  const handleCallbackChangePaginationPending = (event, value) => {
    setPagePending(value);
    if (countCurrentPagesPending <= value && hasMorePending) {
      setCountCurrentPagesPending(countCurrentPagesPending + 1);
      fetchReceivedRequestPending();
    }
  }; // end block paginate for user_request(pending)

  // Block render user_request(rejected) ***** paginated
  const [allRejectedRef, setAllRejectedRef] = useState(dataChild[1]?.data);
  const [cursorRejected, setCursorRejected] = useState(dataChild[1]?.cursor);
  const [hasMoreRejected, setHasMoreRejected] = useState(dataChild[1]?.hasMore);
  const [pageRejected, setPageRejected] = useState(1);
  const [countCurrentPagesRejected, setCountCurrentPagesRejected] = useState(2);
  const fetchReceivedRequestRejected = async () => {
    const data = (dataType === "1") ? await getMatchingRequestReceived(LIMITCOUNTPERPAGE, cursorRejected, "rejected") : await getMatchingRequestSent(LIMITCOUNTPERPAGE, cursorRejected, "rejected");
    setCursorRejected(data?.cursor);
    setHasMoreRejected(data?.hasMore);
    setAllRejectedRef([...allRejectedRef, ...data?.items]);
    return data;
  };
  const handleCallbackChangePaginationRejected = (event, value) => {
    setPageRejected(value);
    if (countCurrentPagesRejected <= value && hasMoreRejected) {
      setCountCurrentPagesRejected(countCurrentPagesRejected + 1);
      fetchReceivedRequestRejected();
    }
  }; // end block paginate for user-request(rejected)

  React.useEffect(() => {
    setAllPendingRef(dataChild[0]?.data);
    setCursorPending(dataChild[0]?.cursor);
    setHasMorePending(dataChild[0]?.hasMore);
    setPagePending(1);
    setCountCurrentPagesPending(2);
  }, [dataChild[0]?.data, dataChild[0]?.cursor, dataChild[0]?.hasMore])
  React.useEffect(() => {
    setAllRejectedRef(dataChild[1]?.data);
    setCursorRejected(dataChild[1]?.cursor);
    setHasMoreRejected(dataChild[1]?.hasMore);
    setPageRejected(1);
    setCountCurrentPagesRejected(2);
  }, [dataChild[1]?.data, dataChild[1]?.cursor, dataChild[1]?.hasMore])

  return (
    <React.Fragment>
      <Tabs
        variant="fullWidth"
        value={valueChildTab}
        onChange={onChangeChildTab}
        aria-label="tab children"
        sx={{
          mx: { sm: "42px" },
          pt: { sm: "38px" },
          borderBottom: [`1px solid ${theme.lightGray}`, "none"],
          ".MuiTabs-indicator": {
            backgroundColor: [theme.blue, "transparent"],
          },
        }}
      >
        {dataChild?.map((tab, index) => (
          <ChildTabCustom
            key={index.toString()}
            props={{
              fontSize: "10px",
              mdWidth: maxWidth,
              smFontSize: "14px",
              mdFontSize: "21px",
            }}
            iconPosition="top"
            label={tab.text + (tab?.count ? `（${tab?.count}）` : "")}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>

      <TabPanel value={valueChildTab} index={0}>
        <Box
          sx={{
            pb: ["120px", "98px"],
            backgroundColor: [theme.whiteBlue, "white"],
          }}
        >
          {allPendingRef?.length ? (
            <React.Fragment>
              {allPendingRef?.slice((pagePending - 1) * LIMITCOUNTPERPAGE, pagePending * LIMITCOUNTPERPAGE)
                .map((tab, index) => (
                  <React.Fragment key={index.toString()}>
                    <Box
                      sx={{
                        mx: [0, "45px"],
                        "&:first-of-type": {
                          paddingTop: ["20px", "27px"],
                        },
                        "&:last-of-type": {
                          borderBottom: { sm: `2px solid ${theme.lightGray}` },
                        },
                      }}
                    >
                      <ThreadComponent
                        data={tab}
                        type="unConfirm"
                        dataType={dataType}
                        setKeyRefetchData={setKeyRefetchData}
                      />
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
                {dataChild[0]?.hasMore && (
                  <PaginationCustomComponent
                    handleCallbackChangePagination={handleCallbackChangePaginationPending}
                    page={pagePending}
                    perPage={countCurrentPagesPending}
                    totalPage={hasMorePending ? countCurrentPagesPending : countCurrentPagesPending - 1}
                  />
                )}
              </Box>
            </React.Fragment>
          ) : (
            <Box
              sx={{
                mx: [0, "45px"],
                paddingTop: ["20px", "27px"],
              }}
            >
              <EmptyMatchingComponent
                text={dataId === 1 ? t("matching:text-empty.tab-1.1") : t("matching:text-empty.tab-2.1")}
              />
            </Box>
          )}
        </Box>
      </TabPanel>
      <TabPanel value={valueChildTab} index={1}>
        <Box
          sx={{
            pb: ["120px", "98px"],
            backgroundColor: [theme.whiteBlue, "white"],
          }}
        >
          {allRejectedRef?.length ? (
            <React.Fragment>
              {allRejectedRef?.slice((pageRejected - 1) * LIMITCOUNTPERPAGE, pageRejected * LIMITCOUNTPERPAGE)
                .map((tab, index) => (
                  <React.Fragment key={index.toString()}>
                    <Box
                      sx={{
                        mx: [0, "45px"],
                        "&:first-of-type": {
                          paddingTop: ["20px", "27px"],
                        },
                      }}
                    >
                      <ThreadComponent
                        data={tab}
                        type="reject"
                        dataType={dataType}
                        setKeyRefetchData={setKeyRefetchData}
                      />
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
                {(dataChild[1]?.hasMore) && (
                  <PaginationCustomComponent
                    handleCallbackChangePagination={handleCallbackChangePaginationRejected}
                    page={pageRejected}
                    perPage={countCurrentPagesRejected}
                    totalPage={hasMoreRejected ? countCurrentPagesRejected : countCurrentPagesRejected - 1}
                  />
                )}
              </Box>
            </React.Fragment>
          ) : (
            <Box
              sx={{
                mx: [0, "45px"],
                paddingTop: ["20px", "27px"],
              }}
            >
              <EmptyMatchingComponent
                text={dataId === 1 ? t("matching:text-empty.tab-1.3") : t("matching:text-empty.tab-2.3")}
              />
            </Box>
          )}
        </Box>
      </TabPanel>
    </React.Fragment>
  );
};
export default ChildTabComponent;
