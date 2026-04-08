import { Nullable } from "@/commons/types/common";
import { TResponse } from "@/commons/types/response";

export type TContact = {
  name: string;
  phone: string;
  wa: string;
  email: string;
  address: string;
};

export type TContactRequest = TContact;

export type TDetailContactResponse = TResponse<Nullable<TContact>>;
