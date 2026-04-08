import { TUserItem } from "../user/type";

export type TLoginParam = {
  user: string;
  password: string;
};

export type TLoginResponse = {
  data: {
    access_token: string;
    refresh_token: string;
    user: TUserItem;
  };
};

export type TLoginOidcParam = {
  code: string;
};

export type TLoginOidcResponse = {
  data: {
    access_token: string;
    refresh_token: string;
    user: TUserItem;
  };
};
