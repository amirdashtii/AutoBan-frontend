import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, HTTP_METHODS } from "@/utils/api";
import { queryKeys } from "@/lib/react-query";
import {
  UserVehicle,
  ListUserVehiclesResponse,
  UserVehicleResponse,
  CreateUserVehicleRequest,
  UpdateUserVehicleRequest,
  CompleteVehicleHierarchy,
} from "@/types/api";

// Get user vehicles with caching
export function useUserVehicles() {
  return useQuery({
    queryKey: queryKeys.vehicles.userVehicles,
    queryFn: async (): Promise<UserVehicle[]> => {
      const response = await apiRequest<ListUserVehiclesResponse>(
        "/user/vehicles"
      );
      return response.vehicles || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - vehicle data doesn't change frequently
  });
}

// Get single user vehicle
export function useUserVehicle(vehicleId: string) {
  return useQuery({
    queryKey: queryKeys.vehicles.userVehicle(vehicleId),
    queryFn: async (): Promise<UserVehicle> => {
      const response = await apiRequest<UserVehicleResponse>(
        `/user/vehicles/${vehicleId}`
      );
      return response.vehicle;
    },
    enabled: !!vehicleId, // Only run if vehicleId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get vehicle hierarchy with aggressive caching (this data rarely changes)
export function useVehicleHierarchy() {
  return useQuery({
    queryKey: queryKeys.vehicles.hierarchy,
    queryFn: async (): Promise<CompleteVehicleHierarchy> => {
      return await apiRequest<CompleteVehicleHierarchy>("/vehicles/hierarchy");
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - hierarchy data is very stable
    gcTime: 60 * 60 * 1000, // 1 hour cache time
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// Create user vehicle mutation
export function useCreateUserVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      vehicleData: CreateUserVehicleRequest
    ): Promise<UserVehicle> => {
      const response = await apiRequest<UserVehicleResponse>("/user/vehicles", {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(vehicleData),
      });
      return response.vehicle;
    },
    onSuccess: (newVehicle) => {
      // Update the user vehicles cache with the new vehicle
      queryClient.setQueryData<UserVehicle[]>(
        queryKeys.vehicles.userVehicles,
        (oldVehicles) => {
          if (!oldVehicles) return [newVehicle];
          return [...oldVehicles, newVehicle];
        }
      );

      // Also cache the individual vehicle
      queryClient.setQueryData(
        queryKeys.vehicles.userVehicle(newVehicle.id.toString()),
        newVehicle
      );
    },
  });
}

// Update user vehicle mutation
export function useUpdateUserVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vehicleId,
      vehicleData,
    }: {
      vehicleId: string;
      vehicleData: UpdateUserVehicleRequest;
    }): Promise<UserVehicle> => {
      const response = await apiRequest<UserVehicleResponse>(
        `/user/vehicles/${vehicleId}`,
        {
          method: HTTP_METHODS.PUT,
          body: JSON.stringify(vehicleData),
        }
      );
      return response.vehicle;
    },
    onSuccess: (updatedVehicle, { vehicleId }) => {
      // Update the individual vehicle cache
      queryClient.setQueryData(
        queryKeys.vehicles.userVehicle(vehicleId),
        updatedVehicle
      );

      // Update the user vehicles list cache
      queryClient.setQueryData<UserVehicle[]>(
        queryKeys.vehicles.userVehicles,
        (oldVehicles) => {
          if (!oldVehicles) return [updatedVehicle];
          return oldVehicles.map((vehicle) =>
            vehicle.id.toString() === vehicleId ? updatedVehicle : vehicle
          );
        }
      );
    },
  });
}

// Delete user vehicle mutation
export function useDeleteUserVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleId: string): Promise<void> => {
      await apiRequest(`/user/vehicles/${vehicleId}`, {
        method: HTTP_METHODS.DELETE,
      });
    },
    onSuccess: (_, vehicleId) => {
      // Remove from user vehicles list cache
      queryClient.setQueryData<UserVehicle[]>(
        queryKeys.vehicles.userVehicles,
        (oldVehicles) => {
          if (!oldVehicles) return [];
          return oldVehicles.filter(
            (vehicle) => vehicle.id.toString() !== vehicleId
          );
        }
      );

      // Remove individual vehicle cache
      queryClient.removeQueries({
        queryKey: queryKeys.vehicles.userVehicle(vehicleId),
      });

      // Remove related service data
      queryClient.removeQueries({
        queryKey: queryKeys.services.vehicle(vehicleId),
      });
    },
  });
}

// Prefetch vehicle hierarchy (useful for pre-loading data)
export function usePrefetchVehicleHierarchy() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.vehicles.hierarchy,
      queryFn: async (): Promise<CompleteVehicleHierarchy> => {
        return await apiRequest<CompleteVehicleHierarchy>(
          "/api/vehicles/hierarchy"
        );
      },
      staleTime: 30 * 60 * 1000,
    });
  };
}
