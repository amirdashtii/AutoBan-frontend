import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { AuthService } from '../services/authService';

interface VerificationDialogProps {
  open: boolean;
  onClose: () => void;
  phoneNumber: string;
  onSuccess: () => void;
}

export default function VerificationDialog({ open, onClose, phoneNumber, onSuccess }: VerificationDialogProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError('کد باید ۶ رقمی باشد');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await AuthService.verifyPhoneNumber({ phone_number: phoneNumber, code });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در تایید کد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      await AuthService.sendVerificationCode({ phone_number: phoneNumber });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال مجدد کد');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>تایید شماره تلفن</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          کد تایید ۶ رقمی برای شماره {phoneNumber} ارسال شده است.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="کد تایید"
          type="text"
          fullWidth
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={!!error}
          helperText={error}
          inputProps={{
            maxLength: 6,
            pattern: '[0-9]*',
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexDirection: 'column', gap: 1 }}>
        <Button
          onClick={handleVerify}
          fullWidth
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'تایید کد'}
        </Button>
        <Button
          onClick={handleResendCode}
          fullWidth
          variant="text"
          disabled={resendLoading}
        >
          {resendLoading ? <CircularProgress size={24} /> : 'ارسال مجدد کد'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
