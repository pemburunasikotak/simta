"use client";

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
    Stack,
    IconButton,
    Divider,
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    List,
} from "@mui/material";
import { RefreshOutlined, RateReviewOutlined, CloseOutlined, PersonOutlined, StarHalfOutlined } from "@mui/icons-material";
import { useSession } from "@/app/_components/providers/session";
import { getExaminerSchedules, putExaminerFeedback } from "@/api/schedule/api";
import { useSnackbar } from "notistack";

export default function ScheduleReviewPage() {
    const { session } = useSession();
    const { enqueueSnackbar } = useSnackbar();
    
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    
    // Form state
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
    const [nilai, setNilai] = useState<number | "">("");
    const [catatan, setCatatan] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchSchedules = async () => {
        if (!session?.user?.id_referensi) return;
        setLoading(true);
        try {
            const data = await getExaminerSchedules(session.user.id_referensi);
            setSchedules(data);
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
            enqueueSnackbar("Gagal mengambil jadwal ujian asisten", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchSchedules();
        }
    }, [session?.user]);

    const handleOpenReview = (jadwal: any) => {
        setSelectedSchedule(jadwal);
        setNilai(jadwal.nilai || "");
        setCatatan(jadwal.catatan || "");
        setOpen(true);
    };

    const handleSave = async () => {
        if (nilai === "" || Number(nilai) < 0 || Number(nilai) > 100) {
            enqueueSnackbar("Harap berikan nilai dari 0 hingga 100", { variant: "warning" });
            return;
        }

        if (!session?.user?.id_referensi) return;

        setSaving(true);
        try {
            await putExaminerFeedback(selectedSchedule.id_jadwal, session.user.id_referensi, {
                nilai: Number(nilai),
                catatan
            });
            enqueueSnackbar("Evaluasi berhasil disimpan!", { variant: "success" });
            setOpen(false);
            fetchSchedules(); // Refresh to reflect new data
        } catch (error) {
            console.error("Saving evaluated issue:", error);
            enqueueSnackbar("Gagal menyimpan evaluasi.", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Review Sidang
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Berikan nilai dan masukan ujian spesifik pada sidang di mana Anda menjadi Penguji.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<RefreshOutlined />} onClick={fetchSchedules}>
                    Refresh
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell><strong>Tanggal & Waktu</strong></TableCell>
                            <TableCell><strong>Tipe Sidang</strong></TableCell>
                            <TableCell><strong>Mahasiswa</strong></TableCell>
                            <TableCell><strong>Ruangan</strong></TableCell>
                            <TableCell><strong>Status Nilai Anda</strong></TableCell>
                            <TableCell align="center"><strong>Aksi</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Loading...</TableCell>
                            </TableRow>
                        ) : schedules.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <Typography color="text.secondary">Anda tidak memiliki jadwal terdaftar sebagai penguji.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            schedules.map((jadwal) => (
                                <TableRow key={jadwal.id_jadwal} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {new Date(jadwal.tgl_sidang).toLocaleDateString("id-ID")}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(jadwal.tgl_sidang).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{jadwal.tipe_sidang || "Sidang"}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{jadwal.nama_mhs}</Typography>
                                        <Typography variant="caption" color="text.secondary">NIM: {jadwal.nim}</Typography>
                                    </TableCell>
                                    <TableCell>{jadwal.ruangan || "-"}</TableCell>
                                    <TableCell>
                                        {jadwal.nilai && jadwal.nilai > 0 ? (
                                            <Chip label={`Ternilai (${jadwal.nilai})`} color="success" size="small" />
                                        ) : (
                                            <Chip label="Belum Dinilai" color="warning" size="small" variant="outlined" />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            startIcon={<RateReviewOutlined />}
                                            onClick={() => handleOpenReview(jadwal)}
                                            variant="contained"
                                            color="primary"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Evaluasi
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Evaluation Modal */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight="bold">Form Evaluasi Sidang</Typography>
                    <IconButton onClick={() => setOpen(false)} size="small"><CloseOutlined /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Box p={2} bgcolor="#f8f9fa" borderRadius={2}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">Mahasiswa</Typography>
                                <Typography variant="body2" fontWeight="bold">: {selectedSchedule?.nama_mhs}</Typography>
                                <Typography variant="body2" color="text.secondary">Tipe Sidang</Typography>
                                <Typography variant="body2" fontWeight="bold">: {selectedSchedule?.tipe_sidang}</Typography>
                                <Typography variant="body2" color="text.secondary">Judul TA</Typography>
                                <Typography variant="body2" fontWeight="bold">: {selectedSchedule?.judul_ta}</Typography>
                            </Box>
                        </Box>

                        <TextField
                            label="Nilai Sidang"
                            type="number"
                            fullWidth
                            required
                            value={nilai}
                            onChange={(e) => setNilai(e.target.value === "" ? "" : Number(e.target.value))}
                            inputProps={{ min: 0, max: 100 }}
                            helperText="Rentang nilai 0 - 100"
                        />

                        <TextField
                            label="Catatan Revisi / Feedback"
                            multiline
                            rows={4}
                            fullWidth
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Berikan masukan mendetail untuk revisi mahasiswa..."
                        />
                        
                        {selectedSchedule?.rekan_penguji && selectedSchedule.rekan_penguji.length > 0 && (
                            <Box mt={2}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                                    Evaluasi dari Rekan Penguji
                                </Typography>
                                <List disablePadding>
                                    {selectedSchedule.rekan_penguji.map((penguji: any) => (
                                        <ListItem key={penguji.id_dosen} alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                                                    <PersonOutlined fontSize="small" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {penguji.nama_dosen} {penguji.id_dosen === session?.user?.id_referensi && "(Anda)"}
                                                        </Typography>
                                                        {penguji.nilai > 0 ? (
                                                            <Chip icon={<StarHalfOutlined fontSize="small"/>} label={penguji.nilai} size="small" variant="outlined" color="success" />
                                                        ) : (
                                                            <Chip label="Belum Menilai" size="small" variant="outlined" color="warning" />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: penguji.catatan ? "normal" : "italic" }}>
                                                        {penguji.catatan || "Belum ada catatan."}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 3 }}>
                    <Button onClick={() => setOpen(false)} color="inherit" disabled={saving}>Batal</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={saving}
                        sx={{ borderRadius: 2 }}
                    >
                        {saving ? "Menyimpan..." : "Simpan Evaluasi"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
