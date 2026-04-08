import zod from "@/libs/zod";

const BaseSchema = zod.object({
  name: zod
    .string({ error: "Nama Vendor harus diisi" })
    .min(1, { error: "Nama Vendor harus diisi" }),
  type: zod.object({
    value: zod.string({ error: "Type Vendor harus diisi" }),
    label: zod.string(),
  }, { error: "Type Vendor harus diisi" }),
  total_booking: zod
    .number({ error: "Total Booking harus diisi" })
    .min(0, { message: "Total Booking tidak boleh negatif" }),
  logo: zod
    .string({ error: "Logo harus diisi" })
    .min(1, { message: "Logo harus diisi" }),
  description: zod
    .string({ error: "Deskripsi harus diisi" })
    .min(1, { message: "Deskripsi harus diisi" }),
});

export const VendorSchema = BaseSchema;
export type TVendorFormData = zod.infer<typeof VendorSchema>;
