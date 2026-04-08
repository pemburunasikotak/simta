import zod from "@/libs/zod";

const BaseSchema = zod.object({
  fullname: zod
    .string({ error: "Nama Lengkap harus diisi" })
    .min(1, { error: "Nama Lengkap harus diisi" }),
  email: zod.email({
    error: (issue) => {
      if (issue.input) {
        return "Format Email salah";
      }
      return "Email harus diisi";
    },
  }),
  phone: zod
    .string({ error: "No. Whatsapp harus diisi" })
    .min(1, { message: "No. Whatsapp harus diisi" }),
  username: zod
    .string({ error: "Username harus diisi" })
    .min(1, { message: "Username harus diisi" }),
  password: zod
    .string({ error: "Password harus diisi" })
    .min(6, { message: "Panjang password minimal 6 karakter" }),
  role: zod
    .string({ error: "Role Akses harus diisi" })
    .min(1, { message: "Role Akses harus diisi" }),
  foto: zod.string({ error: "Foto harus diisi" }).min(1, { message: "Foto harus diisi" }),
});

export const AccessAdminSchema = BaseSchema;
export type TAccessAdminFormData = zod.infer<typeof AccessAdminSchema>;
