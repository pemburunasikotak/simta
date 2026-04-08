import { generatePath } from "react-router";
import { api } from "@/libs/axios/api";

import { TDetailParams } from "../../common";
import {
  TDetailVendorResponse,
  TListVendorResponse,
  TVendor,
  TVendorFilter,
  TVendorRequest,
} from "./type";
import { TDefaultResponse } from "@/commons/types/response";

const endpoints = {
  list: "/master-data/vendors",
  detail: "/master-data/vendors/:id",
  create: "/master-data/vendors/create",
  edit: "/master-data/vendors/:id/update",
};

const mock: TVendor[] = [
  {
    vendor_id: "1",
    name: "Elegant Decor",
    type: {
      id: "1",
      name: "Decoration",
    },
    logo: "https://example.com/images/elegant-decor.jpg",
    description: "Specializing in elegant wedding decorations and setups",
    total_booking: 45,
    created_by: "system",
  },
  {
    vendor_id: "2",
    name: "Divine Catering",
    type: {
      id: "2",
      name: "Catering",
    },
    logo: "https://example.com/images/divine-catering.jpg",
    description: "Premium catering service for all types of events",
    total_booking: 78,
    created_by: "1",
  },
  {
    vendor_id: "3",
    name: "Capture Moments",
    type: {
      id: "3",
      name: "Photography",
    },
    logo: "https://example.com/images/capture-moments.jpg",
    description: "Professional photography services for weddings and events",
    total_booking: 120,
    created_by: "1",
  },
  {
    vendor_id: "4",
    name: "Harmony Music",
    type: {
      id: "4",
      name: "Entertainment",
    },
    logo: "https://example.com/images/harmony-music.jpg",
    description: "Live music and entertainment for special occasions",
    total_booking: 56,
    created_by: "2",
  },
  {
    vendor_id: "5",
    name: "Floral Dreams",
    type: {
      id: "5",
      name: "Florist",
    },
    logo: "https://example.com/images/floral-dreams.jpg",
    description: "Beautiful floral arrangements for all events",
    total_booking: 92,
    created_by: "3",
  },
];

export const getListVendors = async (
  params?: TVendorFilter,
): Promise<TListVendorResponse> => {
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

export const getDetailVendor = async (
  params?: TDetailParams,
): Promise<TDetailVendorResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: mock.find((item) => item.vendor_id === params?.id) || null,
  });

  const res = await api.get(generatePath(endpoints.detail, { params }));
  return res.data;
};

export const createVendor = async (req: TVendorRequest): Promise<TDefaultResponse> => {
  return Promise.resolve({
    code: 200,
    message: "Berhasil",
    status: true,
    result: null,
  });
  const res = await api.post(endpoints.create, { data: req });
  return res.data;
};

export const editVendor = async (
  params: TDetailParams,
  req: TVendorRequest,
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
