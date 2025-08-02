import React from "react";
import {
  Box,
  CssBaseline,
  styled,
  Stack,
  TextField,
  Typography,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import AppTheme from "../theme/AppTheme";
import ColorModeSelect from "../theme/ColorModeSelect";
import Autoban from "../assets/autoban.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function Signup(props: { disableCustomTheme?: boolean }) {
  const { signup, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [phoneError, setPhoneError] = React.useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");

  // Clear error when component unmounts
  React.useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      await signup({ phone_number: phone, password: password });
      navigate("/dashboard"); // Redirect to dashboard after successful signup
    } catch (error) {
      // Error is handled by AuthContext and will be shown in the error state
      console.error("Signup failed:", error);
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
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card variant="outlined">
          <Box display="flex" justifyContent="center">
            <img
              src={Autoban}
              alt="Autoban"
              style={{
                width: "100%",
                height: "100%",
                filter: "sepia(1) hue-rotate(180deg)",
              }}
            />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem,10vw, 2.15rem)" }}
          >
            ثبت نام در اتوبان
          </Typography>
          {/*Error Alert*/}
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
                  در حال ثبت نام
                </>
              ) : (
                "ثبت نام"
              )}
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              قبلاً ثبت نام کرده‌اید؟{" "}
              <Link href="/signin" variant="body2" sx={{ alignSelf: "center" }}>
                وارد اتوبان شوید
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
