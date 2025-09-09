"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Badge,
  IconButton,
} from "@mui/material";
import {
  Person,
  Phone,
  Email,
  Settings,
  Security,
  Notifications,
  Language,
  Logout,
  Edit,
  History,
  Build,
  DirectionsCar,
  Timeline,
  CalendarToday,
  TrendingUp,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import ColorModeSelect from "@/theme/ColorModeSelect";
import AccountActivation from "@/components/AccountActivation";
import LogoutDialog from "@/components/LogoutDialog";
import {
  AppContainer,
  Header,
  ResponsiveContainer,
  ResponsiveGrid,
  ListItem as UIListItem,
  SectionHeader,
  StatusCard,
  SlideIn,
  StaggeredList,
} from "@/components/ui";
import type { SelectChangeEvent } from "@mui/material/Select";

// Mock data برای تاریخچه
const mockHistory = [
  {
    id: 1,
    type: "oil_change",
    vehicle: "پژو 206",
    date: "1403/09/15",
    mileage: 85000,
    cost: 500000,
    status: "completed",
    description: "تعویض روغن موتور و فیلتر",
    location: "تعمیرگاه مرکزی",
  },
  {
    id: 2,
    type: "filter_change",
    vehicle: "پراید 131",
    date: "1403/08/20",
    mileage: 120000,
    cost: 300000,
    status: "completed",
    description: "تعویض فیلتر هوا و کابین",
    location: "سرویس آزاد",
  },
  {
    id: 3,
    type: "brake_service",
    vehicle: "پژو 206",
    date: "1403/07/10",
    mileage: 82000,
    cost: 800000,
    status: "completed",
    description: "تعویض لنت ترمز و روغن ترمز",
    location: "تعمیرگاه رضا",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // Mock settings
  const [settings, setSettings] = useState({
    notifications: true,
    language: "fa",
    autoBackup: true,
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "oil_change":
        return <Build />;
      case "filter_change":
        return <Build />;
      case "brake_service":
        return <Build />;
      default:
        return <Build />;
    }
  };

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case "oil_change":
        return "تعویض روغن";
      case "filter_change":
        return "تعویض فیلتر";
      case "brake_service":
        return "سرویس ترمز";
      default:
        return "سرویس";
    }
  };

  const totalCost = mockHistory.reduce((sum, item) => sum + item.cost, 0);
  const thisYearServices = mockHistory.length;

  const profileStats = [
    {
      title: "مدت عضویت",
      value: "2",
      subtitle: "سال عضویت",
      icon: <CalendarToday />,
      color: "primary" as const,
    },
    {
      title: "کل سرویس‌ها",
      value: thisYearServices.toString(),
      subtitle: "سرویس ثبت شده",
      icon: <History />,
      color: "success" as const,
    },
    {
      title: "میانگین هزینه",
      value: (totalCost / thisYearServices / 1000).toFixed(0) + "K",
      subtitle: "هزار تومان",
      icon: <TrendingUp />,
      color: "info" as const,
    },
  ];

  return (
    <AppContainer
      header={
        <Header
          title="پروفایل"
          subtitle={
            user?.first_name
              ? `${user.first_name} ${user.last_name || ""}`
              : "کاربر"
          }
          actions={[
            <IconButton key="edit">
              <Edit />
            </IconButton>,
          ]}
        />
      }
    >
      {/* Account Activation */}
      {user?.status === "Deactivated" && (
        <AccountActivation
          phoneNumber={user.phone_number}
          onActivationSuccess={() => window.location.reload()}
        />
      )}

      <ResponsiveContainer padding="medium" fullHeight={false}>
        {/* Profile Header Card */}
        <SlideIn direction="up">
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Badge
                  badgeContent={
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        bgcolor:
                          user?.status === "Active"
                            ? "success.main"
                            : "warning.main",
                        border: "2px solid white",
                      }}
                    />
                  }
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "primary.main",
                      fontSize: 32,
                    }}
                  >
                    <Person sx={{ fontSize: 40 }} />
                  </Avatar>
                </Badge>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : "کاربر"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {user?.phone_number}
                  </Typography>
                  <Chip
                    label={
                      user?.status === "Active"
                        ? "فعال"
                        : user?.status === "Deactivated"
                        ? "غیرفعال"
                        : "نامشخص"
                    }
                    color={
                      user?.status === "Active"
                        ? "success"
                        : user?.status === "Deactivated"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </SlideIn>

        {/* Stats */}
        <SlideIn direction="up" delay={100}>
          <ResponsiveGrid columns={{ xs: 1, sm: 3 }} gap={2} sx={{ mb: 3 }}>
            {profileStats.map((stat) => (
              <StatusCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={
                  <Box sx={{ color: `${stat.color}.main` }}>{stat.icon}</Box>
                }
                color={stat.color}
              />
            ))}
          </ResponsiveGrid>
        </SlideIn>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="اطلاعات شخصی" />
            <Tab
              label={
                <Badge badgeContent={mockHistory.length} color="primary">
                  تاریخچه
                </Badge>
              }
            />
            <Tab label="تنظیمات" />
          </Tabs>
        </Box>

        {/* Personal Info Tab */}
        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <SectionHeader title="اطلاعات شخصی" />
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
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={tabValue} index={1}>
          <SectionHeader title="تاریخچه سرویس‌ها" />
          <StaggeredList>
            {mockHistory
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((item) => (
                <UIListItem
                  key={item.id}
                  title={getServiceTypeText(item.type)}
                  subtitle={`${item.vehicle} - ${
                    item.date
                  } | کیلومتر: ${item.mileage.toLocaleString()}`}
                  avatar={
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "success.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "success.dark",
                      }}
                    >
                      {getServiceIcon(item.type)}
                    </Box>
                  }
                  rightContent={
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" color="text.secondary">
                        هزینه
                      </Typography>
                      <Typography variant="body1">
                        {item.cost.toLocaleString()} تومان
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.location}
                      </Typography>
                    </Box>
                  }
                />
              ))}
          </StaggeredList>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* App Settings */}
            <Card>
              <CardContent>
                <SectionHeader title="تنظیمات برنامه" />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="اعلان‌ها"
                      secondary="دریافت اعلان‌های سرویس"
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
                      secondary="تغییر حالت روشن/تاریک"
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
                </List>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardContent>
                <SectionHeader title="حساب کاربری" />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="تغییر رمز عبور"
                      secondary="بروزرسانی رمز عبور"
                    />
                    <Button size="small" variant="outlined">
                      تغییر
                    </Button>
                  </ListItem>
                  <Divider />
                  <ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
                    <ListItemIcon sx={{ color: "error.main" }}>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: "error.main" }}>
                          خروج از حساب
                        </Typography>
                      }
                      secondary="خروج از برنامه"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </ResponsiveContainer>

      {/* Logout Dialog */}
      <LogoutDialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      />
    </AppContainer>
  );
}
