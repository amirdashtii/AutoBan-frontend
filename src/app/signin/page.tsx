"use client";

import React from "react";
import {
  Box,
  Button,
  CssBaseline,
  Link,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import ForgotPassword from "@/components/ForgotPassword";
import Image from "next/image";

export default function Signin() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();

  const [phoneError, setPhoneError] = React.useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Clear error when component unmounts
  React.useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      await login({ phone_number: phone, password });
      router.push("/dashboard");
    } catch (_e) {
      // Error is handled by AuthContext
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validateInputs = () => {
    let isValid = true;

    if (!phone || !/^09\d{9}$/.test(phone)) {
      setPhoneError(true);
      setPhoneErrorMessage("شماره تلفن صحیح وارد کنید به صورت: 09XXXXXXXXX");
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("رمز عبور باید حداقل 8 کاراکتر باشد");
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage("رمز عبور باید حداقل یک حرف بزرگ داشته باشد");
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage("رمز عبور باید حداقل یک حرف کوچک داشته باشد");
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage("رمز عبور باید حداقل یک عدد داشته باشد");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
    return isValid;
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{
          height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
          minHeight: "100%",
          padding: { xs: 2, sm: 4 },
          position: "relative",
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            zIndex: -1,
            inset: 0,
            backgroundImage: {
              light:
                "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
              dark: "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
            },
            backgroundRepeat: "no-repeat",
          },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
            width: "100%",
            padding: 4,
            gap: 2,
            margin: "auto",
            maxWidth: { sm: "450px" },
            boxShadow: {
              light:
                "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
              dark: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
            },
          }}
        >
          <CardContent sx={{ padding: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Image
                src="/AutoBan.png"
                alt="AutoBan"
                width={400}
                height={100}
                priority
                style={{
                  filter: "sepia(1) hue-rotate(180deg)",
                  width: "100%",
                  height: "auto",
                  maxWidth: "400px",
                }}
              />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                width: "100%",
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
                mb: 2,
                textAlign: "center",
              }}
            >
              وارد اتوبان شوید
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <TextField
                error={phoneError}
                helperText={phoneErrorMessage}
                id="phone"
                type="tel"
                name="phone"
                placeholder="09XXXXXXXXX"
                autoComplete="tel"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={phoneError ? "error" : "primary"}
                label="شماره تلفن"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                slotProps={{ input: { style: { direction: "ltr" } } }}
              />
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
                label="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                slotProps={{
                  input: {
                    endAdornment: (passwordFocused || password.length > 0) && (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: { direction: "ltr" },
                  },
                }}
              />
              <ForgotPassword open={open} handleClose={handleClose} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ position: "relative" }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    در حال ورود...
                  </>
                ) : (
                  "ورود"
                )}
              </Button>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                فراموشی رمز عبور
              </Link>
              <Typography sx={{ textAlign: "center" }}>
                حساب کاربری ندارید؟{" "}
                <Link
                  href="/signup"
                  variant="body2"
                  sx={{ alignSelf: "center" }}
                >
                  ثبت نام کنید
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
}
