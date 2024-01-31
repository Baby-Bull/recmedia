import React, { useEffect, useState } from "react";
import { Backdrop, Box, CircularProgress, Tabs } from "@mui/material";
import { useRouter } from "next/router";

import theme from "src/theme";
import useViewport from "src/helpers/useViewport";
import GridViewMemberComponent from "src/components/community/setting/blocks/GridViewMemberComponent";
import { ChildTabCustom, a11yProps, TabPanel } from "src/components/common/Tab/BlueChildTabComponent";
import PaginationCustomComponent from "src/components/common/PaginationCustomComponent";
import { CommunityMembers, CommunityMembersBlocked, MemberBlocked, MemberUnBlock } from "src/services/community";

interface IMemberComponentProps {
  isAdmin?: boolean;
}

const MemberComponent: React.SFC<IMemberComponentProps> = ({ isAdmin }) => {
  const LIMIT = 10;
  const LIST_BLOCK = 0;
  const LIST_BLOCKED = 1;
  const router = useRouter();
  const viewPort = useViewport();
  const isMobile = viewPort.width <= 425;
  const [valueChildTab, setValueChildTab] = useState(0);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [countItemsBlock, setCountItemsBlock] = useState(0);
  const [countItemsBlocked, setCountItemsBlocked] = useState(0);
  const [communityMembersBlocked, setCommunityMembersBlocked] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [pageBlock, setPageBlock] = useState(1);
  const [perPageBlock, setperPageBlock] = useState(2);
  const [valueCursorBlock, setCursorBlock] = useState("");
  const [pageBlocked, setPageBlocked] = useState(1);
  const [perPageBlocked, setperPageBlocked] = useState(2);
  const [valueCursorBlocked, setCursorBlocked] = useState("");
  // end pagination

  const fetchDataUsers = async (cursor: string = "") => {
    const communityId = router.query;
    const resData = await CommunityMembers(communityId?.indexId, LIMIT, cursor);
    // eslint-disable-next-line no-unsafe-optional-chaining
    setCommunityMembers([...communityMembers, ...resData?.items]);
    setCountItemsBlock(resData?.items_count ?? 0);
    setCursorBlock(resData?.cursor);
    return resData;
  };

  const fetchDataUsersBlocked = async (cursor: string = "") => {
    const communityId = router.query;
    const resData = await CommunityMembersBlocked(communityId?.indexId, LIMIT, cursor);
    // eslint-disable-next-line no-unsafe-optional-chaining
    setCommunityMembersBlocked([...communityMembersBlocked, ...resData?.items]);
    setCountItemsBlocked(resData?.items_count ?? 0);
    setCursorBlocked(resData?.cursor);
    return resData;
  };

  useEffect(() => {
    fetchDataUsers();
    fetchDataUsersBlocked();
  }, []);

  const handleCallbackChangePaginationBlock = (event, value) => {
    setPageBlock(value);
    if (perPageBlock <= value && countItemsBlock > communityMembers.length) {
      setperPageBlock(perPageBlock + 1);
      fetchDataUsers(valueCursorBlock ?? "");
    }
  };

  const handleCallbackChangePaginationBlocked = (event, value) => {
    setPageBlocked(value);
    if (perPageBlocked <= value && countItemsBlocked > communityMembersBlocked.length) {
      setperPageBlocked(perPageBlocked + 1);
      fetchDataUsersBlocked(valueCursorBlocked ?? "");
    }
  };

  const onChangeChildTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueChildTab(newValue);
  };

  const MemberUnBlocked = async (memberUnBlockedId) => {
    setIsLoading(true);
    const communityId = router.query;
    const resData = await MemberUnBlock(communityId?.indexId, memberUnBlockedId);
    if (resData && communityMembersBlocked.length < 11 && communityMembersBlocked.length < countItemsBlocked) {
      const resDataMembersBlocked = await CommunityMembersBlocked(communityId?.indexId, LIMIT, "");
      setCommunityMembersBlocked(resDataMembersBlocked?.items);
      setCursorBlocked(resDataMembersBlocked?.cursor);
    }
    setIsLoading(false);
    return resData;
  };

  const MemberBlock = async (memberUnBlockId) => {
    setIsLoading(true);
    const communityId = router.query;
    const resData = await MemberBlocked(communityId?.indexId, memberUnBlockId);
    if (resData && communityMembers.length < 11 && communityMembers.length < countItemsBlock) {
      const resDataCommunityMembers = await CommunityMembers(communityId?.indexId, LIMIT, "");
      setCommunityMembers(resDataCommunityMembers?.items);
      setCursorBlock(resDataCommunityMembers?.cursor);
    }
    setIsLoading(false);
    return resData;
  };

  const callbackHandleRemoveMemberBlock = (indexMember, memberBlockId) => {
    MemberBlock(memberBlockId);
    communityMembersBlocked.unshift(communityMembers[indexMember]);
    setCommunityMembers(communityMembers.filter((_, index) => index !== indexMember));
    setCountItemsBlocked(countItemsBlocked + 1);
    setCountItemsBlock(countItemsBlock - 1);
    if (communityMembers.length < 2 + (pageBlock - 1) * 10 && pageBlock > 1) {
      handleCallbackChangePaginationBlock("onClick", pageBlock - 1);
    }
  };

  const callbackHandleRemoveMemberBlocked = async (indexMember, memberBlockedId) => {
    MemberUnBlocked(memberBlockedId);
    communityMembers.unshift(communityMembersBlocked[indexMember]);
    setCommunityMembersBlocked(communityMembersBlocked.filter((_, index) => index !== indexMember));
    setCountItemsBlocked(countItemsBlocked - 1);
    setCountItemsBlock(countItemsBlock + 1);
    if (communityMembersBlocked.length < 2 + (pageBlocked - 1) * 10 && pageBlocked > 1) {
      handleCallbackChangePaginationBlocked("onClick", pageBlocked - 1);
    }
  };

  return (
    <React.Fragment>
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box
        sx={{
          mr: [0, "17.32%"],
          backgroundColor: [theme.whiteBlue, "white"],
          borderRadius: "12px",
        }}
      >
        <Tabs
          value={valueChildTab}
          onChange={onChangeChildTab}
          aria-label="tab children"
          TabIndicatorProps={{
            style: {
              backgroundColor: isMobile ? theme.blue : "transparent",
            },
          }}
          sx={{
            pl: { sm: "10px" },
          }}
        >
          <ChildTabCustom
            sx={{
              backgroundColor: "white",
              py: { sm: "30px" },
              ml: { sm: "28px" },
            }}
            props={{
              fontSize: "16px",
              xsWidth: "50%",
              xsFontSize: "10px",
              mdWidth: "152px",
            }}
            key={LIST_BLOCK.toString()}
            iconPosition="top"
            label={`参加メンバー ${countItemsBlock ?? 0}人`}
            {...a11yProps(LIST_BLOCK)}
          />

          <ChildTabCustom
            sx={{
              backgroundColor: "white",
              py: { sm: "30px" },
              ml: { sm: "28px" },
            }}
            props={{
              fontSize: "16px",
              xsWidth: "50%",
              xsFontSize: "10px",
              mdWidth: "152px",
            }}
            key={LIST_BLOCKED.toString()}
            iconPosition="top"
            label={`ブロックリスト${countItemsBlocked ?? 0}人`}
            {...a11yProps(LIST_BLOCKED)}
          />
        </Tabs>

        <TabPanel value={valueChildTab} index={0}>
          <Box
            sx={{
              borderBottom: `1px solid ${theme.lightGray}`,
            }}
          >
            {communityMembers.slice((pageBlock - 1) * LIMIT, pageBlock * LIMIT).map((tab, index) => (
              <React.Fragment key={index.toString()}>
                <Box>
                  <GridViewMemberComponent
                    data={tab}
                    index={index + (pageBlock - 1) * LIMIT}
                    type="participated"
                    callbackHandleRemoveElmMember={callbackHandleRemoveMemberBlock}
                    isAdmin={isAdmin}
                  />
                </Box>
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
            {countItemsBlock > LIMIT && (
              <PaginationCustomComponent
                handleCallbackChangePagination={handleCallbackChangePaginationBlock}
                page={pageBlock}
                perPage={perPageBlock}
                totalPage={Math.ceil(countItemsBlock / LIMIT)}
              />
            )}
          </Box>
        </TabPanel>

        <TabPanel value={valueChildTab} index={1}>
          <Box
            sx={{
              borderBottom: `1px solid ${theme.lightGray}`,
            }}
          >
            {communityMembersBlocked.slice((pageBlocked - 1) * LIMIT, pageBlocked * LIMIT).map((tab, index) => (
              <React.Fragment key={index.toString()}>
                <Box>
                  <GridViewMemberComponent
                    data={tab}
                    callbackHandleRemoveElmMember={callbackHandleRemoveMemberBlocked}
                    type="block"
                    index={index + (pageBlocked - 1) * LIMIT}
                    isAdmin={isAdmin}
                  />
                </Box>
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
            {countItemsBlocked > LIMIT && (
              <PaginationCustomComponent
                handleCallbackChangePagination={handleCallbackChangePaginationBlocked}
                page={pageBlocked}
                perPage={perPageBlocked}
                totalPage={
                  Math.floor(countItemsBlocked / LIMIT) < countItemsBlocked / LIMIT
                    ? Math.floor(countItemsBlocked / LIMIT) + 1
                    : Math.floor(countItemsBlocked / LIMIT)
                }
              />
            )}
          </Box>
        </TabPanel>
      </Box>
    </React.Fragment>
  );
};
export default MemberComponent;
