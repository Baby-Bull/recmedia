/* eslint-disable no-underscore-dangle */
import axios from "axios";
import { toast } from "react-toastify";

import { FORBIDDEN, NOT_FOUND, SERVER_ERROR } from "src/messages/notification";

import {
  setToken as setTokenStorage,
  getToken as getTokenStorage,
  setRefreshToken,
  getToken,
  getRefreshToken,
} from "./storage";

let fetchTokenPromise = Promise.resolve(null);
let isFetchingToken = false;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

export const apiAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

export const setApiAuth = (token: string) => {
  fetchTokenPromise = Promise.resolve(token);
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
};

export function setToken(token: string, expiresIn?: number) {
  setTokenStorage(token, expiresIn ?? null);
  setApiAuth(token);
}

export const fetchToken = async ({ accessToken, refreshToken }) => {
  if (!isFetchingToken) {
    isFetchingToken = true;
    fetchTokenPromise = apiAuth
      .post("/auth/tokens", { access_token: accessToken, refresh_token: refreshToken })
      .then(({ data }) => {
        const {
          access_token: accessToken,
          access_token_expires_in_seconds: accessTokenExpiresInSeconds,
          refresh_token: refreshToken,
        } = data;
        setToken(accessToken, accessTokenExpiresInSeconds);
        setRefreshToken(refreshToken);
        isFetchingToken = false;
        return accessToken;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  return fetchTokenPromise;
};

apiAuth.interceptors.response.use(
  (response) => response.data,
  async (err: any) => {
    if (err.response.status === 422 || err.response.status === 401) {
      setToken("", null);
      setRefreshToken("");
      if (typeof window !== "undefined") {
        window.location.href = `/login?oldUrl=${window.location.pathname}`;
      }
    }
    Promise.reject(err);
  },
);

api.interceptors.request.use(
  async (config) => {
    const accessToken = getToken();
    const refreshToken = getRefreshToken();
    let token = await fetchTokenPromise;
    if (!token && accessToken && refreshToken) {
      token = await fetchToken({ accessToken, refreshToken });
    }
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (err: any) => {
    if (err.response.status === 403) {
      toast.warning(FORBIDDEN);
      window.location.href = "/";
    }

    if (err.response.status === 404) {
      toast.warning(NOT_FOUND);
      window.location.href = "/";
    }

    if (err.response.status === 422) {
      if (!err?.response?.data?.message?.email && !err.response.data?.message?.access_token) {
        toast.error(SERVER_ERROR);
      }
    }

    const originalRequest = err.config;
    if (originalRequest.url !== "/auth/tokens") {
      if (err.response.status === 401 && typeof window !== "undefined") {
        // only refresh on client
        const accessToken = getToken();
        const refreshToken = getRefreshToken();
        if (accessToken && refreshToken) {
          const token = await fetchToken({
            accessToken,
            refreshToken,
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest).then((result) => ({ data: result }));
        }
        setToken("", null);
        setRefreshToken("");
        if (typeof window !== "undefined") {
          window.location.href = `/login?oldUrl=${window.location.pathname}`;
        }
      }
    }
    return Promise.reject(err);
  },
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => ({
    data: error.response.data,
    statusCode: error.response.status,
  }),
);

setApiAuth(getTokenStorage());
