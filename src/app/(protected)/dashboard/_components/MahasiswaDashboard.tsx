import { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, Grid, Chip, CircularProgress,
    Divider, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
} from "@mui/material";
import {
    CheckCircleOutlined, HourglassEmptyOutlined,
    RateReviewOutlined, DescriptionOutlined,
} from "@mui/icons-material";
import { getTAProgress } from "@/api/ta/api";
import { TTAProgress } from "@/api/ta/type";
import { TUserItem } from "@/api/user/type";
import { StatCard, STATUS_CONFIG } from "./shared";

export default function MahasiswaDashboard({ user }: { user: TUserItem | undefined }) {
    const [submissions, setSubmissions] = useState<TTAProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTAProgress().then(setSubmissions).finally(() => setLoading(false));
    }, []);

    const latest = submissions[0];
    const approved = submissions.filter(s => s.status === "approved").length;
    const reviewed = submissions.filter(s => s.status === "reviewed").length;
    const pending = submissions.filter(s => s.status === "pending").length;
    const progress = submissions.length > 0 ? Math.round((approved / submissions.length) * 100) : 0;

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Halo, {user?.name} 👋</Typography>
                <Typography variant="body2" color="text.secondary">Pantau progress Tugas Akhir kamu di sini.</Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Total Submission" value={submissions.length} icon={<DescriptionOutlined />} color="#1976d2" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Approved" value={approved} icon={<CheckCircleOutlined />} color="#2e7d32" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Reviewed" value={reviewed} icon={<RateReviewOutlined />} color="#0288d1" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Pending" value={pending} icon={<HourglassEmptyOutlined />} color="#ed6c02" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={12}>
                    <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Progress TA</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", py: 3 }}>
                                <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={progress}
                                        size={120}
                                        thickness={5}
                                        sx={{ color: progress === 100 ? "success.main" : "primary.main" }}
                                    />
                                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography variant="h5" fontWeight="bold">{progress}%</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {approved} dari {submissions.length} submission disetujui
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={1}>
                                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                    <Box key={key} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Chip icon={cfg.icon as any} label={cfg.label} size="small" color={cfg.color} variant="outlined" />
                                        <Typography variant="body2" fontWeight={600}>
                                            {submissions.filter(s => s.status === key).length}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={12}>
                    <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Riwayat Submission</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                                        <TableRow>
                                            <TableCell><strong>Judul</strong></TableCell>
                                            <TableCell><strong>Tanggal</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                            <TableCell><strong>Nilai</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {submissions.map((item) => {
                                            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                                            return (
                                                <TableRow key={item.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {item.title}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">{item.uploadDate}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip icon={cfg.icon as any} label={cfg.label} size="small" color={cfg.color} variant="outlined" />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600}>{item.assessment ?? "-"}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {latest?.feedback && (
                                <Box sx={{ mt: 3, p: 2, bgcolor: "#f0f7ff", borderRadius: 2, borderLeft: "4px solid #1976d2" }}>
                                    <Typography variant="caption" color="text.secondary">Feedback Terbaru</Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>{latest.feedback}</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}