import { Nullable } from "@/commons/types/common";
import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";
import { TFacilities } from "../facilities/type";

export type TWeddingPackagesFilter = TFilterParams;

export type TWeddingPackages = {
  package_id: string;
  package_name: string;
  package_type: string;
  package_facilities: TFacilities[];
};

export type TWeddingPackagesRequest = {
  package_name: string;
  package_type: string;
  package_facilities: string[];
};

export type TDetailWeddingPackagesResponse = TResponse<Nullable<TWeddingPackages>>;
export type TListWeddingPackagesResponse = TResponsePaginate<TWeddingPackages>;
