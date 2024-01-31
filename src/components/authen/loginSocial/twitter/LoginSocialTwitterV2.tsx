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
import base64 from "base-64";

import { IResolveParams, objectType, TypeCrossFunction } from "..";

interface Props {
  state?: string;
  scope?: string;
  client_id: string;
  className?: string;
  redirect_uri: string;
  client_secret: string;
  children?: React.ReactNode;
  onLoginStart?: () => void;
  onLogoutSuccess?: () => void;
  onReject: (reject: string | objectType) => void;
  onResolve: ({ provider, data }: IResolveParams) => void;
}

const TWITTER_URL: string = "https://twitter.com";
const TWITTER_API_URL: string = "https://api.twitter.com/";
const PREVENT_CORS_URL: string = "https://cors.bridged.cc";

export const LoginSocialTwitterV2 = forwardRef(
  (
    {
      state = "",
      scope = "repo,gist",
      client_id,
      client_secret,
      className = "",
      redirect_uri,
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
      if (stateItem === "state" && code) {
        localStorage.setItem("twitter", code);
        window.close();
      }
    }, []);

    const getAccessToken = useCallback(
      (code: string) => {
        const params = {
          code,
          grant_type: "authorization_code",
          client_id: process.env.NEXT_PUBLIC_TWITTER_API_KEY,
          redirect_uri,
          code_verifier: "challenge",
        };
        const headers = new Headers();
        headers.append(
          "Authorization",
          `Basic ${base64.encode(
            `${process.env.NEXT_PUBLIC_TWITTER_API_KEY}:${process.env.NEXT_PUBLIC_TWITTER_API_KEY_SECRET}`,
          )}`,
        );
        headers.append("x-cors-grida-api-key", "875c0462-6309-4ddf-9889-5227b1acc82c");

        fetch(`${PREVENT_CORS_URL}/${TWITTER_API_URL}2/oauth2/token`, {
          method: "POST",
          headers,
          body: new URLSearchParams(params),
        })
          .then((response) => response.json())
          .then((response) => {
            setIsProcessing(false);
            if (response.access_token) {
              setIsLogged(true);
              onResolve({ provider: "twitter/v2", data: { credentials: { ...response } } });
            } else onReject("no data");
          })
          .catch((err) => {
            setIsProcessing(false);
            onReject(err);
          });
      },
      [client_id, client_secret, onReject, redirect_uri, state],
    );

    const handlePostMessage = useCallback(
      async ({ type, code, provider }) => type === "code" && provider === "twitter/v2" && code && getAccessToken(code),
      [getAccessToken],
    );
    const onChangeLocalStorage = useCallback(() => {
      // window.removeEventListener("storage", onChangeLocalStorage, false);
      const code = localStorage.getItem("twitter");
      setIsProcessing(true);
      handlePostMessage({ provider: "twitter/v2", type: "code", code });
      localStorage.removeItem("twitter");
    }, [handlePostMessage]);

    const onLogin = useCallback(() => {
      if (!isProcessing) {
        onLoginStart && onLoginStart();
        window.addEventListener("storage", onChangeLocalStorage, false);
        const oauthUrl = `${TWITTER_URL}/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL_REGISTER}&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain`;
        const width = 450;
        const height = 730;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          oauthUrl,
          "test",
          `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`,
        );
      }
    }, [isProcessing, onLoginStart, onChangeLocalStorage, client_id, scope, state, redirect_uri]);

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

export default memo(LoginSocialTwitterV2);
