import { Nullable } from "@/commons/types/common";
import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TVendorFilter = TFilterParams;

export type TVendorType = {
  id: string;
  name: string;
};

export type TVendor = {
  vendor_id: string;
  name: string;
  type: TVendorType;
  logo: string;
  description: string;
  total_booking: number;
  created_by: string;
};

export type TVendorRequest = Omit<TVendor, "created_by" | "vendor_id"> & {};

export type TDetailVendorResponse = TResponse<Nullable<TVendor>>;
export type TListVendorResponse = TResponsePaginate<TVendor>;
