/* eslint-disable import/prefer-default-export */
import { api, apiAuth, setToken } from "src/helpers/api";
import { setIsProfileEdited, setRefreshToken } from "src/helpers/storage";

type TwitterAccessToken = {
  oauth_token: string;
  oauth_verifier: string;
  oauth_token_secret: string;
};

interface AuthCredentials<T> {
  credentials: T;
}

type OauthCredentials = AuthCredentials<{ access_token: string }>;
type TwitterV1Credentails = AuthCredentials<TwitterAccessToken>;

export const getAuthUrlTwitter = async (redirectUrl: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/twitter/v1/authorize`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callback_url: redirectUrl,
      }),
    });
    const response = await res.json();
    return response.data;
  } catch (error) {
    return null;
  }
};
export const authWithProvider = async (provider: string, credentials: OauthCredentials | TwitterV1Credentails) => {
  try {
    const res = await apiAuth.post(`/auth/${provider}`, credentials);
    if (res?.data?.access_token) {
      setToken(res?.data?.access_token, res?.data?.access_token_expires_in_seconds);
      setRefreshToken(res?.data?.refresh_token);
      setIsProfileEdited(res?.data?.user?.is_profile_edited);
    }
    return res;
  } catch (error) {
    return error;
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    setToken("");
    setIsProfileEdited("");
    return res;
  } catch (error) {
    return error;
  }
};

export const updateProfile = async (dataUpdate: any) => {
  try {
    const res = await api.patch("/user/profile", dataUpdate);
    return res;
  } catch (error) {
    return error;
  }
};
