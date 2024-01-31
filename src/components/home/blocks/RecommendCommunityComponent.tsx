import { Avatar, Box, Grid, Link } from "@mui/material";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { memo, useEffect, useState } from "react";
import Image from "next/image";

// import ButtonComponent from "src/components/common/elements/ButtonComponent";
// import { HOMEPAGE_RECOMMEND_COMMUNITY_STATUS } from "src/components/constants/constants";
import styles from "src/components/home/home.module.scss";
import { replaceLabelByTranslate } from "src/utils/utils";
// import { joinCommunity } from "src/services/community";

import SlickSliderRecommendComponent from "./SlickSliderRecommendComponent";

interface IRecommendCommunityDataItem {
  id: string;
  profile_image: string;
  name: string;
  member_count: number;
  login_count: number;
  tags: Array<string>;
  description: string;
  is_public: boolean;
  join_status: string;
  status: number;
}

interface IRecommendCommunityItemProps {
  data: IRecommendCommunityDataItem;
}

interface IRecommendCommunityProps {
  recommendCommunity?: any;
}

const RecommendCommunityItem: React.SFC<IRecommendCommunityItemProps> = ({ data }) => {
  const { t } = useTranslation();
  const router = useRouter();
  // const [statusJoin, setStatusJoin] = useState(
  //   // eslint-disable-next-line no-nested-ternary
  //   data?.is_public ? 1 : !data?.is_public && data?.join_status === "pending" ? 2 : 3,
  // );
  const redirectToComunnity = () => {
    router.push(`community/${data?.id}`);
  };

  // const joinCummunityHome = async () => {
  //   const res = await joinCommunity(data?.id, data?.is_public);
  //   if (res) {
  //     if (statusJoin === 1) {
  //       setTimeout(() => router.push(`community/${data?.id}`), 1000);
  //     }
  //     if (statusJoin === 3) {
  //       setStatusJoin(2);
  //     }
  //   }
  //   return res;
  // };

  return (
    <Grid item xs={12} className={classNames(styles.boxRecommend, "box-recommend-community")} style={{ padding: 0 }}>
      <Box className={styles.boxRecommendCommunity} onClick={redirectToComunnity}>
        <Grid container style={{ padding: 10 }}>
          <Grid className={styles.infoMemberCommunity} item xs={12}>
            <div className="label-number-of-register">
              {replaceLabelByTranslate(t("home:box-community-recommend.number-of-register"), data?.login_count ?? 0)}
            </div>
            <div className="label-number-of-members">
              {replaceLabelByTranslate(t("home:box-community-recommend.number-of-members"), data?.member_count ?? 0)}
            </div>
          </Grid>
        </Grid>
        <div className="image-community">
          <Avatar
            sx={{
              width: "100%",
              height: "160px",
              backgroundColor: "#fff !important",
              borderRadius: "0!important",
            }}
          >
            <Image
              loader={() => data?.profile_image}
              src={data?.profile_image}
              alt={data?.name}
              width={360}
              height={160}
              layout="fill"
            />
          </Avatar>
        </div>
        <div className="tags">
          <ul>
            {data?.tags?.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
        <div className="name">{data?.name}</div>
        <p className="description">{data?.description}</p>
      </Box>
      {/* <Box sx={{ padding: "0 20px 20px" }}>
        <ButtonComponent
          mode={HOMEPAGE_RECOMMEND_COMMUNITY_STATUS[statusJoin]?.mode}
          fullWidth
          onClick={joinCummunityHome}
        >
          {HOMEPAGE_RECOMMEND_COMMUNITY_STATUS[statusJoin]?.label}
        </ButtonComponent>
      </Box> */}
    </Grid>
  );
};

const RecommendCommunityComponent: React.SFC<IRecommendCommunityProps> = memo(({ recommendCommunity }) => {
  const { t } = useTranslation();
  const [recommendCommunityItems, setRecommendCommunityItems] = useState([]);

  useEffect(() => {
    setRecommendCommunityItems(
      recommendCommunity?.map((item, index) => <RecommendCommunityItem data={item} key={index} />),
    );
  }, [recommendCommunity]);
  return (
    <Grid container className={styles.recommendList}>
      <div className="div-title">
        <span className="title">{t("home:recommend-community")}</span>
        <Link className="link-see-more content-pc" href="/search_community" underline="none">
          {t("home:see-more")} <img src="/assets/images/icon/icon_seemore.png" alt="" />
        </Link>
      </div>

      <div className="content">
        <SlickSliderRecommendComponent items={recommendCommunityItems} />
      </div>
      <div style={{ textAlign: "center", width: "100%" }}>
        <Link className="link-see-more content-mobile" href="/search_community" underline="none">
          {t("home:see-more")} <img src="/assets/images/icon/icon_seemore.png" alt="" />
        </Link>
      </div>
    </Grid>
  );
});

export default RecommendCommunityComponent;
