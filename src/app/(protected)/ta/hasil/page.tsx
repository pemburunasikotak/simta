"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Button,
    Chip,
    Stack,
} from "@mui/material";
import { RefreshOutlined, AssignmentTurnedInOutlined, PersonOutlined, StarBorderOutlined, CommentOutlined, PrintOutlined } from "@mui/icons-material";
import { useSession } from "@/app/_components/providers/session";
import { getStudentExamResults } from "@/api/schedule/api";
import { useSnackbar } from "notistack";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { PrintableRevisiForm } from "./_components/PrintableRevisiForm";

export default function TAExamResultsPage() {
    const { session } = useSession();
    const { enqueueSnackbar } = useSnackbar();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        if (!session?.user?.id_referensi) return;
        setLoading(true);
        try {
            const data = await getStudentExamResults(session.user.id_referensi);
            setResults(data);
        } catch (error) {
            console.error("Failed to fetch exam results:", error);
            enqueueSnackbar("Gagal mengambil hasil sidang.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchResults();
        }
    }, [session?.user]);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Hasil Tugas Akhir
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Lihat evaluasi, nilai, dan catatan hasil sidang dari masing-masing dosen penguji.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<RefreshOutlined />} onClick={fetchResults}>
                    Refresh
                </Button>
            </Box>

            {loading ? (
                <Typography>Loading data...</Typography>
            ) : results.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 10, bgcolor: "#f8f9fa", borderRadius: 3 }}>
                    <AssignmentTurnedInOutlined sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">Belum Ada Hasil Sidang</Typography>
                    <Typography variant="body2" color="text.disabled">Anda belum memiliki jadwal ujian yang diringkas atau dinilai.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {results.map((jadwal) => (
                        <ResultCard key={jadwal.id_jadwal} jadwal={jadwal} session={session} />
                    ))}
                </Grid>
            )}
        </Box>
    );
}

function ResultCard({ jadwal, session }: { jadwal: any; session: any }) {
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Revisi_TA_${jadwal.tipe_sidang}_${session?.user?.name || ""}`,
    });

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                {jadwal.tipe_sidang}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tanggal Ujian: {new Date(jadwal.tgl_sidang).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                                Judul TA: {jadwal.judul_ta}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                                variant="contained"
                                startIcon={<PrintOutlined />}
                                size="small"
                                onClick={() => handlePrint()}
                                sx={{ borderRadius: 2 }}
                            >
                                Print PDF
                            </Button>
                            <Chip label="Sesuai Jadwal" color="default" />
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Hidden printable component */}
                    <div style={{ display: "none" }}>
                        <PrintableRevisiForm
                            ref={componentRef}
                            jadwal={jadwal}
                            session={session}
                        />
                    </div>

                    <Typography variant="subtitle2" gutterBottom color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                        Rincian Evaluasi Penguji
                    </Typography>

                    <List>
                        {jadwal.penguji.map((p: any, idx: number) => (
                            <ListItem key={idx} alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: "primary.light" }}>
                                        <PersonOutlined />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {p.nama_dosen}
                                            </Typography>
                                            <Chip
                                                icon={<StarBorderOutlined fontSize="small" />}
                                                label={`Nilai: ${p.nilai || 0}`}
                                                color={p.nilai >= 80 ? "success" : p.nilai > 0 ? "warning" : "default"}
                                                variant={p.nilai > 0 ? "filled" : "outlined"}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ bgcolor: "#f1f3f4", p: 2, borderRadius: 2, display: "flex", alignItems: "flex-start", gap: 1.5, mt: 1 }}>
                                            <CommentOutlined sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold" color="text.primary" gutterBottom>
                                                    Feedback / Catatan Revisi:
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                                                    {p.catatan || "Belum ada catatan dari penguji ini."}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Grid>
    );
}
