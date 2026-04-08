import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import {
    CheckCircleOutlined, HourglassEmptyOutlined,
    CancelOutlined, RateReviewOutlined,
} from "@mui/icons-material";

export const STATUS_CONFIG: Record<string, {
    label: string;
    color: "success" | "info" | "error" | "warning";
    icon: React.ReactNode;
}> = {
    approved: { label: "Approved", color: "success", icon: <CheckCircleOutlined fontSize="small" /> },
    reviewed: { label: "Reviewed", color: "info", icon: <RateReviewOutlined fontSize="small" /> },
    rejected: { label: "Rejected", color: "error", icon: <CancelOutlined fontSize="small" /> },
    pending: { label: "Pending", color: "warning", icon: <HourglassEmptyOutlined fontSize="small" /> },
};

export function StatCard({ label, value, icon, color }: {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}>
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
                        <Typography variant="h4" fontWeight="bold">{value}</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
                </Box>
            </CardContent>
        </Card>
    );
}