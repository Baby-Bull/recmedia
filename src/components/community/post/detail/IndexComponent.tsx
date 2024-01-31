import React, { useEffect, useState } from "react";
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
// @ts-ignore
import { MentionsInput, Mention } from "react-mentions";
import GlobalStyles from "@mui/material/GlobalStyles";

import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";
import IntroCommunityComponent from "src/components/community/blocks/IntroCommunityComponent";
import PostDetailComponent from "src/components/community/post/detail/blocks/PostDetailComponent";
import ListCommentComponent from "src/components/community/post/detail/blocks/ListCommentComponent";
import LayoutComponent from "src/components/community/LayoutComponent";
import {
  getCommunity,
  detailCommunityPost,
  createPostComment,
  getListComment,
  deleteCommunityPostComment,
  searchMemberCommunity,
} from "src/services/community";
import { VALIDATE_FORM_COMMUNITY_POST } from "src/messages/validate";

const BoxTextValidate = styled(Box)({
  color: "#FF9458",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
});

const DetailPostComponent = () => {
  const { t } = useTranslation();
  const LIMIT = 10;
  const router = useRouter();
  const [dataCommunityDetail, setDataCommunityDetail] = useState({
    name: null,
    profile_image: null,
    description: null,
    owner: {},
    admins: [],
    is_public: null,
    post_permission: null,
    community_role: null,
    member_count: null,
    login_count: null,
    created_at: null,
  });
  const [communityPostRequest, setCommunityPostRequest] = useState({
    content: "",
  });
  const [errorValidates, setErrorValidates] = useState({
    content: null,
  });

  const errorMessages = {
    content: null,
  };
  const [communityPost, setCommunityPost] = useState({});
  const [comments, setComments] = useState([]);
  const [totalComment, setTotalComment] = useState(0);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(2);
  const [valueCursor, setCursor] = React.useState("");
  const [content, setContent] = React.useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkLoadingComment, setCheckLoadingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusOrder, setStatusOrder] = useState("oldest");
  const [member, setMember] = useState([]);
  const onChangeCommunityPostRequest = (key: string, valueInput: any) => {
    setContent(valueInput);
    setCommunityPostRequest({
      ...communityPostRequest,
      [key]: typeof valueInput === "string" ? valueInput.trim() : valueInput,
    });
  };

  const fetchMember = async (text: string = "") => {
    const community = router.query;
    const res = await searchMemberCommunity(community?.id, text);
    const users = [];
    if (res) {
      // eslint-disable-next-line array-callback-return
      res?.items.map((value) => {
        users.push({ id: value?.id, display: value?.username });
      });
      setMember(users);
    }
    return res;
  };

  const handleValidateFormCommunityPost = () => {
    let isValidForm = true;
    if (communityPostRequest?.content?.length > 1000) {
      isValidForm = false;
      errorMessages.content = VALIDATE_FORM_COMMUNITY_POST.content_comment.max_length;
    }
    setErrorValidates(errorMessages);
    return isValidForm;
  };

  const handleSaveForm = async () => {
    if (handleValidateFormCommunityPost() && communityPostRequest?.content?.length > 0) {
      setIsLoading(true);
      const communityId = router.query;
      const res = await createPostComment(communityId?.id, communityId?.detailId, communityPostRequest);
      if (res) {
        setContent("");
        comments.unshift(res);
        setTotalComment(totalComment + 1);
      }
      setIsLoading(false);
      return res;
    }
  };

  const fetchComments = async (cursor: string = "", status: string = statusOrder) => {
    const community = router.query;
    const data = await getListComment(community?.id, community?.detailId, LIMIT, cursor, status);
    setCheckLoadingComment(true);
    if (!data?.error_code) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setComments([...comments, ...data?.items]);
      setTotalComment(data?.items_count ?? 0);
      setCursor(data?.cursor);
    }
    return data;
  };

  const fetchCommunity = async () => {
    const communityId = router.query;
    const data = await getCommunity(communityId?.id);
    if (!data?.error_code) {
      setDataCommunityDetail(data);
      return data;
    }
  };

  const fetchCommunityPost = async () => {
    const community = router.query;
    const res = await detailCommunityPost(community?.id, community?.detailId);
    setCheckLoading(true);
    if (!res?.error_code) {
      setCommunityPost(res);
      fetchComments();
    }
  };

  const handleCallBackPaginationIndex = (pageCallBack, perPageCallBack) => {
    setPage(pageCallBack);
    if (perPage <= pageCallBack && totalComment > comments.length) {
      setPerPage(perPageCallBack + 1);
      fetchComments(valueCursor ?? "");
    }
  };
  const handleCallbackRemove = async (indexComment, commentId) => {
    setIsLoading(true);
    const community = router.query;
    const res = await deleteCommunityPostComment(community?.id, community?.detailId, commentId);
    if (res) {
      if (comments.length < 2 + (page - 1) * 10 && page > 1) {
        handleCallBackPaginationIndex(page - 1, perPage);
      }
      setComments(comments.filter((e) => comments.indexOf(e) !== indexComment));
      setTotalComment(totalComment - 1);

      if (comments.length <= 10 && comments.length < totalComment) {
        const data = await getListComment(community?.id, community?.detailId, LIMIT, "", statusOrder);
        setCheckLoadingComment(true);
        if (!data?.error_code) {
          setComments(data?.items);
          setCursor(data?.cursor);
        }
      }
    }
    setIsLoading(false);
    return res;
  };

  const handleCallbackChangeStatusOrder = async (status, totalCommentFb, pageFb, perPageFb, cursorFb) => {
    setCheckLoadingComment(false);
    setIsLoading(true);
    setTotalComment(totalCommentFb);
    setPage(pageFb);
    setPerPage(perPageFb);
    setCursor(cursorFb);
    setStatusOrder(status);
    const community = router.query;
    const data = await getListComment(community?.id, community?.detailId, LIMIT, "", status);
    if (!data?.error_code) {
      setComments(data?.items);
      setTotalComment(data?.items_count ?? 0);
      setCursor(data?.cursor);
    }
    setIsLoading(false);
    setCheckLoadingComment(true);
    return data;
  };

  useEffect(() => {
    fetchCommunity();
    fetchCommunityPost();
    fetchMember();
  }, []);

  const defaultStyle = {
    control: {
      backgroundColor: "#fff",
      fontSize: 14,
      fontWeight: "normal",
    },

    "&multiLine": {
      control: {
        minHeight: 130,
      },
      highlighter: {
        position: "",
        padding: 9.3,
        fontFamily: "Noto Sans JP,sans-serif !important",
        color: theme.blue,
        zIndex: "1",
      },
      input: {
        padding: 9,
        border: errorValidates.content
          ? `2px solid ${theme.blue} !important`
          : `2px solid ${theme.whiteGray} !important`,
        borderRadius: "12px",
      },
    },
    suggestions: {
      list: {
        backgroundColor: "#fff",
        fontSize: 14,
        width: "300px",
        color: theme.blue,
        border: `1px solid ${theme.blue}`,
        borderRadius: "5px",
        maxHeight: "200px",
        overflowY: "auto",
      },
      item: {
        padding: "5px 15px",
        "&focused": {
          backgroundColor: theme.blue,
          color: "#fff",
          borderRadius: "5px",
        },
      },
    },
  };
  return (
    <LayoutComponent>
      <GlobalStyles
        styles={{
          ".mention-create__input": {
            border: errorValidates.content ? `2px solid ${theme.blue}` : `2px solid ${theme.whiteGray}`,
            "&::-webkit-input-placeholder": {
              color: theme.gray,
            },
            "&:focus-visible": {
              border: `2px solid ${theme.blue}`,
              outline: "none",
            },
          },
        }}
      />
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box>
        {checkLoading && (
          <Box
            sx={{
              mt: "40px",
              pt: ["8px", "80px"],
              display: "flex",
              flexDirection: ["column-reverse", "row"],
            }}
          >
            <Box
              sx={{
                width: { md: "20%" },
              }}
            >
              <IntroCommunityComponent data={dataCommunityDetail} />
            </Box>

            <Box
              sx={{
                mr: { md: "13px" },
                ml: { md: "25px" },
                mb: ["80px", "20px"],
                width: { md: "80%" },
              }}
            >
              <PostDetailComponent data={communityPost} />

              <Box
                sx={{
                  mt: "40px",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: [14, 20],
                    fontWeight: 700,
                  }}
                >
                  {t("community:comment")}（{totalComment ?? 0}）
                </Typography>

                <ListCommentComponent
                  comments={comments.slice((page - 1) * LIMIT, page * LIMIT)}
                  page={page}
                  perPage={perPage}
                  handleCallBackPaginationIndex={handleCallBackPaginationIndex}
                  handleCallbackRemove={handleCallbackRemove}
                  totalComment={totalComment ?? 0}
                  checkLoadingComment={checkLoadingComment}
                  handleCallbackChangeStatusOrder={handleCallbackChangeStatusOrder}
                />

                <Typography
                  component="span"
                  sx={{
                    fontSize: [14, 20],
                    fontWeight: 700,
                  }}
                >
                  {t("community:write-comment")}
                </Typography>
                <MentionsInput
                  value={content}
                  className="mention-update"
                  style={defaultStyle}
                  placeholder={t("community:place-holder")}
                  onChange={(e: any) => onChangeCommunityPostRequest("content", e.target.value)}
                  onKeyPress={(e: any) => {
                    if (e.shiftKey && (e.keyCode || e.which) === 13) {
                      return true;
                    }
                    if ((e.keyCode || e.which) === 13) {
                      e.preventDefault();
                      handleSaveForm();
                      return true;
                    }
                  }}
                >
                  <Mention
                    trigger="@"
                    markup="@{__id__|__display__}"
                    data={member}
                    style={{ backgroundColor: "#cee4e5" }}
                  />
                </MentionsInput>
                {errorValidates?.content && <BoxTextValidate>{errorValidates?.content}</BoxTextValidate>}
                <Box sx={{ textAlign: "right", cursor: "pointer" }}>
                  <ButtonComponent
                    disabled={!content?.length}
                    props={{
                      square: true,
                      bgColor: theme.blue,
                    }}
                    sx={{
                      mt: "20px",
                      width: "96px",
                    }}
                    onClick={handleSaveForm}
                  >
                    {t("community:button.detail.submit-post")}
                  </ButtonComponent>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </LayoutComponent>
  );
};
export default DetailPostComponent;
