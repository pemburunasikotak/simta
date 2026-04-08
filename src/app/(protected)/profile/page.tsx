import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Tab,
    Tabs,
    Typography,
    Stack,
    Paper,
    Chip,
} from "@mui/material";
import {
    SaveOutlined,
    PersonOutline,
    LockOutlined,
    NotificationsNoneOutlined,
    CameraAltOutlined,
} from "@mui/icons-material";

import FormTextField from "@/app/_components/ui/form-text-field";
import { SessionUser } from "@/libs/localstorage";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ProfilePage() {
    const session = SessionUser.get();
    const user = session?.user;
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const personalForm = useForm({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            nim: "2103191001",
            jurusan: "Teknik Informatika",
        },
    });

    const securityForm = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onUpdateProfile = (data: any) => {
        console.log("Update Personal Info:", data);
        alert("Informasi profil berhasil diperbarui!");
    };

    const onChangePassword = (data: any) => {
        console.log("Change Password:", data);
        alert("Kata sandi berhasil diperbarui!");
    };

    return (
        <Box sx={{ p: 4, margin: "0 auto" }}>
            {/* Profile Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                    color: "white",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: 4,
                    boxShadow: "0 10px 40px rgba(25, 118, 210, 0.2)",
                }}
            >
                <Box sx={{ position: "relative" }}>
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            border: "4px solid rgba(255,255,255,0.3)",
                            fontSize: "3rem",
                            bgcolor: "rgba(255,255,255,0.2)",
                        }}
                    >
                        {user?.name?.charAt(0) || "U"}
                    </Avatar>
                    <Button
                        size="small"
                        variant="contained"
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            minWidth: 0,
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: "white",
                            color: "primary.main",
                            "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                    >
                        <CameraAltOutlined fontSize="small" />
                    </Button>
                </Box>
                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                    <Typography variant="h4" fontWeight="bold">
                        {user?.name || "User Name"}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8 }}>
                        {user?.email || "user@email.com"}
                    </Typography>
                    <Chip
                        label={user?.roles?.[0]?.name || "Role"}
                        sx={{
                            mt: 1.5,
                            bgcolor: "rgba(255,255,255,0.2)",
                            color: "white",
                            fontWeight: "bold",
                            border: "1px solid rgba(255,255,255,0.3)",
                        }}
                    />
                </Box>
            </Paper>

            <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 2 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                        <Tab icon={<PersonOutline />} iconPosition="start" label="Informasi Pribadi" />
                        <Tab icon={<LockOutlined />} iconPosition="start" label="Keamanan" />
                        <Tab icon={<NotificationsNoneOutlined />} iconPosition="start" label="Notifikasi" disabled />
                    </Tabs>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    {/* Personal Information Tab */}
                    <CustomTabPanel value={tabValue} index={0}>
                        <form onSubmit={personalForm.handleSubmit(onUpdateProfile)}>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormTextField
                                        control={personalForm.control}
                                        label="Nama Lengkap"
                                        name="name"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormTextField
                                        control={personalForm.control}
                                        label="Email"
                                        name="email"
                                        placeholder="Masukkan email"
                                        disabled
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormTextField
                                        control={personalForm.control}
                                        label="NIM / NIP"
                                        name="nim"
                                        placeholder="Masukkan NIM/NIP"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormTextField
                                        control={personalForm.control}
                                        label="Jurusan / Departemen"
                                        name="jurusan"
                                        placeholder="Masukkan jurusan"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveOutlined />}
                                        size="large"
                                        sx={{
                                            px: 4,
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Simpan Perubahan
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CustomTabPanel>

                    {/* Security Tab */}
                    <CustomTabPanel value={tabValue} index={1}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Ganti Kata Sandi
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Pastikan kata sandi Anda kuat dan mengandung kombinasi huruf, angka, dan simbol.
                            </Typography>
                            <form onSubmit={securityForm.handleSubmit(onChangePassword)}>
                                <Stack spacing={3}>
                                    <FormTextField
                                        control={securityForm.control}
                                        label="Kata Sandi Saat Ini"
                                        name="currentPassword"
                                        type="password"
                                        placeholder="Masukkan kata sandi lama"
                                    />
                                    <FormTextField
                                        control={securityForm.control}
                                        label="Kata Sandi Baru"
                                        name="newPassword"
                                        type="password"
                                        placeholder="Masukkan kata sandi baru"
                                    />
                                    <FormTextField
                                        control={securityForm.control}
                                        label="Konfirmasi Kata Sandi Baru"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Ulangi kata sandi baru"
                                    />
                                    <Box>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveOutlined />}
                                            size="large"
                                            sx={{
                                                width: "100%",
                                                px: 4,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Perbarui Kata Sandi
                                        </Button>
                                    </Box>
                                </Stack>
                            </form>
                        </Box>
                    </CustomTabPanel>
                </CardContent>
            </Card>
        </Box>
    );
}
