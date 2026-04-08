import { z } from "zod";

export const taProgressSchema = z.object({
    id: z.string(),
    studentName: z.string(),
    title: z.string(),
    fileName: z.string(),
    uploadDate: z.string(),
    status: z.enum(["pending", "reviewed", "approved", "rejected", "need_revision"]),
    feedback: z.string().optional(),
    assessment: z.number().optional(),
});

export type TTAProgress = z.infer<typeof taProgressSchema>;

export const uploadTAParamSchema = z.object({
    id_mhs: z.number(),
    judul_ta: z.string().min(1, "Judul TA wajib diisi"),
    abstrak: z.string().optional(),
    tipe_dokumen: z.string().min(1, "Tipe dokumen harus dipilih"),
    catatan_mahasiswa: z.string().optional(),
    file: z.any(), // In real app, this would be a file object
});

export type TUploadTAParam = z.infer<typeof uploadTAParamSchema>;

export const feedbackTAParamSchema = z.object({
    progressId: z.string(),
    feedback: z.string().min(1, "Feedback harus diisi"),
    status: z.enum(["reviewed", "approved", "rejected"]),
    assessment: z.number().min(0).max(100).optional(),
});

export type TFeedbackTAParam = z.infer<typeof feedbackTAParamSchema>;
