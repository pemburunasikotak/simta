import { z } from "zod";

export const contactFormSchema = z.object({
  company_name: z.string().min(1, "Nama Perusahaan harus diisi"),
  phone_number: z.string().min(1, "No Telfon harus diisi"),
  whatsapp_number: z.string().min(1, "No. Whatsapp harus diisi"),
  email: z.string().min(1, "Email harus diisi").email("Email tidak valid"),
  address: z.string().min(1, "Alamat harus diisi"),
});

export type TContactFormData = z.infer<typeof contactFormSchema>;
