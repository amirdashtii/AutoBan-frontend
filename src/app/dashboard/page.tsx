"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import {
  DirectionsCar,
  Build,
  History,
  Person,
  Add,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import InactiveUserRestriction from "@/components/InactiveUserRestriction";
import { ListItemCard } from "@/components/ui";

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
      {/* Top header removed per design */}

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
          <ListItemCard
            key={action.title}
            title={action.title}
            subtitle={action.description}
            icon={
              <Box sx={{ color: `${action.color}.main` }}>{action.icon}</Box>
            }
            actions={
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                color={action.color}
              >
                مدیریت
              </Button>
            }
            onClick={() => router.push(action.path)}
          />
        ))}
      </Box>
    </Box>
  );
}
