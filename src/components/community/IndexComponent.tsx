import React, { FC, useEffect, useState } from "react";
import { Box, Typography, Avatar, Link, styled } from "@mui/material";
import { useTranslation } from "next-i18next";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import theme from "src/theme";
import LayoutComponent from "src/components/community/LayoutComponent";
import ButtonComponent from "src/components/common/ButtonComponent";
import IntroCommunityComponent from "src/components/community/blocks/IntroCommunityComponent";
import TabComponent from "src/components/community/blocks/TabComponent";
import BannerComponent from "src/components/community/blocks/BannerComponent";
import EmptyComponent from "src/components/community/blocks/EmptyComponent";
import { COPY_SUCCESSFUL } from "src/messages/notification";
import { CommunityMembers, getCommunity, joinCommunity } from "src/services/community";

import { tabsCommunity, status, bgColorByStatus } from "./mockData";

const TypographyCustom = styled(Typography)({
  fontSize: 20,
  fontWeight: 700,
  "@media (max-width: 425px)": {
    fontSize: 14,
    marginBottom: "15px",
  },
});

interface User {
  id: string;
  username: string;
  profile_image?: string;
}

interface CommunityInfo {
  id: string;
  name: string;
  profile_image?: string;
  ogp_image: string;
  ogp_image_version: number;
  description: string;
  owner: User;
  admins: User[];
  post_permission: "all" | "member" | "admin";
  is_public: boolean;
  community_role: null | "pending" | "member" | "admin" | "owner";
  member_count: number;
  login_count: number;
  created_at: string;
}

