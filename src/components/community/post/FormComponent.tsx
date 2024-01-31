import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Box, Grid, Typography, Avatar, Paper, ListItem, Chip, CircularProgress, Backdrop } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";

import theme from "src/theme";
import ButtonComponent from "src/components/common/ButtonComponent";
import { Field, InputCustom } from "src/components/community/blocks/Form/InputComponent";
import { REGEX_RULES, VALIDATE_FORM_COMMUNITY_POST } from "src/messages/validate";
import { createCommunityPost, detailCommunityPost, updateCommunityPost } from "src/services/community";
import TextEditor from "lib/TextEditor/TextEditor";

const BoxTitle = styled(Box)({
  fontSize: 18,
  "@media (max-width: 425px)": {
    fontSize: 16,
  },
  fontWeight: 700,
});

const BoxTextValidate = styled(Box)({
  color: "#FF9458",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
});

interface ILayoutComponentProps {
  editable?: boolean;
}

const FormComponent: React.SFC<ILayoutComponentProps> = ({ editable }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [referenceUrl, setReferenceUrl] = useState("");
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const [tagDataValidate, setTagDataValidate] = useState(false);

  const [communityPostRequest, setCommunityPostRequest] = useState({
    title,
    content,
    reference_url: referenceUrl,
    address,
    tags,
  });
  const [errorValidates, setErrorValidates] = useState({
    title: null,
    content: null,
    reference_url: null,
    address: null,
  });

  const errorMessages = {
    title: null,
    content: null,
    reference_url: null,
    address: null,
  };

  const onKeyPress = (e) => {
    if (e.target.value.length > 20) {
      setTagDataValidate(true);
      return false;
    }
    if (e.key === "Enter" && e.target.value) {
      setTagDataValidate(false);
      setTags([...tags, e.target.value]);
      (document.getElementById("tags") as HTMLInputElement).value = "";
    }
  };
  const handleDeleteTag = (indexRemove) => () => {
    setTags(tags.filter((_, index) => index !== indexRemove));
  };

  const onChangeCommunityPostRequest = (key: string, valueInput: any) => {
    if (key === "title") {
      setTitle(valueInput);
    }
    if (key === "content") {
      setContent(valueInput);
    }
    if (key === "reference_url") {
      setReferenceUrl(valueInput);
    }
    if (key === "address") {
      setAddress(valueInput);
    }
    setCommunityPostRequest({
      ...communityPostRequest,
      [key]: typeof valueInput === "string" ? valueInput.trim() : valueInput,
    });
  };

  const onChangeContent = useCallback((htmlValue, textLenght) => {
    setContent(htmlValue);
    setContentLength(textLenght);
    setCommunityPostRequest((previous) => ({
      ...previous,
      content: htmlValue,
    }));
  }, []);

  const handleValidateFormCommunityPost = () => {
    let isValidForm = true;
    if (!communityPostRequest?.title?.length || communityPostRequest?.title?.length > 60) {
      isValidForm = false;
      errorMessages.title = VALIDATE_FORM_COMMUNITY_POST.title.max_length;
    }

    if (!communityPostRequest?.title?.length || communityPostRequest?.title?.length === 0) {
      isValidForm = false;
      errorMessages.title = VALIDATE_FORM_COMMUNITY_POST.title.required;
    }

    if (!content || contentLength < 1) {
      isValidForm = false;
      errorMessages.content = VALIDATE_FORM_COMMUNITY_POST.content.required;
    } else if (contentLength > 1000) {
      isValidForm = false;
      errorMessages.content = VALIDATE_FORM_COMMUNITY_POST.content.max_length;
    }

    if (communityPostRequest?.reference_url?.length > 0 && !REGEX_RULES.url.test(communityPostRequest?.reference_url)) {
      isValidForm = false;
      errorMessages.reference_url = VALIDATE_FORM_COMMUNITY_POST.reference_url.format;
    }

    if (communityPostRequest?.address?.length > 100) {
      isValidForm = false;
      errorMessages.address = VALIDATE_FORM_COMMUNITY_POST.address.max_length;
    }
    setErrorValidates(errorMessages);
    return isValidForm;
  };

  const handleSaveForm = async () => {
    if (handleValidateFormCommunityPost() && (tags.length === 0 || tags.length > 1)) {
      setIsLoading(true);
      const communityId = router.query;
      communityPostRequest.tags = tags;
      if (editable) {
        const res = await updateCommunityPost(communityId?.id, communityId?.updateId, communityPostRequest);
        setIsLoading(false);
        setTimeout(() => router.push(`/community/${communityId?.id}/post/detail/${res?.slug}`), 1000);
        return res;
      }
      const res = await createCommunityPost(communityId?.id, communityPostRequest);
      setIsLoading(false);
      if (res) {
        setTimeout(() => router.push(`/community/${communityId?.id}/post/detail/${res?.slug}`), 1000);
        return res;
      }
    }
  };

  const getCommunityPost = async () => {
    if (editable) {
      setIsLoading(true);
      const community = router.query;
      const res = await detailCommunityPost(community?.id, community?.updateId);
      setTitle(res?.title);
      setAddress(res?.address);
      setContent(res?.content);
      setReferenceUrl(res?.reference_url);
      setTags(res?.tags);
      setCommunityPostRequest({
        title: res?.title,
        address: res?.address,
        content: res?.content,
        reference_url: res?.reference_url,
        tags: res?.tags,
      });
      setIsLoading(false);
    }
    setShowEditor(true);
  };

  useEffect(() => {
    getCommunityPost();
  }, []);
  return (
    <React.Fragment>
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Typography
        sx={{
          fontSize: [18, 20],
          fontWeight: 700,
          pt: [0, "40px"],
        }}
      >
        {editable ? t("community:form.edit") : t("community:form.create")}
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "white",
          mt: "8px",
          p: ["23px", "40px"],
          color: theme.navy,
          borderRadius: "12px",
          border: [`1px solid ${theme.lightGray_1}`, "none"],
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: "flex", alignItems: "center", width: "240px" }}>
              <BoxTitle>{t("community:form.title")}</BoxTitle>
              <Box
                sx={{
                  background: theme.orange,
                  padding: "0px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: "16px",
                  color: "#fff",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "20px",
                  ml: "8px",
                }}
              >
                {t("common:required")}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Field
              id="title"
              placeholder={t("community:form.placeholder.title")}
              onChangeInput={onChangeCommunityPostRequest}
              error={errorValidates.title}
              value={title}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BoxTitle>{t("community:form.detail")}</BoxTitle>
              <Box
                sx={{
                  background: theme.orange,
                  padding: "0px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: "16px",
                  color: "#fff",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "20px",
                  ml: "8px",
                }}
              >
                {t("common:required")}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={9} sx={{ padding: "0" }}>
            {showEditor && (
              <TextEditor
                error={errorValidates.content}
                value={content}
                placeholder={t("community:place-holder")}
                onChange={onChangeContent}
              />
            )}
            {/* <TextArea
              id="content"
              placeholder={t("community:place-holder")}
              error={errorValidates.content}
              onChangeInput={onChangeCommunityPostRequest}
              value={content}
            /> */}
          </Grid>

          <Grid item xs={12} sm={3}>
            <BoxTitle>{t("community:form.url")}</BoxTitle>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Field
              id="reference_url"
              placeholder={t("community:form.placeholder.url")}
              error={errorValidates.reference_url}
              onChangeInput={onChangeCommunityPostRequest}
              value={referenceUrl}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <BoxTitle>{t("community:form.address")}</BoxTitle>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Field
              id="address"
              placeholder={t("community:form.placeholder.address")}
              error={errorValidates.address}
              onChangeInput={onChangeCommunityPostRequest}
              value={address}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <BoxTitle>{t("community:setting.form.tag-post")}</BoxTitle>
          </Grid>
          <Grid item xs={12} sm={9}>
            <InputCustom
              sx={{
                ml: 1,
                flex: 1,
                border: tagDataValidate || (tags.length > 0 && tags.length < 2) ? "1px solid #FF9458" : "none",
              }}
              placeholder={t("community:setting.form.placeholder.tag")}
              inputProps={{ "aria-label": t("community:setting.form.placeholder.tag") }}
              id="tags"
              onKeyPress={onKeyPress}
            />
            {tagDataValidate && <BoxTextValidate>{t("community:max_length_tag")}</BoxTextValidate>}

            <Box>
              <Paper
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  listStyle: "none",
                  boxShadow: "none",
                }}
              >
                {tags?.map((tag, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: "3px",
                      width: "auto",
                    }}
                  >
                    <Chip
                      label={tag}
                      onDelete={handleDeleteTag(index)}
                      deleteIcon={
                        <Avatar
                          src="/assets/images/svg/delete.svg"
                          sx={{
                            width: "16px",
                            height: "16px",
                            backgroundColor: "white",
                            "& img": {
                              p: "4px",
                            },
                          }}
                        />
                      }
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "white",
                        height: "22px",
                        backgroundColor: theme.blue,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                  </ListItem>
                ))}
              </Paper>
            </Box>
            {tags.length > 0 && tags.length < 2 && <BoxTextValidate>{t("community:min_2_tag")}</BoxTextValidate>}
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ButtonComponent
            props={{
              dimension: "medium",
              bgColor: theme.blue,
            }}
            onClick={handleSaveForm}
          >
            {editable ? t("community:form.submit-edit") : t("community:form.submit-create")}
          </ButtonComponent>
        </Box>
      </Box>
    </React.Fragment>
  );
};
export default FormComponent;
