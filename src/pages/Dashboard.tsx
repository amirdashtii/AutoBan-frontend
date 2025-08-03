import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Build as ServiceIcon,
  Event as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import AppTheme from "../theme/AppTheme";
import LoadingSpinner from "../components/LoadingSpinner";
import MainLayout from "../components/layout/MainLayout";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

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
      <MainLayout>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            خوش آمدید {user.first_name || "کاربر گرامی"}!
          </Typography>

          {/* Stats Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
              mb: 4,
            }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">خودروها</Typography>
                </Box>
                <Typography variant="h4" component="div">
                  0
                </Typography>
                <Typography color="text.secondary">خودرو ثبت شده</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled>
                  مشاهده همه
                </Button>
              </CardActions>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ServiceIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">سرویس‌ها</Typography>
                </Box>
                <Typography variant="h4" component="div">
                  0
                </Typography>
                <Typography color="text.secondary">سرویس انجام شده</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled>
                  مشاهده همه
                </Button>
              </CardActions>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">تقویم</Typography>
                </Box>
                <Typography variant="h4" component="div">
                  0
                </Typography>
                <Typography color="text.secondary">رویداد پیش‌رو</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled>
                  مشاهده تقویم
                </Button>
              </CardActions>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">گزارشات</Typography>
                </Box>
                <Typography variant="h4" component="div">
                  0
                </Typography>
                <Typography color="text.secondary">گزارش آماده</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled>
                  مشاهده گزارشات
                </Button>
              </CardActions>
            </Card>
          </Box>

          {/* User Info */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              اطلاعات حساب کاربری
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body1">
                  <strong>نام:</strong>{" "}
                  {user.first_name
                    ? `${user.first_name} ${user.last_name || ""}`
                    : "تنظیم نشده"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1">
                  <strong>شماره تلفن:</strong> {user.phone_number}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" component="div">
                  <strong>وضعیت:</strong>{" "}
                  <Chip
                    label={user.status === "Active" ? "فعال" : "غیرفعال"}
                    color={user.status === "Active" ? "success" : "warning"}
                    size="small"
                  />
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1">
                  <strong>تاریخ عضویت:</strong>{" "}
                  {new Date(user.created_at).toLocaleDateString("fa-IR")}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              اقدامات سریع
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CarIcon />}
                disabled
              >
                افزودن خودرو
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ServiceIcon />}
                disabled
              >
                ثبت سرویس
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CalendarIcon />}
                disabled
              >
                برنامه‌ریزی
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TrendingUpIcon />}
                disabled
              >
                گزارش جدید
              </Button>
            </Box>
          </Paper>
        </Container>
      </MainLayout>
    </AppTheme>
  );
}
