import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import theme from "src/theme";
import styles from "src/components/profile/profile.module.scss";
import ButtonComponent from "src/components/common/ButtonComponent";
import PopupReportUser from "src/components/chat/Personal/Blocks/PopupReportUser";
import PopupReviewComponent from "src/components/chat/Personal/Blocks/PopupReviewComponent";
import ModalMatchingComponent from "src/components/home/blocks/ModalMatchingComponent";
import {
  rejectMatchingRequestReceived,
  sendMatchingRequest,
  acceptMatchingRequestReceived,
  cancelMatchingRequestSent,
} from "src/services/matching";
import { TYPE } from "src/constants/matching";
import { IStoreState } from "src/constants/interface";
import actionTypes from "src/store/actionTypes";
import { JOBS, USER_ONLINE_STATUS } from "src/constants/constants";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("ja");

const ThreadTitle = styled(Typography)({
  paddingLeft: "20px",
  fontWeight: 700,
  minWidth: "110px",
});

const ThreadContent = styled(Typography)({
  marginLeft: "20px",
});

interface IThreadComponentProps {
  data: any;
  dataType?: string;
  type?: "unConfirm" | "confirm" | "reject" | "favorite" | "matched" | "community";
  setKeyRefetchData?: Function;
}

const handlePurposeMatchingTab12 = (tempValue: string) => {
  switch (tempValue) {
    case "talk-casually":
      return "カジュアルにお話ししたい";
    case "technical-consultation":
      return "技術的な相談がしたい";
    case "work-with":
      return "一緒に働けるエンジニアを探している";
    default:
      return "その他";
  }
};

