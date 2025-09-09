"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Phone,
  Lock,
  CheckCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { AuthService } from "@/services/authService";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const steps = [
    {
      label: "شماره تلفن",
      description: "شماره تلفن خود را وارد کنید",
    },
    {
      label: "کد تایید",
      description: "کد ارسال شده را وارد کنید",
    },
    {
      label: "رمز عبور جدید",
      description: "رمز عبور جدید خود را وارد کنید",
    },
  ];

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string) => {
    // Password must be at least 8 characters and contain uppercase, lowercase, and numbers
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const getPasswordError = (password: string) => {
    if (!password) return "";
    if (password.length < 8) return "رمز عبور باید حداقل 8 کاراکتر باشد";
    if (!/(?=.*[a-z])/.test(password))
      return "رمز عبور باید شامل حروف کوچک باشد";
    if (!/(?=.*[A-Z])/.test(password))
      return "رمز عبور باید شامل حروف بزرگ باشد";
    if (!/(?=.*\d)/.test(password)) return "رمز عبور باید شامل اعداد باشد";
    return "";
  };

  const handleSendCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError("لطفاً شماره تلفن معتبر وارد کنید");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.forgotPassword({ phone_number: phoneNumber });
      setActiveStep(1);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "خطا در ارسال کد تایید";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError("لطفاً کد 6 رقمی را وارد کنید");
      return;
    }

    setActiveStep(2);
    setError(null);
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setError(
        "رمز عبور باید حداقل 8 کاراکتر باشد و شامل حروف کوچک، بزرگ و اعداد باشد"
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.resetPassword({
        phone_number: phoneNumber,
        new_password: newPassword,
        verification_code: verificationCode,
      });

      // The backend returns new tokens, so we can automatically login the user
      // The tokens are already set in cookies by the API route
      setSuccess(true);

      // Close the dialog after a short delay to show success message
      setTimeout(() => {
        handleCloseDialog();
        // Redirect to home since user is now logged in
        window.location.href = "/home";
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "خطا در تغییر رمز عبور";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.forgotPassword({ phone_number: phoneNumber });
      setError(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "خطا در ارسال مجدد کد";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    // Reset state when closing
    setActiveStep(0);
    setPhoneNumber("");
    setVerificationCode("");
    setNewPassword("");
    setIsLoading(false);
    setError(null);
    setSuccess(false);
    handleClose();
  };

  if (success) {
    return (
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            رمز عبور با موفقیت تغییر یافت
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            شما به صورت خودکار وارد شده‌اید و در حال هدایت به خانه هستید...
          </Typography>
          <Button variant="contained" fullWidth onClick={handleCloseDialog}>
            بستن
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>فراموشی رمز عبور</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {step.description}
                </Typography>

                {index === 0 && (
                  <Box>
                    <TextField
                      fullWidth
                      label="شماره تلفن"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="مثال: 09123456789"
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <Phone sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendCode}
                      disabled={isLoading || !phoneNumber.trim()}
                      fullWidth
                    >
                      {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "ارسال کد تایید"
                      )}
                    </Button>
                  </Box>
                )}

                {index === 1 && (
                  <Box>
                    <TextField
                      fullWidth
                      label="کد تایید"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="مثال: 123456"
                      sx={{ mb: 2 }}
                      inputProps={{ maxLength: 6 }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        sx={{ flex: 1 }}
                      >
                        ارسال مجدد
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleVerifyCode}
                        disabled={isLoading || verificationCode.length !== 6}
                        sx={{ flex: 1 }}
                      >
                        تایید کد
                      </Button>
                    </Box>
                  </Box>
                )}

                {index === 2 && (
                  <Box>
                    <TextField
                      fullWidth
                      label="رمز عبور جدید"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      error={
                        passwordFocused &&
                        newPassword.length > 0 &&
                        getPasswordError(newPassword) !== ""
                      }
                      helperText={getPasswordError(newPassword)}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <Lock sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={isLoading}
                        sx={{ flex: 1 }}
                      >
                        بازگشت
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleResetPassword}
                        disabled={
                          isLoading ||
                          !newPassword.trim() ||
                          getPasswordError(newPassword) !== ""
                        }
                        sx={{ flex: 1 }}
                      >
                        {isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "تغییر رمز عبور"
                        )}
                      </Button>
                    </Box>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>انصراف</Button>
      </DialogActions>
    </Dialog>
  );
}
