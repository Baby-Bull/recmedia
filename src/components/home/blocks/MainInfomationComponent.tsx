/* eslint-disable */
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { Box, Grid, Typography, Button, Avatar } from "@mui/material";
import styles from "src/components/home/home.module.scss";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { IStoreState } from "src/constants/interface";
import { useSelector, useDispatch } from "react-redux";
import { REACT_QUERY_KEYS } from "src/constants/constants";
import actionTypes from "src/store/actionTypes";
import { getUserStatics } from "src/services/user";
import Link from "next/link";

export default function MainInfomationComponent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state: IStoreState) => state.user);
  const isProfileEdited = useSelector((state: any) => state.is_profile_edited);
  const [generalCommunityId, setGeneralCommunityId] = React.useState("")
  useQuery(
    [`${REACT_QUERY_KEYS.HOMEPAGE_GET_USER_STATS}`],
    async () => {
      const stats = await getUserStatics();
      setGeneralCommunityId(stats?.default_community_id);
      dispatch({
        type: actionTypes.UPDATE_PROFILE,
        payload: stats,
      });
      dispatch({
        type: actionTypes.UPDATE_UNREAD_LISTROOMS_COUNT,
        payload: { count: stats.chat_room_with_unread_messages },
      });
      dispatch({
        type: actionTypes.UPDATE_NOTIFICATION_UNREAD_COUNT,
        payload: { count: stats.notification_unread_count },
      });
    },
    { refetchOnWindowFocus: false, keepPreviousData: true },
  );

  const hasFinishedMission1 = useMemo(() => {
    return isProfileEdited;
  }, [isProfileEdited]);

  const hasFinishedMission2 = useMemo(() => {
    return auth.community_count > 0 && auth.match_request_confirmed_count + auth.match_application_confirmed_count > 0;
  }, [auth]);

  const hasFinishedMission3 = useMemo(() => {
    return auth.community_chat_message_count > 0;
  }, [auth]);

  const hasFinishedMission4 = useMemo(() => {
    return auth.community_post_count > 0;
  }, [auth]);

  const dataInfoMatching = [
    {
      title: t("home:matching.community"),
      icon: "/assets/images/home_page/ic_star_circle.svg",
      number: auth?.community_count ?? 0,
      link: "/matching?type=community",
    },
    {
      title: t("home:matching.people"),
      icon: "/assets/images/home_page/ic_heart_blue.svg",
      number: auth?.favorite_count ?? 0,
      link: "/matching?type=favorite",
    },
    {
      title: t("home:matching.request"),
      icon: "/assets/images/home_page/ic_user.svg",
      number: auth?.match_application_pending_count ?? 0,
      link: "/matching?type=received",
    },
    {
      title: t("home:matching.application"),
      icon: "/assets/images/home_page/ic_hand.svg",
      number: auth?.match_request_pending_count ?? 0,
      link: "/matching?type=sent",
    },
  ];
  return (
    <Box className={styles.mainInfomations} sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid className={styles.imgInfomation} item xs={3}>
          <Box className={styles.infoTitle}>{auth.username}</Box>
          <Avatar
            sx={{
              borderRadius: "50%",
              width: "106px",
              height: "106px",
              margin: "auto",
            }}
          >
            <Image
              loader={() => auth?.profile_image}
              src={auth?.profile_image || "/assets/images/avatar_user.png"}
              alt="Image"
              width={106}
              height={106}
              loading="lazy"
              className="rounded-full"
            />
          </Avatar>
          <Box className={styles.contentProfile}>
            <Typography className={styles.titleProfile}>マイプロフィールを充実させてみよう！</Typography>
            <Link href="/my-profile">
              <Button className={styles.btnProfile}>マイプロフィール編集</Button>
            </Link>
          </Box>
        </Grid>
        <Grid className={styles.matchingInfomation} item xs={3}>
          <Box className={styles.infoTitle}>goodhubメニュー</Box>
          <Grid container>
            <Grid item xs={9}>
              <ul className={styles.matchingListTitle}>
                {dataInfoMatching?.map((item, index) => (
                  <Link href={item.link} shallow key={index}>
                    <li>
                      <img src={item.icon} alt="icon" />
                      <span>{item.title}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            </Grid>
            <Grid item xs={3}>
              <ul className={styles.matchingListNumber}>
                {dataInfoMatching?.map((item, index) => (
                  <li key={index}>{item.number}</li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={styles.missionInfomation} item xs={6}>
          <Box className={styles.infoTitle}>ミッションクリアしてみよう！</Box>
          <ul className={styles.missionList}>
            <Link href={"/my-profile/edit"} shallow >
              <li >
                <span className={hasFinishedMission1 ? styles.doneMissionText : undefined}>
                  Mission 1 プロフィールを充実させて、色んな人に知ってもらおう
                </span>
                {hasFinishedMission1 && <div className={styles.doneMission}>OK</div>}
              </li>
            </Link>
            <Link href={"/search_community"} shallow >
              <li >
                <span className={hasFinishedMission2 ? styles.doneMissionText : undefined}>
                  Mission 2 気になるコミュニティに参加して、友達を増やそう
                </span>
                {hasFinishedMission2 && <div className={styles.doneMission}>OK</div>}
              </li>
            </Link>
            <Link href={"/matching?type=community"} shallow >
              <li >
                <span className={hasFinishedMission3 ? styles.doneMissionText : undefined}>
                  Mission 3 コミュニティチャットで自己紹介をしてみよう
                </span>
                {hasFinishedMission3 && <div className={styles.doneMission}>OK</div>}
              </li>
            </Link>
            <Link href={`/community/${generalCommunityId}/post/create`} shallow >
              <li >
                <span className={hasFinishedMission4 ? styles.doneMissionText : undefined}>
                  Mission 4 コミュニティで話題を投稿して、メンバーと交流してみよう
                </span>
                {hasFinishedMission4 && <div className={styles.doneMission}>OK</div>}
              </li>
            </Link>
          </ul>
        </Grid>
      </Grid>
    </Box>
  );
}
