import { postLogin } from "@/api/auth/api";
import { TLoginParam, TLoginResponse } from "@/api/auth/type";
import { SessionUser } from "@/libs/localstorage";
import { SessionToken } from "@/libs/cookies";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";

export const usePostLogin = (): UseMutationResult<
  TLoginResponse,
  unknown,
  TLoginParam,
  unknown
> => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ["post-login"],
    mutationFn: async (payload) => await postLogin(payload),
    onSuccess: (res) => {
      SessionUser.set({ user: res.data.user });
      SessionToken.set(res.data);
      enqueueSnackbar("Login berhasil! Selamat datang.", { variant: "success" });
      navigate(0);
    },
    onError: (err: unknown) => {
      // Use proper casting to satisfy lint
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError?.response?.data?.message || "Terjadi kesalahan saat login";
      enqueueSnackbar(message, { variant: "error" });
    },
  });
};
