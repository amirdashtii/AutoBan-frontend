"use client";

import React, { useState } from "react";
import {
  Box,
  CardContent,
  Typography,
  List,
  Switch,
  FormControl,
  Select,
  Avatar,
  Badge,
  MenuItem,
} from "@mui/material";
import {
  Person,
  Settings as SettingsIcon,
  Security,
  Notifications,
  Language,
  Logout,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import ColorModeSelect from "@/theme/ColorModeSelect";
import AccountActivation from "@/components/AccountActivation";
import LogoutDialog from "@/components/LogoutDialog";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  ListItemCard,
} from "@/components/ui";
import type { SelectChangeEvent } from "@mui/material/Select";

export default function Settings() {
  const { user } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // Mock settings
  const [settings, setSettings] = useState({
    notifications: true,
    language: "fa",
    autoBackup: true,
  });

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const handleSettingChange =
    (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings({
        ...settings,
        [setting]: event.target.checked,
      });
    };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSettings({
      ...settings,
      language: String(event.target.value),
    });
  };

  return (
    <AppContainer>
      <Header user={user} />
      {/* Account Activation */}
      {user?.status === "Deactivated" && (
        <AccountActivation
          phoneNumber={user.phone_number}
          onActivationSuccess={() => window.location.reload()}
        />
      )}

      <ResponsiveContainer padding="medium" fullHeight={false}>       

        <List>
          <ListItemCard
            title="پروفایل"
            subtitle="مشاهده و ویرایش پروفایل"
            icon={
              <Box sx={{ color: "error.light" }}>
                <Person />
              </Box>
            }
            actions={<ChevronLeftIcon fontSize="large" />}
            // onClick={() => router.push(action.path)}
          />
        </List>
        <List>
          <ListItemCard
            title="اعلان‌ها"
            subtitle="دریافت اعلان‌های سرویس"
            icon={
              <Box sx={{ color: "warning.light" }}>
                <Notifications />
              </Box>
            }
            actions={
              <Switch
                checked={settings.notifications}
                onChange={handleSettingChange("notifications")}
              />
            }
          />
          <ListItemCard
            title="تم برنامه"
            subtitle="تغییر حالت روشن/تاریک"
            icon={
              <Box sx={{ color: "blue" }}>
                <SettingsIcon />
              </Box>
            }
            actions={
              <FormControl sx={{ minWidth: 90 }}>
                <ColorModeSelect size="small" />
              </FormControl>
            }
          />
          <ListItemCard
            title="زبان"
            subtitle="زبان برنامه"
            icon={
              <Box sx={{ color: "success.main" }}>
                <Language />
              </Box>
            }
            actions={
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
            }
          />
        </List>

        {/* Account Settings */}
        <List>
          <ListItemCard
            title="تغییر رمز عبور"
            subtitle="بروزرستانی رمز عبور"
            icon={
              <Box sx={{ color: "warning.main" }}>
                <Security />
              </Box>
            }
            actions={<ChevronLeftIcon fontSize="large" />}
          />
          <ListItemCard
            title="خروج از حساب"
            subtitle="خروج از برنامه"
            icon={
              <Box sx={{ color: "error.main" }}>
                <Logout />
              </Box>
            }
            onClick={handleLogout}
          />
        </List>
      </ResponsiveContainer>

      {/* Logout Dialog */}
      <LogoutDialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      />
    </AppContainer>
  );
}
