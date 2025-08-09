"use client";

import React from "react";
import { Box, CssBaseline } from "@mui/material";
import BottomNavigationComponent, {
  NavigationTab,
} from "@/components/layout/BottomNavigation";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentTab = (): NavigationTab => {
    if (pathname === "/dashboard") return "home";
    if (pathname === "/dashboard/vehicles") return "vehicles";
    if (pathname === "/dashboard/services") return "services";
    if (pathname === "/dashboard/history") return "history";
    if (pathname === "/dashboard/profile") return "profile";
    return "home";
  };

  const handleTabChange = (tab: NavigationTab) => {
    switch (tab) {
      case "home":
        router.push("/dashboard");
        break;
      case "vehicles":
        router.push("/dashboard/vehicles");
        break;
      case "services":
        router.push("/dashboard/services");
        break;
      case "history":
        router.push("/dashboard/history");
        break;
      case "profile":
        router.push("/dashboard/profile");
        break;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        maxWidth: "100vw",
        overflow: "hidden",
        "& *": {
          boxSizing: "border-box",
        },
      }}
    >
      {/* Main Content */}
      <Box sx={{ flex: 1, width: "100%", maxWidth: "100%" }}>{children}</Box>

      {/* Bottom Navigation */}
      <BottomNavigationComponent
        currentTab={getCurrentTab()}
        onTabChange={handleTabChange}
      />
    </Box>
  );
}
