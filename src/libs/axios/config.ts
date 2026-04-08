import { AxiosRequestConfig } from "axios";

import { SessionToken } from "../cookies";
import { env } from "../env";

export const axiosConfig: AxiosRequestConfig = {
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${SessionToken.get()?.access_token}`,
  },
  paramsSerializer: (params) => {
    const queryString = Object.entries(params || {})
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((val) => `${key}=${encodeURIComponent(val)}`).join("&");
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");
    return queryString;
  },
};
