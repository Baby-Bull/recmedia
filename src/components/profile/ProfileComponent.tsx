/* eslint-disable */
import { Backdrop, Box, CircularProgress } from "@mui/material";
import React, { FC, useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { IStoreState } from "src/constants/interface";
import useViewport from "src/helpers/useViewport";
import ProfileSkillComponent from "src/components/profile/ProfileSkillComponent";
import ReviewComponent from "src/components/profile/ReviewComponent";
import ParticipatingCommunityComponent from "src/components/profile/ParticipatingCommunityComponent";
import {
  getUserCommunites,
  getOrtherUserProfile,
  getUserReviews,
  getUserRecommended,
  addUserFavorite,
} from "src/services/user";
import BoxItemUserComponent from "src/components/profile/BoxItemUserComponent";
import BoxNoDataComponent from "src/components/profile/BoxNoDataComponent";
import TopProfileComponent from "src/components/profile/TopProfileComponent";
import { HOMEPAGE_RECOMMEND_MEMBER_STATUS } from "src/components/constants/constants";
import ButtonComponent from "src/components/common/elements/ButtonComponent";
import SlickSliderRecommendComponent from "src/components/home/blocks/SlickSliderRecommendComponent";

import theme from "../../theme";
import ModalMatchingComponent from "../home/blocks/ModalMatchingComponent";
import { acceptMatchingRequestReceived, sendMatchingRequest } from "../../services/matching";
import PaginationCustomComponent from "../common/PaginationCustomComponent";
import { typeMatchingStatus } from "src/constants/searchUserConstants";
import { searchUserActions } from "src/store/actionTypes";
interface Props {
  userId: string;
  isAuth: boolean;
}

const ProfileHaveDataComponent: FC<Props> = ({ userId, isAuth }) => {
  const { t } = useTranslation();
  const viewPort = useViewport();
  const router = useRouter();
  const dispatch = useDispatch();
  const stateUserGlobalStorage = useSelector((state: IStoreState) => state.search_users)
  const auth = useSelector((state: IStoreState) => state.user);
  const isMobile = viewPort.width <= 992;
  const LIMIT = 20;
  const NumberOfReviewsPerPage = isMobile ? 5 : 10;
  const NumberOfCommunitiesPerPage = isMobile ? 2 : 8;
  const review_ref = useRef(null);
  const community_ref = useRef(null);
  const userIdPathname = router.query?.userId || ""

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

  const [isDisableBtn, setIsDisableBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalMatching, setModalMatching] = React.useState(false);
  const [profileSkill, setProfileSkill] = useState<any>([]);
  const [communities, setCommunities] = useState([]);
  const [communityCursor, setCommunityCursor] = useState("");
  const [countAllCommunities, setCountAllCommunities] = useState(0);
  const [recommended, setRecommended] = useState([]);

  // Block render user-reviews ***** paginated
  const [allReviewsRef, setAllReviewsRef] = useState([]);
  const [cursorReviews, setCursorReviews] = useState("");
  const [page, setPage] = useState(1);
  const [countCurrentPages, setCountCurrentPages] = useState(2);
  const [countAllReviews, setCountAllReviews] = useState(0);
  const fetchUserReviews = async () => {
    const data = await getUserReviews(userIdPathname, NumberOfReviewsPerPage, cursorReviews);
    setCursorReviews(data?.cursor);
    setCountAllReviews(data?.items_count ?? 0);
    setAllReviewsRef([...allReviewsRef, ...data?.items]);
    return data;
  };
  const handleCallbackChangePaginationReviews = (event, value) => {
    setPage(value);
    if (countCurrentPages <= value && countAllReviews > allReviewsRef?.length) {
      setCountCurrentPages(countCurrentPages + 1);
      fetchUserReviews();
    }
  }; // end block paginate for user reviews

  const fetchProfileSkill = async () => {
    setIsLoading(true);
    const data = await getOrtherUserProfile(userIdPathname);
    setProfileSkill(data);
    setIsLoading(false);
    return data;
  };

  const fetchCommunities = async () => {
    setIsLoading(true);
    const data = await getUserCommunites(userIdPathname);
    setCommunities(data?.items);
    setCommunityCursor(data.cursor);
    setCountAllCommunities(data.items_count);
    setIsLoading(false);
    return data;
  };

  const fetchRecommended = async () => {
    setIsLoading(true);
    const data = await getUserRecommended(LIMIT);
    setRecommended(data?.items?.filter((item: any) => item?.match_status !== typeMatchingStatus.CONFIRMED));
    setIsLoading(false);
    return data;
  };

  let arrayItemsInUserStore = stateUserGlobalStorage?.result?.items
  let current_item = stateUserGlobalStorage?.result?.items?.find((item: any) => item?.id === userId)
  const updateCommunityStateAfterHandleRequestFn = (typeOfAction: string) => {
    if (current_item) {
      switch (typeOfAction) {
        case "ACCEPT_REQUEST":
          current_item.match_status = typeMatchingStatus.CONFIRMED
          break;
        case "SENT_REQUEST":
          current_item.match_status = typeMatchingStatus.SENT_PENDING
          break;
        default:
          break;
      }
      current_item.match_status = typeMatchingStatus.SENT_PENDING
      const updated_items = arrayItemsInUserStore?.map((item: any) => item?.id === userId ? current_item : item)
      const updated_payload = {
        ...stateUserGlobalStorage?.result,
        items: updated_items
      }
      dispatch({
        type: searchUserActions.UPDATE_RESULT,
        payload: updated_payload,
      });
    }
  }

  const handleSendMatchingRequest = async (matchingRequest: any) => {
    const res = await sendMatchingRequest(userIdPathname, matchingRequest);
    updateCommunityStateAfterHandleRequestFn("SENT_REQUEST");
    setModalMatching(false);
    setIsDisableBtn(true);
    setProfileSkill({
      ...profileSkill,
      is_favorite: true,
    });
    return res;
  };

  const handleClickMatchingButton = async (statusValue: string) => {
    if (statusValue === typeMatchingStatus.RECEIVED_PENDING) {
      await acceptMatchingRequestReceived(profileSkill?.match_request?.id);
      updateCommunityStateAfterHandleRequestFn("ACCEPT_REQUEST")
    } else {
      setModalMatching(true);
    }
  };

  const handleMapMatchingStatus = (statusMatchingTemp: string) => {
    switch (statusMatchingTemp) {
      case typeMatchingStatus.SENT_PENDING:
        return 1;
      case typeMatchingStatus.CONFIRMED:
        return 2;
      case typeMatchingStatus.RECEIVED_PENDING:
        return 3;
      default:
        return 4;
    }
  };

  useLayoutEffect(() => {
    if (router.query?.userId === auth?.id) {
      router.push("/my-profile");
    }
  }, []);

  useEffect(() => {
    fetchProfileSkill();
    fetchUserReviews();
    fetchCommunities();
    if (isAuth) {
      fetchRecommended();
    }
  }, [userIdPathname]);

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
          mt: "70px",
          p: { xs: "0 20px", lg: "140px 120px 120px 120px" },
        }}
      >
        <TopProfileComponent
          user={profileSkill}
          myProfile={false}
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
          {t("profile:title-review")}（{countAllReviews}）
          {countAllReviews > NumberOfReviewsPerPage && (
            <PaginationCustomComponent
              handleCallbackChangePagination={handleCallbackChangePaginationReviews}
              page={page}
              perPage={countCurrentPages}
              totalPage={Math.ceil(countAllReviews / NumberOfReviewsPerPage)}
            />
          )}
          {countAllReviews > 0 ? (
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
            flexWrap: "wrap-reverse",
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
      <Box
        sx={{
          background: "#F5F5F5",
          justifyContent: "center",
          position: "fixed",
          top: "88%",
          opacity: 0.8,
          width: "100%",
          paddingY: "20px",
          display: profileSkill?.match_status === "confirmed" ? "none" : "flex",
        }}
      >
        <ButtonComponent
          sx={{
            width: "280px",
            height: "56px",
            fontSize: "16px",
            fontWeight: 700,
            color: "#ffffff",
            alignItems: "center",
            textAlign: "center",
            lineHeight: "24px",
            borderRadius: "40px",
            display: profileSkill?.match_status === "confirmed" ? "none" : "flex",
            "&.Mui-disabled": {
              background: "#989EA8 !important",
              color: "#fff",
            },
          }}
          onClick={() => handleClickMatchingButton(profileSkill?.match_status)}
          mode={HOMEPAGE_RECOMMEND_MEMBER_STATUS[handleMapMatchingStatus(profileSkill?.match_status)]?.mode}
          disabled={profileSkill?.match_status === "pending" || isDisableBtn}
        >
          {HOMEPAGE_RECOMMEND_MEMBER_STATUS[handleMapMatchingStatus(profileSkill?.match_status)]?.label}
        </ButtonComponent>
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
