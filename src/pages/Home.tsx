import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from "@mui/material";
import {
  DirectionsCar,
  Build,
  Schedule,
  Warning,
  Add,
  TrendingUp,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  // Mock data - در آینده از API دریافت می‌شود
  const mockData = {
    totalVehicles: 2,
    activeServices: 1,
    upcomingServices: 3,
    alerts: 2,
    recentServices: [
      {
        id: 1,
        vehicle: "پژو 206",
        service: "تعویض روغن",
        date: "1402/12/15",
        status: "completed",
      },
      {
        id: 2,
        vehicle: "سمند",
        service: "تعویض فیلتر هوا",
        date: "1402/12/10",
        status: "completed",
      },
    ],
  };

  return (
    <Box sx={{ p: 2, pb: 8 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          سلام {user?.first_name || "کاربر"} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          امروز {new Date().toLocaleDateString("fa-IR")} است
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <DirectionsCar color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {mockData.totalVehicles}
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
              <Build color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {mockData.activeServices}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                سرویس فعال
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Alerts Section */}
      {mockData.alerts > 0 && (
        <Card sx={{ mb: 3, bgcolor: "warning.light" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Warning color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">هشدارها</Typography>
            </Box>
            <Typography variant="body2">
              {mockData.alerts} مورد نیاز به توجه دارد
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              startIcon={<TrendingUp />}
            >
              مشاهده جزئیات
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            اقدامات سریع
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Add />}
                sx={{ py: 1.5 }}
              >
                افزودن خودرو
              </Button>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Schedule />}
                sx={{ py: 1.5 }}
              >
                برنامه سرویس
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Services */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            آخرین سرویس‌ها
          </Typography>
          <List>
            {mockData.recentServices.map((service, index) => (
              <React.Fragment key={service.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                    >
                      <Build sx={{ fontSize: 16 }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={service.service}
                    secondary={`${service.vehicle} - ${service.date}`}
                  />
                  <Chip
                    label="تکمیل شده"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </ListItem>
                {index < mockData.recentServices.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
