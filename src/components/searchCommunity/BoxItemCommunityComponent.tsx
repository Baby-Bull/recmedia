import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import ButtonComponent from "src/components/common/elements/ButtonComponent";
import { HOMEPAGE_RECOMMEND_COMMUNITY_STATUS } from "src/components/constants/constants";
import styles from "src/components/searchCommunity/search_community.module.scss";
import { replaceLabelByTranslate } from "src/utils/utils";
import { joinCommunity } from "src/services/community";
import { IStoreState } from "src/constants/interface";
import { typeRoleUser } from "src/constants/searchCommunityConstants";
import { searchCommunityActions } from "src/store/actionTypes";

interface IIBoxItemCommunityDataItem {
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

interface IBoxItemCommunityComponentProps {
  data: IIBoxItemCommunityDataItem;
}

const BoxItemCommunityComponent: React.SFC<IBoxItemCommunityComponentProps> = ({ data }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchCommunityState = useSelector((state: IStoreState) => state.search_community);
  const [statusJoin, setStatusJoin] = useState(
    // eslint-disable-next-line no-nested-ternary
    data?.is_public ? 1 : !data?.is_public && data?.join_status === typeRoleUser.PENDING ? 2 : 3,
  );
  const IS_MEMBER = data?.join_status === typeRoleUser.MEMBER;

  const arrayItemsInCommunityStore = searchCommunityState?.result?.items;
  const currentItem = searchCommunityState?.result?.items?.find((item: any) => item?.id === data?.id);

  const updateCommunityStateAfterHandleRequestFn = (typeOfAction: string) => {
    if (currentItem) {
      switch (typeOfAction) {
        case "JOIN_PUBLIC_COMMUNITY":
          currentItem.join_status = typeRoleUser.MEMBER;
          break;
        case "JOIN_PRIVATE_COMMUNITY":
          currentItem.join_status = typeRoleUser.PENDING;
          break;
        default:
          break;
      }
      const updatedItems = arrayItemsInCommunityStore?.map((item: any) => (item?.id === data?.id ? currentItem : item));
      const updatedPayload = {
        ...searchCommunityState?.result,
        items: updatedItems,
      };
      dispatch({
        type: searchCommunityActions.UPDATE_RESULT,
        payload: updatedPayload,
      });
    }
  };

  const joinCommunitySearch = async () => {
    if (statusJoin === 2) return;
    if (IS_MEMBER) {
      router.push(`chat/community?room=${data?.id}`);
      return;
    }
    const res = await joinCommunity(data?.id, data?.is_public);
    if (res) {
      updateCommunityStateAfterHandleRequestFn(data?.is_public ? "JOIN_PUBLIC_COMMUNITY" : "JOIN_PRIVATE_COMMUNITY");
      if (statusJoin === 1) {
        setTimeout(() => router.push(`community/${data?.id}`), 100);
      }
      if (statusJoin === 3) {
        setStatusJoin(2);
      }
    }
    return res;
  };

  return (
    <Grid item xs={12} className={styles.boxCommunity} style={{ padding: "18px 20px" }}>
      <Box className={styles.boxItemCommunity}>
        <Grid container>
          <Grid item xs={9}>
            <div className="label-number-of-register">
              {replaceLabelByTranslate(t("home:box-community-recommend.number-of-register"), data?.login_count ?? 0)}
            </div>
          </Grid>
        </Grid>
        <Box onClick={() => router.push(`community/${data?.id}`)} sx={{ cursor: "pointer" }}>
          <div className="image-community">
            <img className="image" src={data?.profile_image ?? "/assets/images/logo/logo.png"} alt={data?.name} />
          </div>
          <p className="name">{data?.name}</p>
          <Typography className="number-of-participant">
            {replaceLabelByTranslate(t("home:box-community-recommend.number-of-members"), data?.member_count ?? 0)}
          </Typography>
          <div className="tags">
            <ul>
              {data?.tags?.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>

          <p className="description">{data?.description}</p>
        </Box>
        <div className="button">
          <ButtonComponent
            mode={HOMEPAGE_RECOMMEND_COMMUNITY_STATUS[IS_MEMBER ? 4 : statusJoin]?.mode}
            fullWidth
            onClick={joinCommunitySearch}
          >
            {HOMEPAGE_RECOMMEND_COMMUNITY_STATUS[IS_MEMBER ? 4 : statusJoin]?.label}
          </ButtonComponent>
        </div>
      </Box>
    </Grid>
  );
};

export default BoxItemCommunityComponent;
