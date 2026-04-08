import { Nullable } from "@/commons/types/common";
import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TAccessAdminFilter = TFilterParams;

export type TAccessAdmin = {
  user_id: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  foto: string;
  role: string;
  created_by: string;
};

export type TAccessAdminRequest = Omit<TAccessAdmin, "created_by" | "user_id"> & {};

export type TDetailAccessAdminResponse = TResponse<Nullable<TAccessAdmin>>;
export type TListAccessAdminResponse = TResponsePaginate<TAccessAdmin>;