const CommunityComponent: FC = () => {
  const { t } = useTranslation();
  const PENDING = "pending";
  const [dataCommunityDetail, setDataCommunityDetail] = useState<CommunityInfo>();
  const [communityMembers, setCommunityMembers] = useState([]);
  const [checkLoading, setCheckLoading] = useState(false);
  const router = useRouter();
  const handleCopyUrl = () => {
    const communityId = router.query;
    const ogpImageVersionQuery = dataCommunityDetail.ogp_image_version
      ? `?v=${dataCommunityDetail.ogp_image_version}`
      : "";
    const resUrl = `${process.env.NEXT_PUBLIC_URL_PROFILE}/community/${communityId?.id}${ogpImageVersionQuery}`;
    copy(resUrl);
    toast.success(COPY_SUCCESSFUL);
  };

  const fetchDataUsers = async (cursor: string = "") => {
    const communityId = router.query;
    const resData = await CommunityMembers(communityId?.id, 4, cursor);
    // eslint-disable-next-line no-unsafe-optional-chaining
    setCommunityMembers(resData?.items);
    return resData;
  };

  useEffect(() => {
    const fetchData = async () => {
      const communityId = router.query;
      const data = await getCommunity(communityId?.id);
      if (!data?.error_code) {
        setDataCommunityDetail(data);
        setCheckLoading(true);
        if ((data?.community_role && data?.community_role !== PENDING) || data?.is_public) {
          fetchDataUsers();
        }
        return data;
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dataCommunityDetail?.ogp_image_version) {
      window.history.replaceState(null, null, `${window.location.pathname}?v=${dataCommunityDetail.ogp_image_version}`);
    }
  }, [dataCommunityDetail]);

  const redirectPageMembers = () => {
    const communityId = router.query;
    router.push(`/community/members/${communityId?.id}`);
  };

  const handleJoinCommunity = async () => {
    const community = router.query;
    const res = await joinCommunity(community?.id);
    if (res.status) {
      setDataCommunityDetail({
        ...dataCommunityDetail,
        community_role: dataCommunityDetail?.is_public ? "member" : "pending",
      });
    }
    return res;
  };

  return (
    <LayoutComponent>
      {checkLoading && (
        <Box
          sx={{
            pt: ["20px", "80px"],
            "@media (min-width: 600px)": {
              mx: "-30px",
            },
          }}
        >
          <Box textAlign={["center", "right"]}>
            <ButtonComponent
              variant="outlined"
              props={{
                square: true,
                color: theme.gray,
                height: "40px",
                borderColor: theme.gray,
                dimension: "medium",
              }}
              onClick={handleCopyUrl}
              startIcon={
                <Avatar
                  variant="square"
                  sx={{ width: "100%", height: "100%" }}
                  src="/assets/images/svg/link_media.svg"
                />
              }
            >
              {t("community:button.copy-url")}
            </ButtonComponent>
          </Box>

          <Box>
            <BannerComponent data={dataCommunityDetail} setDataCommunity={setDataCommunityDetail} />
          </Box>

          <Box
            sx={{
              mt: "40px",
              display: "flex",
              flexDirection: ["column-reverse", "row"],
            }}
          >
            <Box
              sx={{
                width: "240px !important",
                "@media (max-width: 900px)": {
                  mr: "25px !important",
                  width: "100% !important",
                },
              }}
            >
              <IntroCommunityComponent data={dataCommunityDetail} />
            </Box>

            <Box
              sx={{
                display: { sm: "none" },
                mb: "40px",
              }}
            >
              <Box
                sx={{
                  display: communityMembers?.length > 0 ? "flex" : "none",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  {t("community:matching-members")}
                </Typography>
                <Link onClick={redirectPageMembers} color="secondary">
                  <Typography
                    sx={{
                      mr: "10px",
                      color: theme.blue,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {t("community:button.load-more")}
                  </Typography>
                </Link>
              </Box>

              <Box
                sx={{
                  pt: "22px",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {communityMembers?.map((member, index) => (
                  <React.Fragment key={index.toString()}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: "0 0 24%",
                      }}
                    >
                      <Avatar
                        sx={{ width: "72px", height: "72px" }}
                        src={member?.profile_image}
                        alt={member?.username}
                      />

                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 500,
                        }}
                      >
                        {member?.username}
                      </Typography>
                    </Box>
                  </React.Fragment>
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                mr: { md: "13px" },
                ml: { md: "25px" },
                mb: ["40px", 0],
                width: { md: "80%" },
                "@media (max-width: 900px)": {
                  width: "100% !important",
                },
                borderRadius: "12px",
                display:
                  !dataCommunityDetail?.is_public &&
                  (!dataCommunityDetail?.community_role || dataCommunityDetail?.community_role === PENDING)
                    ? "none"
                    : "block",
              }}
            >
              {((dataCommunityDetail?.community_role && dataCommunityDetail?.community_role !== PENDING) ||
                dataCommunityDetail?.is_public) && (
                <TabComponent data={tabsCommunity} dataCommunityDetail={dataCommunityDetail} />
              )}

              <Box display={status === "apply" || status === "applying" ? "inherit" : "none"}>
                <EmptyComponent
                  hiddenButton={status === "join"}
                  textButton={t("community:button.empty.apply")}
                  mtButton={{
                    xs: "25px",
                    md: "35px",
                  }}
                  bgButton={bgColorByStatus}
                  absolute
                >
                  <TypographyCustom>{t("community:community-is-approved")}</TypographyCustom>
                  <TypographyCustom display={["none", "inherit"]}>
                    {t("community:after-join") + t("community:can-approve")}
                  </TypographyCustom>
                  <TypographyCustom display={["inherit", "none"]}>{t("community:after-join")}</TypographyCustom>
                  <TypographyCustom display={["inherit", "none"]}>{t("community:can-approve")}</TypographyCustom>
                </EmptyComponent>
              </Box>
            </Box>
            <Box
              sx={{
                display:
                  !dataCommunityDetail?.is_public &&
                  (!dataCommunityDetail?.community_role || dataCommunityDetail?.community_role === PENDING)
                    ? "flex"
                    : "none",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                background: "#fff !important",
                ml: { xs: 0, lg: "25px" },
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography fontSize={20} lineHeight="39px" fontWeight={700}>
                  {t("community:community-is-approved")}
                </Typography>
                <Typography fontSize={20} lineHeight="39px" fontWeight={700}>
                  {t("community:if-community-is-approved")}
                </Typography>
                <ButtonComponent
                  sx={{
                    width: "280px",
                    height: "48px",
                    marginTop: "35px",
                  }}
                  onClick={dataCommunityDetail?.community_role !== PENDING ? handleJoinCommunity : null}
                  props={{
                    bgColor: dataCommunityDetail?.community_role === PENDING ? theme.gray : theme.orange,
                  }}
                >
                  {dataCommunityDetail?.community_role === PENDING
                    ? t("community:banner.applying")
                    : t("community:banner.apply")}
                </ButtonComponent>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </LayoutComponent>
  );
};
export default CommunityComponent;
