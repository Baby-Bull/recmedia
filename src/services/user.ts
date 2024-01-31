import { toast } from "react-toastify";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { api } from "src/helpers/api";
import {
  USER_REPORT,
  USER_REVIEW,
  SETTING_EMAIL,
  SERVER_ERROR,
  SETTING_NOTIFICATION,
  UPDATE_PROFILE,
  EMAIL_EXISTS,
} from "src/messages/notification";
import { typeTimeLogin, typeReview } from "src/constants/searchUserConstants";

import { setIsProfileEdited } from "../helpers/storage";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("ja");

export const getUserFavorite = async (limit: number, cursor: string) => {
  try {
    const res = await api.get(`/user/favorite?limit=${limit}&cursor=${cursor}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUserStatics = async () => {
  try {
    const res = await api.get(`/user/stats`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getUserFavoriteTags = async (limit: number, cursor: string = "") => {
  try {
    const res = await api.get(`/user/favorite/tag-users?limit=${limit}&cursor=${cursor}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getUserProvince = async (limit: number, cursor: string = "") => {
  try {
    const res = await api.get(`/user/province-users?limit=${limit}&cursor=${cursor}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getUserNewMembers = async (limit: number, cursor: string = "") => {
  try {
    const res = await api.get(`/user/members-new?limit=${limit}&cursor=${cursor}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getUserRecentlyLogin = async (limit: number, cursor: string = "") => {
  try {
    const res = await api.get(`/user/logged-in?limit=${limit}&cursor=${cursor}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const addUserFavorite = async (userId: string) => {
  try {
    const res = await api.post(`/user/favorite/${userId}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteUserFavorite = async (userId: string) => {
  try {
    const res = await api.delete(`/user/favorite/${userId}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const userReport = async (userId: string, body: object) => {
  try {
    const res = await api.post(`/user/${userId}/report`, body);
    if (res.data.error_code) {
      toast.error(res.data.message);
    } else {
      toast.success(USER_REPORT);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const userReview = async (userId: string, body: object) => {
  try {
    const res = await api.post(`/user/${userId}/review`, body);
    if (res.data.error_code) {
      toast.error(res.data.message);
    } else {
      toast.success(USER_REVIEW);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const userSettingEmail = async (body: any) => {
  try {
    const res = await api.patch("/user/email", body);
    if (!res.data) {
      toast.error(SERVER_ERROR);
    } else if (res?.data?.error_code === "422") {
      toast.error(EMAIL_EXISTS);
    } else {
      toast.success(SETTING_EMAIL);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const userSettingNotification = async (body: any) => {
  try {
    const res = await api.patch("/user/setting", body);
    if (!res.data) {
      toast.error(SERVER_ERROR);
    } else {
      toast.success(SETTING_NOTIFICATION);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

// @ts-ignore
export const UserSearch = async (
  params?: any,
  inputTags?: any,
  fullText?: string | string[],
  isSort?: string,
  limit?: number,
  cursor: string = "",
) => {
  let query = `/user/search?limit=${limit}&cursor=${cursor}`;
  // Query full text
  query += fullText ? `&fulltext=${fullText}` : "";
  // Query job
  query += params?.job ? `&job=${params?.job}` : "";
  // Query employment status

  query += params?.employeeStatus ? `&employment_status=${params?.employeeStatus}` : "";
  // Query status
  query += params?.statusCanTalk ? `&status[]=can-talk` : "";
  query += params?.statusLookingForFriend ? `&status[]=looking-for-friend` : "";
  query += params?.statusNeedConsult ? `&status[]=need-consult` : "";

  // Query last login
  query += params?.lastLogin === typeTimeLogin.login ? `&is_online=true` : "";

  query +=
    params?.lastLogin === typeTimeLogin.one_hour
      ? `&last_login[]=${dayjs().subtract(1, "hours").toISOString()}&last_login[]=${dayjs().toISOString()}`
      : "";

  query +=
    params?.lastLogin === typeTimeLogin.one_day
      ? `&last_login[]=${dayjs().subtract(1, "days").toISOString()}&last_login[]=${dayjs().toISOString()}`
      : "";

  query +=
    params?.lastLogin === typeTimeLogin.on_day_to_week
      ? `&last_login[]=${dayjs().subtract(1, "weeks").toISOString()}&last_login[]=${dayjs()
          .subtract(1, "days")
          .toISOString()}`
      : "";

  query +=
    params?.lastLogin === typeTimeLogin.week_to_two_week
      ? `&last_login[]=${dayjs().subtract(2, "weeks").toISOString()}&last_login[]=${dayjs()
          .subtract(1, "weeks")
          .toISOString()}`
      : "";

  query +=
    params?.lastLogin === typeTimeLogin.two_week_to_month
      ? `&last_login[]=${dayjs().subtract(1, "months").toISOString()}&last_login[]=${dayjs()
          .subtract(2, "weeks")
          .toISOString()}`
      : "";

  query +=
    params?.lastLogin === typeTimeLogin.month_or_than
      ? `&last_login[]=&last_login[]=${dayjs().subtract(1, "months").toISOString()}`
      : "";
  // Query count review
  query += params?.review === typeReview.no_0 ? `&review_count[]=1&review_count[]=` : "";
  query += params?.review === typeReview.less_than_10 ? `&review_count[]=0&review_count[]=10` : "";
  query += params?.review === typeReview.from_11_to_50 ? `&review_count[]=11&review_count[]=50` : "";
  query += params?.review === typeReview.from_51_to_100 ? `&review_count[]=51&review_count[]=100` : "";
  query += params?.review === typeReview.more_than_100 ? `&review_count[]=101&review_count[]=` : "";
  // Sort
  query += isSort ? `&sort_order=${isSort}` : "";
  // query input tag
  for (let i = 0; i < inputTags.length; i++) {
    query += `&tags[]=${inputTags[i]}`;
  }

  try {
    const res = await api.get(query);
    if (!res.data) {
      toast.error(SERVER_ERROR);
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getOrtherUserProfile = async (userId: string | string[]) => {
  try {
    const res = await api.get(`/user/${userId}/profile`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getUserCommunites = async (
  userId: string | string[],
  limit: number | null = null,
  cursor: string = null,
) => {
  try {
    const queryString = new URLSearchParams({
      ...(limit ? { limit: `${limit}` } : {}),
      ...(cursor ? { cursor } : {}),
    }).toString();
    const res = await api.get(`/user/${userId}/communities?${queryString}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getUserRecommended = async (limit: number, cursor: string = "") => {
  try {
    const queryString = new URLSearchParams({
      ...(limit ? { limit: `${limit}` } : {}),
      ...(cursor ? { cursor } : {}),
    }).toString();
    const res = await api.get(`/user/recommended-users/?${queryString}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getUserReviews = async (userId: string | string[], limit: number | null = null, cursor: string = null) => {
  try {
    const queryString = new URLSearchParams({
      ...(limit ? { limit: `${limit}` } : {}),
      ...(cursor ? { cursor } : {}),
    }).toString();
    const res = await api.get(`/user/${userId}/reviews?${queryString}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getUserProfile = async () => {
  try {
    const res = await api.get(`/user/profile`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const updateProfile = async (body: any, showToast = true) => {
  toast.configure();
  try {
    const res = await api.patch(`/user/profile`, body);
    if (!res.data) {
      toast.error(SERVER_ERROR);
    } else if (res?.data?.message?.email[0]?.message === "email is not unique") {
      toast.error(EMAIL_EXISTS);
    } else {
      setIsProfileEdited("true");
      if (showToast) {
        toast.success(UPDATE_PROFILE);
      }
    }
    return res.data;
  } catch (error) {
    toast.error(SERVER_ERROR);
    return error;
  }
};

export const getListnotifications = async (limit: number, cursor: string) => {
  try {
    const queryString = new URLSearchParams({
      ...(limit ? { limit: `${limit}` } : {}),
      ...(cursor ? { cursor } : {}),
    }).toString();
    const res = await api.get(`/user/notifications?${queryString}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const readAllNotifications = async () => {
  try {
    await api.patch(`/user/notifications/read`);
  } catch (error) {
    return error;
  }
};

export const readNotification = async (notificationId: string) => {
  try {
    await api.patch(`/user/notifications/${notificationId}/read`);
  } catch (error) {
    return error;
  }
};

export const readMessagePersonal = async (userId: string) => {
  try {
    await api.post(`/user/${userId}/messages/read`);
  } catch (error) {
    return error;
  }
};

export const readMessageCommunity = async (communityId: string) => {
  try {
    await api.post(`user/communities/chat-rooms/${communityId}/messages/read`);
  } catch (error) {
    return error;
  }
};
