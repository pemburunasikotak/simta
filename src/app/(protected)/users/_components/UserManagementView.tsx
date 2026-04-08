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
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
    Avatar,
    TablePagination,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Skeleton,
} from "@mui/material";
import {
    EditOutlined,
    DeleteOutline,
    RefreshOutlined,
    PersonAddOutlined,
    SearchOutlined,
    SchoolOutlined,
    PersonOutlined,
    AdminPanelSettingsOutlined,
    PeopleOutlined,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import { getUsers, createUser, updateUser, deleteUser } from "@/api/user/index";
import { useSnackbar } from "notistack";

const ROLE_CONFIG: Record<string, { label: string; color: "primary" | "secondary" | "default"; icon: React.ReactNode }> = {
    Mahasiswa: { label: "Mahasiswa", color: "primary", icon: <SchoolOutlined fontSize="small" /> },
    Dosen: { label: "Dosen", color: "secondary", icon: <PersonOutlined fontSize="small" /> },
    Administrasi: { label: "Administrasi", color: "default", icon: <AdminPanelSettingsOutlined fontSize="small" /> },
};

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const h = hash % 360;
    return `hsl(${h}, 50%, 45%)`;
}

export default function UserManagementView({ roleType }: { roleType?: "Mahasiswa" | "Dosen" | "Administrasi" }) {
    const { enqueueSnackbar } = useSnackbar();
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [userDosen, setUserDosen] = useState<any[]>([]);
    console.log('CEK CEK USER DOSEN', userDosen)
    const [loading, setLoading] = useState(true);

    const getDosenName = (id: number | null | string) => {
        if (!id) return null;
        const dosen = userDosen.find((d) => d.id_referensi === Number(id));
        return dosen ? dosen.name : "Memuat...";
    };
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const showPembimbing = roleType !== "Dosen" && roleType !== "Administrasi" && roleFilter !== "Dosen" && roleFilter !== "Administrasi";
    const columnCount = showPembimbing ? 7 : 6;

    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState(roleType || "Mahasiswa");
    const [formIdentityNumber, setFormIdentityNumber] = useState("");
    const [formUsername, setFormUsername] = useState("");
    const [formDepartment, setFormDepartment] = useState("");
    const [formDepartmentOther, setFormDepartmentOther] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formDosenPembimbing, setFormDosenPembimbing] = useState("");
    const [formDosenPembimbing2, setFormDosenPembimbing2] = useState("");
    const [formKuotaBimbingan, setFormKuotaBimbingan] = useState(10);

    // Ambil semua data sekaligus, tanpa filter role ke API
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const resp = await getUsers({ page: 1, limit: 1000, roles: roleType });
            const dosen = await getUsers({ page: 1, limit: 1000, roles: 'Dosen' });
            setUserDosen(dosen.result.data)
            setAllUsers(resp.result.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    console.log("CEK DISINI", allUsers)

    // Filter & search di frontend
    const filteredUsers = allUsers.filter((u) => {
        const matchRole = !roleFilter || u.role === roleFilter;
        // const matchSearch = !search ||
        //     u.name?.toLowerCase().includes(search.toLowerCase()) ||
        //     u.email?.toLowerCase().includes(search.toLowerCase()) ||
        //     u.identity_number?.toLowerCase().includes(search.toLowerCase());
        return matchRole;
    });

    console.log('MASUK DISINI', filteredUsers, roleFilter)

    // Pagination di frontend
    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleRoleFilter = (_: any, val: string | null) => {
        setRoleFilter(val);
        setPage(0); // reset ke halaman pertama saat filter berubah
    };

    const handleOpenAdd = () => {
        setSelectedUser(null);
        setFormName("");
        setFormEmail("");
        setFormUsername("");
        setFormRole(roleType || "Mahasiswa");
        setFormIdentityNumber("");
        setFormDepartment("");
        setFormDepartmentOther("");
        setFormPassword("");
        setShowPassword(false);
        setFormDosenPembimbing("");
        setFormDosenPembimbing2("");
        setFormKuotaBimbingan(10);
        setOpen(true);
    };

    const handleOpenEdit = (user: any) => {
        const departments = ["Teknik Bangunan Kapal", "Teknik Permesinan Kapal", "Teknik Kelistrikan Kapal"];
        const isOther = user.department && !departments.includes(user.department);

        setSelectedUser(user);
        setFormName(user.name);
        setFormEmail(user.email);
        setFormUsername(user.username || "");
        setFormRole(user.role || "Mahasiswa");
        setFormIdentityNumber(user.identity_number || "");
        setFormDepartment(isOther ? "Lainnya" : (user.department || ""));
        setFormDepartmentOther(isOther ? user.department : "");
        setFormPassword("");
        setShowPassword(false);
        setFormDosenPembimbing(user.id_pembimbing_utama || "");
        setFormDosenPembimbing2(user.id_pembimbing_kedua || "");
        setFormKuotaBimbingan(user.kuota_bimbingan || 10);
        setOpen(true);
    };

    const handleSave = async () => {
        if (!formName.trim() || !formUsername.trim() || !formEmail.trim()) {
            enqueueSnackbar("Harap pastikan Nama Lengkap, Email, dan Username telah terisi!", { variant: "warning" });
            return;
        }

        const finalDepartment = formDepartment === "Lainnya" ? formDepartmentOther : formDepartment;
        const payload = {
            name: formName,
            email: formEmail,
            username: formUsername,
            role: formRole,
            identity_number: formIdentityNumber,
            department: finalDepartment,
            ...(formPassword && { password: formPassword }),
            ...(formRole === "Mahasiswa" && {
                id_pembimbing_utama: formDosenPembimbing || null,
                id_pembimbing_kedua: formDosenPembimbing2 || null
            }),
            ...(formRole === "Dosen" && { kuota_bimbingan: formKuotaBimbingan }),
        };

        try {
            if (selectedUser) {
                await updateUser(selectedUser.id, { ...payload, id: selectedUser.id } as any);
                enqueueSnackbar(`User ${formName} berhasil diperbarui`, { variant: "success" });
            } else {
                await createUser({ ...payload } as any);
                enqueueSnackbar(`User ${formName} berhasil dibuat`, { variant: "success" });
            }
            setOpen(false);
            fetchUsers();
        } catch {
            enqueueSnackbar("Gagal menyimpan data.", { variant: "error" });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            try {
                await deleteUser(id);
                enqueueSnackbar("User berhasil dihapus", { variant: "success" });
                fetchUsers();
            } catch {
                enqueueSnackbar("Gagal menghapus user.", { variant: "error" });
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Manajemen User
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Kelola akun Mahasiswa, Dosen, dan Staff Akademik.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="outlined" startIcon={<RefreshOutlined />} onClick={fetchUsers} disabled={loading}>
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddOutlined />}
                        onClick={handleOpenAdd}
                        sx={{
                            background: "linear-gradient(45deg, #2e7d32 30%, #66bb6a 90%)",
                            boxShadow: "0 3px 5px 2px rgba(102, 187, 106, .3)",
                        }}
                    >
                        Tambah User
                    </Button>
                </Stack>
            </Box>

            {/* Filter Bar */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
                <TextField
                    placeholder="Cari nama, email, NIM/NIP..."
                    size="small"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    sx={{ minWidth: 280 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                {!roleType && (
                    <ToggleButtonGroup
                        value={roleFilter}
                        exclusive
                        onChange={handleRoleFilter}
                        size="small"
                    >
                        <ToggleButton value={null as any}>
                            <PeopleOutlined fontSize="small" sx={{ mr: 0.5 }} /> Semua
                        </ToggleButton>
                        <ToggleButton value="Mahasiswa">
                            <SchoolOutlined fontSize="small" sx={{ mr: 0.5 }} /> Mahasiswa
                        </ToggleButton>
                        <ToggleButton value="Dosen">
                            <PersonOutlined fontSize="small" sx={{ mr: 0.5 }} /> Dosen
                        </ToggleButton>
                        <ToggleButton value="Administrasi">
                            <AdminPanelSettingsOutlined fontSize="small" sx={{ mr: 0.5 }} /> Administrasi
                        </ToggleButton>
                    </ToggleButtonGroup>
                )}

                {/* Info jumlah hasil filter */}
                <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                    Menampilkan {filteredUsers.length} dari {allUsers.length} user
                </Typography>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                        <TableRow>
                            <TableCell><strong>Nama</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>NIM / NIP</strong></TableCell>
                            {showPembimbing && <TableCell><strong>Pembimbing</strong></TableCell>}
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell align="center"><strong>Aksi</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: rowsPerPage }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: columnCount }).map((_, j) => (
                                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : paginatedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columnCount} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                    <PeopleOutlined sx={{ fontSize: 40, mb: 1, opacity: 0.3, display: "block", mx: "auto" }} />
                                    <Typography variant="body2">Tidak ada data user</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedUsers?.map((user) => {
                                const role = user?.role || user?.roles?.[0]?.key || "Mahasiswa";
                                const config = ROLE_CONFIG[role] || ROLE_CONFIG.Mahasiswa;
                                console.log('CEK CEK MASUK MASUK', user)
                                return (
                                    <TableRow key={user.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: stringToColor(user.name || "?") }}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight={500}>{user.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                                                {user.username || "-"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                {user.identity_number || "-"}
                                            </Typography>
                                        </TableCell>
                                        {showPembimbing && (
                                            <TableCell>
                                                {role === "Mahasiswa" ? (
                                                    <Box>
                                                        <Typography variant="caption" display="block" color="text.primary" sx={{ fontWeight: 500 }}>
                                                            1. {getDosenName(user.id_pembimbing_utama) + " (Pembimbing Utama)" || "-"}
                                                        </Typography>
                                                        {user.id_pembimbing_kedua && (
                                                            <Typography variant="caption" display="block" color="text.secondary">
                                                                2. {getDosenName(user.id_pembimbing_kedua) + " (Pembimbing Kedua)" || "-"}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" color="text.disabled">-</Typography>
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <Chip
                                                icon={config.icon as any}
                                                label={config.label}
                                                size="small"
                                                color={config.color}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Edit User">
                                                <IconButton onClick={() => handleOpenEdit(user)} color="primary" size="small">
                                                    <EditOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Hapus User">
                                                <IconButton onClick={() => handleDelete(user.id)} color="error" size="small">
                                                    <DeleteOutline fontSize="small" />
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
                    count={filteredUsers.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Baris per halaman:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
                />
            </TableContainer>

            {/* Dialog Add/Edit */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    {selectedUser ? "Edit User" : "Tambah User Baru"}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Nama Lengkap"
                            fullWidth value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Username"
                            fullWidth
                            value={formUsername} onChange={(e) => setFormUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="Role" select
                            fullWidth
                            value={formRole} onChange={(e) => setFormRole(e.target.value as any)} disabled={!!roleType}>
                            <MenuItem value="Mahasiswa">Mahasiswa</MenuItem>
                            <MenuItem value="Dosen">Dosen</MenuItem>
                            <MenuItem value="Administrasi">Administrasi</MenuItem>
                        </TextField>
                        <TextField label="NIM / NIP" fullWidth value={formIdentityNumber} onChange={(e) => setFormIdentityNumber(e.target.value)} />
                        <TextField label="Departemen" select fullWidth value={formDepartment} onChange={(e) => setFormDepartment(e.target.value)}>
                            <MenuItem value="Teknik Bangunan Kapal">Teknik Bangunan Kapal</MenuItem>
                            <MenuItem value="Teknik Permesinan Kapal">Teknik Permesinan Kapal</MenuItem>
                            <MenuItem value="Teknik Kelistrikan Kapal">Teknik Kelistrikan Kapal</MenuItem>
                            <MenuItem value="Lainnya">Lainnya</MenuItem>
                        </TextField>
                        {formDepartment === "Lainnya" && (
                            <TextField
                                label="Nama Departemen Lainnya"
                                fullWidth
                                value={formDepartmentOther}
                                onChange={(e) => setFormDepartmentOther(e.target.value)}
                                helperText="Sebutkan nama jurusan/departemen"
                            />
                        )}
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            helperText={selectedUser ? "Kosongkan jika tidak ingin mengubah password" : "Wajib diisi untuk user baru"}
                            FormHelperTextProps={{ sx: { color: "error.main" } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {formRole === "Mahasiswa" && (
                            <>
                                <TextField
                                    label="Dosen Pembimbing Utama (Wajib)"
                                    select
                                    fullWidth
                                    value={formDosenPembimbing}
                                    onChange={(e) => setFormDosenPembimbing(e.target.value)}
                                    required
                                >
                                    <MenuItem value="">-- Pilih Dosen --</MenuItem>
                                    {userDosen.map((dosen) => (
                                        <MenuItem key={dosen.id_referensi} value={dosen.id_referensi}>
                                            {dosen.name} - {dosen.identity_number || "Tidak ada NIDN"}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Dosen Pembimbing Kedua (Opsional)"
                                    select
                                    fullWidth
                                    value={formDosenPembimbing2}
                                    onChange={(e) => setFormDosenPembimbing2(e.target.value)}
                                >
                                    <MenuItem value="">-- Tidak ada --</MenuItem>
                                    {userDosen.filter(d => d.id_referensi !== formDosenPembimbing).map((dosen) => (
                                        <MenuItem key={dosen.id_referensi} value={dosen.id_referensi}>
                                            {dosen.name} - {dosen.identity_number || "Tidak ada NIDN"}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </>
                        )}
                        {formRole === "Dosen" && (
                            <TextField
                                label="Kuota Bimbingan"
                                type="number"
                                fullWidth
                                value={formKuotaBimbingan}
                                onChange={(e) => setFormKuotaBimbingan(parseInt(e.target.value) || 10)}
                            />
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 3 }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Batal</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2 }}>Simpan</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}