import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
    IconButton,
} from "@mui/material";
import { UploadFileOutlined, RefreshOutlined, CloseOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useSession } from "@/app/_components/providers/session";

import { getTAProgress, postUploadTA } from "@/api/ta/api";
import { TTAProgress } from "@/api/ta/type";

export default function TAProgressPage() {
    const [progress, setProgress] = useState<TTAProgress[]>([]);
    const [loading, setLoading] = useState(true);

    const { enqueueSnackbar } = useSnackbar();
    const { session } = useSession();

    // Upload Modal State
    const [openUpload, setOpenUpload] = useState(false);
    const [judulTA, setJudulTA] = useState("");
    const [abstrak, setAbstrak] = useState("");
    const [tipeDokumen, setTipeDokumen] = useState("Proposal");
    const [catatan, setCatatan] = useState("");
    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchProgress = async () => {
        setLoading(true);
        try {
            const data = await getTAProgress(session?.user?.id_referensi);
            setProgress(data);
        } catch (error) {
            console.error("Failed to fetch TA progress:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchProgress();
        }
    }, [session?.user]);

    const handleUploadSubmit = async () => {
        if (!judulTA.trim()) {
            enqueueSnackbar("Judul Tugas Akhir wajib diisi", { variant: "warning" });
            return;
        }
        if (!fileUpload) {
            enqueueSnackbar("Silahkan pilih file terlebih dahulu", { variant: "warning" });
            return;
        }
        if (!session?.user?.id_referensi) {
            enqueueSnackbar("ID Mahasiswa tidak terdeteksi", { variant: "error" });
            return;
        }

        setUploading(true);
        try {
            await postUploadTA({
                id_mhs: session.user.id_referensi,
                judul_ta: judulTA,
                abstrak: abstrak,
                tipe_dokumen: tipeDokumen,
                catatan_mahasiswa: catatan,
                file: fileUpload,
            });
            enqueueSnackbar("Progress berhasil diupload!", { variant: "success" });
            setOpenUpload(false);
            setFileUpload(null);
            setJudulTA("");
            setAbstrak("");
            setCatatan("");
            fetchProgress();
        } catch (error) {
            console.error("Upload error:", error);
            enqueueSnackbar("Gagal mengupload progress", { variant: "error" });
        } finally {
            setUploading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "success";
            case "need_revision":
            case "reviewed":
                return "info";
            case "rejected":
                return "error";
            default:
                return "warning";
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Progress Tugas Akhir
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Pantau status dan riwayat pengajuan Tugas Akhir Anda.
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" startIcon={<RefreshOutlined />} onClick={fetchProgress}>
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<UploadFileOutlined />}
                        onClick={() => setOpenUpload(true)}
                        sx={{
                            background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                            boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                        }}
                    >
                        Upload Progress Baru
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell><strong>Tanggal</strong></TableCell>
                            <TableCell><strong>Judul Pengajuan</strong></TableCell>
                            <TableCell><strong>Nama File</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Feedback</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {progress.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.uploadDate}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.fileName}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.status.toUpperCase()}
                                        color={getStatusColor(item.status) as any}
                                        size="small"
                                        sx={{ fontWeight: "bold" }}
                                    />
                                </TableCell>
                                <TableCell>{item.feedback || "-"}</TableCell>
                            </TableRow>
                        ))}
                        {progress.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">Belum ada data progress.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Upload Dialog */}
            <Dialog open={openUpload} onClose={() => setOpenUpload(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight="bold">Upload Progress TA</Typography>
                    <IconButton onClick={() => setOpenUpload(false)} size="small"><CloseOutlined /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        <TextField
                            label="Judul Tugas Akhir"
                            fullWidth
                            value={judulTA}
                            onChange={(e) => setJudulTA(e.target.value)}
                            required
                        />

                        <TextField
                            label="Abstrak Singkat (Opsional)"
                            fullWidth
                            multiline
                            rows={2}
                            value={abstrak}
                            onChange={(e) => setAbstrak(e.target.value)}
                        />

                        <TextField
                            select
                            label="Tipe Dokumen"
                            fullWidth
                            value={tipeDokumen}
                            onChange={(e) => setTipeDokumen(e.target.value)}
                        >
                            <MenuItem value="Proposal">Proposal</MenuItem>
                            <MenuItem value="Bab 1-3">Bab 1-3 (Progress)</MenuItem>
                            <MenuItem value="Laporan Akhir">Laporan Akhir</MenuItem>
                            <MenuItem value="Revisi">Revisi</MenuItem>
                        </TextField>

                        <TextField
                            label="Catatan / Pesan untuk Pembimbing"
                            fullWidth
                            multiline
                            rows={3}
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                        />

                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                File Dokumen (PDF disarankan)
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<UploadFileOutlined />}
                                sx={{ justifyContent: "flex-start", py: 1.5, borderColor: "divider" }}
                            >
                                {fileUpload ? fileUpload.name : "Pilih File..."}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFileUpload(e.target.files[0]);
                                        }
                                    }}
                                />
                            </Button>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 3 }}>
                    <Button onClick={() => setOpenUpload(false)} color="inherit" disabled={uploading}>Batal</Button>
                    <Button
                        onClick={handleUploadSubmit}
                        variant="contained"
                        disabled={uploading}
                        sx={{ borderRadius: 2 }}
                    >
                        {uploading ? "Mengupload..." : "Upload Sekarang"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
