export type objectType = {
  [key: string]: any;
};

export type IResolveParams<T = objectType> = {
  provider: string;
  data?: T;
};

export type TypeCrossFunction = {
  onLogout: () => void;
};

export { default as LoginSocialGithub } from "./LoginSocialGithub";
export { default as LoginSocialTwitterV1 } from "./twitter/LoginSocialTwitterV1";
export { default as LoginSocialTwitterV2 } from "./twitter/LoginSocialTwitterV2";
