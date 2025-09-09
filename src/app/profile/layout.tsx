"use client";

import React from "react";
import BottomNavigationComponent, {
  NavigationTab,
} from "@/components/layout/BottomNavigation";
import { AppShell } from "@/components/layout";
import { useRouter, usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentTab = (): NavigationTab => {
    if (pathname.startsWith("/vehicles")) return "vehicles";
    if (pathname.startsWith("/profile")) return "profile";
    return "profile";
  };

  const handleTabChange = (tab: NavigationTab) => {
    switch (tab) {
      case "home":
        router.push("/dashboard");
        break;
      case "vehicles":
        router.push("/vehicles");
        break;
      case "profile":
        router.push("/profile");
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
