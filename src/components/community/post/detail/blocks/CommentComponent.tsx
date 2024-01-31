/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Avatar, Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useRouter } from "next/router";
// eslint-disable-next-line import/order
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
// @ts-ignore
import { MentionsInput, Mention } from "react-mentions";
import GlobalStyles from "@mui/material/GlobalStyles";

import theme from "src/theme";
import ButtonDropDownComponent from "src/components/community/post/detail/blocks/ButtonDropDownComponent";
import { IStoreState } from "src/constants/interface";
import ButtonComponent from "src/components/common/ButtonComponent";
import { VALIDATE_FORM_COMMUNITY_POST } from "src/messages/validate";
import { searchMemberCommunity, updatePostComment } from "src/services/community";
import Link from "next/link";

dayjs.extend(localizedFormat);
dayjs.locale("ja");

interface ICommentComponentProps {
  itemData: any;
  handleCallbackRemove?: any;
  index?: string;
}

const BoxTextValidate = styled(Box)({
  color: "#FF9458",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
});

const CommentComponent: React.SFC<ICommentComponentProps> = ({ itemData, handleCallbackRemove, index }) => {
  const { t } = useTranslation();
  const auth = useSelector((state: IStoreState) => state.user);
  const router = useRouter();
  const [triggerRenderClient, setTriggerRenderClient] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isDisableBtn, setIsDisableBtn] = useState(true);
  const [isUpdateComment, setIsUpdateComment] = useState(false);
  const [content, setContent] = useState(itemData?.content);
  const [member, setMember] = useState([]);
  const [communityPostUpdateRequest, setCommunityPostUpdateRequest] = useState({
    content: itemData?.content,
  });
  const [errorValidates, setErrorValidates] = useState({
    content: null,
  });

  const errorMessages = {
    content: null,
  };

  useEffect(() => {
    setCommunityPostUpdateRequest({
      content: itemData?.content,
    });
    setContent(itemData?.content);
  }, [itemData]);
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

  const onChangeCommunityPostRequest = (key: string, valueInput: any) => {
    setContent(valueInput);
    setIsDisableBtn(false);
    setCommunityPostUpdateRequest({
      ...communityPostUpdateRequest,
      [key]: typeof valueInput === "string" ? valueInput.trim() : valueInput,
    });
  };

  const handleValidateFormCommunityPost = () => {
    let isValidForm = true;
    if (communityPostUpdateRequest?.content?.length > 1000) {
      isValidForm = false;
      errorMessages.content = VALIDATE_FORM_COMMUNITY_POST.content_comment.max_length;
    }
    setErrorValidates(errorMessages);
    return isValidForm;
  };
  const handleSaveFormUpdate = async () => {
    if (handleValidateFormCommunityPost() && communityPostUpdateRequest?.content?.length > 0) {
      setIsLoading(true);
      const communityId = router.query;
      const response = await updatePostComment(
        communityId?.id,
        communityId?.detailId,
        itemData?.id,
        communityPostUpdateRequest,
      );
      setIsLoading(false);
      setTriggerRenderClient(true);
      setIsUpdateComment(false);
      return response;
    }
  };

  const redirectProfile = () => {
    if (itemData?.user?.id === auth?.id) {
      router.push("/my-profile");
    } else {
      router.push(`/profile/${itemData?.user?.id}`, undefined, { shallow: true });
    }
  };

  const handleCallbackUpdateComment = (status: any) => {
    setContent(content.length > 0 ? content : itemData?.content);
    setIsUpdateComment(status);
  };

  useEffect(() => {
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
        minHeight: "100%",
      },
      highlighter: {
        substring: {
          visibility: isUpdateComment ? "hidden" : "visible",
          color: "black",
        },
        position: "",
        padding: 9.3,
        fontFamily: "Noto Sans JP,sans-serif !important",
        color: theme.blue,
        zIndex: "1",
      },
      input: {
        display: isUpdateComment ? "block" : "none",
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
    <Box>
      <GlobalStyles
        styles={{
          ".mention-detail__input": {
            border: "none",
            "&:focus-visible": {
              border: "none",
              outline: "none",
            },
            cursor: "context-menu !important",
          },
          ".mention-update__input": {
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
      <Box
        sx={{
          borderTop: `1px solid ${theme.lightGray}`,
          pt: ["8px", "20px"],
          pb: "26px",
          position: "relative",
        }}
      >
        {(itemData?.can_delete || itemData?.can_edit) && (
          <ButtonDropDownComponent
            top={["4px", "10px"]}
            right="0"
            handleCallbackRemove={handleCallbackRemove}
            handleCallbackUpdateComment={handleCallbackUpdateComment}
            index={index}
            comment={itemData}
          />
        )}
        <Box
          sx={{
            display: "flex",
            pb: "20px",
          }}
        >
          <Avatar
            sx={{
              mr: ["8px", "24px"],
              width: ["32px", "54px"],
              height: ["32px", "54px"],
              cursor: "pointer",
            }}
            onClick={redirectProfile}
            src={itemData?.user?.profile_image}
            alt={itemData?.user?.username}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: ["row-reverse", "column"],
              alignItems: ["center", "inherit"],
            }}
          >
            <Typography
              sx={{
                color: theme.gray,
                fontSize: [10, 14],
              }}
            >
              {dayjs(itemData?.created_at).format("LLL")}
            </Typography>
            <Typography
              sx={{
                fontSize: [14, 20],
                fontWeight: 700,
                mr: ["16px", 0],
                cursor: "pointer",
              }}
              onClick={redirectProfile}
            >
              {itemData?.user?.username}
            </Typography>
          </Box>
        </Box>
        {isUpdateComment ? (
          <Box>
            <MentionsInput
              //value={communityPostUpdateRequest?.content}
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
                  handleSaveFormUpdate();
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
              {!isDisableBtn && (
                <ButtonComponent
                  props={{
                    square: true,
                    bgColor: theme.gray,
                  }}
                  sx={{
                    mt: "20px",
                    mr: "15px",
                    width: "96px",
                  }}
                  onClick={() => {
                    setTriggerRenderClient(false);
                    setContent(itemData?.content);
                    setIsUpdateComment(false);
                  }}
                >
                  {t("community:button.detail.cancel-edit")}
                </ButtonComponent>
              )}
              <ButtonComponent
                disabled={isDisableBtn || content.length < 1}
                props={{
                  square: true,
                  bgColor: theme.blue,
                }}
                sx={{
                  mt: "20px",
                  width: "96px",
                }}
                onClick={handleSaveFormUpdate}
              >
                {t("community:button.detail.submit-post")}
              </ButtonComponent>
            </Box>
          </Box>
        ) : (
          <>
            <MentionsInput
              value={triggerRenderClient ? communityPostUpdateRequest?.content : itemData?.content}
              className="mention-detail"
              style={defaultStyle}
              readOnly
            >
              <Mention
                displayTransform={(id: string, display: any) => (
                  <Link href={`/profile/${id}`} shallow>
                    <a style={{ textDecoration: "none", color: "#03BCDB" }}>{display}</a>
                  </Link>
                )}
                markup="@{__id__|__display__}"
                style={{ backgroundColor: "#fff", cursor: "pointer !important" }}
              />
              <Mention
                displayTransform={(id: string, display: any) => {
                  return (
                    <a target="_blank" style={{ textDecoration: "none", color: "#03BCDB" }} href={id}>
                      {id}
                    </a>
                  );
                }}
                markup="__id__"
                regex={
                  /((?:http|https):\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*))/
                }
                style={{ backgroundColor: "#fff", cursor: "pointer !important" }}
              />
            </MentionsInput>
          </>
        )}
      </Box>
    </Box>
  );
};
export default CommentComponent;
