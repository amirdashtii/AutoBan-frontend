import React from "react";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Link,
  styled,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import ForgotPassword from "../components/ForgotPassword";
import AppTheme from "../theme/AppTheme";
import ColorModeSelect from "../theme/ColorModeSelect";
import Autoban from "../assets/autoban.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
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

export default function Signin(props: { disableCustomTheme?: boolean }) {
  const [phoneError, setPhoneError] = React.useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return;
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validateInputs = () => {
    const phone = document.getElementById("phone") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!phone.value || !/^09\d{9}$/.test(phone.value)) {
      setPhoneError(true);
      setPhoneErrorMessage("شماره تلفن صحیح وارد کنید به صورت: 09XXXXXXXXX");
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("رمز عبور باید حداقل 8 کاراکتر باشد");
      isValid = false;
    } else if (!/[A-Z]/.test(password.value)) {
      setPasswordError(true);
      setPasswordErrorMessage("رمز عبور باید حداقل یک حرف بزرگ داشته باشد");
      isValid = false;
    } else if (!/[a-z]/.test(password.value)) {
      setPasswordError(true);
      setPasswordErrorMessage("رمز عبور باید حداقل یک حرف کوچک داشته باشد");
      isValid = false;
    } else if (!/[0-9]/.test(password.value)) {
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
      <SignInContainer direction="column" justifyContent="space-between">
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
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            وارد اتوبان شوید
          </Typography>
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
              autoFocus
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="مرا به خاطر بسپار"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              ورود
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
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
