import { Nullable } from "@/commons/types/common";
import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TTransactionFilter = TFilterParams;

export type TTransactionStatus = "cancel" | "success" | "pending";

export type TTransacion = {
  booking_id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  booking_date: string;
  total_price: string;
  status: TTransactionStatus;
  created_by: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
};

export type TTransactionRequest = Omit<TTransacion, "booking_id" | "created_by" | "status"> & {
  status: string;
};

export type TDetailTransactionResponse = TResponse<Nullable<TTransacion>>;
export type TListTransactionResponse = TResponsePaginate<TTransacion>;
