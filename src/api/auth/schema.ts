import { z } from "zod";

export const loginSchema = z.object({
  user: z
    .string({ required_error: "Username wajib diisi" })
    .min(1, { message: "Username wajib diisi" }),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(1, { message: "Password wajib diisi" }),
});
