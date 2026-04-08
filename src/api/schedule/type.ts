import { z } from "zod";

export const examinerSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string(),
    email: z.string().optional(),
    role: z.string().optional(),
});

export const scheduleSchema = z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string(),
    type: z.string().optional(),
    date: z.string(),
    time: z.string(),
    location: z.string(),
    description: z.string().optional(),
    notes: z.string().optional(),
    duration_minutes: z.number().optional(),
    meeting_link: z.string().optional(),
    status: z.string().optional(),
    studentId: z.union([z.string(), z.number()]).optional(),
    studentName: z.string(),
    studentEmail: z.string().optional(),
    pembimbingId: z.union([z.string(), z.number()]).optional(),
    pembimbingName: z.string().optional(),
    examiners: z.array(examinerSchema),
});

export type TSchedule = z.infer<typeof scheduleSchema>;

export const createScheduleParamSchema = z.object({
    title: z.string().min(1, "Judul harus diisi"),
    type: z.string().min(1, "Tipe harus diisi"),
    date: z.string().min(1, "Tanggal harus diisi"),
    time: z.string().min(1, "Waktu harus diisi"),
    location: z.string().min(1, "Lokasi harus diisi"),
    studentId: z.union([z.string(), z.number()]),
    examinerIds: z.array(z.union([z.string(), z.number()])).min(1, "Minimal 1 penguji"),
});

export type TCreateScheduleParam = z.infer<typeof createScheduleParamSchema>;
