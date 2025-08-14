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
    try {
      const response = await apiRequest<
        UserVehicleResponse | UserVehicle | Record<string, unknown> | null
      >(`/user/vehicles/${vehicleId}`, {
        method: HTTP_METHODS.GET,
      });

      if (!response) {
        throw new Error("Empty response");
      }

      console.log(response);
      // Exact expected shape
      if ((response as UserVehicleResponse).vehicle) {
        return response as UserVehicleResponse;
      }

      // ApiResponse-like wrappers
      const maybe = response as Record<string, unknown>;
      const dataUnknown = (maybe as { data?: unknown }).data;
      if (dataUnknown && typeof dataUnknown === "object") {
        const dataObj = dataUnknown as Record<string, unknown>;
        if (
          "vehicle" in dataObj &&
          dataObj.vehicle &&
          typeof dataObj.vehicle === "object"
        ) {
          return { vehicle: dataObj.vehicle as UserVehicle };
        }
        if ("id" in dataObj) {
          return { vehicle: dataObj as unknown as UserVehicle };
        }
      }

      // Raw vehicle
      const raw = response as UserVehicle;
      if (raw && typeof raw === "object" && "id" in raw) {
        return { vehicle: raw };
      }

      throw new Error("Unexpected response shape");
    } catch (_err) {
      // Fallback: fetch list and find locally
      const list = await this.getUserVehicles();
      const found = list.vehicles.find((v) => v.id === vehicleId);
      if (!found) throw _err;
      return { vehicle: found };
    }
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
