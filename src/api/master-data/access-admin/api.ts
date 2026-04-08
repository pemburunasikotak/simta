import { generatePath } from "react-router";
import { api } from "@/libs/axios/api";

import { TDetailParams } from "../../common";
import {
  TDetailAccessAdminResponse,
  TListAccessAdminResponse,
  TAccessAdmin,
  TAccessAdminFilter,
  TAccessAdminRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
  list: "/master-data/access-admin",
  detail: "/master-data/access-admin/:id",
  create: "/master-data/access-admin/create",
  edit: "/master-data/access-admin/:id/update",
};

const mock: TAccessAdmin[] = [
  {
    user_id: "1",
    fullname: "Ahmad Nizar",
    username: "nizaradmin",
    email: "nizar@example.com",
    phone: "081234567890",
    password: "hashedPassword1",
    foto: "https://example.com/images/rahma.jpg",
    role: "reporting",
    created_by: "system",
  },
  {
    user_id: "2",
    fullname: "Siti Rahma",
    username: "rahma_s",
    email: "rahma@example.com",
    phone: "081298765432",
    password: "hashedPassword2",
    foto: "https://example.com/images/rahma.jpg",
    role: "management",
    created_by: "1",
  },
  {
    user_id: "3",
    fullname: "Budi Santoso",
    username: "budis",
    email: "budi@example.com",
    phone: "082112223334",
    password: "hashedPassword3",
    foto: "https://example.com/images/rahma.jpg",
    role: "reporting",
    created_by: "1",
  },
  {
    user_id: "4",
    fullname: "Lisa Mariana",
    username: "lisam",
    email: "lisa@example.com",
    phone: "081355512345",
    password: "hashedPassword4",
    foto: "https://example.com/images/lisa.jpg",
    role: "management",
    created_by: "2",
  },
  {
    user_id: "5",
    fullname: "Dedi Gunawan",
    username: "dedi_g",
    email: "dedi@example.com",
    phone: "081377788899",
    password: "hashedPassword5",
    foto: "https://example.com/images/rahma.jpg",
    role: "editor",
    created_by: "3",
  },
];

export const getListAccessAdmin = async (
  params?: TAccessAdminFilter,
): Promise<TListAccessAdminResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: {
      data: mock,
      current_page: 1,
      total: 10,
      total_page: 4,
      has_previous_page: false,
      has_next_page: true,
    },
  });

  const res = await api.get(endpoints.list, { params });

  return res.data;
};

export const getDetailAccessAdmin = async (
  params?: TDetailParams,
): Promise<TDetailAccessAdminResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: mock.find((item) => item.user_id === params?.id) || null,
  });

  const res = await api.get(generatePath(endpoints.detail, { params }));
  return res.data;
};

export const createAccessAdmin = async (req: TAccessAdminRequest): Promise<TDefaultResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: null,
  });
  const res = await api.post(endpoints.create, { data: req });
  return res.data;
};

export const editAccessAdmin = async (
  params: TDetailParams,
  req: TAccessAdminRequest,
): Promise<TDefaultResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: null,
  });

  const res = await api.put(generatePath(endpoints.edit, { id: params.id }), { data: req });
  return res.data;
};
