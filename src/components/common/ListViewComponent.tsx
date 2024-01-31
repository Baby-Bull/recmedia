import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";

import theme from "src/theme";
import { IStoreState } from "src/constants/interface";

export interface IData {
  id?: string;
  title?: string;
  name?: string;
  updated_at?: string;
  comment_count?: string;
  user?: any;
}
interface IListViewComponentProps {
  data: IData;
  props?: {
    pl?: string[];
    pr?: string[];
  };
}

dayjs.extend(relativeTime);
dayjs.locale("ja");

const ListViewComponent: React.SFC<IListViewComponentProps> = ({ data, props }) => {
  const router = useRouter();
  const auth = useSelector((state: IStoreState) => state.user);
  const redirectPostDetail = () => {
    const community = router.query;
    router.push(`/community/${community?.id}/post/detail/${data?.id}`);
  };
  const redirectProfile = () => {
    if (data?.user?.id === auth?.id) {
      router.push("/my-profile", undefined, { shallow: true });
    } else {
      router.push(`/profile/${data?.user?.id}`, undefined, { shallow: true });
    }
  };

  return (
    <Box
      sx={{
        py: ["10px", "20px"],
        pl: props?.pl,
        pr: props?.pr,
        borderTop: `1px solid ${theme.lightGray}`,
      }}
    >
      <Typography
        component="span"
        sx={{
          display: { sm: "none" },
          fontSize: [12, 16],
          fontWeight: 700,
        }}
        onClick={redirectPostDetail}
      >
        {data.title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: ["5px", "0"],
        }}
      >
        <Avatar
          sx={{
            width: ["24px", "64px"],
            height: ["24px", "64px"],
            cursor: "pointer",
          }}
          onClick={redirectProfile}
          src={data?.user?.profile_image}
          alt={data?.user?.username}
        />

        {/* Grid right Info */}
        <Box
          sx={{
            ml: ["8px", "18px"],
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            component="span"
            sx={{
              display: ["none", "inherit"],
              fontSize: [12, 16],
              fontWeight: 700,
              "&:hover": {
                cursor: "pointer",
                color: theme.blue,
                textDecoration: "underline",
              },
            }}
            onClick={redirectPostDetail}
          >
            {data?.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography component="span" fontSize={12} sx={{ cursor: "pointer" }} onClick={redirectProfile}>
              {data?.user?.username}
            </Typography>
            <Typography
              component="span"
              sx={{
                mx: ["12px", "30px"],
                fontSize: 12,
                color: theme.gray,
              }}
            >
              {dayjs(data?.updated_at).toNow().replace("後", "前")}
            </Typography>

            <img src="/assets/images/svg/message.svg" alt="message" />

            <Typography
              component="span"
              sx={{
                ml: "4px",
                fontSize: 12,
                color: theme.gray,
              }}
            >
              {data?.comment_count}
            </Typography>
          </Box>
        </Box>
        {/* End Grid right Info */}
      </Box>
    </Box>
  );
};
export default ListViewComponent;
