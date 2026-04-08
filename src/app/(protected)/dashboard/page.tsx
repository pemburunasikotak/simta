import { FC, ReactElement } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";

import { useSession } from "@/app/_components/providers/session";
import { Page } from "@/app/_components/ui";
import MahasiswaDashboard from "./_components/MahasiswaDashboard";
import DosenDashboard from "./_components/DosenDashboard";
import AkademikDashboard from "./_components/AkademikDashboard";

const Component: FC = (): ReactElement => {
  const { signout, session, status } = useSession();

  if (status === "authenticating") {
    return (
      <Page>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      </Page>
    );
  }

  if (!session?.user) {
    return (
      <Page>
        <Box sx={{ p: 3 }}>
          <Typography color="error">Sesi tidak ditemukan. Silakan login ulang.</Typography>
        </Box>
      </Page>
    );
  }

  const role = session.user.roles?.[0]?.key || session.user.roles;

  const renderDashboard = () => {
    switch (role) {
      case "Mahasiswa": return <MahasiswaDashboard user={session.user} />;
      case "Dosen": return <DosenDashboard user={session.user} />;
      case "Administrasi": return <AkademikDashboard user={session.user} />;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography color="error">Role tidak dikenali</Typography>
          </Box>
        );
    }
  };

  return (
    <Page>
      {/* Logout button di pojok kanan atas */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, pb: 0 }}>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogoutOutlined />}
          onClick={signout}
        >
          Logout
        </Button>
      </Box>

      {renderDashboard()}
    </Page>
  );
};

export default Component;