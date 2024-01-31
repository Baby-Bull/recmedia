import { Avatar, Box, Grid } from "@mui/material";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { memo, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";

import ButtonComponent from "src/components/common/elements/ButtonComponent";
import {
  // HOMEPAGE_MEMBER_RECOMMEND_CHAT_STATUS,
  HOMEPAGE_RECOMMEND_MEMBER_STATUS,
} from "src/components/constants/constants";
import { JOBS } from "src/constants/constants";
import styles from "src/components/home/home.module.scss";
import { addUserFavorite, deleteUserFavorite } from "src/services/user";
import actionTypes, { searchUserActions } from "src/store/actionTypes";
import UserTag from "src/components/profile/UserTagComponent";
import { typeMatchingStatus } from "src/constants/searchUserConstants";

import SlickSliderRecommendComponent from "./SlickSliderRecommendComponent";

dayjs.extend(relativeTime);
dayjs.locale("ja");

interface IRecommendDataItem {
  id: string;
  profile_image: string;
  last_login_at: string;
  username: string;
  job: string;
  review_count: number;
  hitokoto: string;
  tags: Array<string>;
  discussion_topic: string;
  status: string;
  chatStatus: number;
  is_favorite: boolean;
  is_favorite_count: number;
  match_status: string;
  activity_status?: string;
}

interface IRecommendItemProps {
  data: IRecommendDataItem;
  indexKey?: number;
  handleOpenMatchingModal: Function;
  handleAcceptMatchingRequestReceived: Function;
}

interface IRecommendMembersComponentProps {
  indexFetch?: number;
  title: string;
  dataRecommends: Array<IRecommendDataItem>;
  handleOpenMatchingModal: Function;
  handleAcceptMatchingRequestReceived: Function;
  queryUrl: string;
}

// const handleFavoriteAnUser = (isFavorite: boolean, tempData: string) => {
//   if (isFavorite) deleteUserFavorite(tempData);
//   else addUserFavorite(tempData);
// };

// const handleMapChatStatus = (statusChatTemp: string) => {
//   switch (statusChatTemp) {
//     case "looking-for-friend":
//       return 1;
//     case "can-talk":
//       return 2;
//     case "need-consult":
//       return 3;
//     default:
//       return 2;
//   }
// };
const handleMapMatchingStatus = (statusMatchingTemp: string) => {
  switch (statusMatchingTemp) {
    case typeMatchingStatus.SENT_PENDING:
      return 1;
    case typeMatchingStatus.CONFIRMED:
      return 2;
    // case "rejected":
    //   return 3;
    case typeMatchingStatus.RECEIVED_PENDING:
      return 3;
    default:
      return 4;
  }
};

const RecommendItem: React.SFC<IRecommendItemProps> = ({
  data,
  handleOpenMatchingModal,
  handleAcceptMatchingRequestReceived,
  indexKey,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(data.is_favorite);
  const [likeCount, setLikeCount] = useState(data?.is_favorite_count ?? 0);
  // const dispatch = useDispatch();
  // const auth = useSelector((state: IStoreState) => state.user);

  useEffect(() => {
    setLiked(data.is_favorite);
  }, [data.is_favorite]);

  useEffect(() => {
    setLikeCount(data.is_favorite_count);
  }, [data.is_favorite_count]);

  const handleClickButtonModal = (tempValue: any) => {
    if (tempValue === typeMatchingStatus.REJECTED || !tempValue) {
      handleOpenMatchingModal(data, indexKey);
    } else if (tempValue === typeMatchingStatus.RECEIVED_PENDING) {
      handleAcceptMatchingRequestReceived(data, indexKey);
    } else if (tempValue === typeMatchingStatus.CONFIRMED) {
      router.push(`/chat/personal?room=${data.id}`);
    } else if (tempValue === typeMatchingStatus.SENT_PENDING) {
      return null;
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ isFavorite, userId }: any) => {
      if (isFavorite) {
        await deleteUserFavorite(userId);
        setLikeCount((value) => value - 1);
        dispatch({ type: actionTypes.REMOVE_FAVORITE });
      } else {
        await addUserFavorite(userId);
        setLikeCount((value) => value + 1);
        dispatch({ type: actionTypes.ADD_FAVORITE });
      }
      setLiked(!isFavorite);
    },
  });

  const onUserTagClicked = (tag: string) => {
    dispatch({ type: searchUserActions.SEARCH_TAG_ONLY, payload: [tag] });
    router.push("/search_user");
  };

  // const handleClickFavoriteButton = () => {
  //   handleFavoriteAnUser(liked, data?.id);
  //   if (liked) dispatch({ type: actionTypes.REMOVE_FAVORITE, payload: auth });
  //   else dispatch({ type: actionTypes.ADD_FAVORITE, payload: auth });
  //   setLiked(!liked);
  // };

  // const handleClickToProfile = () => {
  //   router.push(`/profile/${data.id}`, undefined, { shallow: true });
  // };

  return (
    <Grid item xs={12} className={classNames(styles.boxRecommend)}>
      <Box className={styles.boxRecommendMember}>
        <Box sx={{ cursor: "pointer" }}>
          {/* <div className="status-summary">
              <ButtonComponent
                mode={HOMEPAGE_MEMBER_RECOMMEND_CHAT_STATUS[handleMapChatStatus(data?.status)]?.mode}
                size="small"
                style={{ borderRadius: "4px", width: "130px" }}
              >
                {HOMEPAGE_MEMBER_RECOMMEND_CHAT_STATUS[handleMapChatStatus(data?.status)]?.label}
              </ButtonComponent>
              <span className="label-login-status">
                {data?.activity_status !== USER_ONLINE_STATUS
                  ? replaceLabelByTranslate(
                      t("home:box-member-recommend.last-login"),
                      dayjs(data?.last_login_at).fromNow(),
                    )
                  : t("home:box-member-recommend.no-login")}
              </span>
            </div> */}

          <div className="info-summary">
            <Link href={`/profile/${data.id}`}>
              <div style={{ width: "100%" }}>
                <Avatar
                  sx={{
                    width: "56px",
                    height: "56px",
                    mr: "13px",
                    borderRadius: "74px",
                    objectFit: "cover",
                    border: " 1px solid rgba(156, 172, 194, 0.3)",
                  }}
                >
                  <Image
                    loader={() =>
                      data?.profile_image ??
                      "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png"
                    }
                    width={56}
                    height={56}
                    src={
                      data?.profile_image ??
                      "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png"
                    }
                    alt={data?.username}
                    objectFit="contain"
                  />
                </Avatar>
                <div className="member-info">
                  <div className="name">{data?.username}</div>
                  <div className="career">{JOBS.find((item) => item?.value === data?.job)?.label ?? "情報なし"}</div>
                  <div className="review">
                    {t("home:box-member-recommend.review")}: {data?.review_count ?? 0}
                  </div>
                </div>
              </div>
            </Link>
            <div
              className="favorite-btn"
              onClick={() =>
                mutation.mutate({
                  isFavorite: liked,
                  userId: data.id,
                })
              }
            >
              <img
                className="ic_like"
                alt="ic-like"
                src={
                  liked ? "/assets/images/home_page/ic_heart_blue.svg" : "/assets/images/home_page/ic_heart_empty.svg"
                }
              />
              {likeCount}
            </div>
          </div>
          {/* </div> */}

          {/* <div className="introduce">{data?.hitokoto ?? "情報なし"}</div> */}

          <Link href={`/profile/${data.id}`}>
            <div>
              <div className="label-description">
                <img alt="" src="/assets/images/home_page/chatIcon.png" />
                {t("home:box-member-recommend.label-talking")}
              </div>

              <div className="description">
                {data?.discussion_topic ?? "はじめまして。色々な方とお話をしたいと考えています！よろしくお願いします。"}
              </div>
            </div>
          </Link>
          {data.tags.length ? (
            <div className="tags">
              <UserTag tags={data.tags} onClick={onUserTagClicked} />
            </div>
          ) : (
            <Link href={`/profile/${data.id}`}>
              <div className="tags">
                <UserTag tags={data.tags} onClick={onUserTagClicked} />
              </div>
            </Link>
          )}
        </Box>
        {/* <div className="div-review" onClick={handleClickFavoriteButton}>
          <img
            alt="ic-like"
            src={liked ? "/assets/images/home_page/ic_heart.svg" : "/assets/images/home_page/ic_heart_empty.svg"}
          />
          <span>{t("home:box-member-recommend.like-string")}</span>
        </div>  */}

        <ButtonComponent
          className="button-matching"
          onClick={() => handleClickButtonModal(data?.match_status)}
          mode={HOMEPAGE_RECOMMEND_MEMBER_STATUS[handleMapMatchingStatus(data?.match_status)]?.mode}
          fullWidth
          disabled={data?.match_status === "pending"}
        >
          {HOMEPAGE_RECOMMEND_MEMBER_STATUS[handleMapMatchingStatus(data?.match_status)]?.label}
        </ButtonComponent>
      </Box>
    </Grid>
  );
};

