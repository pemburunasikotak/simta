import { supabase } from "@/libs/supabase";
import { TSchedule, TCreateScheduleParam } from "./type";

export const getSchedules = async (): Promise<TSchedule[]> => {
    const { data, error } = await supabase
        .from("jadwal_sidang")
        .select(`
        id_jadwal,
        tipe_sidang,
        tgl_sidang,
        ruangan,
        status_selesai,
        tugas_akhir(
            id_mhs,
            judul_ta,
            mahasiswa(
                nama_mhs,
                email,
                id_pembimbing_utama,
                pembimbing_utama:dosen!id_pembimbing_utama(nama_dosen),
                id_pembimbing_kedua,
                pembimbing_kedua:dosen!id_pembimbing_kedua(nama_dosen)
            )
        ),
        detail_penguji(
            dosen(id_dosen, nama_dosen, email)
        )
    `)
        .order("tgl_sidang", { ascending: true });

    if (error) throw error;

    return (data || []).map((item: any) => {
        const dateObj = new Date(item.tgl_sidang);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const hh = String(dateObj.getHours()).padStart(2, "0");
        const min = String(dateObj.getMinutes()).padStart(2, "0");
        console.log('CEK RESPON', item.tugas_akhir?.mahasiswa)

        return {
            id: item.id_jadwal,
            title: item.tugas_akhir?.judul_ta || item.tipe_sidang,
            type: item.tipe_sidang,
            date: `${yyyy}-${mm}-${dd}`,
            time: `${hh}:${min}`,
            location: item.ruangan,
            description: "",
            notes: "",
            duration_minutes: 60,
            status: item.status_selesai ? "Selesai" : "Belum",
            studentId: item.tugas_akhir?.id_mhs,
            studentName: item.tugas_akhir?.mahasiswa?.nama_mhs || "Unknown",
            studentEmail: item.tugas_akhir?.mahasiswa?.email || "",
            pembimbingId: item.tugas_akhir?.mahasiswa?.id_pembimbing_utama,
            pembimbingName: item.tugas_akhir?.mahasiswa?.pembimbing_utama?.nama_dosen || "-",
            pembimbingKeduaId: item.tugas_akhir?.mahasiswa?.id_pembimbing_kedua,
            pembimbingKeduaName: item.tugas_akhir?.mahasiswa?.pembimbing_kedua?.nama_dosen || "-",
            examiners: (item.detail_penguji || []).map((penguji: any) => ({
                id: penguji.dosen?.id_dosen,
                name: penguji.dosen?.nama_dosen || "Unknown",
                email: penguji.dosen?.email || "",
                role: "Penguji",
            })),
        };
    });
};

export const postCreateSchedule = async (payload: TCreateScheduleParam): Promise<{ message: string }> => {
    // 1. Check if Mahasiswa has Tugas Akhir
    let id_ta = null;
    const { data: taData, error: taQueryError } = await supabase
        .from("tugas_akhir")
        .select("id_ta")
        .eq("id_mhs", parseInt(String(payload.studentId)))
        .single();

    if (taQueryError && taQueryError.code !== "PGRST116") {
        throw taQueryError;
    }

    if (taData) {
        id_ta = taData.id_ta;
    } else {
        // Auto-create Tugas Akhir record to satisfy DB requirement
        const { data: newTa, error: taInsertError } = await supabase
            .from("tugas_akhir")
            .insert({
                id_mhs: parseInt(String(payload.studentId)),
                judul_ta: payload.title,
                status_ta: "Proposal", // Default fallback
            })
            .select("id_ta")
            .single();

        if (taInsertError) throw taInsertError;
        id_ta = newTa.id_ta;
    }

    // 2. Insert jadwal sidang
    const tgl_sidang = `${payload.date} ${payload.time}:00`;
    const { data: jadwalData, error: jadwalError } = await supabase
        .from("jadwal_sidang")
        .insert({
            id_ta: id_ta,
            tipe_sidang: payload.type,
            tgl_sidang: tgl_sidang,
            ruangan: payload.location,
        })
        .select("id_jadwal")
        .single();

    if (jadwalError) throw jadwalError;

    // 3. Insert examiners
    if (payload.examinerIds && payload.examinerIds.length > 0) {
        const examinerInserts = payload.examinerIds.map((id) => ({
            id_jadwal: jadwalData.id_jadwal,
            id_dosen: parseInt(String(id)),
        }));

        const { error: examinerError } = await supabase
            .from("detail_penguji")
            .insert(examinerInserts);

        if (examinerError) throw examinerError;
    }

    return { message: "Jadwal berhasil dibuat" };
};

