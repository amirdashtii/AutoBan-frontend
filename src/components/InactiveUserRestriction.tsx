import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
} from "@mui/material";
import { Error, Security } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

interface InactiveUserRestrictionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function InactiveUserRestriction({
  children,
  fallback,
}: InactiveUserRestrictionProps) {
  const { user } = useAuth();

  // If user is active, show children
  if (user?.status === "Active") {
    return <>{children}</>;
  }

  // If user is deactivated, show restriction message
  if (user?.status === "Deactivated") {
    return (
      <Box sx={{ p: 2 }}>
        <Card sx={{ bgcolor: "warning.light" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Security color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">دسترسی محدود</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              حساب کاربری شما هنوز فعال نشده است. برای استفاده از این بخش، لطفاً
              ابتدا حساب کاربری خود را فعال کنید.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                // Navigate to profile page for activation
                window.location.href = "/home?tab=profile";
              }}
            >
              فعال‌سازی حساب کاربری
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // If user is deleted, show error
  if (user?.status === "Deleted") {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" icon={<Error />}>
          <Typography variant="h6" gutterBottom>
            حساب کاربری حذف شده
          </Typography>
          <Typography variant="body2">
            حساب کاربری شما حذف شده است. لطفاً با پشتیبانی تماس بگیرید.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Show fallback or default message
  return fallback ? (
    <>{fallback}</>
  ) : (
    <Box sx={{ p: 2 }}>
      <Alert severity="info">
        <Typography variant="body2">
          در حال بارگذاری اطلاعات کاربر...
        </Typography>
      </Alert>
    </Box>
  );
}
