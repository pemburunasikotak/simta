import { TResponse } from "@/commons/types/response";
import { supabase } from "@/libs/supabase";
import {
  TGetUsersParams,
  TUserUpdateRequest,
  TUserDetailResponse,
  TUserCreateRequest,
  TUserPaginateResponse,
} from "./type";

export const getUsers = async (params: TGetUsersParams): Promise<TUserPaginateResponse> => {
  const { page = 1, limit = 10 } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("users").select('*', { count: "exact" });

  if (params.roles) {
    query = query.eq("role", params.roles);
  }

  const { data: users, count, error } = await query.range(from, to).order('id_user', { ascending: false });
  if (error) throw error;

  // Manual stitch since id_referensi has no explicit foreign constraints to 3 different tables
  const resolvedUsers = await Promise.all((users || []).map(async (u) => {
    let detail: any = {};
    if (u.role === "Dosen") {
      const { data } = await supabase.from("dosen").select("*").eq("id_dosen", u.id_referensi).single();
      detail = { name: data?.nama_dosen, email: data?.email, identity_number: data?.nidn, kuota_bimbingan: data?.kuota_bimbingan };
    } else if (u.role === "Mahasiswa") {
      const { data } = await supabase.from("mahasiswa").select("*").eq("id_mhs", u.id_referensi).single();
      detail = { name: data?.nama_mhs, email: data?.email, identity_number: data?.nim, department: data?.prodi, id_pembimbing_utama: data?.id_pembimbing_utama, id_pembimbing_kedua: data?.id_pembimbing_kedua };
    } else if (u.role === "Administrasi") {
      const { data } = await supabase.from("administrasi").select("*").eq("id_admin", u.id_referensi).single();
      detail = { name: data?.nama_admin, email: data?.email, identity_number: data?.nip, department: data?.bagian };
    }

    return {
      id_user: u.id_user,
      id: u.id_user, // For backward compatibility UI
      username: u.username,
      role: u.role,
      id_referensi: u.id_referensi,
      id_referensi_kedua: u.id_referensi_kedua,
      name: detail.name || "-",
      email: detail.email || "-",
      identity_number: detail.identity_number || "-",
      department: detail.department || "-",
      kuota_bimbingan: detail.kuota_bimbingan,
      id_pembimbing_utama: detail.id_pembimbing_utama,
      id_pembimbing_kedua: detail.id_pembimbing_kedua,
      roles: [{ id: u.role, key: u.role, name: u.role, permissions: [] }],
    };
  }));

  return {
    code: 1,
    message: "success",
    status: true,
    result: {
      data: resolvedUsers as any,
      current_page: page,
      total: count || 0,
      total_page: Math.ceil((count || 0) / limit),
      has_previous_page: page > 1,
      has_next_page: page < Math.ceil((count || 0) / limit),
    },
  };
};

export const getUser = async (id: string): Promise<TUserDetailResponse> => {
  const { data: u, error } = await supabase
    .from("users")
    .select("*")
    .eq("id_user", parseInt(id))
    .single();

  if (error) throw error;

  let detail: any = {};
  if (u.role === "Dosen") {
    const { data } = await supabase.from("dosen").select("*").eq("id_dosen", u.id_referensi).single();
    detail = { name: data?.nama_dosen, email: data?.email, identity_number: data?.nidn, kuota_bimbingan: data?.kuota_bimbingan };
  } else if (u.role === "Mahasiswa") {
    const { data } = await supabase.from("mahasiswa").select("*").eq("id_mhs", u.id_referensi).single();
    detail = { name: data?.nama_mhs, email: data?.email, identity_number: data?.nim, department: data?.prodi, id_pembimbing_utama: data?.id_pembimbing_utama, id_pembimbing_kedua: data?.id_pembimbing_kedua };
  } else if (u.role === "Administrasi") {
    const { data } = await supabase.from("administrasi").select("*").eq("id_admin", u.id_referensi).single();
    detail = { name: data?.nama_admin, email: data?.email, identity_number: data?.nip, department: data?.bagian };
  }

  return {
    code: 1,
    message: "success",
    status: true,
    result: {
      id_user: u.id_user,
      id: u.id_user,
      username: u.username,
      role: u.role,
      id_referensi: u.id_referensi,
      id_referensi_kedua: u.id_referensi_kedua,
      name: detail.name || "-",
      email: detail.email || "-",
      identity_number: detail.identity_number || "-",
      department: detail.department || "-",
      kuota_bimbingan: detail.kuota_bimbingan,
      id_pembimbing_utama: detail.id_pembimbing_utama,
      id_pembimbing_kedua: detail.id_pembimbing_kedua,
      roles: [{
        id: u.role,
        key: u.role,
        name: u.role,
        permissions: []
      }],
    } as any,
  };
};

