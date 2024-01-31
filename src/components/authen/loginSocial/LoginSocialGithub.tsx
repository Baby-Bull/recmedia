/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/**
 *
 * LoginSocialGithub
 *
 */
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

import { IResolveParams, objectType, TypeCrossFunction } from ".";

interface Props {
  state?: string;
  scope?: string;
  client_id: string;
  className?: string;
  redirect_uri: string;
  client_secret: string;
  allow_signup?: boolean;
  children?: React.ReactNode;
  onLoginStart?: () => void;
  onLogoutSuccess?: () => void;
  onReject: (reject: string | objectType) => void;
  onResolve: ({ provider, data }: IResolveParams) => void;
}

type GithubAuthData = {
  code: string;
  provider: "github";
};

const GITHUB_URL: string = "https://github.com";
const GITHUB_API_URL: string = "https://api.github.com/";
const PREVENT_CORS_URL: string = "https://cors.bridged.cc";

export const LoginSocialGithub = forwardRef(
  (
    {
      state = "",
      scope = "user:email",
      client_id,
      client_secret,
      className = "",
      redirect_uri,
      allow_signup = false,
      children,
      onReject,
      onResolve,
      onLoginStart,
      onLogoutSuccess,
    }: Props,
    ref: React.Ref<TypeCrossFunction>,
  ) => {
    const [isLogged, setIsLogged] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
      const popupWindowURL = new URL(window.location.href);
      const code = popupWindowURL.searchParams.get("code");
      const stateItem = popupWindowURL.searchParams.get("state");
      const isPopupWindow = window.opener;
      if (isPopupWindow && stateItem?.includes("_github") && code) {
        window.opener.postMessage({
          code,
          provider: "github",
        });
        window.close();
      }
    }, []);

    const getAccessToken = useCallback(
      (code: string) => {
        const params = {
          code,
          state,
          redirect_uri,
          client_id,
          client_secret,
        };
        const headers = new Headers({
          "Content-Type": "application/x-www-form-urlencoded",
          "x-cors-grida-api-key": "875c0462-6309-4ddf-9889-5227b1acc82c",
          Accept: "application/json",
        });

        fetch(`${PREVENT_CORS_URL}/${GITHUB_URL}/login/oauth/access_token`, {
          method: "POST",
          headers,
          body: new URLSearchParams(params),
        })
          .then((response) => response.json())
          .then((response) => {
            setIsProcessing(false);
            if (response.access_token) {
              setIsLogged(true);
              setIsProcessing(false);
              onResolve({ provider: "github", data: { credentials: response } });
            } else {
              setIsProcessing(false);
              onReject("no data");
            }
          })
          .catch((err) => {
            setIsProcessing(false);
            onReject(err);
          });
      },
      [client_id, client_secret, onReject, redirect_uri, state],
    );

    const handlePostMessage = useCallback(
      async ({ type, code, provider }) => type === "code" && provider === "github" && code && getAccessToken(code),
      [getAccessToken],
    );

    // add parent - child window communication event
    useEffect(() => {
      // if this window is the parent and there is cached twitter credentials
      if (window.opener === null) {
        const eventHandler = (event) => {
          const githubAuthData = event.data as GithubAuthData;
          if (githubAuthData?.code && githubAuthData.provider === "github") {
            setIsProcessing(true);
            handlePostMessage({
              provider: "github",
              type: "code",
              code: githubAuthData.code,
            });
          }
        };
        window.addEventListener("message", eventHandler);
        return () => window.removeEventListener("message", eventHandler);
      }
    }, []);

    const onLogin = useCallback(() => {
      if (!isProcessing) {
        onLoginStart && onLoginStart();
        const oauthUrl = `${GITHUB_URL}/login/oauth/authorize?client_id=${client_id}&scope=${scope}&state=${`${state}_github`}&redirect_uri=${redirect_uri}&allow_signup=${allow_signup}`;
        const width = 450;
        const height = 730;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          oauthUrl,
          "Github",
          `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`,
        );
      }
    }, [isProcessing, onLoginStart, client_id, scope, state, redirect_uri, allow_signup]);

    useImperativeHandle(ref, () => ({
      onLogout: () => {
        if (isLogged) {
          setIsLogged(false);
          onLogoutSuccess && onLogoutSuccess();
        } else {
          console.log("You must login before logout.");
        }
      },
    }));

    return (
      <div className={className} onClick={onLogin}>
        {children}
      </div>
    );
  },
);

export default memo(LoginSocialGithub);
