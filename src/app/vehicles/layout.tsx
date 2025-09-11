"use client";

import React from "react";
import BottomNavigationComponent, {
  NavigationTab,
} from "@/components/layout/BottomNavigation";
import { AppShell } from "@/components/layout";
import { useRouter, usePathname } from "next/navigation";

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentTab = (): NavigationTab => {
    if (pathname.startsWith("/vehicles")) return "vehicles";
    if (pathname.startsWith("/settings")) return "settings";
    return "vehicles";
  };

  const handleTabChange = (tab: NavigationTab) => {
    switch (tab) {
      case "home":
        router.push("/home");
        break;
      case "vehicles":
        router.push("/vehicles");
        break;
      case "settings":
        router.push("/settings");
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
