import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Avatar, Box } from "@mui/material";

import GridViewComponent from "src/components/community/blocks/GridViewComponent";
import { CommunityMembers } from "src/services/community";
import PaginationCustomComponent from "src/components/common/PaginationCustomComponent";

const MemberComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const LIMIT = 10;
  const [communityMembers, setCommunityMembers] = useState([]);
  const [countCommunity, setCountCommunity] = useState(0);
  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(2);
  const [cursor, setCursor] = useState("");
  // end pagination

  const fetchData = async (valueCursor: string = "") => {
    const communityId = router.query;
    const data = await CommunityMembers(communityId?.indexId, LIMIT, valueCursor);
    // eslint-disable-next-line no-unsafe-optional-chaining
    setCommunityMembers([...communityMembers, ...data?.items]);
    setCursor(data?.cursor);
    setCountCommunity(data?.items_count ?? 0);
    return data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCallbackChangePaginationMember = (event, value) => {
    setPage(value);
    if (perPage <= value) {
      setPerPage(perPage + 1);
      fetchData(cursor ?? "");
    }
  };

  const handleRedirectCommunityDetail = () => {
    const community = router.query;
    router.push(`/community/${community?.indexId}`);
  };

  return (
    <Box sx={{ pt: "100px" }}>
      <GridViewComponent
        data={communityMembers?.slice((page - 1) * LIMIT, page * LIMIT)}
        title={t("community:community-members")}
      />
      <Box
        sx={{
          pb: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {countCommunity > LIMIT && (
          <PaginationCustomComponent
            handleCallbackChangePagination={handleCallbackChangePaginationMember}
            page={page}
            perPage={perPage}
            totalPage={Math.ceil(countCommunity / LIMIT)}
          />
        )}
      </Box>
      <Box
        sx={{
          fontWeight: 700,
          lineHeight: "14px",
          fontSize: "14px",
          mb: "80px",
          color: "#03BCDB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={handleRedirectCommunityDetail}
      >
        <Avatar src="/assets/images/icon/left.svg" sx={{ width: "8px", height: "16px", mr: "14px" }} />
        {t("community:setting.member.back-community")}
      </Box>
    </Box>
  );
};
export default MemberComponent;
