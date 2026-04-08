import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { SchoolOutlined } from "@mui/icons-material";
import { z } from "zod";

import { useSession } from "@/app/_components/providers/session";
import { loginSchema } from "@/api/auth/schema";
import { usePostLogin } from "./_hooks/use-post-login";
import FormTextField from "@/app/_components/ui/form-text-field";

type TLoginForm = z.infer<typeof loginSchema>;

const Component: React.FC = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { mutate, isPending: loading } = usePostLogin();

  const form = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session.status === "authenticated") {
      navigate(searchParams.get("callbackUrl") || "/dashboard");
    }
  }, [session.status, navigate, searchParams]);

  const handleSubmit = (values: TLoginForm) => {
    mutate(values);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a6e 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          top: "-200px",
          right: "-200px",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-100px",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header Brand */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              mb: 2,
              boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
            }}
          >
            <SchoolOutlined sx={{ color: "#fff", fontSize: 36 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px",
              mb: 0.5,
            }}
          >
            SIM-TA
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Sistem Informasi Manajemen Tugas Akhir
          </Typography>
        </Box>

        {/* Login Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            p: { xs: 3, sm: 5 },
            boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#fff",
              mb: 0.5,
            }}
          >
            Selamat Datang 👋
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.5)", mb: 4 }}
          >
            Masuk ke akun Anda untuk melanjutkan
          </Typography>

          <Box
            component="form"
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Username Field */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  mb: 1,
                  display: "block",
                }}
              >
                Username
              </Typography>
              <FormTextField
                control={form.control}
                name="user"
                placeholder="Masukkan username Anda"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.12)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(99,102,241,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1",
                      boxShadow: "0 0 0 3px rgba(99,102,241,0.2)",
                    },
                  },
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.3)",
                    opacity: 1,
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f87171",
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  mb: 1,
                  display: "block",
                }}
              >
                Password
              </Typography>
              <FormTextField
                control={form.control}
                name="password"
                type="password"
                placeholder="Masukkan password Anda"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.12)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(99,102,241,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1",
                      boxShadow: "0 0 0 3px rgba(99,102,241,0.2)",
                    },
                  },
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.3)",
                    opacity: 1,
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f87171",
                  },
                  "& .MuiIconButton-root": {
                    color: "rgba(255,255,255,0.5)",
                    "&:hover": {
                      color: "#6366f1",
                    },
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                letterSpacing: "0.02em",
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                  boxShadow: "0 12px 32px rgba(99,102,241,0.55)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&.Mui-disabled": {
                  background: "rgba(99,102,241,0.3)",
                  color: "rgba(255,255,255,0.4)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "rgba(255,255,255,0.7)" }} />
              ) : (
                "Masuk"
              )}
            </Button>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 3,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          © {new Date().getFullYear()} SIMTA — Sistem Informasi Manajemen Tugas Akhir
        </Typography>
      </Container>
    </Box>
  );
};

export default Component;
