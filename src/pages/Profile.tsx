import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  Switch,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Person,
  Phone,
  Email,
  CalendarToday,
  Settings,
  Security,
  Notifications,
  Language,
  Logout,
  Edit,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import ColorModeSelect from "../theme/ColorModeSelect";

export default function Profile() {
  const { user, logout } = useAuth();
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Mock settings
  const [settings, setSettings] = React.useState({
    notifications: true,
    language: "fa",
    autoBackup: true,
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEditProfile = () => {
    setOpenEditDialog(true);
  };

  const handleChangePassword = () => {
    setOpenPasswordDialog(true);
  };

  const handleSettingChange =
    (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings({
        ...settings,
        [setting]: event.target.checked,
      });
    };

  const handleLanguageChange = (event: any) => {
    setSettings({
      ...settings,
      language: event.target.value,
    });
  };

  return (
    <Box sx={{ p: 2, pb: 8 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 2, bgcolor: "primary.main" }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : "کاربر"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.phone_number}
              </Typography>
              {user?.email && (
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEditProfile}
            >
              ویرایش
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" component="div" color="primary">
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                خودرو
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" component="div" color="success.main">
                15
              </Typography>
              <Typography variant="body2" color="text.secondary">
                سرویس
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" component="div" color="info.main">
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                سال عضویت
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Profile Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            اطلاعات شخصی
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText
                primary="نام و نام خانوادگی"
                secondary={
                  user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : "تنظیم نشده"
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Phone />
              </ListItemIcon>
              <ListItemText
                primary="شماره تلفن"
                secondary={user?.phone_number}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText
                primary="ایمیل"
                secondary={user?.email || "تنظیم نشده"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CalendarToday />
              </ListItemIcon>
              <ListItemText
                primary="تاریخ عضویت"
                secondary={
                  user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("fa-IR")
                    : "نامشخص"
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            تنظیمات
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="اعلان‌ها"
                secondary="دریافت اعلان‌های سرویس و تعمیر"
              />
              <Switch
                checked={settings.notifications}
                onChange={handleSettingChange("notifications")}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText
                primary="تم برنامه"
                secondary="تغییر بین حالت روشن و تاریک"
              />
              <FormControl sx={{ minWidth: 90 }}>
                <ColorModeSelect size="small" />
              </FormControl>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText primary="زبان" secondary="زبان برنامه" />
              <FormControl sx={{ minWidth: 90 }}>
                <Select
                  value={settings.language}
                  onChange={handleLanguageChange}
                  size="small"
                >
                  <MenuItem value="fa">فارسی</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="پشتیبان‌گیری خودکار"
                secondary="ذخیره خودکار اطلاعات"
              />
              <Switch
                checked={settings.autoBackup}
                onChange={handleSettingChange("autoBackup")}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            حساب کاربری
          </Typography>
          <List>
            <ListItemButton onClick={handleChangePassword}>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="تغییر رمز عبور"
                secondary="تغییر رمز عبور حساب کاربری"
              />
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText
                primary="تنظیمات پیشرفته"
                secondary="تنظیمات اضافی برنامه"
              />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main" }}>
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary="خروج از حساب"
                secondary="خروج از حساب کاربری"
              />
            </ListItemButton>
          </List>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ویرایش پروفایل</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="نام"
                defaultValue={user?.first_name || ""}
              />
              <TextField
                fullWidth
                label="نام خانوادگی"
                defaultValue={user?.last_name || ""}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="ایمیل"
                type="email"
                defaultValue={user?.email || ""}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="تاریخ تولد"
                type="date"
                InputLabelProps={{ shrink: true }}
                defaultValue={
                  user?.birthday
                    ? new Date(user.birthday).toISOString().split("T")[0]
                    : ""
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>انصراف</Button>
          <Button variant="contained" onClick={() => setOpenEditDialog(false)}>
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>تغییر رمز عبور</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="رمز عبور فعلی"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  ),
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="رمز عبور جدید"
                type={showNewPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      size="small"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  ),
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="تأیید رمز عبور جدید"
                type={showConfirmPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>انصراف</Button>
          <Button
            variant="contained"
            onClick={() => setOpenPasswordDialog(false)}
          >
            تغییر رمز عبور
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
