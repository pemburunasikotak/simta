import { generatePath } from "react-router";
import { api } from "@/libs/axios/api";

import { TDetailParams } from "../common";
import {
  TDetailTransactionResponse,
  TListTransactionResponse,
  TTransacion,
  TTransactionFilter,
  TTransactionRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
  list: "/transactions",
  detail: "/transactions/:id",
  create: "/transactions/create",
  edit: "/transactions/:id/update",
};

const mock: TTransacion[] = [
  {
    booking_id: "BK001",
    fullname: "Andi Wijaya",
    email: "andi.wijaya@example.com",
    phone: "081234567890",
    address: "Jl. Merdeka No. 10, Jakarta",
    booking_date: "2025-06-10T10:00:00.000Z",
    total_price: "1500000",
    status: "success",
    created_by: "admin",
    province: "Jatim",
    city: "Malang",
    district: "Tlogomas",
    postal_code: "90123",
  },
  {
    booking_id: "BK002",
    fullname: "Siti Rahmawati",
    email: "siti.rahmawati@example.com",
    phone: "082198765432",
    address: "Jl. Gatot Subroto No. 20, Bandung",
    booking_date: "2025-06-11T14:30:00.000Z",
    total_price: "2000000",
    status: "cancel",
    created_by: "user123",
    province: "Jatim",
    city: "Malang",
    district: "Tlogomas",
    postal_code: "90123",
  },
  {
    booking_id: "BK003",
    fullname: "Budi Santoso",
    email: "budi.santoso@example.com",
    phone: "081223344556",
    address: "Jl. Sudirman No. 5, Surabaya",
    booking_date: "2025-06-12T09:15:00.000Z",
    total_price: "1750000",
    status: "pending",
    created_by: "admin",
    province: "Jatim",
    city: "Malang",
    district: "Tlogomas",
    postal_code: "90123",
  },
  {
    booking_id: "BK004",
    fullname: "Rina Marlina",
    email: "rina.marlina@example.com",
    phone: "085612345678",
    address: "Jl. Ahmad Yani No. 15, Medan",
    booking_date: "2025-06-09T16:45:00.000Z",
    total_price: "2200000",
    status: "cancel",
    created_by: "staff01",
    province: "Jatim",
    city: "Malang",
    district: "Tlogomas",
    postal_code: "90123",
  },
];

export const getListTransaction = async (
  params?: TTransactionFilter,
): Promise<TListTransactionResponse> => {
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

export const getDetailTransaction = async (
  params?: TDetailParams,
): Promise<TDetailTransactionResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: mock.find((item) => item.booking_id === params?.id) || null,
  });

  const res = await api.get(generatePath(endpoints.detail, { params }));
  return res.data;
};

export const createTransaction = async (req: TTransactionRequest): Promise<TDefaultResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: null,
  });
  const res = await api.post(endpoints.create, { data: req });
  return res.data;
};

export const editTransaction = async (
  params: TDetailParams,
  req: TTransactionRequest,
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
