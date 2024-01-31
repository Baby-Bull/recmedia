import React, { useState } from "react";
import { Box, Typography, Avatar, Backdrop, CircularProgress } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { IStoreState } from "src/constants/interface";
import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";
import { MemberApprove, MemberReject } from "src/services/community";

dayjs.extend(localizedFormat);
dayjs.locale("ja");

interface IGridViewComponentProps {
  data: any;
  index: any;
  callbackHandleRemoveElmMember: any;
}

const GridViewComponent: React.SFC<IGridViewComponentProps> = ({ data, index, callbackHandleRemoveElmMember }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useSelector((state: IStoreState) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const callbackHandleApprove = async () => {
    setIsLoading(true);
    const communityId = router.query;
    const resDataApprove = await MemberApprove(communityId?.indexId, data.id);
    callbackHandleRemoveElmMember(index);
    setIsLoading(false);
    return resDataApprove;
  };

  const callbackHandleReject = async () => {
    setIsLoading(true);
    const communityId = router.query;
    const resDataReject = await MemberReject(communityId?.indexId, data.id);
    callbackHandleRemoveElmMember(index);
    setIsLoading(false);
    return resDataReject;
  };

  const redirectProfile = () => {
    setIsLoading(true);
    const userId = data?.user?.id;
    setIsLoading(false);

    if (auth?.id === userId) {
      router.push(`/my-profile`);
    } else {
      router.push(`/profile/${userId}`, undefined, { shallow: true });
    }
  };
  return (
    <Box
      sx={{
        py: ["20px", "22px"],
        px: ["20px", "40px"],
        mb: ["20px", 0],
        borderTop: `1px solid ${theme.lightGray}`,
        borderBottom: [`1px solid ${theme.lightGray}`, "none"],
        color: theme.navy,
        backgroundColor: "white",
      }}
    >
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Typography
        sx={{
          display: { sm: "none" },
          fontSize: [12, 14],
          fontWeight: 400,
          color: theme.gray,
          mb: "5px",
        }}
      >
        {data.date_request}
      </Typography>

      {/* Info user (avatar, ...) */}
      <Box sx={{ mb: 1, color: theme.gray, fontSize: "12px", lineHeight: "17.38px", display: ["block", "none"] }}>
        {dayjs(data?.created_at).format("LLL")} {t("community:request")}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: ["32px", "64px"],
              height: ["32px", "64px"],
              cursor: "pointer",
            }}
            src={data?.user?.profile_image}
            onClick={redirectProfile}
          />

          {/* Grid right Info */}
          <Box
            sx={{
              pl: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              component="span"
              sx={{
                display: ["none", "inherit"],
                fontSize: [12, 14],
                fontWeight: 400,
                color: theme.gray,
              }}
            >
              {dayjs(data?.created_at).format("LLL")} {t("community:request")}
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={redirectProfile}
            >
              {data?.user?.username}
            </Typography>
          </Box>
          {/* End Grid right Info */}
        </Box>

        {/* Button PC */}
        <Box
          sx={{
            display: ["none", "flex"],
          }}
        >
          <React.Fragment>
            <ButtonComponent
              props={{
                bgColor: theme.orange,
                dimension: "x-small",
              }}
              sx={{
                mr: "20px",
                height: "36px",
              }}
              onClick={callbackHandleApprove}
            >
              {t("community:button.setting.participation.approve")}
            </ButtonComponent>

            <ButtonComponent
              props={{
                bgColor: theme.gray,
                dimension: "x-small",
              }}
              sx={{
                height: "36px",
              }}
              onClick={callbackHandleReject}
            >
              {t("community:button.setting.participation.reject")}
            </ButtonComponent>
          </React.Fragment>
        </Box>
        {/* End Button PC */}
      </Box>
      {/* End Info user (avatar, ...) */}

      {/* Button SP */}
      <Box
        sx={{
          display: ["flex", "none"],
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <React.Fragment>
          <ButtonComponent
            props={{
              bgColor: theme.orange,
              dimension: "x-small",
            }}
            sx={{
              mt: "27px",
              fontSize: 14,
              height: "40px",
            }}
            onClick={callbackHandleApprove}
          >
            {t("community:button.setting.participation.approve")}
          </ButtonComponent>

          <ButtonComponent
            props={{
              bgColor: theme.gray,
              dimension: "x-small",
            }}
            sx={{
              mt: "27px",
              fontSize: 14,
              height: "40px",
            }}
            onClick={callbackHandleReject}
          >
            {t("community:button.setting.participation.reject")}
          </ButtonComponent>
        </React.Fragment>
      </Box>
      {/* End Button SP */}
    </Box>
  );
};
export default GridViewComponent;
