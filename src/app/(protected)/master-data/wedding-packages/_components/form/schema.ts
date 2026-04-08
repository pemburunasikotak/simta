import zod from "@/libs/zod";

const BaseSchema = zod.object({
  package_name: zod
    .string({ error: "Nama Paket harus diisi" })
    .min(1, { error: "Nama Paket harus diisi" }),
  package_type: zod
    .string({ error: "Type Paket harus diisi" })
    .min(1, { error: "Type Paket harus diisi" }),
  package_facilities: zod
    .array(zod.string())
    .min(1, "Fasilitas Paket harus diisi minimal 1 item"),
});

export const WeddingPackagesSchema = BaseSchema;
export type TWeddingPackagesFormData = zod.infer<typeof WeddingPackagesSchema>;
