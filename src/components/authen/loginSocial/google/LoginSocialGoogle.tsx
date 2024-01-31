import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import React, { FC } from "react";

import { IResolveParams } from "..";

type Props = {
  // eslint-disable-next-line no-unused-vars
  onSuccess: (response: IResolveParams<any>) => void;
  // eslint-disable-next-line no-unused-vars
  onError: (err: unknown) => void;
  redirectUrl: string;
};

const GoogleLogin: FC<Props> = ({ onSuccess, onError, redirectUrl, children }) => {
  const loginGoogle = useGoogleLogin({
    onSuccess: (credentials: any) => onSuccess({ provider: "google", data: { credentials } }),
    onError,
    redirect_uri: redirectUrl,
  });

  return <div onClick={loginGoogle}>{children}</div>;
};

type WrapperProps = Props & {
  clientId: string;
};

const LoginSocialGoogle: FC<WrapperProps> = ({ onSuccess, onError, redirectUrl, clientId, children }) => (
  <GoogleOAuthProvider clientId={clientId}>
    <GoogleLogin onSuccess={onSuccess} onError={onError} redirectUrl={redirectUrl}>
      {children}
    </GoogleLogin>
  </GoogleOAuthProvider>
);

export default LoginSocialGoogle;
