import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Phone, CheckCircle, Error } from "@mui/icons-material";
import { AuthService } from "@/services/authService";

interface AccountActivationProps {
  phoneNumber: string;
  onActivationSuccess?: () => void;
}

export default function AccountActivation({
  phoneNumber,
  onActivationSuccess,
}: AccountActivationProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSendCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.sendVerificationCode({ phone_number: phoneNumber });
      setShowDialog(true);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? (error as Error).message : "خطا در ارسال کد";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError("لطفاً کد تایید را وارد کنید");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.verifyPhone({
        phone_number: phoneNumber,
        code: code.trim(),
      });

      setSuccess(true);
      setShowDialog(false);

      if (onActivationSuccess) {
        onActivationSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? (error as Error).message
          : "کد وارد شده صحیح نیست";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.sendVerificationCode({ phone_number: phoneNumber });
      setError(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? (error as Error).message
          : "خطا در ارسال مجدد کد";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            <Typography variant="h6" color="success.main">
              حساب کاربری فعال شد
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            حساب کاربری شما با موفقیت فعال شد و می‌توانید از تمام امکانات برنامه
            استفاده کنید.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 3, bgcolor: "warning.light" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Error color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6">حساب کاربری غیرفعال</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            حساب کاربری شما هنوز فعال نشده است. برای استفاده از تمام امکانات
            برنامه، لطفاً حساب کاربری خود را فعال کنید.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Phone />}
            onClick={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "ارسال کد فعال‌سازی"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Verification Dialog */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>فعال‌سازی حساب کاربری</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            کد تایید به شماره {phoneNumber} ارسال شد. لطفاً کد را وارد کنید.
          </Typography>
          <TextField
            fullWidth
            label="کد تایید"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="مثال: 123456"
            sx={{ mb: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} disabled={isLoading}>
            انصراف
          </Button>
          <Button onClick={handleResendCode} disabled={isLoading}>
            ارسال مجدد
          </Button>
          <Button
            variant="contained"
            onClick={handleVerifyCode}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "تایید و فعال‌سازی"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
