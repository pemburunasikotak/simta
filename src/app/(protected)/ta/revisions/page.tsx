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
} from "@mui/material";
import { PrintOutlined, DownloadOutlined, RefreshOutlined } from "@mui/icons-material";

import { getTAProgress } from "@/api/ta/api";
import { TTAProgress } from "@/api/ta/type"

export default function TARevisionsPage() {
    const [revisions, setRevisions] = useState<TTAProgress[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRevisions = async () => {
        setLoading(true);
        try {
            const data = await getTAProgress();
            // Only show reviewed or approved items that have feedback/revisions
            setRevisions(data.filter((item) => item.status === "reviewed" || item.status === "approved"));
        } catch (error) {
            console.error("Failed to fetch TA revisions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevisions();
    }, []);

    const handlePrint = (item: TTAProgress) => {
        console.log("Printing revision for:", item.title);
        alert(`Mencetak hasil revisi untuk: ${item.title}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Hasil Revisi TA
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Cetak hasil revisi dan feedback dari Dosen Pembimbing/Penguji.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<RefreshOutlined />} onClick={fetchRevisions}>
                    Refresh
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell><strong>Tanggal</strong></TableCell>
                            <TableCell><strong>Judul TA</strong></TableCell>
                            <TableCell><strong>Feedback / Catatan Revisi</strong></TableCell>
                            <TableCell align="center"><strong>Aksi</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {revisions.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.uploadDate}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell sx={{ maxWidth: 400 }}>{item.feedback || "Tidak ada catatan."}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Cetak Hasil Revisi">
                                        <IconButton onClick={() => handlePrint(item)} color="primary">
                                            <PrintOutlined />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Download Dokumen">
                                        <IconButton color="secondary">
                                            <DownloadOutlined />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {revisions.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">Belum ada data revisi yang tersedia.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
