"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import {
  DirectionsCar,
  Build,
  History,
  Person,
  Add,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import InactiveUserRestriction from "@/components/InactiveUserRestriction";

export default function DashboardHome() {
  const router = useRouter();

  type QuickActionColor = "primary" | "success" | "info" | "warning";
  interface QuickAction {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: QuickActionColor;
    path: string;
  }

  const quickActions: QuickAction[] = [
    {
      title: "خودروها",
      description: "مدیریت خودروهای خود",
      icon: <DirectionsCar />,
      color: "primary",
      path: "/dashboard/vehicles",
    },
    {
      title: "سرویس",
      description: "ثبت و مشاهده سرویس‌ها",
      icon: <Build />,
      color: "success",
      path: "/dashboard/services",
    },
    {
      title: "تاریخچه",
      description: "مشاهده تاریخچه سرویس‌ها",
      icon: <History />,
      color: "info",
      path: "/dashboard/history",
    },
    {
      title: "پروفایل",
      description: "تنظیمات حساب کاربری",
      icon: <Person />,
      color: "warning",
      path: "/dashboard/profile",
    },
  ];

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        داشبورد
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        به اتوبان خوش آمدید! از اینجا می‌توانید خودروها و سرویس‌هایتان را مدیریت
        کنید.
      </Typography>

      {/* Account Activation Warning */}
      <InactiveUserRestriction />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        {quickActions.map((action) => (
          <Card
            key={action.title}
            sx={{
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => router.push(action.path)}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    color: `${action.color}.main`,
                    mr: 2,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" component="h2">
                  {action.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {action.description}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                color={action.color}
              >
                مدیریت
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
