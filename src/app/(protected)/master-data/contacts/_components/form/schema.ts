import zod from "@/libs/zod";

const BaseSchema = zod.object({
  name: zod
    .string({ error: "Nama Fasilitas harus diisi" })
    .min(1, { error: "Nama Fasilitas harus diisi" }),
  phone: zod
    .string({ error: "No. Telepon harus diisi" })
    .min(1, { error: "No. Telepon harus diisi" }),
  wa: zod
    .string({ error: "No. Whatsapp harus diisi" })
    .min(1, { error: "No. Whatsapp harus diisi" }),
  email: zod.email({
    error: (issue) => {
      if (issue.input) {
        return "Format Email salah";
      }
      return "Email harus diisi";
    },
  }),
  address: zod.string({ error: "Alamat tharus diisi" }).min(1, { error: "Alamat harus diisi" }),
});

export const ContactSchema = BaseSchema;
export type TContactFormData = zod.infer<typeof ContactSchema>;
