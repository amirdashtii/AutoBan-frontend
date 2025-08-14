"use client";

import { useEffect } from "react";
import { usePrefetchVehicleHierarchy } from "@/hooks/useVehicles";
import { useAuth } from "@/hooks/useAuth";

/**
 * DataPrefetcher component preloads critical data for better performance
 * This component should be rendered early in the app lifecycle
 */
export default function DataPrefetcher() {
  const { isAuthenticated } = useAuth();
  const prefetchVehicleHierarchy = usePrefetchVehicleHierarchy();

  useEffect(() => {
    // Prefetch vehicle hierarchy data early as it's used frequently
    // and rarely changes
    const timer = setTimeout(() => {
      prefetchVehicleHierarchy();
    }, 1000); // Delay to not block initial render

    return () => clearTimeout(timer);
  }, [prefetchVehicleHierarchy]);

  useEffect(() => {
    // Prefetch user-specific data when authenticated
    if (isAuthenticated) {
      // Additional prefetching for authenticated users can be added here
      // For example: prefetch user vehicles, recent services, etc.
    }
  }, [isAuthenticated]);

  // This component doesn't render anything
  return null;
}
