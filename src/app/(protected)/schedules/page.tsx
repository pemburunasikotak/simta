import { useState, useEffect, useMemo } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Stack,
    Divider,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Skeleton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
} from "@mui/material";
import {
    CalendarTodayOutlined,
    AccessTimeOutlined,
    LocationOnOutlined,
    PersonOutlined,
    TodayOutlined,
    DateRangeOutlined,
    AllInclusiveOutlined,
    CloseOutlined,
    TimerOutlined,
    NotesOutlined,
    LinkOutlined,
    SchoolOutlined,
    InfoOutlined,
    ListAltOutlined,
} from "@mui/icons-material";

import { getSchedules } from "@/api/schedule/api";
import { TSchedule } from "@/api/schedule/type";
import { useSession } from "@/app/_components/providers/session";

type DateFilter = "all" | "today" | "week" | "month" | "custom";

const today = new Date().toISOString().split("T")[0];

function toLocalDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
}

const TYPE_CONFIG: Record<string, { label: string; color: "error" | "primary" | "warning"; borderColor: string }> = {
    "Sidang Akhir": { label: "Sidang Akhir", color: "error", borderColor: "#d32f2f" },
    "Sidang Proposal": { label: "Sidang Proposal", color: "primary", borderColor: "#1976d2" },
    "Sidang Progress": { label: "Sidang Progress", color: "warning", borderColor: "#ed6c02" },
};

const STATUS_CONFIG: Record<string, { label: string; color: "success" | "warning" | "info" | "error" | "default" }> = {
    "Belum": { label: "Belum Dimulai", color: "info" },
    "Selesai": { label: "Selesai", color: "success" },
};

const ROLE_CONFIG: Record<string, { color: "primary" | "secondary" | "default" }> = {
    "Pembimbing": { color: "primary" },
    "Penguji": { color: "secondary" },
};

