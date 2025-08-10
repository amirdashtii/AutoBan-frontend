import { apiRequest, HTTP_METHODS } from "@/utils/api";
import {
  CompleteVehicleHierarchy,
  CreateUserVehicleRequest,
  UpdateUserVehicleRequest,
  ListUserVehiclesResponse,
  UserVehicleResponse,
  UserVehicle,
} from "@/types/api";

// Vehicle Service
export class VehicleService {
  // Get complete vehicle hierarchy
  static async getVehicleHierarchy(): Promise<CompleteVehicleHierarchy> {
    const response = await apiRequest<CompleteVehicleHierarchy>(
      "/vehicles/hierarchy",
      {
        method: HTTP_METHODS.GET,
      }
    );
    return response;
  }

  // Get user vehicles
  static async getUserVehicles(): Promise<ListUserVehiclesResponse> {
    const response = await apiRequest<ListUserVehiclesResponse>(
      "/user/vehicles",
      {
        method: HTTP_METHODS.GET,
      }
    );
    return response;
  }

  // Get specific user vehicle
  static async getUserVehicle(vehicleId: number): Promise<UserVehicleResponse> {
    const response = await apiRequest<UserVehicleResponse>(
      `/user/vehicles/${vehicleId}`,
      {
        method: HTTP_METHODS.GET,
      }
    );
    return response;
  }

  // Add new user vehicle
  static async addUserVehicle(
    data: CreateUserVehicleRequest
  ): Promise<UserVehicleResponse> {
    const response = await apiRequest<UserVehicleResponse>("/user/vehicles", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
    return response;
  }

  // Update user vehicle
  static async updateUserVehicle(
    vehicleId: number,
    data: UpdateUserVehicleRequest
  ): Promise<UserVehicleResponse> {
    const response = await apiRequest<UserVehicleResponse>(
      `/user/vehicles/${vehicleId}`,
      {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(data),
      }
    );
    return response;
  }

  // Delete user vehicle
  static async deleteUserVehicle(vehicleId: number): Promise<void> {
    await apiRequest<void>(`/user/vehicles/${vehicleId}`, {
      method: HTTP_METHODS.DELETE,
    });
  }
}
