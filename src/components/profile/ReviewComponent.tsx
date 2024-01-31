import React from "react";
import { Avatar, Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useSelector } from "react-redux";
import Link from "next/link";

import { IStoreState } from "src/constants/interface";

dayjs.extend(localizedFormat);
dayjs.locale("ja");

interface reviewProps {
  user: any;
  hideReviewer: boolean;
  rating: string;
  comment: string;
  createdAt?: string;
}

const ReviewComponent: React.SFC<reviewProps> = ({ user, hideReviewer, rating, comment, createdAt }) => {
  const { t } = useTranslation();
  const GOOD = "good";
  const auth = useSelector((state: IStoreState) => state.user);

  return (
    <Box>
      <Box
        sx={{
          mt: "40px",
          display: { xs: "block", lg: "flex" },
        }}
      >
        <Box
          sx={{
            alignItems: { xs: "center", lg: "top" },
            display: { xs: "flex", lg: "block" },
          }}
        >
          {!user?.profile_image || hideReviewer ? (
            <Box
              component="img"
              sx={{
                width: { xs: "32px", lg: "56px" },
                height: { xs: "32px", lg: "56px" },
                objectFit: "cover",
                borderRadius: "50%",
              }}
              alt="avatar"
              src="/assets/images/svg/goodhub.svg "
            />
          ) : (
            <Link href={auth.id === user?.id ? `/my-profile` : `/profile/${user?.id}`} shallow>
              <a
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: "32px", lg: "56px" },
                    height: { xs: "32px", lg: "56px" },
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  alt={user?.username}
                  src={user?.profile_image}
                />
              </a>
            </Link>
          )}
          {rating ? (
            <Box
              sx={{
                color: "#1A2944",
                fontSize: "16px",
                lineHeight: "23.17px",
                fontWeight: 700,
                display: { xs: "block", lg: "none" },
                ml: { xs: "7px", lg: "0" },
              }}
            >
              おじろ＠フルスタックエンジニア
            </Box>
          ) : (
            <Box
              sx={{
                color: "#989EA8",
                fontSize: "16px",
                lineHeight: "23.17px",
                fontWeight: 700,
                display: { xs: "block", lg: "none" },
                ml: { xs: "7px", lg: "0" },
              }}
            >
              {t("profile:anonymous")}
            </Box>
          )}
        </Box>
        <Box>
          <Box
            sx={{
              p: { xs: "15px 12px 19px 12px", lg: "16px 20px" },
              border: "1px solid #03BCDB",
              borderRadius: "12px",
              background: "#FFFFFF",
              ml: { xs: "0", lg: "31px" },
              mt: { xs: "19px", lg: "0" },
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: "-18px",
                top: "10px",
                display: { xs: "none", lg: "block" },
              }}
            >
              <img src="/assets/images/icon/ic_polygon_left.png" alt="ic_polygon_left" />
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "10px",
                top: "-17px",
                display: { xs: "block", lg: "none" },
              }}
            >
              <img src="/assets/images/icon/ic_polygon_top.png" alt="ic_polygon_top" />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row-reverse", lg: "unset" },
                justifyContent: { xs: "left" },
              }}
            >
              {!hideReviewer ? (
                <Box
                  sx={{
                    color: "#1A2944",
                    fontSize: "16px",
                    lineHeight: "23.17px",
                    fontWeight: 700,
                    display: { xs: "none", lg: "block" },
                  }}
                >
                  <Link href={auth.id === user?.id ? `/my-profile` : `/profile/${user?.id}`} shallow>
                    <a
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      {user?.username}
                    </a>
                  </Link>
                </Box>
              ) : (
                <Box
                  sx={{
                    color: "#989EA8",
                    fontSize: "16px",
                    lineHeight: "23.17px",
                    fontWeight: 700,
                    display: { xs: "none", lg: "block" },
                  }}
                >
                  {t("profile:anonymous")}
                </Box>
              )}
              <Box
                sx={{
                  color: rating === GOOD ? "#FF9458" : "#03BCDB",
                  fontSize: "16px",
                  lineHeight: "23px",
                  fontWeight: 700,
                  display: "flex",
                  marginLeft: "20px",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    mr: "5.63px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={
                      rating === GOOD ? "/assets/images/icon/ic_very_good.png" : "/assets/images/icon/ic_very_bad.png"
                    }
                    alt="ic_rating"
                  />
                </Box>
                <Box>{rating === GOOD ? t("profile:it-good") : t("profile:it-bad")}</Box>
              </Box>
              <Box
                sx={{
                  color: "#989EA8",
                  fontSize: "14px",
                  lineHeight: "20.27px",
                  marginLeft: "20px",
                  fontWeight: 400,
                }}
              >
                {dayjs(createdAt).format("LL")}にレビュー
              </Box>
            </Box>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                LineHeight: "23.17px",
                mt: "11px",
              }}
            >
              <Box>{comment}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default ReviewComponent;
