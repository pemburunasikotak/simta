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
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Autocomplete,
    CircularProgress,
    Card,
    CardContent,
    Divider,
} from "@mui/material";
import {
    EditOutlined,
    DeleteOutline,
    RefreshOutlined,
    EventNoteOutlined,
} from "@mui/icons-material";

import { getSchedules, postCreateSchedule, putUpdateSchedule, deleteSchedule } from "@/api/schedule/api";
import { TSchedule } from "@/api/schedule/type";
import { getUsers } from "@/api/user";
import { TUserItem } from "@/api/user/type";
import { useSnackbar } from "notistack";


export default function ScheduleManagePage() {
    const { enqueueSnackbar } = useSnackbar();
    const [schedules, setSchedules] = useState<TSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    console.log('CEK LOADING', loading)
    const [open, setOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<TSchedule | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");

    // Student & Lecturer data
    const [students, setStudents] = useState<TUserItem[]>([]);
    console.log('CEK STUDENT', students)
    const [lecturers, setLecturers] = useState<TUserItem[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState<TUserItem | null>(null);
    const [selectedExaminers, setSelectedExaminers] = useState<TUserItem[]>([]);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const data = await getSchedules();
            setSchedules(data);
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInitialData = async () => {
        setLoadingData(true);
        try {
            const [studentRes, lecturerRes] = await Promise.all([
                getUsers({ roles: "Mahasiswa", limit: 100 }),
                getUsers({ roles: "Dosen", limit: 100 })
            ]);
            setStudents(studentRes.result.data);
            setLecturers(lecturerRes.result.data);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
        fetchInitialData();
    }, []);

    const handleOpenAdd = () => {
        setSelectedSchedule(null);
        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setSelectedStudent(null);
        setSelectedExaminers([]);
        setOpen(true);
    };

    const handleOpenEdit = (schedule: TSchedule) => {
        setSelectedSchedule(schedule);
        setTitle(schedule.title);
        setDate(schedule.date);
        setTime(schedule.time);
        setLocation(schedule.location);

        // Match student and examiners from list if they exist
        const student = students.find(s => s.name === schedule.studentName);
        setSelectedStudent(student || null);

        const currentExaminers = lecturers.filter(l =>
            schedule.examiners.some(e => e.name === l.name)
        );
        setSelectedExaminers(currentExaminers);

        setOpen(true);
    };

    const handleSave = async () => {
        if (!selectedStudent) {
            enqueueSnackbar("Silahkan pilih mahasiswa terlebih dahulu.", { variant: "warning" });
            return;
        }

        if (selectedExaminers.length === 0) {
            enqueueSnackbar("Silahkan pilih minimal 1 penguji.", { variant: "warning" });
            return;
        }

        try {
            const submitPayload = {
                title,
                type: title === "Sidang Proposal" ? "proposal" : title === "Sidang Progress" ? "progress" : "akhir",
                date,
                time,
                location,
                studentId: selectedStudent.id_referensi,
                examinerIds: selectedExaminers.map(e => e.id_referensi),
            };

            if (selectedSchedule) {
                await putUpdateSchedule(String(selectedSchedule.id), submitPayload);
                enqueueSnackbar("Jadwal berhasil diperbarui!", { variant: "success" });
            } else {
                await postCreateSchedule(submitPayload);
                enqueueSnackbar("Jadwal baru berhasil dibuat!", { variant: "success" });
            }
            setOpen(false);
            fetchSchedules();
        } catch (error) {
            enqueueSnackbar("Gagal menyimpan jadwal.", { variant: "error" });
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) return;

        try {
            await deleteSchedule(String(id));
            enqueueSnackbar("Jadwal berhasil dihapus!", { variant: "success" });
            fetchSchedules();
        } catch (error) {
            console.error("Failed to delete schedule:", error);
            enqueueSnackbar("Gagal menghapus jadwal.", { variant: "error" });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Kelola Jadwal Ujian
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Atur jadwal sidang, seminar, dan pengujian untuk mahasiswa dan dosen.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<RefreshOutlined />} onClick={fetchSchedules}>
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EventNoteOutlined />}
                        onClick={handleOpenAdd}
                        sx={{ borderRadius: 2 }}
                    >
                        Buat Jadwal Baru
                    </Button>
                </Stack>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell><strong>Tanggal & Waktu</strong></TableCell>
                            <TableCell><strong>Judul Agenda</strong></TableCell>
                            <TableCell><strong>Mahasiswa</strong></TableCell>
                            <TableCell><strong>Pembimbing</strong></TableCell>
                            <TableCell><strong>Penguji</strong></TableCell>
                            <TableCell><strong>Lokasi</strong></TableCell>
                            <TableCell align="center"><strong>Aksi</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedules.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.date} {item.time}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.studentName}</TableCell>
                                <TableCell>{item.pembimbingName}</TableCell>
                                <TableCell>
                                    {item.examiners?.map((ex, index) => (
                                        <Typography key={index} variant="body2" sx={{ display: "block" }}>
                                            • {ex.name}
                                        </Typography>
                                    ))}
                                </TableCell>
                                <TableCell>{item.location}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Edit Jadwal">
                                        <IconButton onClick={() => handleOpenEdit(item)} color="primary">
                                            <EditOutlined />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Hapus Jadwal">
                                        <IconButton onClick={() => handleDelete(item.id)} color="error">
                                            <DeleteOutline />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    {selectedSchedule ? "Edit Jadwal" : "Buat Jadwal Baru"}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Autocomplete
                            options={["Sidang Proposal", "Sidang Progress", "Sidang Akhir"]}
                            value={title}
                            onChange={(_, newValue) => setTitle(newValue || "")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Nama Agenda"
                                    placeholder="Pilih Agenda"
                                    fullWidth
                                />
                            )}
                        />

                        <Autocomplete
                            options={students}
                            getOptionLabel={(option) => `${option.identity_number} - ${option.name}`}
                            value={selectedStudent}
                            onChange={(_, newValue) => setSelectedStudent(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Pilih Mahasiswa (NRP)"
                                    placeholder="Cari berdasarkan NRP atau Nama"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingData ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />

                        {selectedStudent && (
                            <Card variant="outlined" sx={{ bgcolor: "grey.50", borderStyle: "dashed" }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Detail Mahasiswa
                                    </Typography>
                                    <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">NRP</Typography>
                                            <Typography variant="body2" fontWeight="medium">{selectedStudent?.identity_number}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">Nama Lengkap</Typography>
                                            <Typography variant="body2" fontWeight="medium">{selectedStudent.name}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                                            <Typography variant="body2" fontWeight="medium">{selectedStudent.email || "-"}</Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}

                        <Autocomplete
                            multiple
                            options={lecturers}
                            getOptionLabel={(option) => option.name || ""}
                            value={selectedExaminers}
                            onChange={(_, newValue) => setSelectedExaminers(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Pilih Penguji"
                                    placeholder="Cari Dosen"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingData ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />

                        {selectedExaminers.length > 0 && (
                            <Card variant="outlined" sx={{ bgcolor: "grey.50", borderStyle: "dashed" }}>
                                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Detail Penguji
                                    </Typography>
                                    <Stack spacing={2}>
                                        {selectedExaminers.map((examiner, index) => (
                                            <Box key={examiner.id}>
                                                {index > 0 && <Divider sx={{ my: 1, borderStyle: "dotted" }} />}
                                                <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
                                                    <Box sx={{ minWidth: 100 }}>
                                                        <Typography variant="caption" color="text.secondary" display="block">NIDN/NUPTK/NIP</Typography>
                                                        <Typography variant="body2" fontWeight="medium">{examiner.identity_number}</Typography>
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" color="text.secondary" display="block">Nama Penguji</Typography>
                                                        <Typography variant="body2" fontWeight="medium">{examiner.name}</Typography>
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                                                        <Typography variant="body2" fontWeight="medium">{examiner.email || "-"}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}

                        <Stack direction="row" spacing={2}>
                            <TextField label="Tanggal" type="date" fullWidth InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} />
                            <TextField label="Waktu" type="time" fullWidth InputLabelProps={{ shrink: true }} value={time} onChange={(e) => setTime(e.target.value)} />
                        </Stack>
                        <TextField label="Lokasi" placeholder="Contoh: Ruang Sidang 1 / Zoom" fullWidth value={location} onChange={(e) => setLocation(e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 3 }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Batal</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2 }}>
                        Simpan Jadwal
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
