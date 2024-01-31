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

import { getAuthUrlTwitter } from "src/services/auth";

import { IResolveParams, objectType, TypeCrossFunction } from "..";

interface Props {
  state?: string;
  scope?: string;
  className?: string;
  redirect_uri: string;
  children?: React.ReactNode;
  onLoginStart?: () => void;
  onLogoutSuccess?: () => void;
  onReject: (reject: string | objectType) => void;
  onResolve: ({ provider, data }: IResolveParams) => void;
}

type TwitterAuthData = {
  oauth_token: string;
  oauth_verifier: string;
};

export const LoginSocialTwitterV1 = forwardRef(
  (
    {
      state = "",
      scope = "",
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
    const twitterCredentials = useRef(null);

    useEffect(() => {
      const popupWindowURL = new URL(window.location.href);
      const oauthToken = popupWindowURL.searchParams.get("oauth_token");
      const oauthVerifier = popupWindowURL.searchParams.get("oauth_verifier");
      const isPopupWindow = window.opener;
      if (isPopupWindow && oauthVerifier && oauthToken) {
        window.opener.postMessage({
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier,
        });
        window.close();
      }
    }, []);

    const getAccessToken = ({ oauth_token, oauth_verifier, oauth_token_secret }) => {
      setIsProcessing(false);
      setIsLogged(true);
      onResolve({
        provider: "twitter/v1",
        data: {
          credentials: {
            oauth_token,
            oauth_verifier,
            oauth_token_secret,
          },
        },
      });
    };

    const handlePostMessage = async ({ type, code, provider }) =>
      type === "code" && provider === "twitter/v1" && code && getAccessToken(code);

    // add parent - child window communication event
    useEffect(() => {
      // if this window is the parent and there is cached twitter credentials
      if (window.opener === null) {
        const eventHandler = (event) => {
          const twitterAuthData = event.data as TwitterAuthData;
          if (twitterCredentials.current && twitterAuthData.oauth_verifier && twitterAuthData.oauth_token) {
            setIsProcessing(true);
            handlePostMessage({
              provider: "twitter/v1",
              type: "code",
              code: {
                ...twitterCredentials.current,
                ...twitterAuthData,
              },
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
        const width = 450;
        const height = 730;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const twitterPopup = window.open(
          "",
          "Twitter",
          `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`,
        ); // fix bug on safari, window.open must not be in async function
        getAuthUrlTwitter(redirect_uri)
          .then((authLinks) => {
            twitterCredentials.current = {
              oauth_token: authLinks.oauth_token,
              oauth_token_secret: authLinks.oauth_token_secret,
            };
            twitterPopup.location = authLinks.url;
          })
          .catch((err) => {
            twitterPopup.close();
            onReject(err);
          });
      }
    }, [isProcessing, onLoginStart, onReject, scope, state, redirect_uri]);

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

export default memo(LoginSocialTwitterV1);
