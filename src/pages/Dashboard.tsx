import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AppTheme from "../theme/AppTheme";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleClose();
  };

  const handleSettings = () => {
    // TODO: Navigate to settings page
    handleClose();
  };

  // Redirect to signin if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <AppTheme>
        <LoadingSpinner message="در حال بارگذاری داشبورد..." />
      </AppTheme>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppTheme>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              اتوبان
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.first_name
                    ? user.first_name.charAt(0).toUpperCase()
                    : user.phone_number}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user.first_name || "کاربر"}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user.phone_number}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSettings}>
                  <Settings sx={{ mr: 1 }} />
                  تنظیمات
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  خروج
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            خوش آمدید {user.first_name || "کاربر گرامی"}!
          </Typography>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              اطلاعات حساب کاربری
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>نام:</strong> {user.first_name || "تنظیم نشده"}
              </Typography>
              <Typography variant="body1">
                <strong>شماره تلفن:</strong> {user.phone_number}
              </Typography>
              <Typography variant="body1">
                <strong>تاریخ عضویت:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString("fa-IR")}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              امکانات در دسترس
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button variant="outlined" disabled>
                پروفایل
              </Button>
              <Button variant="outlined" disabled>
                تنظیمات
              </Button>
              <Button variant="outlined" disabled>
                تاریخچه
              </Button>
              <Button variant="outlined" disabled>
                پشتیبانی
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </AppTheme>
  );
} 