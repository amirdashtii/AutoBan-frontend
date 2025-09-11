"use client";

import React from "react";
import { Box, Button, Fab } from "@mui/material";
import {
  DirectionsCar,
  Build,
  History,
  Person,
  Add,
  Settings,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import InactiveUserRestriction from "@/components/InactiveUserRestriction";
import {
  ListItemCard,
  ResponsiveContainer,
  ResponsiveGrid,
  StatusCard,
  SectionHeader,
  Header,
  AppContainer,
} from "@/components/ui";
import { useResponsive } from "@/components/ui/ResponsiveContainer";
import ColorModeSelect from "@/theme/ColorModeSelect";

export default function Home() {
  const router = useRouter();

  type QuickActionColor = "primary" | "success" | "info" | "warning";
  interface QuickAction {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: QuickActionColor;
    path: string;
  }

  // آمار کلی
  const stats = [
    {
      title: "خودروهای من",
      value: "2",
      subtitle: "خودرو ثبت شده",
      icon: <DirectionsCar />,
      color: "primary" as const,
    },
    {
      title: "سرویس‌های امسال",
      value: "12",
      subtitle: "سرویس انجام شده",
      icon: <Build />,
      color: "success" as const,
    },
    {
      title: "یادآوری فوری",
      value: "3",
      subtitle: "سرویس نزدیک",
      icon: <History />,
      color: "warning" as const,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: "خودروها",
      description: "مدیریت خودروها و سرویس‌ها",
      icon: <DirectionsCar />,
      color: "primary",
      path: "/vehicles",
    },
    {
      title: "تنظیمات",
      description: "تنظیمات و پروفایل",
      icon: <Person />,
      color: "info",
      path: "/settings",
    },
  ];

  const { isMobile } = useResponsive();

  return (
    <AppContainer
      header={
        <Header
          title="خانه AutoBan"
          subtitle="مدیریت خودرو و سرویس"
          actions={[<ColorModeSelect key="theme" size="small" />]}
        />
      }
    >
      {/* Account Activation Warning */}
      <InactiveUserRestriction />

      <ResponsiveContainer padding="medium" fullHeight={false}>
        {/* آمار کلی */}
        <SectionHeader title="آمار کلی" />
        <ResponsiveGrid
          columns={{ xs: 1, sm: 3 }}
          gap={2}
          autoFit={false}
          sx={{ mb: 4 }}
        >
          {stats.map((stat) => (
            <StatusCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={<Box sx={{ color: `${stat.color}.main` }}>{stat.icon}</Box>}
            />
          ))}
        </ResponsiveGrid>

        {/* دسترسی سریع */}
        <SectionHeader title="دسترسی سریع" />
        <ResponsiveGrid
          columns={{ xs: 1, sm: 2 }}
          gap={3}
          autoFit={!isMobile}
          minItemWidth="280px"
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
                  fullWidth={isMobile}
                >
                  مشاهده
                </Button>
              }
              onClick={() => router.push(action.path)}
            />
          ))}
        </ResponsiveGrid>

        {/* یادآوری‌های فوری */}
        <Box sx={{ mt: 4 }}>
          <SectionHeader title="یادآوری‌های فوری" />
          <ListItemCard
            title="تعویض روغن پژو 206"
            subtitle="کیلومتر فعلی: 85,000 - سرویس بعدی: 90,000"
            icon={<Build sx={{ color: "warning.main" }} />}
            actions={
              <Button size="small" color="warning" variant="outlined">
                جزئیات
              </Button>
            }
            onClick={() => router.push("/vehicles")}
          />
        </Box>
      </ResponsiveContainer>
    </AppContainer>
  );
}
