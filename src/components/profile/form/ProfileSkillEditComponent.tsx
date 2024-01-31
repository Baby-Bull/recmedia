import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputBase,
  Link,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
/* eslint-disable */
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
/* eslint-enable */
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "next-i18next";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";

import theme from "src/theme";
import { VALIDATE_FORM_UPDATE_PROFILE, REGEX_RULES } from "src/messages/validate";
import { Field } from "src/components/profile/form/InputProfileComponent";
import { FieldArea } from "src/components/profile/form/TextAreaComponent";
import { FieldSelect } from "src/components/profile/form/SelectComponent";
import {
  JOBS,
  EMPLOYEE_STATUS,
  PROFILE_JAPAN_PROVINCE_OPTIONS,
  MONTHS,
  LEVELS,
  ENGLISH_LEVEL_OPTIONS,
  MY_PROFILE_STATUS_OPTIONS,
} from "src/constants/constants";
// eslint-disable-next-line import/no-duplicates
import { getUserProfile, updateProfile } from "src/services/user";
import { IStoreState } from "src/constants/interface";
import actionTypes from "src/store/actionTypes";
import { SERVER_ERROR, UPDATE_PROFILE } from "src/messages/notification";

const BoxContentTab = styled(Box)`
  display: flex;
  margin-bottom: 43px;
  color: ${theme.navy};
  ${(props) => props.theme.breakpoints.up("xs")} {
    display: block;
  }

  ${(props) => props.theme.breakpoints.up("lg")} {
    display: flex;
  }
`;

const TitleContentTab = styled(Box)`
  width: 238px;
  font-size: 18px;
  font-weight: 700;
  ${(props) => props.theme.breakpoints.up("xs")} {
    font-size: 16px;
  }

  ${(props) => props.theme.breakpoints.up("lg")} {
    font-size: 18px;
  }
`;

const ContentTab = styled(Box)`
  width: 740px;
  ${(props) => props.theme.breakpoints.up("xs")} {
    font-size: 14px;
    width: 100%;
  }

  ${(props) => props.theme.breakpoints.up("xl")} {
    font-size: 16px;
    width: 76%;
  }
`;

const Tab = styled(TabUnstyled)`
  color: ${theme.blue};
  cursor: pointer;
  font-size: 20px;
  line-height: 29px;
  font-weight: bold;
  background-color: #fff;
  width: 240px;
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  border: 1px solid #03bcdb;
  border-radius: 12px 12px 0 0;
  border-bottom: none !important;
  height: 56px;

  &.${tabUnstyledClasses.selected} {
    background-color: ${theme.blue};
    color: #fff;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
`;

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  display: flex;
  align-items: center;
`;

const TypoProfile = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  line-height: 26.06px;
  margin-bottom: 26px;
`;

const TypoProfileMobile = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
  lineHeight: "20.27px",
  "@media (min-width: 1200px)": {
    display: "none",
  },
});

const ImgStar = styled(Avatar)({
  width: "13px",
  height: "15px",
});

const BoxEstimatedStar = styled(Box)({
  display: "flex",
  alignItems: "center",
  "@media (max-width: 1200px)": {
    display: "none",
  },
});

const TypoxEstimatedStar = styled(Typography)({
  fontSize: "14px",
  textDecorationLine: "underline",
  marginLeft: "10px",
});

const ListItem = styled("li")({
  marginRight: "6px",
});

const InputCustom = styled(TextField)({
  width: "100%",
  borderRadius: "6px",
  "& fieldset": {
    border: "none",
  },
  "&:placeholder": {
    color: "red",
  },
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: "#F4FDFF",
    fontSize: 16,
    padding: "9px 16px",
    borderRadius: "6px",
    fontFamily: "Noto Sans JP",
    "@media (max-width: 1200px)": {
      fontSize: 14,
    },
    "&:focus": {
      boxShadow: `${theme.blue} 0 0 0 0.1rem`,
      borderColor: theme.blue,
    },
  },
});
const SelectCustom = styled(Select)({
  borderRadius: 6,
  width: "46%",
  height: "40px",
  "& fieldset": {
    border: "none",
  },
  "&:hover": {
    borderRadius: 6,
    borderColor: theme.whiteBlue,
  },
  "@media (max-width: 1200px)": {
    width: "100%",
  },
  backgroundColor: `${theme.whiteBlue}`,
  "& .MuiSelect-select": {
    position: "relative",
    backgroundColor: `${theme.whiteBlue}`,
    border: `1px solid ${theme.whiteBlue}`,
    fontSize: 16,
    padding: "9px 16px",
    borderRadius: 6,
    fontFamily: "Noto Sans JP",
    "@media (max-width: 1200px)": {
      fontSize: 14,
    },
    "&:focus": {
      boxShadow: `${theme.blue} 0 0 0 0.1rem`,
      borderColor: theme.blue,
    },
  },
});

const BoxTextValidate = styled(Box)({
  color: "#FF9458",
  lineHeight: "20px",
  fontWeight: "400",
  fontSize: "14px",
});

const ImgStarLevel = ({ countStar }) => {
  const rows = [];
  for (let i = 0; i < countStar; i++) {
    rows.push("/assets/images/star.png");
  }
  return (
    <Box sx={{ display: "flex" }}>
      {rows?.map((value, key) => (
        <Box key={key}>
          <img src={value} alt="star" />
        </Box>
      ))}
    </Box>
  );
};

const ProfileSkillComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state: IStoreState) => state.user);
  const router = useRouter();
  const profileImgData = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [hitokoto, setHitokoto] = useState(null);
  const [discussionTopic, setDiscussionTopic] = useState(null);
  const [twitterUrl, setTwitterUrl] = useState(null);
  const [facebookUrl, setFacebookUrl] = useState(null);
  const [githubUrl, setGithubUrl] = useState(null);
  const [selfDescription, setSelfDescription] = useState(null);
  const [status, setStatus] = useState(MY_PROFILE_STATUS_OPTIONS[0].value);
  const [englishLevel, setEnglishLevel] = useState(ENGLISH_LEVEL_OPTIONS[0].value);
  const [job, setJob] = useState(JOBS[0].value);
  const [jobPosition, setJobPosition] = useState(null);
  const [employmentStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0].value);
  const [address, setAddress] = useState(PROFILE_JAPAN_PROVINCE_OPTIONS[0].value);
  const [inputTags, setInputTags] = useState([]);
  const [isSkillProfile, setIsSkillProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [upstreamProcess, setUpstreamProcess] = useState(null);
  const [otherLanguageLevel, setOtherLanguageLevel] = useState(null);
  const [tagDataValidate, setTagDataValidate] = useState(false);
  const [skillLanguageData, setSkillLanguage] = useState([
    { key: 0, name: null, experience_year: 0, experience_month: 1, level: 1, category: "programLanguage" },
  ]);
  const [skillFrameworkData, setSkillFramework] = useState([
    { key: 0, name: null, experience_year: 0, experience_month: 1, level: 1, category: "framework" },
  ]);
  const [skillInfrastructureData, setSkillInfrastructure] = useState([
    { key: 0, name: null, experience_year: 0, experience_month: 1, level: 1, category: "infrastructure" },
  ]);
  const [monthLanguage] = useState(MONTHS[0].value);
  const [levelLanguage] = useState(LEVELS[2].value);
  const [messSkillLanguageErr, setMessSkillLanguageErr] = useState([{ key: null, mess: null, type: null }]);
  const [messSkillFrameworkErr, setMessSkillFrameworkErr] = useState([{ key: null, mess: null, type: null }]);
  const [messSkillInfrastructureErr, setMessSkillInfrastructureErr] = useState([{ key: null, mess: null, type: null }]);
  const [statusErrNameLanguage, setStatusErrNameLanguage] = useState([{ key: null, status: null }]);
  const [statusErrYearLanguage, setStatusErrYearLanguage] = useState([{ key: null, status: null }]);
  const [statusErrNameFramework, setStatusErrNameFramework] = useState([{ key: null, status: null }]);
  const [statusErrYearFramework, setStatusErrYearFramework] = useState([{ key: null, status: null }]);
  const [statusErrNameInfrastructure, setStatusErrNameInfrastructure] = useState([{ key: null, status: null }]);
  const [statusErrYearInfrastructure, setStatusErrYearInfrastructure] = useState([{ key: null, status: null }]);
  // const [statusErrYearInfrastructure, setStatusErrYearInfrastructure] = useState([{ key: null, status: null }]);
  // const [statusErrYearInfrastructure, setStatusErrYearInfrastructure] = useState([{ key: null, status: null }]);
  const [skillRequest, setSkillRequest] = useState({
    upstream_process: null,
    english_level: null,
    other_language_level: null,
  });

  const errorMessages = {
    username: null,
    twitter_url: null,
    facebook_url: null,
    github_url: null,
    hitokoto: null,
    self_description: null,
    status: null,
    job: null,
    job_position: null,
    employment_status: null,
    discussion_topic: null,
    address: null,
    tags: null,
    upstream_process: null,
    english_level: null,
    other_language_level: null,
    image_profile: null,
  };

  const [errorValidates, setErrorValidates] = useState({
    username: null,
    twitter_url: null,
    facebook_url: null,
    github_url: null,
    hitokoto: null,
    self_description: null,
    status: null,
    job: null,
    job_position: null,
    employment_status: null,
    discussion_topic: null,
    address: null,
    tags: null,
    upstream_process: null,
    english_level: null,
    other_language_level: null,
    image_profile: null,
  });

  const [profileRequest, setProfileRequest] = useState({
    hitokoto,
    self_description: selfDescription,
    status,
    job,
    job_position: jobPosition,
    employment_status: employmentStatus,
    discussion_topic: discussionTopic,
    address,
    tags: inputTags,
  });

  const [profileSocialRequest, setProfileSocialRequest] = useState({
    username,
    twitter_url: twitterUrl,
    facebook_url: facebookUrl,
    github_url: githubUrl,
  });

  // fetch api profile
  const fetchProfileSkill = async () => {
    setErrorValidates({
      username: null,
      twitter_url: null,
      facebook_url: null,
      github_url: null,
      hitokoto: null,
      self_description: null,
      status: null,
      job: null,
      job_position: null,
      employment_status: null,
      discussion_topic: null,
      address: null,
      tags: null,
      upstream_process: null,
      english_level: null,
      other_language_level: null,
      image_profile: null,
    });
    setStatusErrNameLanguage([]);
    setStatusErrYearLanguage([]);
    setStatusErrNameFramework([]);
    setStatusErrYearFramework([]);
    setStatusErrYearInfrastructure([]);
    setStatusErrYearInfrastructure([]);
    setMessSkillLanguageErr([
      {
        key: null,
        mess: null,
        type: null,
      },
    ]);
    setMessSkillFrameworkErr([
      {
        key: null,
        mess: null,
        type: null,
      },
    ]);
    setMessSkillInfrastructureErr([
      {
        key: null,
        mess: null,
        type: null,
      },
    ]);
    setIsLoading(true);
    const data = await getUserProfile();
    setUsername(data.username);
    setFacebookUrl(data.facebook_url);
    setTwitterUrl(data.twitter_url);
    setGithubUrl(data.github_url);
    setHitokoto(data.hitokoto);
    setJobPosition(data.job_position);
    setDiscussionTopic(data.discussion_topic);
    setSelfDescription(data.self_description);
    setStatus(data.status ? data.status : MY_PROFILE_STATUS_OPTIONS[0].value);
    setJob(data.job ? data.job : JOBS[0].value);
    setInputTags(data.tags ? data.tags : []);
    setEmployeeStatus(data.employment_status ? data.employment_status : EMPLOYEE_STATUS[0].value);
    setAddress(data.address ? data.address : PROFILE_JAPAN_PROVINCE_OPTIONS[0].value);
    setProfileImage(data.profile_image);
    setIsLoading(false);
    setEnglishLevel(data?.skills?.english_level);
    setOtherLanguageLevel(data?.skills?.other_language_level);
    setUpstreamProcess(data?.skills?.upstream_process);
    setSkillRequest({
      upstream_process: data?.skills?.upstream_process,
      english_level: data?.skills?.english_level,
      other_language_level: data?.skills?.other_language_level,
    });
    setProfileSocialRequest({
      username: data.username,
      twitter_url: data.twitter_url,
      facebook_url: data.facebook_url,
      github_url: data.github_url,
    });
    setProfileRequest({
      hitokoto: data.hitokoto,
      self_description: data.self_description,
      status: data.status ? data.status : MY_PROFILE_STATUS_OPTIONS[0].value,
      job: data.job ? data.job : JOBS[0].value,
      job_position: data.job_position,
      employment_status: data.employment_status ? data.employment_status : EMPLOYEE_STATUS[0].value,
      discussion_topic: data.discussion_topic,
      address: data.address ? data.address : PROFILE_JAPAN_PROVINCE_OPTIONS[0].value,
      tags: data.tags ? data.tags : [],
    });

    const codeSkills = data?.skills?.code_skills;
    const arrLanguage = [];
    const arrFramework = [];
    const arrInfrastructure = [];
    for (let i = 0; i < codeSkills?.length; i++) {
      if (codeSkills[i]?.category === "programLanguage") {
        arrLanguage.push({
          key: i,
          name: codeSkills[i]?.name,
          experience_month: codeSkills[i]?.experience_month,
          experience_year: codeSkills[i]?.experience_year,
          level: codeSkills[i]?.level,
          category: "programLanguage",
        });
      }
      if (codeSkills[i]?.category === "framework") {
        arrFramework.push({
          key: i,
          name: codeSkills[i]?.name,
          experience_month: codeSkills[i]?.experience_month,
          experience_year: codeSkills[i]?.experience_year,
          level: codeSkills[i]?.level,
          category: "framework",
        });
      }

      if (codeSkills[i]?.category === "infrastructure") {
        arrInfrastructure.push({
          key: i,
          name: codeSkills[i]?.name,
          experience_month: codeSkills[i]?.experience_month,
          experience_year: codeSkills[i]?.experience_year,
          level: codeSkills[i]?.level,
          category: "infrastructure",
        });
      }
    }
    if (arrLanguage.length > 0) {
      setSkillLanguage(arrLanguage);
    }
    if (arrFramework.length > 0) {
      setSkillFramework(arrFramework);
    }
    if (arrInfrastructure.length > 0) {
      setSkillInfrastructure(arrInfrastructure);
    }
    setCheckLoading(true);
    return data;
  };

  useEffect(() => {
    fetchProfileSkill();
  }, []);

  // /* Delete item */
  const handleDeleteSkillLanguage = (SkillLanguageToDelete) => () => {
    setSkillLanguage((languages) => languages.filter((language) => language.key !== SkillLanguageToDelete.key));
  };

  const handleDeleteSkillFramework = (SkillFrameworkToDelete) => () => {
    setSkillFramework((frameworks) => frameworks.filter((framework) => framework.key !== SkillFrameworkToDelete.key));
  };

  const handleDeleteSkillInfrastructure = (SkillInfrastructureToDelete) => () => {
    setSkillInfrastructure((infrastructures) =>
      infrastructures.filter((infrastructure) => infrastructure.key !== SkillInfrastructureToDelete.key),
    );
  };

  const arrMessLanguageErrors = [];
  const arrStatusNameLanguageErrors = [];
  const arrStatusYearLanguageErrors = [];
  const arrStatusNameFrameworkErrors = [];
  const arrStatusYearFrameworkErrors = [];
  const arrStatusNameInfrastructureErrors = [];
  const arrStatusYearInfrastructureErrors = [];
  const arrMessFrameworkErrors = [];
  const arrMessInfrastructureErrors = [];
  const arrNameLanguage = [];
  const arrNameFramework = [];
  const arrNameInfrastructure = [];

  const removeSearchTag = (indexRemove) => {
    setInputTags(inputTags.filter((_, index) => index !== indexRemove));
  };

  /* Click add item item */
  const addSkillLanguageClick = (key) => () => {
    // @ts-ignore
    setSkillLanguage([
      ...skillLanguageData,
      { key: key + 1, name: null, experience_year: 0, experience_month: 1, level: 1, category: "programLanguage" },
    ]);
  };

  const addSkillFrameworkClick = (key) => () => {
    // @ts-ignore
    setSkillFramework([
      ...skillFrameworkData,
      { key: key + 1, name: null, experience_year: 0, experience_month: 1, level: 1, category: "framework" },
    ]);
  };
  // ?.trim()
  const addSkillInfrastructureClick = (key) => () => {
    // @ts-ignore
    setSkillInfrastructure([
      ...skillInfrastructureData,
      { key: key + 1, name: null, experience_year: 0, experience_month: 1, level: 1, category: "infrastructure" },
    ]);
  };

  const onKeyPress = (e) => {
    if (e.target.value.length > 20) {
      setTagDataValidate(true);
      return false;
    }
    if (e.key === "Enter" && e.target.value) {
      setTagDataValidate(false);
      setInputTags([...inputTags, e.target.value]);
      (document.getElementById("input_search_tag") as HTMLInputElement).value = "";
    }
  };

  const onChangeSkillLanguage = (key: number, e: any) => {
    const { name, value } = e.target;
    // eslint-disable-next-line no-shadow
    setSkillLanguage((skillLanguageData) =>
      skillLanguageData.map((el) =>
        Number(el.key) === Number(key)
          ? {
              ...el,
              [name]: typeof value === "string" ? value : value,
            }
          : el,
      ),
    );
  };

  const onChangeSkillFramework = (key: number, e: any) => {
    const { name, value } = e.target;
    // eslint-disable-next-line no-shadow
    setSkillFramework((skillFrameworkData) =>
      skillFrameworkData.map((el) =>
        Number(el.key) === Number(key)
          ? {
              ...el,
              [name]: typeof value === "string" ? value : value,
            }
          : el,
      ),
    );
  };

  const onChangeSkillInfrastructure = (key: number, e: any) => {
    const { name, value } = e.target;
    // eslint-disable-next-line no-shadow
    setSkillInfrastructure((skillInfrastructureData) =>
      skillInfrastructureData.map((el) =>
        Number(el.key) === Number(key)
          ? {
              ...el,
              [name]: typeof value === "string" ? value.trim() : value,
            }
          : el,
      ),
    );
  };

  // form profile url social
  const onChangeProfileSocialRequest = (key: string, value: any) => {
    if (key === "username") {
      setUsername(value);
    }
    if (key === "twitter_url") {
      setTwitterUrl(value);
    }
    if (key === "facebook_url") {
      setFacebookUrl(value);
    }
    if (key === "github_url") {
      setGithubUrl(value);
    }

    setProfileSocialRequest({
      ...profileSocialRequest,
      [key]: typeof value === "string" ? value.trim() : value,
    });
  };

  // form profile
  const onChangeProfileRequest = (key: string, value: any) => {
    if (key === "hitokoto") {
      setHitokoto(value);
    }
    if (key === "self_description") {
      setSelfDescription(value);
    }
    if (key === "status") {
      setStatus(value);
    }

    if (key === "job") {
      setJob(value);
    }

    if (key === "employment_status") {
      setEmployeeStatus(value);
    }

    if (key === "address") {
      setAddress(value);
    }

    if (key === "job_position") {
      setJobPosition(value);
    }

    if (key === "discussion_topic") {
      setDiscussionTopic(value);
    }

    setProfileRequest({
      ...profileRequest,
      [key]: typeof value === "string" ? value.trim() : value,
    });
  };

  // form profile skill
  const onChangeProfileSkillRequest = (key: string, value: any) => {
    if (key === "english_level") {
      setEnglishLevel(value);
    }
    if (key === "upstream_process") {
      setUpstreamProcess(value);
    }
    if (key === "other_language_level") {
      setOtherLanguageLevel(value);
    }
    setSkillRequest({
      ...skillRequest,
      [key]: typeof value === "string" ? value.trim() : value,
    });
  };

  // Validate profile url social form
  const handleValidateFormSocial = () => {
    let isValidForm = true;
    // validate user name
    if (profileSocialRequest?.username?.length > 50) {
      isValidForm = false;
      errorMessages.username = VALIDATE_FORM_UPDATE_PROFILE.username.max_length;
    }
    if (!profileSocialRequest?.username?.length) {
      isValidForm = false;
      errorMessages.username = VALIDATE_FORM_UPDATE_PROFILE.username.required;
    }
    if (!REGEX_RULES.username_register.test(profileSocialRequest?.username)) {
      isValidForm = false;
      errorMessages.username = VALIDATE_FORM_UPDATE_PROFILE.format;
    }
    if (profileSocialRequest?.facebook_url?.length > 0 && !REGEX_RULES.url.test(profileSocialRequest?.facebook_url)) {
      isValidForm = false;
      errorMessages.facebook_url = VALIDATE_FORM_UPDATE_PROFILE.facebook_url.format;
    }

    if (profileSocialRequest?.twitter_url?.length > 0 && !REGEX_RULES.url.test(profileSocialRequest?.twitter_url)) {
      isValidForm = false;
      errorMessages.twitter_url = VALIDATE_FORM_UPDATE_PROFILE.twitter_url.format;
    }

    if (profileSocialRequest?.github_url?.length > 0 && !REGEX_RULES.url.test(profileSocialRequest?.github_url)) {
      isValidForm = false;
      errorMessages.github_url = VALIDATE_FORM_UPDATE_PROFILE.github_url.format;
    }
    setErrorValidates(errorMessages);
    return isValidForm;
  };

  // Validate profile form
  const handleValidateForm = () => {
    let isValidForm = true;
    if (isSkillProfile) {
      // Validate arr input language
      for (let i = 0; i < skillLanguageData.length; i++) {
        arrStatusNameLanguageErrors.push({
          key: `name_${skillLanguageData[i]?.key}`,
          status: false,
        });
        arrNameLanguage.push(skillLanguageData[i]?.name);
        arrStatusYearLanguageErrors.push({
          key: `experience_year_${skillLanguageData[i]?.key}`,
          status: false,
        });
        if (skillLanguageData[i]?.name?.trim()?.length > 40) {
          isValidForm = false;
          arrMessLanguageErrors.push({
            key: `name_${skillLanguageData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.max_length_name_skill,
            type: "max_length",
          });
          arrStatusNameLanguageErrors[i].status = true;
        }

        // @ts-ignore
        if (skillLanguageData[i]?.experience_year?.length > 2) {
          isValidForm = false;
          arrMessLanguageErrors.push({
            key: `experience_year_${skillLanguageData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.max_length_year_skill,
            type: "max_length",
          });
          arrStatusYearLanguageErrors[i].status = true;
        }

        if (skillLanguageData[i]?.experience_year < 0) {
          isValidForm = false;
          arrMessLanguageErrors.push({
            key: `experience_year_${skillLanguageData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.experience_year.min,
            type: "min",
          });
          arrStatusYearLanguageErrors[i].status = true;
        }
      }
      // validate arr input framework
      for (let i = 0; i < skillFrameworkData.length; i++) {
        arrStatusNameFrameworkErrors.push({
          key: `name_${skillFrameworkData[i]?.key}`,
          status: false,
        });
        arrStatusYearFrameworkErrors.push({
          key: `experience_year_${skillFrameworkData[i]?.key}`,
          status: false,
        });
        arrNameFramework.push(skillFrameworkData[i]?.name);

        if (skillFrameworkData[i]?.name?.trim()?.length > 40) {
          isValidForm = false;
          arrMessFrameworkErrors.push({
            key: `name_${skillFrameworkData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.max_length_name_skill,
            type: "max_length",
          });
          arrStatusNameFrameworkErrors[i].status = true;
        }

        // @ts-ignore
        if (skillFrameworkData[i]?.experience_year?.length > 2) {
          isValidForm = false;
          arrMessFrameworkErrors.push({
            key: `experience_year_${skillFrameworkData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.max_length_year_skill,
            type: "max_length",
          });
          arrStatusYearFrameworkErrors[i].status = true;
        }

        if (skillFrameworkData[i]?.experience_year < 0) {
          isValidForm = false;
          arrMessFrameworkErrors.push({
            key: `experience_year_${skillFrameworkData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.experience_year.min,
            type: "min",
          });
          arrStatusYearFrameworkErrors[i].status = true;
        }
      }

      // validate arr input Infrastructure
      for (let i = 0; i < skillInfrastructureData.length; i++) {
        arrStatusNameInfrastructureErrors.push({
          key: `name_${skillInfrastructureData[i]?.key}`,
          status: false,
        });

        arrStatusYearInfrastructureErrors.push({
          key: `experience_year_${skillInfrastructureData[i]?.key}`,
          status: false,
        });
        arrNameInfrastructure.push(skillInfrastructureData[i]?.name);

        if (skillInfrastructureData[i]?.name?.trim()?.length > 40) {
          isValidForm = false;
          arrMessInfrastructureErrors.push({
            key: `name_${skillInfrastructureData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.max_length_name_skill,
            type: "max_length",
          });
          arrStatusNameInfrastructureErrors[i].status = true;
        }

        // @ts-ignore
        if (skillInfrastructureData[i]?.experience_year?.length > 2) {
          isValidForm = false;
          arrMessInfrastructureErrors.push({
            key: `experience_year_${skillInfrastructureData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.max_length_year_skill,
            type: "max_length",
          });
          arrStatusYearInfrastructureErrors[i].status = true;
        }

        if (skillInfrastructureData[i]?.experience_year < 0) {
          isValidForm = false;
          arrMessInfrastructureErrors.push({
            key: `experience_year_${skillInfrastructureData[i]?.key}`,
            mess: VALIDATE_FORM_UPDATE_PROFILE.experience_year.min,
            type: "min",
          });
          arrStatusYearInfrastructureErrors[i].status = true;
        }
      }

      if (skillRequest?.upstream_process?.length > 200) {
        isValidForm = false;
        errorMessages.upstream_process = VALIDATE_FORM_UPDATE_PROFILE.upstream_process.max_length;
      }

      // if (!skillRequest?.english_level) {
      //   isValidForm = false;
      //   errorMessages.english_level = VALIDATE_FORM_UPDATE_PROFILE.english_level.select;
      // }

      if (skillRequest?.other_language_level?.length > 200) {
        isValidForm = false;
        errorMessages.other_language_level = VALIDATE_FORM_UPDATE_PROFILE.other_language_level.max_length;
      }
      setStatusErrNameLanguage(arrStatusNameLanguageErrors);
      setStatusErrYearLanguage(arrStatusYearLanguageErrors);
      setStatusErrNameFramework(arrStatusNameFrameworkErrors);
      setStatusErrYearFramework(arrStatusYearFrameworkErrors);
      setStatusErrNameInfrastructure(arrStatusNameInfrastructureErrors);
      setStatusErrYearInfrastructure(arrStatusYearInfrastructureErrors);
      setMessSkillLanguageErr(arrMessLanguageErrors);
      setMessSkillFrameworkErr(arrMessFrameworkErrors);
      setMessSkillInfrastructureErr(arrMessInfrastructureErrors);
    } else {
      // validate hitokoto
      if (profileRequest?.hitokoto?.length > 40) {
        isValidForm = false;
        errorMessages.hitokoto = VALIDATE_FORM_UPDATE_PROFILE.hitokoto.max_length;
      }

      // validate self_description
      if (profileRequest?.self_description?.length > 1000) {
        isValidForm = false;
        errorMessages.self_description = VALIDATE_FORM_UPDATE_PROFILE.self_description.max_length;
      }

      // validate status
      // if (!profileRequest?.status) {
      //   isValidForm = false;
      //   errorMessages.status = VALIDATE_FORM_UPDATE_PROFILE.status.select;
      // }

      // validate job
      // if (!profileRequest?.job) {
      //   isValidForm = false;
      //   errorMessages.job = VALIDATE_FORM_UPDATE_PROFILE.job.select;
      // }

      // validate job_position
      if (profileRequest?.job_position?.length > 1000) {
        isValidForm = false;
        errorMessages.job_position = VALIDATE_FORM_UPDATE_PROFILE.job_position.max_length;
      }

      // validate employment_status
      // if (!profileRequest?.employment_status) {
      //   isValidForm = false;
      //   errorMessages.employment_status = VALIDATE_FORM_UPDATE_PROFILE.employment_status.select;
      // }

      // validate discussion_topic
      if (profileRequest?.discussion_topic?.length > 100) {
        isValidForm = false;
        errorMessages.discussion_topic = VALIDATE_FORM_UPDATE_PROFILE.discussion_topic.max_length;
      }

      // validate address
      // if (!profileRequest?.address) {
      //   isValidForm = false;
      //   errorMessages.address = VALIDATE_FORM_UPDATE_PROFILE.address.select;
      // }

      if (inputTags?.length > 1 && inputTags?.length < 2) {
        isValidForm = false;
        errorMessages.tags = VALIDATE_FORM_UPDATE_PROFILE.tags.min_tag;
      }
    }
    setErrorValidates(errorMessages);
    return isValidForm;
  };

  // // submit profile social form
  // const submitUserProfileSocial = async () => {
  //   if (handleValidateFormSocial()) {
  //     setIsLoading(true);
  //     const res = await updateProfile(profileSocialRequest);
  //     if (res) {
  //       auth.username = profileSocialRequest.username;
  //       dispatch({ type: actionTypes.UPDATE_PROFILE, payload: auth });
  //       setTimeout(() => router.push("/my-profile"), 1000);
  //       setIsLoading(false);
  //       return res;
  //     }
  //   }
  // };
  // // submit profile form
  // const submitUserProfileRequest = async () => {
  //   if (handleValidateForm()) {
  //     // setIsLoading(true);
  //     const paramSkillLanguageData = [];
  //     const paramSkillFrameworkData = [];
  //     const paramSkillInfrastructureData = [];
  //     if (inputTags.length === 0 || inputTags.length > 1) {
  //       setProfileRequest({
  //         ...profileRequest,
  //       });
  //       for (let i = 0; i < skillLanguageData.length; i++) {
  //         if (skillLanguageData[i]?.name?.trim()?.length > 0) {
  //           paramSkillLanguageData.push({
  //             category: skillLanguageData[i]?.category,
  //             name: skillLanguageData[i]?.name.trim(),
  //             experience_month: skillLanguageData[i]?.experience_month,
  //             experience_year:
  //               // @ts-ignore
  //               skillLanguageData[i]?.experience_year?.length > 0 ? skillLanguageData[i]?.experience_year : 0,
  //             level: skillLanguageData[i]?.level,
  //           });
  //         }
  //       }
  //       for (let i = 0; i < skillFrameworkData.length; i++) {
  //         if (skillFrameworkData[i]?.name?.trim()?.length > 0) {
  //           paramSkillFrameworkData.push({
  //             category: skillFrameworkData[i]?.category,
  //             name: skillFrameworkData[i]?.name.trim(),
  //             experience_month: skillFrameworkData[i]?.experience_month,
  //             experience_year:
  //               // @ts-ignore
  //               skillFrameworkData[i]?.experience_year?.length > 0 ? skillFrameworkData[i]?.experience_year : 0,
  //             level: skillFrameworkData[i]?.level,
  //           });
  //         }
  //       }
  //       for (let i = 0; i < skillInfrastructureData.length; i++) {
  //         if (skillInfrastructureData[i]?.name?.trim()?.length > 0) {
  //           paramSkillInfrastructureData.push({
  //             category: skillInfrastructureData[i]?.category,
  //             name: skillInfrastructureData[i]?.name.trim(),
  //             experience_month: skillInfrastructureData[i]?.experience_month,
  //             experience_year:
  //               // @ts-ignore
  //               skillInfrastructureData[i]?.experience_year?.length > 0
  //                 ? skillInfrastructureData[i]?.experience_year
  //                 : 0,
  //             level: skillInfrastructureData[i]?.level,
  //           });
  //         }
  //       }
  //       const dataUpdate = {
  //         code_skills: [...paramSkillLanguageData, ...paramSkillFrameworkData, ...paramSkillInfrastructureData],
  //         upstream_process: skillRequest.upstream_process?.trim(),
  //         english_level: skillRequest.english_level,
  //         other_language_level: skillRequest.other_language_level?.trim(),
  //       };
  //       const skills = { skills: dataUpdate };
  //       const tags = { tags: inputTags };
  //       const res = await updateProfile({ ...profileRequest, ...tags, ...skills });

  //       setIsLoading(false);
  //       setTimeout(() => router.push("/my-profile"), 1000);
  //       return res.data;
  //     }
  //   }
  // };

  // submit profile image
  const submitUploadProfileImage = async (e) => {
    if (e.currentTarget.files[0].size > 2097152) {
      errorMessages.image_profile = VALIDATE_FORM_UPDATE_PROFILE.image_profile.max_size;
      setErrorValidates(errorMessages);
      return errorMessages;
    }
    if (
      e.currentTarget.files[0].type === "image/jpg" ||
      e.currentTarget.files[0].type === "image/png" ||
      e.currentTarget.files[0].type === "image/jpeg"
    ) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      // eslint-disable-next-line prefer-destructuring
      profileImgData.current = e.target.files[0];
      return;
    }
    errorMessages.image_profile = VALIDATE_FORM_UPDATE_PROFILE.image_profile.format;
    setErrorValidates(errorMessages);
    return errorMessages;
  };

  const submitFormProfile = async () => {
    if (handleValidateForm() && handleValidateFormSocial()) {
      setIsLoading(true);
      const paramSkillLanguageData = [];
      const paramSkillFrameworkData = [];
      const paramSkillInfrastructureData = [];
      if (inputTags.length === 0 || inputTags.length > 1) {
        setProfileRequest({
          ...profileRequest,
        });
        for (let i = 0; i < skillLanguageData.length; i++) {
          if (skillLanguageData[i]?.name?.trim()?.length > 0) {
            paramSkillLanguageData.push({
              category: skillLanguageData[i]?.category,
              name: skillLanguageData[i]?.name.trim(),
              experience_month: skillLanguageData[i]?.experience_month,
              experience_year:
                // @ts-ignore
                skillLanguageData[i]?.experience_year?.length > 0 ? skillLanguageData[i]?.experience_year : 0,
              level: skillLanguageData[i]?.level,
            });
          }
        }
        for (let i = 0; i < skillFrameworkData.length; i++) {
          if (skillFrameworkData[i]?.name?.trim()?.length > 0) {
            paramSkillFrameworkData.push({
              category: skillFrameworkData[i]?.category,
              name: skillFrameworkData[i]?.name.trim(),
              experience_month: skillFrameworkData[i]?.experience_month,
              experience_year:
                // @ts-ignore
                skillFrameworkData[i]?.experience_year?.length > 0 ? skillFrameworkData[i]?.experience_year : 0,
              level: skillFrameworkData[i]?.level,
            });
          }
        }
        for (let i = 0; i < skillInfrastructureData.length; i++) {
          if (skillInfrastructureData[i]?.name?.trim()?.length > 0) {
            paramSkillInfrastructureData.push({
              category: skillInfrastructureData[i]?.category,
              name: skillInfrastructureData[i]?.name.trim(),
              experience_month: skillInfrastructureData[i]?.experience_month,
              experience_year:
                // @ts-ignore
                skillInfrastructureData[i]?.experience_year?.length > 0
                  ? skillInfrastructureData[i]?.experience_year
                  : 0,
              level: skillInfrastructureData[i]?.level,
            });
          }
        }
        const dataUpdate = {
          code_skills: [...paramSkillLanguageData, ...paramSkillFrameworkData, ...paramSkillInfrastructureData],
          upstream_process: skillRequest.upstream_process?.trim(),
          english_level: skillRequest.english_level,
          other_language_level: skillRequest.other_language_level?.trim(),
        };
        const skills = { skills: dataUpdate };
        const tags = { tags: inputTags };
        const profileUpdateRes = updateProfile(
          { ...profileRequest, ...profileSocialRequest, ...tags, ...skills },
          false,
        ).then(() => {
          auth.username = profileSocialRequest.username;
        });
        let profileImgUpdateRes = Promise.resolve(null);
        if (profileImgData.current) {
          const formData = new FormData();
          formData.append("profile_image", profileImgData.current);
          profileImgUpdateRes = updateProfile(formData, false).then((res) => {
            auth.profile_image = res.profile_image;
          });
        }
        try {
          await Promise.all([profileUpdateRes, profileImgUpdateRes]);
        } catch (err) {
          toast.error(SERVER_ERROR);
          return;
        }
        dispatch({ type: actionTypes.UPDATE_PROFILE, payload: auth });
        setIsLoading(false);
        toast.success(UPDATE_PROFILE);
        router.push("/my-profile");
      }
    }
  };

  return (
    <React.Fragment>
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: () => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box
        sx={{
          "@media (max-width: 1350px)": {
            fontSize: 14,
            p: "80px 20px",
          },
          p: "80px 120px",
          // marginTop: { xs: "90px", lg: "0" },
          background: "#F4FDFF",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={12}
          xl={12}
          sx={{ position: { xs: "relative", lg: "unset", display: checkLoading ? "block" : "none" } }}
        >
          <Box
            sx={{
              background: { xs: "unset", lg: "#ffffff" },
              p: { xs: "70px 0 0 0", lg: "40px 80px 78px 80px" },
              m: { xs: "40px 0", lg: "0" },
              position: { xs: "unset", lg: "relative" },
            }}
          >
            <Box
              sx={{
                borderBottom: "2px solid #E6E6E6",
                mb: "63px",
                display: { xs: "block", lg: "flex" },
                background: { xs: "#fff", lg: "none" },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: { xs: "flex", lg: "block" },
                  justifyContent: "center",
                }}
              >
                <label htmlFor="avatar">
                  <Avatar
                    alt={username}
                    src={profileImage || "/assets/images/profile/avatar_2.png"}
                    sx={{
                      width: { xs: "80px", lg: "160px" },
                      height: { xs: "80px", lg: "160px" },
                      mt: { xs: "-40px", lg: "0" },
                      position: { xs: "relative", lg: "unset" },
                    }}
                  />
                  <Avatar
                    alt="camera"
                    src="/assets/images/icon/ic_camera.png"
                    sx={{
                      width: "80px",
                      height: "80px",
                      opacity: 0.6,
                      position: "absolute",
                      display: { xs: "block", lg: "none" },
                      cursor: "pointer",
                      background: "#00000082",
                      padding: "0.1em",
                      top: "-2em",

                      img: {
                        width: "30px",
                        height: "30px",
                        position: "relative",
                        top: "1.2em",
                        left: "1.2em",
                      },
                    }}
                  />
                  <Avatar
                    sx={{
                      bgcolor: { xs: "transparent", lg: theme.navy },
                      position: "absolute",
                      bottom: 50,
                      right: 10,
                      display: { xs: "none", lg: "flex" },
                    }}
                  >
                    <Avatar
                      alt="camera"
                      src="/assets/images/icon/ic_camera.png"
                      sx={{
                        width: "20px",
                        height: "18px",
                        m: "0 auto",
                        cursor: "pointer",
                      }}
                    />
                  </Avatar>
                  <input
                    id="avatar"
                    name="profile_image"
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    hidden
                    onChange={submitUploadProfileImage}
                  />
                </label>
                <BoxTextValidate sx={{ position: "absolute", bottom: 0 }}>
                  {errorValidates.image_profile}
                </BoxTextValidate>
              </Box>
              <Box sx={{ ml: "27px", mb: "9px", display: { xs: "none", lg: "block" } }}>
                <TypoProfile>{t("profile:name")}</TypoProfile>
                <TypoProfile>Twitter</TypoProfile>
                <TypoProfile>Facebook</TypoProfile>
                <TypoProfile>GitHub</TypoProfile>
              </Box>
              <Box sx={{ width: { xs: "100%", lg: "560px" }, p: { xs: "48px 12px 30px 12px", lg: "0 0 9px 27px" } }}>
                <TypoProfileMobile>{t("profile:name")}</TypoProfileMobile>
                <Box sx={{ mb: "12px" }}>
                  <Field
                    id="username"
                    placeholder="田中太郎"
                    onChangeValue={onChangeProfileSocialRequest}
                    error={errorValidates.username}
                    value={username}
                  />
                </Box>
                <TypoProfileMobile>Twitter</TypoProfileMobile>
                <Box sx={{ mb: "12px" }}>
                  <Field
                    id="twitter_url"
                    placeholder={t("profile:form.placeholder.twitter")}
                    onChangeValue={onChangeProfileSocialRequest}
                    value={twitterUrl}
                    error={errorValidates.twitter_url}
                  />
                </Box>
                <TypoProfileMobile>Facebook</TypoProfileMobile>
                <Box sx={{ mb: "12px" }}>
                  <Field
                    id="facebook_url"
                    placeholder={t("profile:form.placeholder.facebook")}
                    onChangeValue={onChangeProfileSocialRequest}
                    value={facebookUrl}
                    error={errorValidates.facebook_url}
                  />
                </Box>
                <TypoProfileMobile>GitHub</TypoProfileMobile>
                <Box>
                  <Field
                    id="github_url"
                    placeholder={t("profile:form.placeholder.github")}
                    onChangeValue={onChangeProfileSocialRequest}
                    value={githubUrl}
                    error={errorValidates.github_url}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  right: { xs: 0, lg: 22 },
                  top: { xs: "-35px", lg: "20px" },
                  width: { xs: "100%", lg: "96px" },
                }}
              >
                <Button
                  sx={{
                    background: theme.blue,
                    color: "#fff",
                    fontWeight: 700,
                    lineHeight: "23.17",
                    width: { xs: "100%", lg: "96px" },
                    height: { xs: "48px", lg: "40px" },
                    alignItems: "center",
                    borderRadius: { xs: "12px", lg: "4px" },
                    "&:hover": {
                      background: theme.blue,
                    },
                  }}
                  onClick={submitFormProfile}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {t("profile:form.save")}
                  </Typography>
                </Button>
              </Box>
            </Box>
            <Box sx={{ width: "100%" }}>
              <TabsUnstyled defaultValue={0}>
                <TabsList>
                  <Tab
                    sx={{ width: { xs: "169px", lg: "240px" }, height: { xs: "45.46px", lg: "56px" } }}
                    onClick={() => setIsSkillProfile(false)}
                  >
                    {t("profile:profile")}
                  </Tab>
                  <Tab
                    sx={{ width: { xs: "169px", lg: "240px" }, height: { xs: "45.46px", lg: "56px" } }}
                    onClick={() => setIsSkillProfile(true)}
                  >
                    {t("profile:skill")}
                  </Tab>
                </TabsList>
                <Box
                  sx={{
                    border: "2px solid #03BCDB",
                    background: "#fff",
                    p: { xs: "40px 12px", lg: "40px 28px" },
                    width: "100%",
                  }}
                >
                  <TabPanel value={0}>
                    <Box
                      sx={{
                        display: { xs: "block", lg: "flex" },
                        marginBottom: "35px",
                        color: "#1A2944",
                      }}
                    >
                      <TitleContentTab>{t("profile:status")}</TitleContentTab>
                      <ContentTab>
                        <FieldSelect
                          id="status"
                          options={MY_PROFILE_STATUS_OPTIONS}
                          onChangeValue={onChangeProfileRequest}
                          error={errorValidates.status}
                          value={status}
                        />
                      </ContentTab>
                    </Box>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:one-thing")}</TitleContentTab>
                      <ContentTab>
                        <Field
                          id="hitokoto"
                          placeholder={t("profile:form.placeholder.one-thing")}
                          onChangeValue={onChangeProfileRequest}
                          error={errorValidates.hitokoto}
                          value={hitokoto}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:self-introduction")}</TitleContentTab>
                      <ContentTab>
                        <FieldArea
                          id="self_description"
                          placeholder={t("profile:form.placeholder.self-introduction")}
                          minRows={5}
                          onChangeValue={onChangeProfileRequest}
                          error={errorValidates.self_description}
                          value={selfDescription}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:occupation")}</TitleContentTab>
                      <ContentTab>
                        <FieldSelect
                          id="job"
                          options={JOBS}
                          onChangeValue={onChangeProfileRequest}
                          error={errorValidates.job}
                          value={job}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:position")}</TitleContentTab>
                      <ContentTab>
                        <Field
                          id="job_position"
                          placeholder={t("profile:form.placeholder.position")}
                          onChangeValue={onChangeProfileRequest}
                          error={errorValidates.job_position}
                          value={jobPosition}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:employment-status")}</TitleContentTab>
                      <ContentTab>
                        <FieldSelect
                          id="employment_status"
                          options={EMPLOYEE_STATUS}
                          onChangeValue={onChangeProfileRequest}
                          error={errorValidates.employment_status}
                          value={employmentStatus}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:discussion-topic")}</TitleContentTab>
                      <ContentTab>
                        <FieldArea
                          id="discussion_topic"
                          placeholder={t("profile:form.placeholder.discussion-topic")}
                          minRows={5}
                          onChangeValue={onChangeProfileRequest}
                          error={errorValidates.discussion_topic}
                          value={discussionTopic}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:address")}</TitleContentTab>
                      <ContentTab>
                        <FieldSelect
                          id="address"
                          options={PROFILE_JAPAN_PROVINCE_OPTIONS}
                          onChangeValue={onChangeProfileRequest}
                          error={errorValidates.address}
                          value={address}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:tag")}</TitleContentTab>
                      <ContentTab>
                        <InputBase
                          className="input-search-tag"
                          id="input_search_tag"
                          onKeyPress={onKeyPress}
                          placeholder={t("profile:form.placeholder.tag")}
                          sx={{
                            flex: 1,
                            width: "100%",
                            borderRadius: "6px",
                            border:
                              tagDataValidate || (inputTags.length > 0 && inputTags.length < 2)
                                ? "solid 2px #FF9458"
                                : "none",
                            "& fieldset": {
                              border: "none",
                            },
                            "& .MuiInputBase-input": {
                              position: "relative",
                              backgroundColor: "#F4FDFF",
                              fontSize: 16,
                              padding: "9px 16px",
                              borderRadius: "6px",
                              fontFamily: "Noto Sans JP",
                              "@media (max-width: 1200px)": {
                                fontSize: 14,
                              },
                              "&:focus": {
                                boxShadow: `${theme.blue} 0 0 0 0.1rem`,
                                borderColor: theme.blue,
                              },
                            },
                          }}
                        />
                        {tagDataValidate && <BoxTextValidate>{t("profile:max_length_tag")}</BoxTextValidate>}
                        <Paper
                          sx={{
                            pl: 0,
                            mt: 1,
                            mb: 1,
                            display: inputTags.length ? "flex" : "none",
                            flexWrap: "wrap",
                            listStyle: "none",
                            boxShadow: "none",
                          }}
                          component="ul"
                        >
                          {inputTags.map((tag, index) => (
                            <ListItem key={index}>
                              <Box
                                sx={{
                                  padding: "8px",
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "white",
                                  height: "22px",
                                  backgroundColor: theme.blue,
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  mb: "2px",
                                }}
                                onClick={() => removeSearchTag(index)}
                              >
                                {tag}
                                <Box
                                  sx={{
                                    background: "#fff",
                                    marginLeft: "4px",
                                    borderRadius: "50%",
                                    padding: "2px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Avatar
                                    sx={{ width: "10px", height: "10px" }}
                                    src="/assets/images/svg/delete-x-white.svg"
                                  />
                                </Box>
                              </Box>
                            </ListItem>
                          ))}
                        </Paper>
                        {inputTags.length > 0 && inputTags.length < 2 && (
                          <BoxTextValidate>{t("profile:min_2_tag")}</BoxTextValidate>
                        )}
                      </ContentTab>
                    </BoxContentTab>
                  </TabPanel>
                  <TabPanel value={1}>
                    <Box
                      sx={{
                        display: { xs: "flex", lg: "none" },
                        justifyContent: "end",
                        alignItems: "center",
                        mb: "30px",
                      }}
                    >
                      <ImgStar src="/assets/images/star.png" />
                      <Typography sx={{ ml: "10px" }}>{t("profile:form.estimated-star")}</Typography>
                    </Box>
                    <BoxContentTab>
                      <TitleContentTab>
                        {t("profile:language")}
                        <BoxEstimatedStar>
                          <ImgStar src="/assets/images/star.png" />
                          <TypoxEstimatedStar>{t("profile:form.estimated-star")}</TypoxEstimatedStar>
                        </BoxEstimatedStar>
                      </TitleContentTab>
                      {/* Languge */}
                      <ContentTab>
                        {skillLanguageData.map((option, key) => (
                          <Box key={key} sx={{ mb: "15px" }}>
                            <Box sx={{ display: { xs: "block", lg: "flex" } }}>
                              <Box>
                                <InputCustom
                                  onChange={(e) => onChangeSkillLanguage(option.key, e)}
                                  name="name"
                                  placeholder={t("profile:form.placeholder.language")}
                                  sx={{ border: statusErrNameLanguage[key]?.status ? "solid 1px #FF9458" : "none" }}
                                  value={option.name}
                                />
                                {messSkillLanguageErr?.map((item, keyItem) =>
                                  item.key === `name_${option.key}` ? (
                                    <BoxTextValidate key={keyItem}>{item.mess}</BoxTextValidate>
                                  ) : null,
                                )}
                              </Box>
                              <Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    m: { xs: "18px 0", lg: "0 0 0 15px" },
                                  }}
                                >
                                  <Box sx={{ width: "80px" }}>
                                    <InputCustom
                                      onChange={(e) => onChangeSkillLanguage(option.key, e)}
                                      name="experience_year"
                                      placeholder={t("profile:form.placeholder.years-of-experience")}
                                      type="number"
                                      sx={{
                                        border: statusErrYearLanguage[key]?.status ? "solid 1px #FF9458" : "none",
                                      }}
                                      value={
                                        option.experience_year < 0 ? -option.experience_year : option.experience_year
                                      }
                                      onKeyPress={(e) => {
                                        if (
                                          (e.keyCode || e.which) === 45 ||
                                          (e.keyCode || e.which) === 45 ||
                                          // @ts-ignore
                                          option.experience_year?.length > 1
                                        ) {
                                          return e.preventDefault();
                                        }
                                      }}
                                    />
                                  </Box>
                                  <Typography fontSize={14} sx={{ m: "0 8px" }}>
                                    {t("profile:year")}
                                  </Typography>
                                  <SelectCustom
                                    id="outlined-select-month"
                                    onChange={(e) => onChangeSkillLanguage(option.key, e)}
                                    sx={{ width: { xs: "80px", lg: "80px" } }}
                                    name="experience_month"
                                    value={option.experience_month ?? monthLanguage}
                                  >
                                    {MONTHS.map((monthOption) => (
                                      <MenuItem key={monthOption.value} value={monthOption.value}>
                                        {monthOption.label}
                                      </MenuItem>
                                    ))}
                                  </SelectCustom>
                                  <Typography fontSize={14} sx={{ m: "0 8px", width: "30px" }}>
                                    {t("profile:month")}
                                  </Typography>
                                </Box>
                                {messSkillLanguageErr?.map((item, keyItem) =>
                                  item.key === `experience_year_${option.key}` ? (
                                    <BoxTextValidate key={keyItem}>{item.mess}</BoxTextValidate>
                                  ) : null,
                                )}
                              </Box>
                              <Box sx={{ display: "flex" }}>
                                <Box sx={{ width: { xs: "78%", lg: "241px" } }}>
                                  <SelectCustom
                                    id="outlined-select-level"
                                    value={option.level ?? levelLanguage}
                                    onChange={(e) => onChangeSkillLanguage(option.key, e)}
                                    sx={{ width: "100%" }}
                                    name="level"
                                  >
                                    {LEVELS.map((levelOption) => (
                                      <MenuItem key={levelOption.value} value={levelOption.value}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                          <ImgStarLevel countStar={levelOption.value} />
                                          <Box sx={{ ml: "7px" }}>{levelOption.label}</Box>
                                        </Box>
                                      </MenuItem>
                                    ))}
                                  </SelectCustom>
                                </Box>
                              </Box>
                              <Box>
                                <Box>
                                  <Button
                                    sx={{
                                      color: theme.gray,
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      lineHeight: "20.27px",
                                      display: skillLanguageData.length > 1 ? "block" : "none",
                                      height: "32px",
                                      p: 0,
                                    }}
                                    onClick={handleDeleteSkillLanguage(option)}
                                  >
                                    <Box
                                      sx={{
                                        height: "32px",
                                        width: "54px",
                                        borderRadius: "8px",
                                        background: { xs: "#E4E6EB", lg: "unset" },
                                        display: "flex",
                                        alignItems: "center",
                                        ml: "20px",
                                        p: "6px",
                                      }}
                                    >
                                      {t("profile:form.delete")}
                                    </Box>
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                        <Box>
                          <Button
                            sx={{
                              color: theme.blue,
                              fontSize: "14px",
                              fontWeight: 700,
                              lineHeight: "20.27px",
                            }}
                            onClick={addSkillLanguageClick(skillLanguageData[skillLanguageData.length - 1].key)}
                          >
                            {t("profile:form.to-add")}
                          </Button>
                        </Box>
                      </ContentTab>
                    </BoxContentTab>
                    {/* end language */}

                    {/* framwork */}
                    <BoxContentTab>
                      <TitleContentTab>
                        {t("profile:framework")}
                        <BoxEstimatedStar>
                          <ImgStar src="/assets/images/star.png" />
                          <TypoxEstimatedStar>{t("profile:form.estimated-star")}</TypoxEstimatedStar>
                        </BoxEstimatedStar>
                      </TitleContentTab>
                      <ContentTab>
                        {skillFrameworkData.map((option, key) => (
                          <Box key={key} sx={{ mb: "15px" }}>
                            <Box sx={{ display: { xs: "block", lg: "flex" } }}>
                              <Box>
                                <InputCustom
                                  onChange={(e) => onChangeSkillFramework(option.key, e)}
                                  name="name"
                                  placeholder={t("profile:form.placeholder.language")}
                                  sx={{
                                    border: statusErrNameFramework[key]?.status ? "solid 1px #FF9458" : "none",
                                  }}
                                  value={option.name}
                                />
                                {messSkillFrameworkErr?.map((item, keyItem) =>
                                  item.key === `name_${option.key}` ? (
                                    <BoxTextValidate key={keyItem}>{item.mess}</BoxTextValidate>
                                  ) : null,
                                )}
                              </Box>
                              <Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    m: { xs: "18px 0", lg: "0 0 0 15px" },
                                  }}
                                >
                                  <Box sx={{ width: "80px" }}>
                                    <InputCustom
                                      onChange={(e) => onChangeSkillFramework(option.key, e)}
                                      name="experience_year"
                                      placeholder={t("profile:form.placeholder.years-of-experience")}
                                      type="number"
                                      sx={{
                                        border: statusErrYearFramework[key]?.status ? "solid 1px #FF9458" : "none",
                                      }}
                                      value={
                                        option.experience_year < 0 ? -option.experience_year : option.experience_year
                                      }
                                      onKeyPress={(e) => {
                                        if (
                                          (e.keyCode || e.which) === 45 ||
                                          (e.keyCode || e.which) === 45 ||
                                          // @ts-ignore
                                          option.experience_year?.length > 1
                                        ) {
                                          return e.preventDefault();
                                        }
                                      }}
                                    />
                                  </Box>
                                  <Typography fontSize={14} sx={{ m: "0 8px" }}>
                                    {t("profile:year")}
                                  </Typography>
                                  <SelectCustom
                                    id="outlined-select-month"
                                    value={option.experience_month ?? monthLanguage}
                                    onChange={(e) => onChangeSkillFramework(option.key, e)}
                                    sx={{ width: { xs: "80px", lg: "80px" } }}
                                    name="experience_month"
                                  >
                                    {MONTHS.map((monthOption) => (
                                      <MenuItem key={monthOption.value} value={monthOption.value}>
                                        {monthOption.label}
                                      </MenuItem>
                                    ))}
                                  </SelectCustom>
                                  <Typography fontSize={14} sx={{ m: "0 8px" }}>
                                    {t("profile:month")}
                                  </Typography>
                                </Box>
                                {messSkillFrameworkErr?.map((item, keyItem) =>
                                  item.key === `experience_year_${option.key}` ? (
                                    <BoxTextValidate key={keyItem}>{item.mess}</BoxTextValidate>
                                  ) : null,
                                )}
                              </Box>
                              <Box sx={{ display: "flex" }}>
                                <Box sx={{ width: { xs: "78%", lg: "241px" } }}>
                                  <SelectCustom
                                    id="outlined-select-level"
                                    value={option.level ?? levelLanguage}
                                    onChange={(e) => onChangeSkillFramework(option.key, e)}
                                    sx={{ width: "100%" }}
                                    name="level"
                                  >
                                    {LEVELS.map((levelOption) => (
                                      <MenuItem key={levelOption.value} value={levelOption.value}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                          <ImgStarLevel countStar={levelOption.value} />
                                          <Box sx={{ ml: "7px" }}>{levelOption.label}</Box>
                                        </Box>
                                      </MenuItem>
                                    ))}
                                  </SelectCustom>
                                </Box>
                              </Box>
                              <Box>
                                <Box>
                                  <Button
                                    sx={{
                                      color: theme.gray,
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      lineHeight: "20.27px",
                                      display: skillFrameworkData.length > 1 ? "block" : "none",
                                      height: "32px",
                                      p: 0,
                                    }}
                                    onClick={handleDeleteSkillFramework(option)}
                                  >
                                    <Box
                                      sx={{
                                        height: "32px",
                                        width: "54px",
                                        borderRadius: "8px",
                                        background: { xs: "#E4E6EB", lg: "unset" },
                                        display: "flex",
                                        alignItems: "center",
                                        ml: "20px",
                                        p: "6px",
                                      }}
                                    >
                                      {t("profile:form.delete")}
                                    </Box>
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                        <Box>
                          <Button
                            sx={{
                              color: theme.blue,
                              fontSize: "14px",
                              fontWeight: 700,
                              lineHeight: "20.27px",
                            }}
                            onClick={addSkillFrameworkClick(skillFrameworkData[skillFrameworkData.length - 1].key)}
                          >
                            {t("profile:form.to-add")}
                          </Button>
                        </Box>
                      </ContentTab>
                    </BoxContentTab>

                    {/* end framwork */}
                    <BoxContentTab>
                      <TitleContentTab>
                        {t("profile:infrastructure")}
                        <BoxEstimatedStar>
                          <ImgStar src="/assets/images/star.png" />
                          <TypoxEstimatedStar>{t("profile:form.estimated-star")}</TypoxEstimatedStar>
                        </BoxEstimatedStar>
                      </TitleContentTab>
                      <ContentTab>
                        {skillInfrastructureData.map((option, key) => (
                          <Box key={key} sx={{ mb: "15px" }}>
                            <Box sx={{ display: { xs: "block", lg: "flex" } }}>
                              <Box>
                                <InputCustom
                                  onChange={(e) => onChangeSkillInfrastructure(option.key, e)}
                                  name="name"
                                  placeholder={t("profile:form.placeholder.language")}
                                  sx={{
                                    border: statusErrNameInfrastructure[key]?.status ? "solid 1px #FF9458" : "none",
                                  }}
                                  value={option.name}
                                />
                                {messSkillInfrastructureErr?.map((item, keyItem) =>
                                  item.key === `name_${option.key}` ? (
                                    <BoxTextValidate key={keyItem}>{item.mess}</BoxTextValidate>
                                  ) : null,
                                )}
                              </Box>
                              <Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    m: { xs: "18px 0", lg: "0 0 0 15px" },
                                  }}
                                >
                                  <Box sx={{ width: "80px" }}>
                                    <InputCustom
                                      onChange={(e) => onChangeSkillInfrastructure(option.key, e)}
                                      name="experience_year"
                                      placeholder={t("profile:form.placeholder.years-of-experience")}
                                      type="number"
                                      sx={{
                                        border: statusErrYearInfrastructure[key]?.status ? "solid 1px #FF9458" : "none",
                                      }}
                                      value={
                                        option.experience_year < 0 ? -option.experience_year : option.experience_year
                                      }
                                      onKeyPress={(e) => {
                                        if (
                                          (e.keyCode || e.which) === 45 ||
                                          (e.keyCode || e.which) === 45 ||
                                          // @ts-ignore
                                          option.experience_year?.length > 1
                                        ) {
                                          return e.preventDefault();
                                        }
                                      }}
                                    />
                                  </Box>
                                  <Typography fontSize={14} sx={{ m: "0 8px" }}>
                                    {t("profile:year")}
                                  </Typography>
                                  <SelectCustom
                                    id="outlined-select-month"
                                    value={option.experience_month ?? monthLanguage}
                                    onChange={(e) => onChangeSkillInfrastructure(option.key, e)}
                                    sx={{ width: { xs: "80px", lg: "80px" } }}
                                    name="experience_month"
                                  >
                                    {MONTHS.map((monthOption) => (
                                      <MenuItem key={monthOption.value} value={monthOption.value}>
                                        {monthOption.label}
                                      </MenuItem>
                                    ))}
                                  </SelectCustom>
                                  <Typography fontSize={14} sx={{ m: "0 8px" }}>
                                    {t("profile:month")}
                                  </Typography>
                                </Box>
                                {messSkillInfrastructureErr?.map((item, keyItem) =>
                                  item.key === `experience_year_${option.key}` ? (
                                    <BoxTextValidate key={keyItem}>{item.mess}</BoxTextValidate>
                                  ) : null,
                                )}
                              </Box>
                              <Box sx={{ display: "flex" }}>
                                <Box sx={{ width: { xs: "78%", lg: "241px" } }}>
                                  <SelectCustom
                                    id="outlined-select-level"
                                    value={option.level ?? levelLanguage}
                                    onChange={(e) => onChangeSkillInfrastructure(option.key, e)}
                                    sx={{ width: "100%" }}
                                    name="level"
                                  >
                                    {LEVELS.map((levelOption) => (
                                      <MenuItem key={levelOption.value} value={levelOption.value}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                          <ImgStarLevel countStar={levelOption.value} />
                                          <Box sx={{ ml: "7px" }}>{levelOption.label}</Box>
                                        </Box>
                                      </MenuItem>
                                    ))}
                                  </SelectCustom>
                                </Box>
                              </Box>
                              <Box>
                                <Box>
                                  <Button
                                    sx={{
                                      color: theme.gray,
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      lineHeight: "20.27px",
                                      display: skillInfrastructureData.length > 1 ? "block" : "none",
                                      height: "32px",
                                      p: 0,
                                    }}
                                    onClick={handleDeleteSkillInfrastructure(option)}
                                  >
                                    <Box
                                      sx={{
                                        height: "32px",
                                        width: "54px",
                                        borderRadius: "8px",
                                        background: { xs: "#E4E6EB", lg: "unset" },
                                        display: "flex",
                                        alignItems: "center",
                                        ml: "20px",
                                        p: "6px",
                                      }}
                                    >
                                      {t("profile:form.delete")}
                                    </Box>
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                        <Box>
                          <Button
                            sx={{
                              color: theme.blue,
                              fontSize: "14px",
                              fontWeight: 700,
                              lineHeight: "20.27px",
                            }}
                            onClick={addSkillInfrastructureClick(
                              skillInfrastructureData[skillInfrastructureData.length - 1].key,
                            )}
                          >
                            {t("profile:form.to-add")}
                          </Button>
                        </Box>
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:upstream-process")}</TitleContentTab>
                      <ContentTab>
                        <Field
                          id="upstream_process"
                          placeholder={t("profile:form.placeholder.upstream-process")}
                          onChangeValue={onChangeProfileSkillRequest}
                          error={errorValidates.upstream_process}
                          value={upstreamProcess}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:english-experience")}</TitleContentTab>
                      <ContentTab>
                        <FieldSelect
                          id="english_level"
                          options={ENGLISH_LEVEL_OPTIONS}
                          onChangeValue={onChangeProfileSkillRequest}
                          error={errorValidates.english_level}
                          value={englishLevel}
                        />
                      </ContentTab>
                    </BoxContentTab>
                    <BoxContentTab>
                      <TitleContentTab>{t("profile:language-experience")}</TitleContentTab>
                      <ContentTab>
                        <FieldArea
                          id="other_language_level"
                          placeholder={t("profile:form.placeholder.language-experience")}
                          onChangeValue={onChangeProfileSkillRequest}
                          error={errorValidates.other_language_level}
                          minRows={5}
                          value={otherLanguageLevel}
                        />
                      </ContentTab>
                    </BoxContentTab>
                  </TabPanel>
                </Box>
              </TabsUnstyled>
            </Box>
            <Box sx={{ mt: "53px", textAlign: "center" }}>
              <Button
                sx={{
                  background: theme.blue,
                  borderRadius: "28px",
                  width: "240px",
                  "&:hover": {
                    background: theme.blue,
                  },
                }}
                onClick={submitFormProfile}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {t("profile:form.save")}
                </Typography>
              </Button>
              <Box sx={{ mt: "40px" }}>
                <Link href="/my-profile" sx={{ color: theme.blue, textDecoration: "none" }}>
                  編集をやめる
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default ProfileSkillComponent;
