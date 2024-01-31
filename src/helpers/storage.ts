import { parseCookies, setCookie } from "nookies";
import cookie from "cookie";

export const USER_TOKEN = "USER_TOKEN";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const EXPIRES_IN = "EXPIRES_IN";
export const IS_PROFILE_EDITED = "IS_PROFILE_EDITED";
export const TRIGGER_REFRESH = "TRIGGER_REFRESH";

export const setItem = (key: string, value: any) => {
  setCookie(null, key, value, {
    path: "/",
  });
};

export const getItem = (key: string) => {
  const cookieStorage = parseCookies(cookie);
  return cookieStorage[key] ?? "";
};

export const setToken = (value: string, expiresIn?: number) => {
  setItem(USER_TOKEN, value);
  if (expiresIn !== undefined) {
    setItem(EXPIRES_IN, expiresIn);
  }
};

export const setRefreshToken = (value: string) => {
  setItem(TRIGGER_REFRESH, "true");
  setItem(REFRESH_TOKEN, value);
};

export const setIsProfileEdited = (value: string) => {
  setItem(IS_PROFILE_EDITED, value);
};

export const clearToken = () => setToken("");

export const getToken = () => getItem(USER_TOKEN);

export const getRefreshToken = () => getItem(REFRESH_TOKEN);
export const getIsProfileEdited = () => getItem(IS_PROFILE_EDITED);

export const getExpireIn = () => getItem(EXPIRES_IN);
