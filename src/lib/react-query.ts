import { QueryClient } from "@tanstack/react-query";

// Create a query client with optimized default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes (data is considered fresh for 5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes (cache persists for 10 minutes after component unmount)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (good for getting fresh data when user returns)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

// Query Keys - Centralized key management for consistency
export const queryKeys = {
  // Auth related
  auth: {
    user: ["auth", "user"] as const,
  },

  // Vehicles related
  vehicles: {
    all: ["vehicles"] as const,
    hierarchy: ["vehicles", "hierarchy"] as const,
    userVehicles: ["vehicles", "user"] as const,
    userVehicle: (id: string) => ["vehicles", "user", id] as const,
    types: ["vehicles", "types"] as const,
    brands: (typeId: number) =>
      ["vehicles", "types", typeId, "brands"] as const,
    models: (typeId: number, brandId: number) =>
      ["vehicles", "types", typeId, "brands", brandId, "models"] as const,
    generations: (typeId: number, brandId: number, modelId: number) =>
      [
        "vehicles",
        "types",
        typeId,
        "brands",
        brandId,
        "models",
        modelId,
        "generations",
      ] as const,
  },

  // Services related
  services: {
    all: ["services"] as const,
    vehicle: (vehicleId: string) => ["services", "vehicle", vehicleId] as const,
    visit: (vehicleId: string, visitId: string) =>
      ["services", "vehicle", vehicleId, "visit", visitId] as const,
    oilChanges: (vehicleId: string) =>
      ["services", "vehicle", vehicleId, "oil-changes"] as const,
    oilFilters: (vehicleId: string) =>
      ["services", "vehicle", vehicleId, "oil-filters"] as const,
  },

  // History related
  history: {
    all: ["history"] as const,
    vehicle: (vehicleId: string) => ["history", "vehicle", vehicleId] as const,
  },
} as const;

// Helper function to invalidate related queries
export const invalidateQueries = {
  userVehicles: () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.vehicles.userVehicles,
    }),
  vehicleServices: (vehicleId: string) =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.services.vehicle(vehicleId),
    }),
  userProfile: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.user }),
  allVehicleData: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all }),
};
