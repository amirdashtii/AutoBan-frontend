import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Logout, Warning } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LogoutDialog({ open, onClose }: LogoutDialogProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logout();
      // After successful logout, the user will be redirected to login page
      // by the AuthContext and routing logic
      onClose(); // Close dialog after successful logout
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? (error as Error).message
          : "خطا در خروج از حساب";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Warning color="warning" sx={{ mr: 1 }} />
          خروج از حساب کاربری
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
        </Typography>
        <Typography variant="body2" color="text.secondary">
          پس از خروج، تمام اطلاعات جلسه شما پاک خواهد شد و باید دوباره وارد
          شوید.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          انصراف
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? "در حال خروج..." : "خروج از حساب"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
