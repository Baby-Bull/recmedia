import { Box, Avatar } from "@mui/material";
import React from "react";
// import { styled } from "@mui/material/styles";

import theme from "src/theme";

interface ReviewOgpProps {
  user?: any;
}
// const BoxInfoProfile = styled(Box)`
//   font-weight: 500;
//   font-size: 32px;
//   line-height: 50px;
//   display: flex;
//   align-items: center;
//   color: #1a2944;
// `;
const ReviewOgp: React.SFC<ReviewOgpProps> = ({ user }) => (
  <Box sx={{ backgroundColor: theme.whiteBlue, padding: "33px 53px" }}>
    <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "29px" }}>
      <Avatar src="/assets/images/logo/logo.png" variant="square" sx={{ width: "148.24px", height: "43.39px" }} />
    </Box>
    <Box sx={{ backgroundColor: "white", padding: "49px 40px", display: "flex" }}>
      <Box sx={{ marginRight: "30px" }}>
        <Avatar src={user?.profile_image} sx={{ width: "360px", height: "360px" }} />
      </Box>
      <Box sx={{ color: theme.navy }}>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: "44px",
            marginBottom: "18px",
            height: "65px",
            "text-overflow": "ellipsis",
            overflow: "hidden",
            wordBreak: "break-all",
            display: "-webkit-box",
            "-webkit-line-clamp": "1 !important",
            "-webkit-box-orient": "vertical",
            width: "621px",
          }}
        >
          {user?.username}
        </Box>
        {/* <BoxInfoProfile>レビュー : {user?.review_count ?? 0}件</BoxInfoProfile> */}
        <Box
          sx={{
            backgroundColor: "#FF9458",
            borderRadius: "12px",
            width: "621.18px",
            height: "97.19px",
            marginTop: "43px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 35px",
          }}
        >
          <Box />
          <Box sx={{ color: "#fff", fontWeight: 700, fontSize: "36px", lineHeight: "24px" }}>レビューを見る</Box>
          <Box>
            <Avatar
              src="/assets/images/icon/ic_vector_right.svg"
              variant="square"
              sx={{ width: "15.88px", height: "20.83px" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);
export default ReviewOgp;
