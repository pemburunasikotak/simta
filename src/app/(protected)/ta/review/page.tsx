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
} from "@mui/material";
import { RateReviewOutlined, RefreshOutlined, CheckCircleOutline } from "@mui/icons-material";

import { getAllProposals, postTAFeedback } from "@/api/ta/api";
import { TTAProgress } from "@/api/ta/type";
import { useSnackbar } from "notistack";

export default function TAReviewPage() {
    const { enqueueSnackbar } = useSnackbar();
    const [submissions, setSubmissions] = useState<TTAProgress[]>([]);
    const [loading, setLoading] = useState(true);
    console.log('CEK LOADING', loading)
    const [selectedItem, setSelectedItem] = useState<TTAProgress | null>(null);
    const [feedback, setFeedback] = useState("");
    const [status, setStatus] = useState<"reviewed" | "approved" | "rejected">("reviewed");
    const [assessment, setAssessment] = useState<number>(0);
    const [open, setOpen] = useState(false);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const data = await getAllProposals();
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleOpenReview = (item: TTAProgress) => {
        setSelectedItem(item);
        setFeedback(item.feedback || "");
        setAssessment(item.assessment || 0);
        setStatus("reviewed");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    const handleSubmitReview = async () => {
        if (!selectedItem) return;
        try {
            await postTAFeedback({
                progressId: selectedItem.id,
                feedback,
                status,
                assessment,
            });
            enqueueSnackbar("Review berhasil disimpan!", { variant: "success" });
            handleClose();
            fetchSubmissions();
        } catch (error) {
            enqueueSnackbar("Gagal menyimpan review.", { variant: "error" });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "success";
            case "reviewed": return "info";
            case "rejected": return "error";
            default: return "warning";
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Review Tugas Akhir
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Berikan feedback, penilaian, dan persetujuan pada progress TA Mahasiswa.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<RefreshOutlined />} onClick={fetchSubmissions}>
                    Refresh
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell><strong>Mahasiswa</strong></TableCell>
                            <TableCell><strong>Judul TA</strong></TableCell>
                            <TableCell><strong>File</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Aksi</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submissions.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.studentName}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.fileName}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.status.toUpperCase()}
                                        color={getStatusColor(item.status) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        size="small"
                                        startIcon={<RateReviewOutlined />}
                                        onClick={() => handleOpenReview(item)}
                                        variant="contained"
                                        color="primary"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Review
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: "bold" }}>Review TA: {selectedItem?.studentName}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Judul TA:</Typography>
                            <Typography variant="body1">{selectedItem?.title}</Typography>
                        </Box>

                        <TextField
                            label="Status"
                            select
                            fullWidth
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                        >
                            <MenuItem value="reviewed">Reviewed</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </TextField>

                        <TextField
                            label="Nilai (0-100)"
                            type="number"
                            fullWidth
                            value={assessment}
                            onChange={(e) => setAssessment(Number(e.target.value))}
                        />

                        <TextField
                            label="Feedback / Catatan Revisi"
                            multiline
                            rows={4}
                            fullWidth
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Berikan masukan untuk mahasiswa..."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 3 }}>
                    <Button onClick={handleClose} color="inherit">Batal</Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        startIcon={<CheckCircleOutline />}
                        sx={{ borderRadius: 2 }}
                    >
                        Simpan Review
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
