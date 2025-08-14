"use client";

import { useEffect } from "react";

/**
 * PerformanceMonitor component tracks and logs performance metrics
 * Only active in development mode
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return;

    // Web Vitals monitoring
    const measureWebVitals = () => {
      if ("web-vitals" in window) return;

      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const { name, startTime, duration } = entry;

          // Log slow operations
          if (duration > 100) {
            console.warn(
              `🐌 Slow operation detected: ${name} took ${duration.toFixed(
                2
              )}ms`
            );
          }

          // Log specific metrics
          if (name === "first-contentful-paint") {
            console.info(
              `🎨 First Contentful Paint: ${startTime.toFixed(2)}ms`
            );
          } else if (name === "largest-contentful-paint") {
            console.info(
              `🖼️ Largest Contentful Paint: ${startTime.toFixed(2)}ms`
            );
          }
        });
      });

      // Observe different types of performance entries
      try {
        observer.observe({
          entryTypes: ["paint", "largest-contentful-paint", "measure"],
        });
      } catch (error) {
        console.warn("Performance Observer not supported");
      }

      return () => observer.disconnect();
    };

    // Monitor React Query performance
    const monitorReactQuery = () => {
      // Listen for React Query cache events
      const queryClient = (window as any).__REACT_QUERY_CLIENT__;
      if (queryClient) {
        const cache = queryClient.getQueryCache();

        cache.subscribe((event: any) => {
          if (event?.type === "added") {
            console.info(
              `📊 Query added to cache: ${JSON.stringify(event.query.queryKey)}`
            );
          } else if (event?.type === "updated") {
            const { state } = event.query;
            if (state.isLoading) {
              console.info(
                `⏳ Query loading: ${JSON.stringify(event.query.queryKey)}`
              );
            } else if (state.isSuccess) {
              console.info(
                `✅ Query success: ${JSON.stringify(event.query.queryKey)}`
              );
            } else if (state.isError) {
              console.error(
                `❌ Query error: ${JSON.stringify(event.query.queryKey)}`,
                state.error
              );
            }
          }
        });
      }
    };

    // Monitor bundle loading
    const monitorBundleLoading = () => {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === "resource") {
            const resource = entry as PerformanceResourceTiming;

            // Log slow-loading resources
            if (resource.duration > 1000) {
              console.warn(
                `🐌 Slow resource load: ${
                  resource.name
                } took ${resource.duration.toFixed(2)}ms`
              );
            }

            // Log JavaScript bundles
            if (
              resource.name.includes("/_next/static/chunks/") &&
              resource.transferSize
            ) {
              console.info(
                `📦 Bundle loaded: ${resource.name.split("/").pop()} (${(
                  resource.transferSize / 1024
                ).toFixed(2)}KB)`
              );
            }
          }
        });
      });

      try {
        resourceObserver.observe({ entryTypes: ["resource"] });
      } catch (error) {
        console.warn("Resource Observer not supported");
      }

      return () => resourceObserver.disconnect();
    };

    // Initialize monitoring
    const cleanup1 = measureWebVitals();
    const cleanup2 = monitorBundleLoading();

    // Delay React Query monitoring to ensure it's initialized
    const reactQueryTimer = setTimeout(monitorReactQuery, 1000);

    // Memory usage monitoring (if available)
    const memoryTimer = setInterval(() => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        const limitMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);

        // Warn if memory usage is high
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
          console.warn(`🧠 High memory usage: ${usedMB}MB / ${limitMB}MB`);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => {
      cleanup1?.();
      cleanup2?.();
      clearTimeout(reactQueryTimer);
      clearInterval(memoryTimer);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
