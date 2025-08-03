import React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  DirectionsCar as CarIcon,
  Build as ServiceIcon,
  Event as CalendarIcon,
  Person as ProfileIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import VerificationModal from "../VerificationModal";

const drawerWidth = 280;

interface MainLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  disabled?: boolean;
}

const menuItems: MenuItem[] = [
  { text: "نمای کلی", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "خودروها", icon: <CarIcon />, path: "/vehicles" },
  { text: "سرویس‌ها", icon: <ServiceIcon />, path: "/services" },
  { text: "تقویم", icon: <CalendarIcon />, path: "/calendar" },
  { text: "گزارشات", icon: <ReportsIcon />, path: "/reports" },
  { text: "پروفایل", icon: <ProfileIcon />, path: "/profile" },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showVerificationModal, setShowVerificationModal] =
    React.useState(false);

  // Check if user needs verification
  React.useEffect(() => {
    if (user && user.status === "Deactivated") {
      setShowVerificationModal(true);
    }
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    handleClose();
  };

  const handleSettings = () => {
    navigate("/settings");
    handleClose();
  };

  const handleVerificationSuccess = () => {
    window.location.reload();
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" noWrap component="div">
          اتوبان
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              disabled={item.disabled}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text ||
              "اتوبان"}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.first_name
                ? user.first_name.charAt(0).toUpperCase()
                : user?.phone_number?.charAt(0) || "U"}
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
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ""}`
                  : "کاربر"}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.phone_number}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSettings}>
              <SettingsIcon sx={{ mr: 1 }} />
              تنظیمات
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              خروج
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        {/* Status Alert */}
        {user?.status === "Deactivated" && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            حساب کاربری شما فعال نشده است. لطفاً کد تایید را وارد کنید.
          </Alert>
        )}

        {children}
      </Box>

      {/* Verification Modal */}
      <VerificationModal
        open={showVerificationModal}
        phoneNumber={user?.phone_number || ""}
        onClose={() => setShowVerificationModal(false)}
        onSuccess={handleVerificationSuccess}
      />
    </Box>
  );
}
