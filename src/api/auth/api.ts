import { PERMISSIONS } from "@/commons/constants/permissions";
import { supabase } from "@/libs/supabase";
import { TLoginOidcParam, TLoginParam, TLoginResponse } from "./type";

export const postLogin = async (payload: TLoginParam): Promise<TLoginResponse> => {
  // Direct table check for prototype (using users from new schema)
  const { data: userLogin, error: loginError } = await supabase
    .from("users")
    .select("*")
    .eq("username", payload.user)
    .eq("password", payload.password)
    .single();

  if (loginError || !userLogin) {
    return Promise.reject({
      response: {
        data: {
          message: "Username atau password salah",
        },
      },
    });
  }

  // Update last_login
  supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id_user", userLogin.id_user);

  let detail: any = {};
  let permissions: string[] = [PERMISSIONS.DEFAULT];
  let identityNumber = "";

  if (userLogin.role === "Dosen") {
    const { data } = await supabase.from("dosen").select("*").eq("id_dosen", userLogin.id_referensi).single();
    detail = data || {};
    permissions = [...permissions, ...Object.values(PERMISSIONS.DOSEN)];
    identityNumber = detail.nidn || "";
  } else if (userLogin.role === "Mahasiswa") {
    const { data } = await supabase.from("mahasiswa").select("*").eq("id_mhs", userLogin.id_referensi).single();
    detail = data || {};
    permissions = [...permissions, ...Object.values(PERMISSIONS.MAHASISWA)];
    identityNumber = detail.nim || "";
  } else if (userLogin.role === "Administrasi") {
    const { data } = await supabase.from("administrasi").select("*").eq("id_admin", userLogin.id_referensi).single();
    detail = data || {};
    permissions = [
      ...permissions,
      ...Object.values(PERMISSIONS.AKADEMIK),
      PERMISSIONS.DASHBOARD.READ_DASHBOARD,
    ];
    identityNumber = detail.nip || "";
  }

  const roleName = userLogin.role;

  return {
    data: {
      access_token: "prototype-token-" + userLogin.id_user,
      refresh_token: "prototype-refresh-token",
      user: {
        id_user: userLogin.id_user,
        id: userLogin.id_user,
        id_referensi: userLogin.id_referensi,
        username: userLogin.username,
        role: userLogin.role,
        name: detail.nama_dosen || detail.nama_mhs || detail.nama_admin || "-",
        email: detail.email || "",
        identity_number: identityNumber,
        roles: [
          {
            id: userLogin.role,
            key: userLogin.role,
            name: roleName,
            permissions: permissions.map((p, index) => ({
              id: String(index + 1),
              key: p,
              name: p,
            })),
          },
        ],
      },
    },
  };
};

export const postLoginOidc = async (_payload: TLoginOidcParam): Promise<TLoginResponse> => {
  return {
    data: {
      access_token: "access_token",
      refresh_token: "refresh_token",
      user: {
        id_user: 1,
        id: 1,
        id_referensi: 1,
        username: "admin",
        role: "Administrasi",
        name: "Admin",
        email: "admin@mail.com",
        roles: [
          {
            id: "1",
            key: "admin",
            name: "Admin",
            permissions: [],
          },
        ],
      },
    },
  };
};
