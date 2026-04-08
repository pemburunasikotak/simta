import { supabase } from "@/libs/supabase";
import { TTAProgress, TUploadTAParam, TFeedbackTAParam } from "./type";

export const postUploadTA = async (payload: TUploadTAParam): Promise<{ message: string }> => {
    // 1. Check or Create Tugas Akhir
    let id_ta = null;
    const { data: taData, error: taQueryError } = await supabase
        .from("tugas_akhir")
        .select("id_ta")
        .eq("id_mhs", payload.id_mhs)
        .single();

    if (taQueryError && taQueryError.code !== "PGRST116") throw taQueryError;

    if (taData) {
        id_ta = taData.id_ta;
        await supabase.from("tugas_akhir").update({
            judul_ta: payload.judul_ta,
            abstrak: payload.abstrak || null
        }).eq("id_ta", id_ta);
    } else {
        const { data: newTa, error: taInsertError } = await supabase
            .from("tugas_akhir")
            .insert({
                id_mhs: payload.id_mhs,
                judul_ta: payload.judul_ta,
                abstrak: payload.abstrak || null,
                status_ta: "Proposal",
            })
            .select("id_ta")
            .single();

        if (taInsertError) throw taInsertError;
        id_ta = newTa.id_ta;
    }

    let fileName = payload.file ? payload.file.name : "Dokumen";

    // Simulate File Uploading logic here securely since it's a prototype
    // In prod: supabase.storage.from('...').upload(..., payload.file)

    const { error } = await supabase.from("dokumen_ta").insert({
        id_ta: id_ta,
        nama_file: fileName,
        tipe_dokumen: payload.tipe_dokumen,
        catatan_mahasiswa: payload.catatan_mahasiswa,
        versi: 1,
    });

    if (error) throw error;
    return { message: "Dokumen TA Berhasil diupload" };
};

export const getTAProgress = async (id_mhs?: number): Promise<TTAProgress[]> => {
    let query = supabase.from("dokumen_ta").select(`
        id_dokumen,
        nama_file,
        tipe_dokumen,
        catatan_mahasiswa,
        catatan_pembimbing,
        tgl_upload,
        versi,
        tugas_akhir!inner(
            id_ta,
            id_mhs,
            judul_ta,
            status_ta,
            mahasiswa(nama_mhs)
        )
    `).order("tgl_upload", { ascending: false });

    if (id_mhs) {
        query = query.eq("tugas_akhir.id_mhs", id_mhs);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((item: any) => ({
        id: item.id_dokumen.toString(),
        studentName: item.tugas_akhir?.mahasiswa?.nama_mhs || "Unknown",
        title: item.tipe_dokumen || item.tugas_akhir?.judul_ta,
        fileName: item.nama_file || "No file",
        uploadDate: new Date(item.tgl_upload).toLocaleDateString(),
        status: item.tugas_akhir?.status_ta === "Lulus" ? "approved"
            : item.tugas_akhir?.status_ta === "Ditolak" ? "rejected"
                : item.tugas_akhir?.status_ta === "Revisi" ? "need_revision"
                    : "pending",
        feedback: item.catatan_pembimbing || item.catatan_mahasiswa,
    }));
};

export const postTAFeedback = async (payload: TFeedbackTAParam): Promise<{ message: string }> => {
    let newStatus = "Revisi";
    if (payload.status === "approved") newStatus = "Lulus";
    else if (payload.status === "rejected") newStatus = "Ditolak";
    else if (payload.status === "reviewed") newStatus = "Revisi";

    const { error } = await supabase.from("tugas_akhir").update({
        status_ta: newStatus,
        // catatan: payload.feedback,
    }).eq("id_ta", parseInt(payload.progressId));

    if (error) throw error;

    // Get latest document to update the lecturer's notes on the file itself natively
    const { data: latestDoc } = await supabase
        .from("dokumen_ta")
        .select("id_dokumen")
        .eq("id_ta", parseInt(payload.progressId))
        .order("tgl_upload", { ascending: false })
        .limit(1)
        .single();

    if (latestDoc) {
        await supabase.from("dokumen_ta").update({
            catatan_pembimbing: payload.feedback
        }).eq("id_dokumen", latestDoc.id_dokumen);
    }

    return { message: "Feedback berhasil disimpan" };
};

export const getAllProposals = async (): Promise<TTAProgress[]> => {
    const { data, error } = await supabase
        .from("tugas_akhir")
        .select(`
            id_ta,
            judul_ta,
            status_ta,
            tgl_pengajuan,
            mahasiswa(nama_mhs),
            dokumen_ta(
                catatan_mahasiswa,
                catatan_pembimbing,
                tgl_upload
            )
        `)
        .order("tgl_pengajuan", { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => {
        // Find latest document if available
        let latestDoc = null;
        if (item.dokumen_ta && item.dokumen_ta.length > 0) {
            // Sort to get latest by date
            const sortedDocs = [...item.dokumen_ta].sort((a, b) => new Date(b.tgl_upload).getTime() - new Date(a.tgl_upload).getTime());
            latestDoc = sortedDocs[0];
        }

        const mahasiswaNote = latestDoc?.catatan_mahasiswa || "-";
        const dosenNote = latestDoc?.catatan_pembimbing || item.catatan || "-";

        return {
            id: item.id_ta.toString(),
            studentName: item.mahasiswa?.nama_mhs || "Unknown",
            title: item.judul_ta,
            fileName: "-",
            uploadDate: new Date(item.tgl_pengajuan).toLocaleDateString(),
            status: item.status_ta === "Lulus" ? "approved"
                : item.status_ta === "Ditolak" ? "rejected"
                    : item.status_ta === "Revisi" ? "need_revision"
                        : "pending",
            feedback: `Mhs: ${mahasiswaNote} | Dosen: ${dosenNote}`,
        };
    });
};