const ThreadComponent: React.SFC<IThreadComponentProps> = ({ data, type, setKeyRefetchData, dataType }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: IStoreState) => state.user);

  const isShowThread = type === "unConfirm" || type === "reject";
  const isConfirmOrFavoriteOrMatched = type === "confirm" || type === "favorite" || type === "matched";

  const [showPopupReport, setShowPopupReport] = React.useState(false);
  const handleShowReport = () => setShowPopupReport(true);

  const [showPopupReview, setShowPopupReview] = React.useState(false);
  const handleShowReview = () => setShowPopupReview(true);

  const [showModalMatching, setModalMatching] = React.useState(false);
  const [userRequestMatchingId, setUserRequestMatchingId] = React.useState(null);
  const handleSendMatchingRequest = async (matchingRequest) => {
    const res = await sendMatchingRequest(userRequestMatchingId, matchingRequest);
    if (setKeyRefetchData) {
      setKeyRefetchData({
        type: TYPE.FAVORITE,
      });
    }
    setModalMatching(false);
    return res;
  };

  const handleRejectMatchingRequest = async (userId: string) => {
    const res = await rejectMatchingRequestReceived(userId);
    if (setKeyRefetchData) {
      setKeyRefetchData({
        type: dataType,
      });
    }
    return res;
  };

  const handleCancelMatchingRequest = async (userId: string) => {
    const res = await cancelMatchingRequestSent(userId);
    if (setKeyRefetchData) {
      setKeyRefetchData({
        type: dataType,
      });
    }
    dispatch({ type: actionTypes.REMOVE_MATCH_REQUEST_COUNT, payload: auth });
    return res;
  };

  const handleAcceptMatchingRequest = async (userId: string) => {
    const res = await acceptMatchingRequestReceived(userId);
    if (setKeyRefetchData) {
      setKeyRefetchData({
        type: dataType,
      });
    }
    return res;
  };

  const handleOpenMatchingModal = (userMatchingId: any) => {
    setModalMatching(true);
    setUserRequestMatchingId(userMatchingId);
  };
  const handleFormatTime = (tempValue: string) => {
    if (tempValue === "favorite") return "";
    if (tempValue === "matched")
      return `${dayjs(data?.matchRequest?.match_date).format("lll").toString()}分にマッチング`;
    if (tempValue === "reject") return `${dayjs(data?.updated_at).format("lll").toString()}に否承認`;
    if (tempValue === "confirm") return `${dayjs(data?.updated_at).format("lll").toString()}にマッチング`;
    return dayjs(data?.updated_at).format("lll").toString() + t("thread:request");
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          py: ["20px", "22px"],
          px: ["20px", 0],
          mb: [isConfirmOrFavoriteOrMatched ? "20px" : "40px", 0],
          borderTop: [`1px solid ${theme.lightGray}`, `2px solid ${theme.lightGray}`],
          borderBottom: [`1px solid ${theme.lightGray}`, "none"],
          color: theme.navy,
          backgroundColor: "white",
        }}
      >
        <Typography
          sx={{
            display: { sm: "none", xs: type !== "favorite" ? "inherit" : "none" },
            fontSize: [12, 14],
            fontWeight: 400,
            mb: "15px",
          }}
        >
          {type === "confirm" || type === "reject"
            ? dayjs(data?.updated_at).format("lll").toString()
            : dayjs(data?.desired_match_date).format("lll").toString()}
        </Typography>

        {/* Info user (avatar, ...) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Absolute icon heart tab favorite SP */}
          <Typography
            sx={{
              display: [type !== "favorite" && "none", "none"],
              position: "absolute",
              top: "-8px",
              right: "-8px",
            }}
          >
            <img src="/assets/images/svg/heart.svg" alt="heart" />
          </Typography>
          {/* End Absolute icon heart tab favorite SP */}

          <Box
            sx={{
              display: "flex",
              alignItems: type === "favorite" ? "start" : "center",
              pl: type === "matched" && data?.matchRequest?.match_direction !== "sent" ? "25px" : "7px",
            }}
          >
            <Box
              sx={{
                display: type === "favorite" ? "flex" : "inherit",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Link
                href={type === "favorite" || type === "matched" ? `/profile/${data?.id}` : `/profile/${data?.user?.id}`}
                shallow
              >
                <a
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mr: type === "matched" && data?.matchRequest?.match_direction === "sent" && "18px",
                      width: ["32px", isConfirmOrFavoriteOrMatched ? "54px" : "80px"],
                      height: ["32px", isConfirmOrFavoriteOrMatched ? "54px" : "80px"],
                    }}
                  >
                    <Avatar
                      variant="square"
                      sx={{
                        borderRadius: "50%",
                        width: ["32px", isConfirmOrFavoriteOrMatched ? "54px" : "80px"],
                        height: "100%",
                      }}
                      src={type === "favorite" || type === "matched" ? data?.profile_image : data?.user?.profile_image}
                      alt={type === "favorite" || type === "matched" ? data?.username : data?.user?.username}
                    />

                    <Avatar
                      variant="square"
                      sx={{
                        borderRadius: "50%",
                        display: type !== "matched" && "none",
                        position: "absolute",
                        top: data?.matchRequest?.match_direction === "sent" ? "-15px" : ["30px", "42px"],
                        left: data?.matchRequest?.match_direction === "sent" ? ["-10px", "-20px"] : ["30px", "52px"],
                        width: ["15px", "24px"],
                        height: ["15px", "24px"],
                      }}
                      src={auth?.profile_image}
                      alt={auth?.username}
                    />
                    <Box
                      sx={{
                        display: type !== "matched" && "none",
                        backgroundImage: `url("/assets/images/svg/send.svg")`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        position: "absolute",
                        top: data?.matchRequest?.match_direction === "sent" ? "-5px" : ["24px", "34px"],
                        left: data?.matchRequest?.match_direction === "sent" ? "0" : ["23px", "43px"],
                        width: ["15px", "20px"],
                        height: ["100%"],
                      }}
                    />
                  </Box>
                </a>
              </Link>
              {/* Title bottom Avatar tab favorite */}
              <Typography
                sx={{
                  display: [type === "matched" ? "none" : "inherit", type === "favorite" ? "inherit" : "none"],
                  color: theme.gray,
                  fontSize: [10, 14],
                  fontWeight: 500,
                  mt: "9px",
                }}
              >
                {data?.activity_status === USER_ONLINE_STATUS ? "ログイン中" : dayjs(data?.last_login_at).fromNow()}
              </Typography>
              {/* End Title bottom Avatar tab favorite */}
            </Box>

            {/* Grid right Info */}
            <Box
              sx={{
                pl: type === "favorite" ? "26px" : "20px",
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
                }}
              >
                {handleFormatTime(type)}
              </Typography>

              <Box
                sx={{
                  fontSize: [16, 20],
                  fontWeight: 700,
                  display: "flex",
                  flexDirection: ["column", "row"],
                  alignItems: ["flex-start", "center"],
                }}
              >
                <Link
                  href={
                    type === "favorite" || type === "matched" ? `/profile/${data?.id}` : `/profile/${data?.user?.id}`
                  }
                  shallow
                >
                  <a
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    {(type === "favorite" || type === "matched" ? data?.username : data?.user?.username) ?? "情報なし"}
                  </a>
                </Link>
                <Typography
                  sx={{
                    pl: { sm: "7px" },
                    fontSize: 12,
                    fontWeight: 500,
                    color: theme.gray,
                  }}
                >
                  {(type === "favorite" || type === "matched"
                    ? JOBS.find((item) => item?.value === data?.job)?.label
                    : JOBS.find((item) => item?.value === data?.user?.job)?.label) ?? "情報なし"}
                </Typography>

                <Typography
                  sx={{
                    pl: "15px",
                    display: ["none", type === "favorite" && "inherit"],
                  }}
                >
                  <img src="/assets/images/svg/heart.svg" alt="heart" />
                </Typography>
              </Box>

              <Typography
                component="span"
                className={styles.discussionTopic}
                sx={{
                  display: ["none!important", type === "favorite" ? "inherit!important" : "none!important"],
                }}
              >
                {data?.discussion_topic ?? "情報なし"}
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
            {type === "unConfirm" && (
              <React.Fragment>
                <ButtonComponent
                  props={{
                    color: theme.gray,
                    bgColor: theme.whiteGray,
                    dimension: "x-small",
                  }}
                  sx={{
                    display: !data?.receiver_id && "none",
                    borderRadius: "12px",
                  }}
                  onClick={() => handleCancelMatchingRequest(data?.id)}
                >
                  {t("thread:button.canceled")}
                </ButtonComponent>

                <ButtonComponent
                  props={{
                    bgColor: theme.orange,
                    dimension: "x-small",
                  }}
                  onClick={() => handleAcceptMatchingRequest(data?.id)}
                  sx={{
                    display: data?.receiver_id && "none",
                    mr: "20px",
                  }}
                >
                  {t("thread:button.approve")}
                </ButtonComponent>

                <ButtonComponent
                  props={{
                    bgColor: theme.gray,
                    dimension: "x-small",
                  }}
                  sx={{
                    display: data?.receiver_id && "none",
                  }}
                  onClick={() => handleRejectMatchingRequest(data?.id)}
                >
                  {t("thread:button.reject")}
                </ButtonComponent>
              </React.Fragment>
            )}

            {type === "confirm" && (
              <React.Fragment>
                <ButtonComponent
                  disabled={data?.is_reviewed}
                  props={{
                    color: data?.is_reviewed && theme.gray,
                    bgColor: !data?.is_reviewed && theme.orange,
                    dimension: "small",
                  }}
                  sx={{
                    mr: "20px",
                  }}
                  onClick={handleShowReview}
                >
                  {data?.is_reviewed ? t("thread:button.reviewed") : t("thread:button.review")}
                </ButtonComponent>

                <ButtonComponent
                  props={{
                    bgColor: theme.blue,
                    dimension: "small",
                  }}
                  onClick={() => router.push(`/chat/personal?room=${data?.user?.id}`)}
                >
                  {t("thread:button.open-message")}
                </ButtonComponent>
              </React.Fragment>
            )}

            {type === "reject" && (
              <ButtonComponent
                props={{
                  bgColor: theme.blue,
                }}
                sx={{
                  width: "80px",
                  mr: "20px",
                  borderRadius: "12px",
                }}
                onClick={handleShowReport}
              >
                {t("thread:button.report")}
              </ButtonComponent>
            )}

            {type === "favorite" && data?.match_status !== "confirmed" && (
              <ButtonComponent
                disabled={data?.match_status}
                props={{
                  color: data?.match_status && theme.gray,
                  bgColor: !data?.match_status && theme.green,
                  dimension: "small",
                }}
                sx={{
                  ml: "15px",
                }}
                onClick={() => handleOpenMatchingModal(data?.id)}
              >
                {data?.match_status ? t("thread:button.applied") : t("thread:button.apply-matching")}
              </ButtonComponent>
            )}

            {type === "matched" && (
              <React.Fragment>
                <ButtonComponent
                  disabled={data?.is_reviewed}
                  props={{
                    color: data?.is_reviewed && theme.gray,
                    bgColor: !data?.is_reviewed && theme.orange,
                    dimension: "small",
                  }}
                  sx={{
                    mr: "20px",
                  }}
                  onClick={handleShowReview}
                >
                  {data?.is_reviewed ? t("thread:button.reviewed") : t("thread:button.review")}
                </ButtonComponent>

                <ButtonComponent
                  props={{
                    bgColor: theme.blue,
                    dimension: "small",
                  }}
                  onClick={() => router.push(`/chat/personal?room=${data?.id}`)}
                >
                  {t("thread:button.open-message")}
                </ButtonComponent>
              </React.Fragment>
            )}
          </Box>
          {/* End Button PC */}
        </Box>
        {/* End Info user (avatar, ...) */}

        <Box
          sx={{
            pr: "20px",
            display: [type !== "favorite" && "none", "none"],
          }}
        >
          {data?.message}
        </Box>

        {/* Thread */}
        <Box
          sx={{
            display: isShowThread ? "block" : "none",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex">
            <Typography
              sx={{
                minWidth: ["32px", "80px"],
                display: ["none", "flex"],
                justifyContent: "center",
                color: theme.gray,
                fontSize: [10, 14],
                fontWeight: 500,
                mt: "9px",
              }}
            >
              {data?.user?.activity_status === USER_ONLINE_STATUS
                ? "ログイン中"
                : dayjs(data?.user?.last_login_at).fromNow()}
            </Typography>

            <Box
              sx={{
                mt: ["17px", 0],
                mb: ["40px", 0],
                ml: [0, "18px"],
                pt: "20px",
                pb: "5px",
                width: "100%",
                backgroundColor: theme.whiteBlue,
                borderRadius: "12px",
              }}
            >
              <Box
                sx={{
                  mb: "10px",
                  display: "flex",
                  flexDirection: ["column", "row"],
                }}
              >
                <ThreadTitle>{t("thread:purpose")}</ThreadTitle>
                <ThreadContent>{handlePurposeMatchingTab12(data?.purpose)}</ThreadContent>
              </Box>
              {/* <Box
                sx={{
                  mb: "15px",
                  display: "flex",
                  flexDirection: ["column", "row"],
                }}
              >
                <ThreadTitle>{t("thread:date-interview")}</ThreadTitle> 
                <ThreadContent>{data?.meeting_link?.length > 0 ? data?.meeting_link : t("no_info")}</ThreadContent>
              </Box> */}
              <Box
                sx={{
                  mb: "10px",
                  display: "flex",
                  flexDirection: ["column", "row"],
                }}
              >
                <ThreadTitle>{t("thread:message")}</ThreadTitle>
                <ThreadContent>{data?.message?.length > 0 ? data?.message : t("no_info")}</ThreadContent>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* End Thread */}

        {/* Button SP */}
        <Box
          sx={{
            display: ["flex", "none"],
            flexDirection: type === "unConfirm" ? "column" : "row",
            justifyContent: type === "confirm" || type === "matched" ? "space-between" : "center",
            alignItems: "center",
          }}
        >
          {type === "unConfirm" && (
            <React.Fragment>
              <ButtonComponent
                props={{
                  color: theme.gray,
                  bgColor: theme.whiteGray,
                  dimension: "x-small",
                }}
                sx={{
                  mb: "20px",
                  display: !data?.receiver_id && "none",
                  borderRadius: "12px",
                }}
                onClick={() => handleCancelMatchingRequest(data?.id)}
              >
                {t("thread:button.canceled")}
              </ButtonComponent>

              <ButtonComponent
                props={{
                  bgColor: theme.orange,
                  dimension: "medium",
                }}
                sx={{
                  display: data?.receiver_id && "none",
                }}
                onClick={() => handleAcceptMatchingRequest(data?.id)}
              >
                {t("thread:button.approve")}
              </ButtonComponent>

              <ButtonComponent
                props={{
                  bgColor: theme.gray,
                  dimension: "x-small",
                }}
                sx={{
                  display: data?.receiver_id && "none",
                  mt: "42px",
                  mb: "20px",
                }}
                onClick={() => handleRejectMatchingRequest(data?.id)}
              >
                {t("thread:button.reject")}
              </ButtonComponent>
            </React.Fragment>
          )}

          {type === "confirm" && (
            <React.Fragment>
              <ButtonComponent
                disabled={data?.is_reviewed}
                props={{
                  color: data?.is_reviewed && theme.gray,
                  bgColor: !data?.is_reviewed && theme.orange,
                  dimension: "x-small",
                }}
                sx={{
                  mt: "27px",
                  mb: "5px",
                  fontSize: 14,
                }}
                onClick={handleShowReview}
              >
                {data?.is_reviewed ? t("thread:button.reviewed") : t("thread:button.review")}
              </ButtonComponent>

              <ButtonComponent
                props={{
                  bgColor: theme.blue,
                  dimension: "x-small",
                }}
                sx={{
                  mt: "27px",
                  mb: "5px",
                  fontSize: 14,
                }}
                onClick={() => router.push(`/chat/personal?room=${data?.user?.id}`)}
              >
                {t("thread:button.open-message-SP")}
              </ButtonComponent>
            </React.Fragment>
          )}

          {type === "reject" && (
            <ButtonComponent
              props={{
                bgColor: theme.blue,
              }}
              sx={{
                width: "80px",
                borderRadius: "12px",
                mb: "20px",
              }}
              onClick={handleShowReport}
            >
              {t("thread:button.report")}
            </ButtonComponent>
          )}

          {type === "favorite" && data?.match_status !== "confirmed" && (
            <ButtonComponent
              disabled={data?.match_status}
              props={{
                dimension: "small",
                color: data?.match_status && theme.gray,
                bgColor: !data?.match_status && theme.green,
              }}
              sx={{
                mt: "20px",
                height: 40,
              }}
              onClick={() => handleOpenMatchingModal(data?.id)}
            >
              {data?.match_status ? t("thread:button.applied") : t("thread:button.apply-matching")}
            </ButtonComponent>
          )}

          {type === "matched" && (
            <React.Fragment>
              <ButtonComponent
                disabled={data?.is_reviewed}
                props={{
                  color: data?.is_reviewed && theme.gray,
                  bgColor: !data?.is_reviewed && theme.orange,
                  dimension: "x-small",
                }}
                sx={{
                  mt: "27px",
                  mb: "5px",
                  fontSize: 14,
                }}
                onClick={handleShowReview}
              >
                {data?.is_reviewed ? t("thread:button.reviewed") : t("thread:button.review")}
              </ButtonComponent>

              <ButtonComponent
                props={{
                  bgColor: theme.blue,
                  dimension: "x-small",
                }}
                sx={{
                  mt: "27px",
                  mb: "5px",
                  fontSize: 14,
                }}
                onClick={() => router.push(`/chat/personal?room=${data?.id}`)}
              >
                {t("thread:button.open-message-SP")}
              </ButtonComponent>
            </React.Fragment>
          )}
        </Box>
        {/* End Button SP */}
      </Box>

      <PopupReportUser showPopup={showPopupReport} setShowPopup={setShowPopupReport} user={data?.user} />
      <PopupReviewComponent
        showPopup={showPopupReview}
        setShowPopup={setShowPopupReview}
        user={type === "matched" ? data : data?.user}
      />
      <ModalMatchingComponent
        open={showModalMatching}
        setOpen={setModalMatching}
        userRequestMatching={data}
        handleSendMatchingRequest={handleSendMatchingRequest}
      />
    </React.Fragment>
  );
};
export default ThreadComponent;
