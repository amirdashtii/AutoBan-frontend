"use client";

import React from "react";
import BottomNavigationComponent, {
  NavigationTab,
} from "@/components/layout/BottomNavigation";
import { AppShell } from "@/components/layout";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentTab = (): NavigationTab => {
    if (pathname === "/dashboard") return "home";
    if (pathname.startsWith("/dashboard/vehicles")) return "vehicles";
    if (pathname.startsWith("/dashboard/services")) return "services";
    if (pathname.startsWith("/dashboard/history")) return "history";
    if (pathname.startsWith("/dashboard/profile")) return "profile";
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
    <AppShell>
      {children}
      <BottomNavigationComponent
        currentTab={getCurrentTab()}
        onTabChange={handleTabChange}
      />
    </AppShell>
  );
}
