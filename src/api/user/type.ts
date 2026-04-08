import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TUserItem = {
  id_user: number;
  id?: number;
  username: string;
  password?: string;
  role: "Administrasi" | "Dosen" | "Mahasiswa";
  id_referensi: number;
  id_referensi_kedua?: number | null;
  last_login?: string;

  // Custom joined fields
  name?: string;
  email?: string;
  identity_number?: string;
  department?: string;
  kuota_bimbingan?: number;
  id_pembimbing_utama?: number | null;
  id_pembimbing_kedua?: number | null;

  roles?: any[];
};

export type TUserCreateRequest = {
  name: string;
  email?: string;
  username: string;
  password?: string;
  role: "Administrasi" | "Dosen" | "Mahasiswa";
  identity_number: string; // NIDN, NIM, or NIP
  department?: string; // Prodi or Bagian
  kuota_bimbingan?: number; // Only for Dosen
  id_pembimbing_utama?: number | null; // Only for Mahasiswa
  id_pembimbing_kedua?: number | null; // Only for Mahasiswa
  id_referensi_kedua?: number | null; // Generic reference
};

export type TUserUpdateRequest = Partial<TUserCreateRequest>;

export type TGetUsersParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  roles?: string;
  search?: string;
};

export type TUserPaginateResponse = TResponsePaginate<TUserItem>;
export type TUserDetailResponse = TResponse<TUserItem>;