export const putUpdateSchedule = async (id: string, payload: TCreateScheduleParam): Promise<{ message: string }> => {
    // 1. Get or Create Tugas Akhir for selected student
    let id_ta = null;
    const { data: taData, error: taQueryError } = await supabase
        .from("tugas_akhir")
        .select("id_ta")
        .eq("id_mhs", parseInt(String(payload.studentId)))
        .single();

    if (taQueryError && taQueryError.code !== "PGRST116") {
        throw taQueryError;
    }

    if (taData) {
        id_ta = taData.id_ta;
    } else {
        const { data: newTa, error: taInsertError } = await supabase
            .from("tugas_akhir")
            .insert({
                id_mhs: parseInt(String(payload.studentId)),
                judul_ta: payload.title,
                status_ta: "Proposal",
            })
            .select("id_ta")
            .single();

        if (taInsertError) throw taInsertError;
        id_ta = newTa.id_ta;
    }

    // 2. Update jadwal sidang
    const tgl_sidang = `${payload.date} ${payload.time}:00`;
    const { error: jadwalError } = await supabase
        .from("jadwal_sidang")
        .update({
            id_ta: id_ta,
            tipe_sidang: payload.type,
            tgl_sidang: tgl_sidang,
            ruangan: payload.location,
        })
        .eq("id_jadwal", parseInt(id));

    if (jadwalError) throw jadwalError;

    // 3. Clear existing examiners and insert new ones
    await supabase.from("detail_penguji").delete().eq("id_jadwal", parseInt(id));

    if (payload.examinerIds && payload.examinerIds.length > 0) {
        const examinerInserts = payload.examinerIds.map((exId) => ({
            id_jadwal: parseInt(id),
            id_dosen: parseInt(String(exId)),
        }));

        const { error: examinerError } = await supabase
            .from("detail_penguji")
            .insert(examinerInserts);

        if (examinerError) throw examinerError;
    }

    return { message: "Jadwal berhasil diperbarui" };
};

export const deleteSchedule = async (id: string): Promise<{ message: string }> => {
    const { error } = await supabase.from("jadwal_sidang").delete().eq("id_jadwal", parseInt(id));
    if (error) throw error;
    return { message: "Jadwal berhasil dihapus" };
};

// --- NEW EXAM REVIEW endpoints ---

export const getExaminerSchedules = async (id_dosen: number): Promise<any[]> => {
    // Get all schedules where this dosen is an examiner
    const { data, error } = await supabase
        .from("detail_penguji")
        .select(`
            id_jadwal,
            nilai,
            catatan_revisi,
            tgl_input_nilai,
            jadwal_sidang!inner(
                tipe_sidang,
                tgl_sidang,
                ruangan,
                tugas_akhir!inner(
                    judul_ta,
                    mahasiswa(nama_mhs, nim)
                ),
                detail_penguji(
                    id_dosen,
                    nilai,
                    catatan_revisi,
                    dosen(nama_dosen)
                )
            )
        `)
        .eq("id_dosen", id_dosen)
        .order("tgl_input_nilai", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
        id_jadwal: item.id_jadwal,
        tipe_sidang: item.jadwal_sidang?.tipe_sidang,
        tgl_sidang: item.jadwal_sidang?.tgl_sidang,
        ruangan: item.jadwal_sidang?.ruangan,
        judul_ta: item.jadwal_sidang?.tugas_akhir?.judul_ta,
        nama_mhs: item.jadwal_sidang?.tugas_akhir?.mahasiswa?.nama_mhs,
        nim: item.jadwal_sidang?.tugas_akhir?.mahasiswa?.nim,
        nilai: item.nilai,
        catatan: item.catatan_revisi,
        rekan_penguji: (item.jadwal_sidang?.detail_penguji || []).map((p: any) => ({
            id_dosen: p.id_dosen,
            nama_dosen: p.dosen?.nama_dosen,
            nilai: p.nilai,
            catatan: p.catatan_revisi
        }))
    }));
};

export const putExaminerFeedback = async (id_jadwal: number, id_dosen: number, payload: { nilai: number, catatan: string }): Promise<{ message: string }> => {
    const { error } = await supabase
        .from("detail_penguji")
        .update({
            nilai: payload.nilai,
            catatan_revisi: payload.catatan,
            tgl_input_nilai: new Date().toISOString()
        })
        .match({ id_jadwal, id_dosen });

    if (error) throw error;
    return { message: "Review Sidang berhasil disimpan" };
};

export const getStudentExamResults = async (id_mhs: number): Promise<any[]> => {
    // Get schedule ID for the student's TA
    const { data, error } = await supabase
        .from("tugas_akhir")
        .select(`
            id_ta,
            judul_ta,
            jadwal_sidang(
                id_jadwal,
                tipe_sidang,
                tgl_sidang,
                detail_penguji(
                    nilai,
                    catatan_revisi,
                    dosen(nama_dosen)
                )
            )
        `)
        .eq("id_mhs", id_mhs)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    if (!data) return [];

    // Flatten result
    const results: any[] = [];
    if (data.jadwal_sidang) {
        data.jadwal_sidang.forEach((jadwal: any) => {
            const pengujiDetails = jadwal.detail_penguji || [];

            // Push an entry per jadawal with nested penguji
            results.push({
                id_jadwal: jadwal.id_jadwal,
                tipe_sidang: jadwal.tipe_sidang,
                tgl_sidang: jadwal.tgl_sidang,
                judul_ta: data.judul_ta,
                penguji: pengujiDetails.map((p: any) => ({
                    nama_dosen: p.dosen?.nama_dosen,
                    nilai: p.nilai,
                    catatan: p.catatan_revisi
                }))
            });
        });
    }

    // Sort descending by date
    results.sort((a, b) => new Date(b.tgl_sidang).getTime() - new Date(a.tgl_sidang).getTime());
    return results;
};
