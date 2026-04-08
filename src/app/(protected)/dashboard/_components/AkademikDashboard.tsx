import { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, Grid, Chip, CircularProgress,
    LinearProgress, Divider, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Avatar,
} from "@mui/material";
import {
    SchoolOutlined, AssignmentOutlined, HourglassEmptyOutlined, PeopleOutlined,
} from "@mui/icons-material";
import { getAllProposals } from "@/api/ta/api";
import { TTAProgress } from "@/api/ta/type";
import { TUserItem } from "@/api/user/type";
import { supabase } from "@/libs/supabase";
import { StatCard, STATUS_CONFIG } from "./shared";

export default function AkademikDashboard({ user }: { user: TUserItem | undefined }) {
    console.log('CEK CEK', user)
    const [submissions, setSubmissions] = useState<TTAProgress[]>([]);
    const [totalMhs, setTotalMhs] = useState(0);
    const [totalDsn, setTotalDsn] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getAllProposals(),
            supabase.from("profiles").select("role").eq("role", "mahasiswa").then(({ data }) => setTotalMhs(data?.length || 0)),
            supabase.from("profiles").select("role").eq("role", "dosen").then(({ data }) => setTotalDsn(data?.length || 0)),
        ]).then(([subs]) => setSubmissions(subs)).finally(() => setLoading(false));
    }, []);

    const pending = submissions.filter(s => s.status === "pending").length;
    const reviewed = submissions.filter(s => s.status === "reviewed").length;
    const approved = submissions.filter(s => s.status === "approved").length;
    const rejected = submissions.filter(s => s.status === "rejected").length;
    const total = submissions.length || 1;

    const statusDist = [
        { key: "approved", count: approved, color: "#2e7d32" },
        { key: "reviewed", count: reviewed, color: "#0288d1" },
        { key: "pending", count: pending, color: "#ed6c02" },
        { key: "rejected", count: rejected, color: "#d32f2f" },
    ];

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Dashboard Akademik 📊</Typography>
                <Typography variant="body2" color="text.secondary">Ringkasan keseluruhan aktivitas Tugas Akhir mahasiswa.</Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Total Mahasiswa" value={totalMhs} icon={<SchoolOutlined />} color="#1976d2" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Total Dosen" value={totalDsn} icon={<PeopleOutlined />} color="#7b1fa2" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Total Submission" value={submissions.length} icon={<AssignmentOutlined />} color="#0288d1" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Menunggu Review" value={pending} icon={<HourglassEmptyOutlined />} color="#ed6c02" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Distribusi Status</Typography>
                            <Box sx={{ display: "flex", borderRadius: 2, overflow: "hidden", height: 20, mb: 3, mt: 2 }}>
                                {statusDist.map(({ key, count, color }) => (
                                    <Box key={key} sx={{ width: `${(count / total) * 100}%`, bgcolor: color }} />
                                ))}
                            </Box>
                            <Stack spacing={2}>
                                {statusDist.map(({ key, count, color }) => (
                                    <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: color }} />
                                            <Typography variant="body2">{STATUS_CONFIG[key].label}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <LinearProgress variant="determinate" value={(count / total) * 100}
                                                sx={{ width: 100, borderRadius: 5, height: 6, bgcolor: "#f0f0f0", "& .MuiLinearProgress-bar": { bgcolor: color } }} />
                                            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 24 }}>{count}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">Total submission</Typography>
                                <Typography variant="body2" fontWeight="bold">{submissions.length}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={12}>
                    <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Submission Terbaru</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                                        <TableRow>
                                            <TableCell><strong>Mahasiswa</strong></TableCell>
                                            <TableCell><strong>Judul</strong></TableCell>
                                            <TableCell><strong>Tanggal</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {submissions.slice(0, 10).map((item) => {
                                            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                                            return (
                                                <TableRow key={item.id} hover>
                                                    <TableCell>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "#7b1fa2" }}>
                                                                {item.studentName.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="body2">{item.studentName}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {item.title}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" color="text.secondary">{item.uploadDate}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip icon={cfg.icon as any} label={cfg.label} size="small" color={cfg.color} variant="outlined" />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}