export const createUser = async (data: TUserCreateRequest): Promise<TResponse<null>> => {
  let id_referensi = 0;

  if (data.role === "Dosen") {
    const { data: dData, error: dError } = await supabase.from("dosen").insert({
      nidn: data.identity_number,
      nama_dosen: data.name,
      email: data.email,
      kuota_bimbingan: data.kuota_bimbingan || 10,
    }).select("id_dosen").single();
    if (dError) throw dError;
    id_referensi = dData.id_dosen;
  } else if (data.role === "Mahasiswa") {
    const { data: mData, error: mError } = await supabase.from("mahasiswa").insert({
      nim: data.identity_number,
      nama_mhs: data.name,
      email: data.email,
      prodi: data.department,
      id_pembimbing_utama: data.id_pembimbing_utama || null,
      id_pembimbing_kedua: data.id_pembimbing_kedua || null,
    }).select("id_mhs").single();
    if (mError) throw mError;
    id_referensi = mData.id_mhs;
  } else if (data.role === "Administrasi") {
    const { data: aData, error: aError } = await supabase.from("administrasi").insert({
      nip: data.identity_number,
      nama_admin: data.name,
      email: data.email,
      bagian: data.department,
    }).select("id_admin").single();
    if (aError) throw aError;
    id_referensi = aData.id_admin;
  }

  // Then create user login credential. Fallback username to email or name if empty.
  const { error: userError } = await supabase.from("users").insert({
    username: data.username || data.identity_number,
    password: data.password || "password123",
    role: data.role,
    id_referensi: id_referensi,
    id_referensi_kedua: data.role === "Mahasiswa" ? data.id_pembimbing_kedua : null,
  });

  if (userError) throw userError;

  return { code: 1, message: "success", status: true, result: null };
};

export const updateUser = async (id: string, data: TUserUpdateRequest): Promise<TResponse<null>> => {
  // Get `id_referensi` and check user
  const { data: user, error: uError } = await supabase.from("users").select("*").eq("id_user", parseInt(id)).single();
  if (uError) throw uError;

  if (user.role === "Dosen") {
    const { error } = await supabase.from("dosen").update({
      nidn: data.identity_number,
      nama_dosen: data.name,
      email: data.email,
      kuota_bimbingan: data.kuota_bimbingan || 10,
    }).eq("id_dosen", user.id_referensi);
    if (error) throw error;
  } else if (user.role === "Mahasiswa") {
    const { error } = await supabase.from("mahasiswa").update({
      nim: data.identity_number,
      nama_mhs: data.name,
      prodi: data.department,
      email: data.email,
      id_pembimbing_utama: data.id_pembimbing_utama || null,
      id_pembimbing_kedua: data.id_pembimbing_kedua || null,
    }).eq("id_mhs", user.id_referensi);
    if (error) throw error;
  } else if (user.role === "Administrasi") {
    const { error } = await supabase.from("administrasi").update({
      nip: data.identity_number,
      nama_admin: data.name,
      bagian: data.department,
      email: data.email,
    }).eq("id_admin", user.id_referensi);
    if (error) throw error;
  }

  // Update password or username if needed
  if (data.username || data.password) {
    const upData: any = {};
    if (data.username) upData.username = data.username;
    if (data.password) upData.password = data.password;
    if (data.role === "Mahasiswa" && data.id_pembimbing_kedua !== undefined) {
      upData.id_referensi_kedua = data.id_pembimbing_kedua;
    }
    const { error } = await supabase.from("users").update(upData).eq("id_user", user.id_user);
    if (error) throw error;
  }

  return { code: 1, message: "success", status: true, result: null };
};

export const deleteUser = async (id: string): Promise<TResponse<null>> => {
  const { data: user } = await supabase.from("users").select("*").eq("id_user", parseInt(id)).single();
  if (user) {
    if (user.role === "Dosen") await supabase.from("dosen").delete().eq("id_dosen", user.id_referensi);
    if (user.role === "Mahasiswa") await supabase.from("mahasiswa").delete().eq("id_mhs", user.id_referensi);
    if (user.role === "Administrasi") await supabase.from("administrasi").delete().eq("id_admin", user.id_referensi);
  }
  const { error } = await supabase.from("users").delete().eq("id_user", parseInt(id));
  if (error) throw error;
  return { code: 1, message: "success", status: true, result: null };
};
