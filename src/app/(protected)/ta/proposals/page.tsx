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
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    TablePagination,
    Skeleton,
} from "@mui/material";
import {
    VisibilityOutlined,
    RefreshOutlined,
    FileDownloadOutlined,
    SearchOutlined,
    AllInboxOutlined,
    CheckCircleOutlined,
    RateReviewOutlined,
    CancelOutlined,
    HourglassEmptyOutlined,
} from "@mui/icons-material";

import { getAllProposals } from "@/api/ta/api";
import { TTAProgress } from "@/api/ta/type";

const STATUS_CONFIG: Record<string, { label: string; color: "success" | "info" | "error" | "warning"; icon: React.ReactNode }> = {
    approved: { label: "Approved", color: "success", icon: <CheckCircleOutlined fontSize="small" /> },
    reviewed: { label: "Reviewed", color: "info", icon: <RateReviewOutlined fontSize="small" /> },
    rejected: { label: "Rejected", color: "error", icon: <CancelOutlined fontSize="small" /> },
    pending: { label: "Pending", color: "warning", icon: <HourglassEmptyOutlined fontSize="small" /> },
};

export default function ProposalsPage() {
    const [allProposals, setAllProposals] = useState<TTAProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchProposals = async () => {
        setLoading(true);
        try {
            const data = await getAllProposals();
            setAllProposals(data);
        } catch (error) {
            console.error("Failed to fetch proposals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProposals(); }, []);

    // Filter di frontend
    const filteredProposals = allProposals.filter((item) => {
        const matchStatus = !statusFilter || item.status === statusFilter;
        const matchSearch = !search ||
            item.studentName?.toLowerCase().includes(search.toLowerCase()) ||
            item.title?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const paginatedProposals = filteredProposals.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Hitung jumlah per status untuk badge di toggle
    const countByStatus = (status: string) =>
        allProposals.filter((p) => p.status === status).length;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Semua Proposal & Progress TA
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Pantau semua aktivitas pengajuan Tugas Akhir mahasiswa secara keseluruhan.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<RefreshOutlined />}
                    onClick={fetchProposals}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Box>

            {/* Filter Bar */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
                <TextField
                    placeholder="Cari nama mahasiswa atau judul TA..."
                    size="small"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    sx={{ minWidth: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />

                <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={(_, val) => { setStatusFilter(val); setPage(0); }}
                    size="small"
                >
                    <ToggleButton value={null as any}>
                        <AllInboxOutlined fontSize="small" sx={{ mr: 0.5 }} />
                        Semua
                        <Chip
                            label={allProposals.length}
                            size="small"
                            sx={{ ml: 0.8, height: 18, fontSize: 10 }}
                        />
                    </ToggleButton>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <ToggleButton key={key} value={key}>
                            <Box sx={{ mr: 0.5, display: "flex", alignItems: "center" }}>
                                {config.icon}
                            </Box>
                            {config.label}
                            <Chip
                                label={countByStatus(key)}
                                size="small"
                                color={config.color}
                                sx={{ ml: 0.8, height: 18, fontSize: 10 }}
                            />
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                    Menampilkan {filteredProposals.length} dari {allProposals.length} submission
                </Typography>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell><strong>Mahasiswa</strong></TableCell>
                            <TableCell><strong>Judul TA</strong></TableCell>
                            <TableCell><strong>Tanggal Upload</strong></TableCell>
                            <TableCell><strong>Status Proposal</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Aksi</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: rowsPerPage }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : paginatedProposals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                    <AllInboxOutlined sx={{ fontSize: 40, mb: 1, opacity: 0.3, display: "block", mx: "auto" }} />
                                    <Typography variant="body2">Tidak ada data submission</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProposals.map((item) => {
                                const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                                return (
                                    <TableRow key={item.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {item.studentName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxWidth: 320,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.uploadDate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                PROPOSAL
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={config.icon as any}
                                                label={config.label}
                                                color={config.color}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Lihat Detail">
                                                <IconButton color="primary" size="small">
                                                    <VisibilityOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download File">
                                                <IconButton color="secondary" size="small">
                                                    <FileDownloadOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredProposals.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Baris per halaman:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
                />
            </TableContainer>
        </Box>
    );
}