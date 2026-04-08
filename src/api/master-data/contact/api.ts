import { api } from "@/libs/axios/api";

import { TContactRequest, TDetailContactResponse } from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
  detail: "/master-data/contact",
  edit: "/master-data/contact/update",
};

export const getDetailContact = async (): Promise<TDetailContactResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: {
      name: "Ayam Tentrem",
      phone: "021 - 345 - 567",
      wa: "082212344321",
      email: "johndoe@gmail.com",
      address: "Jalan Waras, No 12",
    },
  });

  const res = await api.get(endpoints.detail);
  return res.data;
};

export const editContact = async (req: TContactRequest): Promise<TDefaultResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: null,
  });

  const res = await api.put(endpoints.edit, { data: req });
  return res.data;
};
