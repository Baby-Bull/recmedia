/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

import useViewport from "src/helpers/useViewport";
import ProfileSkillComponent from "src/components/profile/ProfileSkillComponent";
import ReviewComponent from "src/components/profile/ReviewComponent";
import ParticipatingCommunityComponent from "src/components/profile/ParticipatingCommunityComponent";
import {
  getUserCommunites,
  getUserReviews,
  getUserRecommended,
  getUserProfile,
} from "src/services/user";
import BoxItemUserComponent from "src/components/profile/BoxItemUserComponent";
import BoxNoDataComponent from "src/components/profile/BoxNoDataComponent";
import TopProfileComponent from "src/components/profile/TopProfileComponent";
import SlickSliderRecommendComponent from "src/components/home/blocks/SlickSliderRecommendComponent";
import theme from "src/theme";
import { IStoreState } from "src/constants/interface";

import ModalMatchingComponent from "../home/blocks/ModalMatchingComponent";
import { sendMatchingRequest } from "../../services/matching";
import PaginationCustomComponent from "../common/PaginationCustomComponent";
import { useRouter } from "next/router";

const ProfileHaveDataComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const viewPort = useViewport();
  const isMobile = viewPort.width <= 992;
  const LIMIT = 20;
  const NumberOfReviewsPerPage = isMobile ? 5 : 10;
  const NumberOfCommunitiesPerPage = isMobile ? 2 : 8;
  const triggerTwitterShareBtn = Boolean(router.query.shareTwitter);
  const review_ref = useRef(null);
  const community_ref = useRef(null);
  const handleClickToScroll = (keyString: string) => {
    switch (keyString) {
      case "review": {
        review_ref.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case "community": {
        community_ref.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      default:
        break;
    }
  }
  const auth = useSelector((state: IStoreState) => state.user);

  const [profileSkill, setProfileSkill] = useState([]);

  const [recommended, setRecommended] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showModalMatching, setModalMatching] = React.useState(false);
  const [userId] = useState(auth?.id);

  // Block render user-reviews ***** paginated
  const [allReviewsRef, setAllReviewsRef] = useState([]);
  const [countReviews, setCountReviews] = useState(0);
  const [cursorReviews, setCursorReviews] = useState("");
  const [page, setPage] = useState(1);
  const [countCurrentPages, setCountCurrentPages] = useState(2);

  const fetchUserReviews = async () => {
    setIsLoading(true);
    const data = await getUserReviews(userId, NumberOfReviewsPerPage, cursorReviews);
    setCursorReviews(data?.cursor);
    setAllReviewsRef([...allReviewsRef, ...data?.items]);
    setCountReviews(data?.items_count ?? 0);
    setIsLoading(false);
    return data;
  };
  const handleCallbackChangePagination = (event, value) => {
    setPage(value);
    if (countCurrentPages <= value && countReviews > allReviewsRef.length) {
      setCountCurrentPages(countCurrentPages + 1);
      fetchUserReviews();
    }
  }; // end block paginate for user reviews

  // Block render user-communities ***** paginated
  const [communities, setCommunities] = useState([]);
  const [communityCursor, setCommunityCursor] = useState("");
  const [countAllCommunities, setCountAllCommunities] = useState(0);
  const fetchCommunities = async () => {
    const data = await getUserCommunites(userId, NumberOfCommunitiesPerPage, "");
    setCountAllCommunities(data?.items_count);
    setCommunities(data.items);
    setCommunityCursor(data.cursor);
    return data;
  };

  const fetchProfileSkill = async () => {
    setIsLoading(true);
    const data = await getUserProfile();
    setProfileSkill(data);
    setIsLoading(false);
    return data;
  };

  const fetchRecommended = async () => {
    setIsLoading(true);
    const data = await getUserRecommended(LIMIT);
    setRecommended(data?.items?.filter((item) => item?.match_status !== "confirmed"));
    setIsLoading(false);
    return data;
  };

  const handleSendMatchingRequest = async (matchingRequest) => {
    const res = await sendMatchingRequest(userId, matchingRequest);
    setModalMatching(false);
    return res;
  };

  useEffect(() => {
    fetchProfileSkill();
    fetchUserReviews();
    fetchCommunities();
    fetchRecommended();
  }, [userId]);

  const dataElements = useMemo(() => {
    return recommended?.map((item) => <BoxItemUserComponent data={item} key={item.id} />);
  }, [recommended]);

  return (
    <>
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box
        sx={{
          p: { xs: "60px 20px 0 20px", lg: "140px 120px 120px 120px" },
        }}
      >
        <TopProfileComponent
          user={profileSkill}
          myProfile
          triggerShareTwitterBtn={triggerTwitterShareBtn}
          handleClickToScroll={handleClickToScroll}
        />
        <ProfileSkillComponent data={profileSkill} />
        <Box
          sx={{
            mt: "40px",
            mb: 3,
            color: "#1A2944",
            fontSize: { xs: "16px", lg: "24px" },
            fontWeight: 700,
            scrollMarginTop: "3em"
          }}
          ref={community_ref}
        >
          {t("profile:title-participating-community")} ({countAllCommunities ?? 0})
          {countAllCommunities > 0 ? (
            <ParticipatingCommunityComponent
              userId={userId}
              initCountAllCommunities={countAllCommunities}
              initCommunities={communities}
              initCursor={communityCursor}
              NumberOfCommunitiesPerPage={NumberOfCommunitiesPerPage}
            />
          ) : (
            <BoxNoDataComponent content="まだ参加中のコミュニティがありません" />
          )}
        </Box>
        <Box
          sx={{
            mt: "40px",
            mb: 3,
            color: "#1A2944",
            fontSize: { xs: "16px", lg: "24px" },
            fontWeight: 700,
            scrollMarginTop: "3em"
          }}
          ref={review_ref}
        >
          {t("profile:title-review")}（{countReviews}）
          {countReviews > NumberOfReviewsPerPage && (
            <PaginationCustomComponent
              handleCallbackChangePagination={handleCallbackChangePagination}
              page={page}
              perPage={countCurrentPages}
              totalPage={Math.ceil(countReviews / NumberOfReviewsPerPage)}
            />
          )}
          {countReviews > 0 ? (
            allReviewsRef
              .slice((page - 1) * NumberOfReviewsPerPage, page * NumberOfReviewsPerPage)
              ?.map((item, key) => (
                <ReviewComponent
                  user={item?.user}
                  hideReviewer={item?.hide_reviewer}
                  rating={item?.rating}
                  comment={item?.comment}
                  createdAt={item?.created_at}
                  key={key}
                />
              ))
          ) : (
            <BoxNoDataComponent content="まだレビューがありません" />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          paddingRight: "20px",
        }}
      >
        <Box
          sx={{
            color: "#1A2944",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "35px",
            mb: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {t("profile:title-recommen-member")}
        </Box>
        <Box
          sx={{
            display: "flex",
            ml: { xs: "20px", lg: "38px" },
            mr: { xs: "0", lg: "11px" },
            mb: { xs: "120px", lg: "160px" },
            justifyContent: { xs: "unset", lg: "center" },
            overflowX: { xs: "scroll", lg: "unset" },
          }}
        >
          <SlickSliderRecommendComponent items={dataElements} />
        </Box>
      </Box>
      <ModalMatchingComponent
        userRequestMatching={profileSkill}
        open={showModalMatching}
        setOpen={setModalMatching}
        handleSendMatchingRequest={handleSendMatchingRequest}
      />
    </>
  );
};
export default ProfileHaveDataComponent;