// ─── Detail Dialog ────────────────────────────────────────────────────────────
function ScheduleDetailDialog({
    schedule,
    open,
    onClose,
}: {
    schedule: TSchedule | null;
    open: boolean;
    onClose: () => void;
}) {
    if (!schedule) return null;

    const typeConfig = TYPE_CONFIG[schedule.type || ""] || TYPE_CONFIG["Sidang Proposal"];
    const statusConfig = STATUS_CONFIG[schedule.status || ""] || STATUS_CONFIG["Belum"];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                            <Chip label={typeConfig.label} size="small" color={typeConfig.color} variant="outlined" />
                            <Chip label={statusConfig.label} size="small" color={statusConfig.color} variant="filled" />
                        </Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.3 }}>
                            {schedule.title}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ mt: 0.5 }}>
                        <CloseOutlined fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2.5}>
                    {/* Mahasiswa */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                            Mahasiswa
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2", fontSize: 13 }}>
                                {schedule.studentName?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight={600}>{schedule.studentName}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Pembimbing: {schedule.pembimbingName || "-"}
                                </Typography>
                                {schedule.studentEmail && (
                                    <Typography variant="caption" color="text.secondary">{schedule.studentEmail}</Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Waktu & Tempat */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                            Waktu & Tempat
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <CalendarTodayOutlined fontSize="small" color="action" />
                                <Typography variant="body2">{toLocalDate(schedule.date)}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <AccessTimeOutlined fontSize="small" color="action" />
                                <Typography variant="body2">{schedule.time} WIB</Typography>
                            </Box>
                            {schedule.duration_minutes && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <TimerOutlined fontSize="small" color="action" />
                                    <Typography variant="body2">{schedule.duration_minutes} menit</Typography>
                                </Box>
                            )}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <LocationOnOutlined fontSize="small" color="action" />
                                <Typography variant="body2">{schedule.location}</Typography>
                            </Box>
                            {schedule.meeting_link && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <LinkOutlined fontSize="small" color="action" />
                                    <Typography
                                        variant="body2"
                                        component="a"
                                        href={schedule.meeting_link}
                                        target="_blank"
                                        sx={{ color: "primary.main" }}
                                    >
                                        {schedule.meeting_link}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Dosen */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                            Dosen Penguji & Pembimbing
                        </Typography>
                        <Stack spacing={1.5} sx={{ mt: 1 }}>
                            {schedule.examiners?.map((examiner, idx) => {
                                const roleConfig = ROLE_CONFIG[examiner.role || ""] || ROLE_CONFIG["Penguji"];
                                return (
                                    <Box key={idx} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: "#7b1fa2", fontSize: 13 }}>
                                                {examiner.name?.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={500}>{examiner.name}</Typography>
                                                {examiner.email && (
                                                    <Typography variant="caption" color="text.secondary">{examiner.email}</Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={(examiner.role || "Penguji").replace("_", " ")}
                                            size="small"
                                            color={roleConfig.color}
                                            variant="outlined"
                                            sx={{ textTransform: "capitalize" }}
                                        />
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>

                    {/* Deskripsi */}
                    {schedule.description && (
                        <>
                            <Divider />
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                                    Deskripsi
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                                    <InfoOutlined fontSize="small" color="action" sx={{ mt: 0.2 }} />
                                    <Typography variant="body2" color="text.secondary">{schedule.description}</Typography>
                                </Box>
                            </Box>
                        </>
                    )}

                    {/* Catatan */}
                    {schedule.notes && (
                        <>
                            <Divider />
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                                    Catatan
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                                    <NotesOutlined fontSize="small" color="action" sx={{ mt: 0.2 }} />
                                    <Typography variant="body2" color="text.secondary">{schedule.notes}</Typography>
                                </Box>
                            </Box>
                        </>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">Tutup</Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SchedulePage() {
    const [schedules, setSchedules] = useState<TSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [customDate, setCustomDate] = useState<string>(today);
    const [selected, setSelected] = useState<TSchedule | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { session } = useSession();

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const data = await getSchedules();
                setSchedules(data);
            } catch (error) {
                console.error("Failed to fetch schedules:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, []);

    const filteredSchedules = useMemo(() => {
        if (!session?.user) return [];
        
        const role = session.user.role || session.user.roles?.[0]?.key;
        const refId = session.user.id_referensi;
        
        let roleSchedules = schedules;
        if (role === "Mahasiswa") {
            roleSchedules = schedules.filter(s => s.studentId === refId);
        } else if (role === "Dosen") {
            roleSchedules = schedules.filter(s => 
                s.pembimbingId === refId || 
                s.examiners.some(ex => ex.id === refId)
            );
        }

        const now = new Date(today);
        return roleSchedules.filter((s) => {
            const schedDate = new Date(s.date);
            switch (dateFilter) {
                case "all": return true;
                case "today": return s.date === today;
                case "week": {
                    const end = new Date(now); end.setDate(now.getDate() + 7);
                    return schedDate >= now && schedDate <= end;
                }
                case "month": {
                    const end = new Date(now); end.setMonth(now.getMonth() + 1);
                    return schedDate >= now && schedDate <= end;
                }
                case "custom": return s.date === customDate;
                default: return true;
            }
        });
    }, [schedules, dateFilter, customDate]);

    const handleOpenDetail = (schedule: TSchedule) => {
        setSelected(schedule);
        setDialogOpen(true);
    };

    const filterLabel: Record<DateFilter, string> = {
        all: "Semua Jadwal", today: "Hari Ini", week: "7 Hari ke Depan", month: "Bulan Ini", custom: "Pilih Tanggal",
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Jadwal Ujian & Seminar
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Berikut adalah jadwal ujian atau seminar Tugas Akhir yang telah dijadwalkan.
            </Typography>

            {/* Filter Bar */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
                <ToggleButtonGroup
                    value={dateFilter}
                    exclusive
                    onChange={(_, val) => { if (val) setDateFilter(val); }}
                    size="small"
                >
                    <ToggleButton value="all">
                        <ListAltOutlined fontSize="small" sx={{ mr: 0.5 }} /> Semua
                    </ToggleButton>
                    <ToggleButton value="today">
                        <TodayOutlined fontSize="small" sx={{ mr: 0.5 }} /> Hari Ini
                    </ToggleButton>
                    <ToggleButton value="week">
                        <DateRangeOutlined fontSize="small" sx={{ mr: 0.5 }} /> 7 Hari
                    </ToggleButton>
                    <ToggleButton value="month">
                        <CalendarTodayOutlined fontSize="small" sx={{ mr: 0.5 }} /> Bulan Ini
                    </ToggleButton>
                    <ToggleButton value="custom">
                        <AllInclusiveOutlined fontSize="small" sx={{ mr: 0.5 }} /> Pilih Tanggal
                    </ToggleButton>
                </ToggleButtonGroup>

                {dateFilter === "custom" && (
                    <TextField
                        type="date"
                        size="small"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarTodayOutlined fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 200 }}
                    />
                )}

                <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                    {filteredSchedules.length} jadwal — {filterLabel[dateFilter]}
                    {dateFilter === "custom" && ` (${toLocalDate(customDate)})`}
                </Typography>
            </Box>

            {/* Cards */}
            <Grid container spacing={3}>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Grid size={{ xs: 12 }} key={i}>
                            <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))
                ) : filteredSchedules.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <CalendarTodayOutlined sx={{ fontSize: 48, opacity: 0.2, mb: 1, display: "block", mx: "auto" }} />
                            <Typography color="text.secondary">
                                Tidak ada jadwal untuk {filterLabel[dateFilter].toLowerCase()}
                                {dateFilter === "custom" && ` (${toLocalDate(customDate)})`}.
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    filteredSchedules.map((schedule) => {
                        const typeConfig = TYPE_CONFIG[schedule.type || ""] || TYPE_CONFIG["Sidang Proposal"];
                        const statusConfig = STATUS_CONFIG[schedule.status || ""] || STATUS_CONFIG["Belum"];
                        return (
                            <Grid size={{ xs: 12, md: 6 }} key={schedule.id}>
                                <Card
                                    onClick={() => handleOpenDetail(schedule)}
                                    sx={{
                                        borderRadius: 3,
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                        borderLeft: `6px solid ${typeConfig.borderColor}`,
                                        cursor: "pointer",
                                        transition: "transform .15s, box-shadow .15s",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ flex: 1, mr: 1 }}>
                                                {schedule.title}
                                            </Typography>
                                            <Stack direction="row" spacing={0.5}>
                                                <Chip label={typeConfig.label} size="small" color={typeConfig.color} variant="outlined" />
                                                <Chip label={statusConfig.label} size="small" color={statusConfig.color} variant="filled" />
                                            </Stack>
                                        </Box>

                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <SchoolOutlined fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {schedule.studentName}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={`Dosen Pembimbing: ${schedule.pembimbingName}`} 
                                                size="small" 
                                                variant="outlined" 
                                                sx={{ borderStyle: "dashed" }}
                                            />
                                        </Box>

                                        <Stack spacing={1}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <CalendarTodayOutlined fontSize="small" color="action" />
                                                <Typography variant="body2">{toLocalDate(schedule.date)}</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <AccessTimeOutlined fontSize="small" color="action" />
                                                <Typography variant="body2">{schedule.time} WIB</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <LocationOnOutlined fontSize="small" color="action" />
                                                <Typography variant="body2">{schedule.location}</Typography>
                                            </Box>
                                        </Stack>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                            {schedule.examiners?.map((examiner, idx) => {
                                                const roleConfig = ROLE_CONFIG[examiner.role || ""] || ROLE_CONFIG["Penguji"];
                                                return (
                                                    <Chip
                                                        key={idx}
                                                        avatar={<Avatar><PersonOutlined fontSize="small" /></Avatar>}
                                                        label={`${examiner.name} (${(examiner.role || "Penguji").replace("_", " ")})`}
                                                        variant="filled"
                                                        size="small"
                                                        color={roleConfig.color}
                                                    />
                                                );
                                            })}
                                        </Box>

                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
                                            Klik untuk lihat detail →
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>

            {/* Detail Dialog */}
            <ScheduleDetailDialog
                schedule={selected}
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setSelected(null); }}
            />
        </Box>
    );
}