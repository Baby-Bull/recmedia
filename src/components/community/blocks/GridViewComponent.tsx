import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";

import { JOBS } from "src/components/constants/constants";
import theme from "src/theme";
import { IStoreState } from "src/constants/interface";
import { USER_ONLINE_STATUS } from "src/constants/constants";

import styles from "./gridView.module.scss";

export interface IData {
  profile_image: string;
  username: string;
  role: string;
  last_login_at: string;
  activity_status: "online" | "offline";
  id: string;
  job: string;
}

interface IGridViewComponentProps {
  title?: string;
  data: IData[];
}

dayjs.extend(relativeTime);
dayjs.locale("ja");

const GridViewComponent: React.SFC<IGridViewComponentProps> = ({ title, data }) => {
  const IS_OWNER = "owner";
  const IS_ADMIN = "admin";
  const router = useRouter();
  const auth = useSelector((state: IStoreState) => state.user);

  const handleRedirectToProfile = (stringId: string) => {
    router.push(stringId === auth?.id ? `/my-profile` : `/profile/${stringId}`, undefined, { shallow: true });
  };

  return (
    <React.Fragment>
      <Typography
        sx={{
          display: !title && "none",
          color: theme.navy,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          mt: ["21px", 0],
          mx: ["24px"],
          mb: "40px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {data?.map((item, index) => (
          <React.Fragment key={index.toString()}>
            <Box
              sx={{
                mt: [0, "30px"],
                mb: ["20px", 0],
                mr: "2%",
                flex: ["0 0 30%", "0 0 18%"],
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                onClick={() => handleRedirectToProfile(item?.id)}
                sx={{
                  cursor: "pointer",
                  width: "149px",
                  height: "149px",
                }}
                src={item?.profile_image}
                alt={item?.username}
              />

              <Box sx={{ display: "flex", alignItems: "center", pt: "10px" }}>
                {item.role === IS_OWNER || item.role === IS_ADMIN ? (
                  <Box
                    sx={{
                      color: "#fff",
                      backgroundColor: item.role === IS_OWNER ? "#1BD0B0" : theme.blue,
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: "16.34px",
                      padding: "2px 9.5px",
                      borderRadius: "11px",
                      mr: "4px",
                      width: "55px",
                    }}
                  >
                    {item.role === IS_OWNER ? "代表者" : "管理者"}
                  </Box>
                ) : null}
                <Box className={styles.showAdmin} onClick={() => handleRedirectToProfile(item?.id)}>
                  {item.username}
                </Box>
              </Box>
              <Typography
                component="span"
                pt="8px"
                sx={{
                  fontSize: 12,
                  color: theme.gray,
                }}
              >
                {JOBS[item.job]?.label}
              </Typography>
              <Typography
                component="span"
                pt="8px"
                sx={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: theme.gray,
                }}
              >
                {item.activity_status === USER_ONLINE_STATUS ? "ログイン" : dayjs(item.last_login_at).fromNow()}
              </Typography>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </React.Fragment>
  );
};
export default GridViewComponent;
