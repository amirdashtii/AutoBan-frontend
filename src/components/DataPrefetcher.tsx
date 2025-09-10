"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * DataPrefetcher component preloads critical data for better performance
 * This component should be rendered early in the app lifecycle
 */
export default function DataPrefetcher() {
  const { isAuthenticated } = useAuth();

  // Prefetching disabled: hierarchy data will be fetched only where needed

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
