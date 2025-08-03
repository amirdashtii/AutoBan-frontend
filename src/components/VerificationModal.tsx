import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { AuthService } from "../services/authService";
import { VerificationCodeRequest, VerifyCodeRequest } from "../types/api";

interface VerificationModalProps {
  open: boolean;
  phoneNumber: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerificationModal({
  open,
  phoneNumber,
  onClose,
  onSuccess,
}: VerificationModalProps) {
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isSendingCode, setIsSendingCode] = React.useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setCode("");
      setError(null);
      setSuccess(false);
      setIsLoading(false);
      setIsSendingCode(false);
    }
  }, [open]);

  const handleSendCode = async () => {
    if (!phoneNumber) return;

    setIsSendingCode(true);
    setError(null);

    try {
      await AuthService.sendVerificationCode({
        phone_number: phoneNumber,
      });
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "خطا در ارسال کد تایید"
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError("کد تایید باید 6 رقم باشد");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.verifyPhoneNumber({
        phone_number: phoneNumber,
        code: code,
      });
      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "خطا در تایید کد");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>فعال‌سازی حساب کاربری</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          برای فعال‌سازی حساب کاربری، کد تایید ارسال شده به شماره{" "}
          <strong>{phoneNumber}</strong> را وارد کنید.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            کد تایید با موفقیت ارسال شد
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="کد تایید"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            inputProps={{
              maxLength: 6,
              style: { textAlign: "center", fontSize: "1.2rem" },
            }}
            fullWidth
            disabled={isLoading}
          />

          <Button
            variant="outlined"
            onClick={handleSendCode}
            disabled={isSendingCode || isLoading}
            sx={{ alignSelf: "flex-start" }}
          >
            {isSendingCode ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                در حال ارسال...
              </>
            ) : (
              "ارسال مجدد کد"
            )}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          انصراف
        </Button>
        <Button
          variant="contained"
          onClick={handleVerifyCode}
          disabled={isLoading || code.length !== 6}
          sx={{ position: "relative" }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              در حال تایید...
            </>
          ) : (
            "تایید کد"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
