import React from "react";
import { Box, Typography, Avatar, Divider, Paper, ListItem, Chip } from "@mui/material";
import { useTranslation } from "next-i18next";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import theme from "src/theme";
// eslint-disable-next-line import/order
import ButtonDropDownComponent from "src/components/community/post/detail/blocks/ButtonDropDownComponent";
// eslint-disable-next-line import/order
import { IStoreState } from "src/constants/interface";
import { deleteCommunityPost } from "src/services/community";
import TextEditor from "lib/TextEditor/TextEditor";

dayjs.extend(localizedFormat);
dayjs.locale("ja");

interface IBoxInfoProps {
  title: string;
  text: string;
  textColor?: string;
  fontWeight: number;
}

interface ICommunityPostDataProps {
  data?: any;
}

const BoxInfo: React.SFC<IBoxInfoProps> = ({ title, text, textColor, fontWeight }) => (
  <Box sx={{ display: "flex", width: "100%", minHeight: "32px" }}>
    <Box
      sx={{
        backgroundColor: theme.blue,
        borderRadius: "12px 0px 0px 12px",
        color: "white",
        fontWeight: 700,
        fontSize: [10, 14],
        width: ["48px", "80px"],
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {title}
    </Box>
    <Box
      sx={{
        border: `1px solid ${theme.blue}`,
        borderTopRightRadius: "12px",
        borderBottomRightRadius: "12px",
        display: "flex",
        alignItems: "center",
        lineHeight: ["32px", "40px"],
        width: "100%",
      }}
    >
      <Typography
        sx={{
          m: "5px",
          color: textColor || "black",
          fontSize: [10, 14],
          fontWeight,
          width: ["100%", "100%"],
          wordBreak: "break-word",
        }}
      >
        {text}
      </Typography>
    </Box>
  </Box>
);

const PostDetailComponent: React.SFC<ICommunityPostDataProps> = ({ data }) => {
  const auth = useSelector((state: IStoreState) => state.user);
  const { t } = useTranslation();
  const router = useRouter();
  const handleCallbackRemove = () => {
    const community = router.query;
    const res = deleteCommunityPost(community?.id, community?.detailId);
    if (res) {
      router.push(`/community/${community?.id}`);
    }
  };

  const redirectProfile = () => {
    if (data?.user?.id === auth?.id) {
      router.push("/my-profile");
    } else {
      router.push(`/profile/${data?.user?.id}`, undefined, { shallow: true });
    }
  };

  const redirectReferenceUrl = (page) => {
    window.open(page);
  };
  return (
    <Box
      sx={{
        pt: ["20px", "30px"],
        pb: "40px",
        px: ["15px", "40px"],
        border: `2px solid ${theme.whiteGray}`,
        borderRadius: "12px",
        color: theme.navy,
        position: "relative",
        backgroundColor: "white",
      }}
    >
      {(data?.can_delete || data?.can_edit) && (
        <ButtonDropDownComponent handleCallbackRemove={handleCallbackRemove} data={data} />
      )}
      <Typography
        component="span"
        sx={{
          fontSize: [18, 32],
          fontWeight: 700,
        }}
      >
        {data?.title}
      </Typography>

      <Box
        sx={{
          my: "20px",
          display: "flex",
        }}
      >
        <Avatar
          sx={{
            mr: ["8px", "24px"],
            width: ["32px", "54px"],
            height: ["32px", "54px"],
            cursor: "pointer",
          }}
          src={data?.user?.profile_image}
          alt={data?.user?.username}
          onClick={redirectProfile}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: ["row-reverse", "column"],
            alignItems: ["center", "inherit"],
          }}
        >
          <Typography
            component="div"
            sx={{
              color: theme.gray,
              fontSize: [10, 14],
            }}
          >
            {dayjs(data?.created_at).format("LLL")}
          </Typography>
          <Typography
            component="div"
            sx={{
              fontSize: [14, 20],
              fontWeight: 700,
              mr: ["16px", 0],
              cursor: "pointer",
            }}
            onClick={redirectProfile}
          >
            {data?.user?.username}
          </Typography>
        </Box>
      </Box>
      <Paper
        sx={{
          m: 0,
          p: 0,
          backgroundColor: "transparent",
          display: "flex",
          flexWrap: "wrap",
          listStyle: "none",
          boxShadow: "none",
          marginBottom: "20px",
        }}
        component="ul"
      >
        {data?.tags?.map((value: any, index: number) => (
          <ListItem
            key={index}
            sx={{
              width: "fit-content",
              ml: 0,
              padding: "4px 4px",
            }}
          >
            <Chip
              variant="outlined"
              size="small"
              label={value}
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color: theme.blue,
                backgroundColor: "white",
                borderRadius: "6px",
                borderColor: theme.blue,
              }}
            />
          </ListItem>
        ))}
      </Paper>

      <React.Fragment>
        {data?.reference_url && (
          <Box
            onClick={() => redirectReferenceUrl(data?.reference_url)}
            sx={{ cursor: "pointer", marginBottom: "7px" }}
          >
            <BoxInfo title={t("community:url")} text={data?.reference_url} textColor={theme.blue} fontWeight={500} />
          </Box>
        )}

        {data?.address && <BoxInfo title={t("community:address")} text={data?.address} fontWeight={400} />}
      </React.Fragment>

      <Divider
        sx={{
          my: "20px",
          backgroundColor: theme.lightGray,
        }}
      />

      <Box mt="20px">{data?.content !== undefined && <TextEditor value={data?.content} readOnly />}</Box>
    </Box>
  );
};
export default PostDetailComponent;