const RecommendMembersComponent: React.SFC<IRecommendMembersComponentProps> = memo(
  ({ title, dataRecommends, indexFetch, handleOpenMatchingModal, handleAcceptMatchingRequestReceived, queryUrl }) => {
    const { t } = useTranslation();
    const [dataElements, setDataElements] = useState([]);

    useEffect(() => {
      setDataElements(
        dataRecommends?.map((item, index) => (
          <RecommendItem
            data={item}
            key={index}
            handleOpenMatchingModal={handleOpenMatchingModal}
            handleAcceptMatchingRequestReceived={handleAcceptMatchingRequestReceived}
            indexKey={indexFetch}
          />
        )),
      );
    }, [dataRecommends]);
    return (
      <Grid container className={styles.recommendList} sx={{ display: dataRecommends.length > 0 ? "block" : "none" }}>
        <div className="div-title">
          <span className="title">{title}</span>
          <Link href={`/search_user?sortType=${queryUrl}`}>
            <a className="link-see-more content-pc">
              {t("home:see-more")} <img src="/assets/images/icon/icon_seemore.png" alt="" />
            </a>
          </Link>
        </div>
        <div className="content">
          <SlickSliderRecommendComponent items={dataElements} />
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href="/search_user">
            <a className="link-see-more content-mobile">
              {t("home:see-more")} <img src="/assets/images/icon/icon_seemore.png" alt="" />
            </a>
          </Link>
        </div>
      </Grid>
    );
  },
);

export default RecommendMembersComponent;
