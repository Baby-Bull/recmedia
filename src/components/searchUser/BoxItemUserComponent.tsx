import { Box, Grid, Avatar } from "@mui/material";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import styles from "src/components/searchUser/search_user.module.scss";
import ButtonComponent from "src/components/common/elements/ButtonComponent";
import { HOMEPAGE_RECOMMEND_MEMBER_STATUS, USER_SEARCH_STATUS } from "src/components/constants/constants";
import { JOBS, USER_ONLINE_STATUS } from "src/constants/constants";
import { replaceLabelByTranslate } from "src/utils/utils";
import ModalMatchingComponent from "src/components/home/blocks/ModalMatchingComponent";
import { acceptMatchingRequestReceived, sendMatchingRequest } from "src/services/matching";
import { addUserFavorite, deleteUserFavorite } from "src/services/user";
import actionTypes, { searchUserActions } from "src/store/actionTypes";
import { IStoreState } from "src/constants/interface";
import { typeMatchingStatus } from "src/constants/searchUserConstants";

import UserTag from "../profile/UserTagComponent";

dayjs.extend(relativeTime);
dayjs.locale("ja");

interface IUserItemProps {
  id: string;
  profile_image: string;
  last_login_at: string;
  activity_status?: string;
  username: string;
  job: string;
  job_position: string;
  review_count: number;
  hitokoto: string;
  tags: Array<string>;
  discussion_topic: string;
  status: number;
  chatStatus: number;
  is_favorite: boolean;
  match_status?: string;
  match_request?: any;
}

interface IBoxUserComponentProps {
  data: IUserItemProps;
}

const BoxItemUserComponent: React.SFC<IBoxUserComponentProps> = ({ data }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [showModalMatching, setModalMatching] = React.useState(false);
  const [statusMatching, setStatusMatching] = React.useState(data?.match_status);
  const [liked, setLiked] = useState(data?.is_favorite);
  const dispatch = useDispatch();
  const auth = useSelector((state: IStoreState) => state.user);

  useEffect(() => {
    setStatusMatching(data?.match_status);
    setLiked(data?.is_favorite);
  }, [data?.match_status, data?.is_favorite]);

  const handleShowModalMatching = async (matchStatus) => {
    if (!matchStatus) {
      setModalMatching(true);
    } else if (matchStatus === typeMatchingStatus.CONFIRMED) {
      router.push(`/chat/personal?room=${data?.id}`);
    } else if (matchStatus === typeMatchingStatus.RECEIVED_PENDING) {
      await acceptMatchingRequestReceived(data?.match_request?.id);
      // callbackHandleIsRefresh(!isRefresh);
    } else {
      return 1;
    }
  };

  const handleSendMatchingRequest = async (matchingRequest) => {
    const res = await sendMatchingRequest(data?.id, matchingRequest);
    setLiked(true);
    setModalMatching(false);
    setStatusMatching(typeMatchingStatus.SENT_PENDING);
    // callbackHandleIsRefresh(!isRefresh);
    return res;
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

  const handleFavoriteAnUser = (isFavorite: boolean, tempData: string) => {
    if (isFavorite) deleteUserFavorite(tempData);
    else addUserFavorite(tempData);
  };

  const handleClickFavoriteButton = () => {
    handleFavoriteAnUser(liked, data?.id);
    if (liked) dispatch({ type: actionTypes.REMOVE_FAVORITE, payload: auth });
    else dispatch({ type: actionTypes.ADD_FAVORITE, payload: auth });
    setLiked(!liked);
  };

  const handleClickToProfile = () => {
    if (auth?.id === data?.id) router.push(`/my-profile`);
    else router.push(`/profile/${data?.id}`, undefined, { shallow: true });
  };

  const onUserTagClicked = (tag: string) => {
    dispatch({ type: searchUserActions.APPEND_TAG, payload: [tag] });
  };

  return (
    <React.Fragment>
      <Grid item xs={12} className={classNames(styles.boxItemUser)}>
        <Box className={styles.boxItemSearchUser}>
          <Box>
            <div onClick={handleClickToProfile} className="status-summary">
              <ButtonComponent
                mode={USER_SEARCH_STATUS[data?.status]?.mode}
                size="small"
                style={{ borderRadius: "4px", width: "130px" }}
              >
                {USER_SEARCH_STATUS[data?.status]?.label}
              </ButtonComponent>
              <span className="label-login-status">
                {data?.activity_status === USER_ONLINE_STATUS
                  ? t("home:box-member-recommend.no-login")
                  : replaceLabelByTranslate(
                      t("home:box-member-recommend.last-login"),
                      dayjs(data?.last_login_at).fromNow(),
                    )}
              </span>
            </div>

            <div onClick={handleClickToProfile} className="info-summary">
              <Avatar
                src={data?.profile_image}
                alt={data?.username}
                sx={{ width: "56px", height: "56px", mr: "13px" }}
              />
              <div className="member-info">
                <p className="name">{data?.username}</p>
                {/* <p className="career">{JOBS[data?.job_position]?.label}</p> */}
                <p className="career">{JOBS.find((item) => item?.value === data?.job)?.label ?? "情報なし"}</p>
                <p className="review">
                  {t("home:box-member-recommend.review")}: {data?.review_count}
                </p>
              </div>
            </div>

            <div onClick={handleClickToProfile} className="introduce">
              {data?.hitokoto ? data?.hitokoto : "情報なし"}
            </div>

            <div className="tags" onClick={data?.tags?.length ? null : handleClickToProfile}>
              <UserTag tags={data?.tags} onClick={onUserTagClicked} />
            </div>
            <div onClick={handleClickToProfile}>
              <p className="label-description">
                <img alt="" src="/assets/images/home_page/ic_chat.svg" />
                {t("home:box-member-recommend.label-description")}
              </p>

              <p className="description">
                {data?.discussion_topic ?? "はじめまして。色々な方とお話をしたいと考えています！よろしくお願いします。"}
              </p>
            </div>
          </Box>
          {auth?.id !== data?.id && (
            <React.Fragment>
              <div className="div-review" onClick={handleClickFavoriteButton}>
                <img
                  alt="ic-like"
                  src={liked ? "/assets/images/home_page/ic_heart.svg" : "/assets/images/home_page/ic_heart_empty.svg"}
                />
                <span>{t("user-search:btn-add-favorite")}</span>
              </div>

              <ButtonComponent
                fullWidth
                onClick={() => handleShowModalMatching(statusMatching)}
                mode={HOMEPAGE_RECOMMEND_MEMBER_STATUS[handleMapMatchingStatus(statusMatching)]?.mode}
                disabled={statusMatching === typeMatchingStatus.SENT_PENDING}
                sx={{
                  "&:disabled": {
                    background: "gray",
                    color: "white",
                  },
                }}
              >
                {HOMEPAGE_RECOMMEND_MEMBER_STATUS[handleMapMatchingStatus(statusMatching)]?.label}
              </ButtonComponent>
            </React.Fragment>
          )}
        </Box>
      </Grid>

      <ModalMatchingComponent
        userRequestMatching={data}
        open={showModalMatching}
        setOpen={setModalMatching}
        handleSendMatchingRequest={handleSendMatchingRequest}
      />
    </React.Fragment>
  );
};

export default BoxItemUserComponent;
