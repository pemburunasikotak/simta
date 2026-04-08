import { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, Grid, Chip, CircularProgress,
    LinearProgress, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar,
} from "@mui/material";
import {
    CheckCircleOutlined, HourglassEmptyOutlined,
    RateReviewOutlined, PeopleOutlined,
} from "@mui/icons-material";
import { getAllProposals } from "@/api/ta/api";
import { TTAProgress } from "@/api/ta/type";
import { TUserItem } from "@/api/user/type";
import { StatCard, STATUS_CONFIG } from "./shared";

export default function DosenDashboard({ user }: { user: TUserItem | undefined }) {
    const [submissions, setSubmissions] = useState<TTAProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllProposals().then(setSubmissions).finally(() => setLoading(false));
    }, []);

    const pending = submissions.filter(s => s.status === "pending").length;
    const reviewed = submissions.filter(s => s.status === "reviewed").length;
    const approved = submissions.filter(s => s.status === "approved").length;

    const byStudent = submissions.reduce((acc: Record<string, TTAProgress[]>, item) => {
        if (!acc[item.studentName]) acc[item.studentName] = [];
        acc[item.studentName].push(item);
        return acc;
    }, {});

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Halo, {user?.name} 👋</Typography>
                <Typography variant="body2" color="text.secondary">Pantau progress mahasiswa bimbingan Anda.</Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Total Mahasiswa" value={Object.keys(byStudent).length} icon={<PeopleOutlined />} color="#7b1fa2" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Menunggu Review" value={pending} icon={<HourglassEmptyOutlined />} color="#ed6c02" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Sudah Direview" value={reviewed} icon={<RateReviewOutlined />} color="#0288d1" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Approved" value={approved} icon={<CheckCircleOutlined />} color="#2e7d32" />
                </Grid>
            </Grid>

            <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Progress per Mahasiswa</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                                <TableRow>
                                    <TableCell><strong>Mahasiswa</strong></TableCell>
                                    <TableCell><strong>Total</strong></TableCell>
                                    <TableCell><strong>Approved</strong></TableCell>
                                    <TableCell><strong>Pending</strong></TableCell>
                                    <TableCell><strong>Progress</strong></TableCell>
                                    <TableCell><strong>Status Terakhir</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(byStudent).map(([name, subs]) => {
                                    const approvedCount = subs.filter(s => s.status === "approved").length;
                                    const pendingCount = subs.filter(s => s.status === "pending").length;
                                    const prog = Math.round((approvedCount / subs.length) * 100);
                                    const cfg = STATUS_CONFIG[subs[0]?.status] || STATUS_CONFIG.pending;
                                    return (
                                        <TableRow key={name} hover>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "#1976d2" }}>
                                                        {name.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight={500}>{name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{subs.length}</TableCell>
                                            <TableCell>{approvedCount}</TableCell>
                                            <TableCell>{pendingCount}</TableCell>
                                            <TableCell sx={{ minWidth: 140 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <LinearProgress variant="determinate" value={prog} sx={{ flex: 1, borderRadius: 5, height: 6 }} color={prog === 100 ? "success" : "primary"} />
                                                    <Typography variant="caption">{prog}%</Typography>
                                                </Box>
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
        </Box>
    );
}