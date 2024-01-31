/* eslint-disable */
import { Avatar, Box, Grid, Typography, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import theme from "src/theme";
import PaginationCustomComponent from "../common/PaginationCustomComponent";
import { getUserCommunites } from "src/services/user";

interface BoxNodataProps {
  userId: string;
  initCountAllCommunities: number;
  NumberOfCommunitiesPerPage: number;
  initCommunities: any[];
  initCursor: string;
}

const ParticipatingCommunityComponent: React.SFC<BoxNodataProps> = ({
  userId,
  initCountAllCommunities,
  NumberOfCommunitiesPerPage,
  initCommunities,
  initCursor,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Block render user-communities ***** paginated
  const [allCommunitiesRef, setAllCommunitiesRef] = useState(initCommunities);
  const [cursorCommunities, setCursorCommunities] = useState(initCursor);
  const [countAllCommunities, setCountAllCommunities] = useState(initCountAllCommunities);
  const [page, setPage] = useState(1);
  const [countCurrentPages, setCountCurrentPages] = useState(2);
  const fetchUserCommunities = async () => {
    //setIsLoading(true);
    const data = await getUserCommunites(userId, NumberOfCommunitiesPerPage, cursorCommunities);
    setCursorCommunities(data?.cursor);
    setCountAllCommunities(data.items_count);
    setAllCommunitiesRef([...allCommunitiesRef, ...data?.items]);
    //setIsLoading(false);
    return data;
  };

  useEffect(() => {
    if (!initCommunities?.length) fetchUserCommunities();
  }, []);

  const handleCallbackChangePagination = (event, value) => {
    setPage(value);
    if (countCurrentPages <= value && countAllCommunities > allCommunitiesRef.length) {
      setCountCurrentPages(countCurrentPages + 1);
      fetchUserCommunities();
    }
  }; // end block paginate for user communities

  return (
    <Box
      sx={{
        width: "100%",
        background: "#ffffff",
        p: "20px 20px",
      }}
    >
      {countAllCommunities > NumberOfCommunitiesPerPage && (
        <PaginationCustomComponent
          handleCallbackChangePagination={handleCallbackChangePagination}
          page={page}
          perPage={countCurrentPages}
          totalPage={Math.ceil(countAllCommunities / NumberOfCommunitiesPerPage)}
        />
      )}
      <Grid container>
        {allCommunitiesRef
          ?.slice((page - 1) * NumberOfCommunitiesPerPage, page * NumberOfCommunitiesPerPage)
          ?.map((item, key) => (
            <Grid item xs={12} lg={3} key={key}>
              <Box
                onClick={() => router.push(`/community/${item?.id}`)}
                sx={{
                  cursor: "pointer",
                  textAlign: "center",
                  p: "20px 40px",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Avatar
                    sx={{
                      width: "124px",
                      height: "124px",
                      img: {
                        objectFit: item?.profile_image === "/assets/images/logo/logo.png" ? "contain" : "cover",
                        border: item?.profile_image === "/assets/images/logo/logo.png" ? "3px #e8ecf1 solid" : "none",
                        borderRadius: "50%",
                      },
                    }}
                    src={item?.profile_image}
                    alt={item?.name}
                  />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    lineHeight: "20,27px",
                    fontSize: "14px",
                    color: theme.black,
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  sx={{
                    lineHeight: "14,48px",
                    fontSize: "10px",
                    color: theme.blue,
                  }}
                >
                  {t("profile:number-participants")}:{item.member_count} {t("profile:man")}
                </Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
export default ParticipatingCommunityComponent;
