import { apiClient } from "./apiClient";
import { apiRequest } from "@/utils/api";

export interface VehicleType {
  id: number;
  name_fa: string;
  name_en: string;
  description_fa?: string;
  description_en?: string;
}

export interface VehicleBrand {
  id: number;
  vehicle_type_id: number;
  name_fa: string;
  name_en: string;
  description_fa?: string;
  description_en?: string;
}

export interface VehicleModel {
  id: number;
  brand_id: number;
  name_fa: string;
  name_en: string;
  description_fa?: string;
  description_en?: string;
}

export interface VehicleGeneration {
  id: number;
  model_id: number;
  name_fa: string;
  name_en: string;
  start_year: number;
  end_year: number;
  body_style_fa: string;
  body_style_en: string;
  engine: string;
  engine_volume: number;
  cylinders: number;
  drivetrain_fa: string;
  drivetrain_en: string;
  gearbox: string;
  fuel_type: string;
  battery?: string;
  seller?: string;
  assembly_type?: string;
  assembler?: string;
}

export interface VehicleHierarchy {
  vehicle_types: VehicleTypeTree[];
  total_types: number;
  total_brands: number;
  total_models: number;
  total_generations: number;
}

export interface VehicleTypeTree {
  id: number;
  name_fa: string;
  name_en: string;
  brands: VehicleBrandTree[];
}

export interface VehicleBrandTree {
  id: number;
  name_fa: string;
  name_en: string;
  models: VehicleModelTree[];
}

export interface VehicleModelTree {
  id: number;
  name_fa: string;
  name_en: string;
  generations: VehicleGenerationTree[];
}

export interface VehicleGenerationTree {
  id: number;
  name_fa: string;
  name_en: string;
}

export interface CreateUserVehicleRequest {
  name: string;
  generation_id: number;
  production_year?: number;
  color?: string;
  license_plate?: string;
  vin?: string;
  current_mileage?: number;
  purchase_date?: string;
}

export interface UserVehicleResponse {
  id: number;
  user_id: string;
  name: string;
  generation_id: number;
  production_year?: number;
  color?: string;
  license_plate?: string;
  vin?: string;
  current_mileage?: number;
  purchase_date: string;
  type?: VehicleType;
  brand?: VehicleBrand;
  model?: VehicleModel;
  generation?: VehicleGeneration;
}

export const vehicleService = {
  // دریافت hierarchy کامل
  async getCompleteHierarchy(): Promise<VehicleHierarchy> {
    // مسیر داخلی Next برای یکپارچگی با Hook ها و حل CORS/Auth
    return await apiRequest<VehicleHierarchy>("/vehicles/hierarchy");
  },

  // دریافت انواع خودرو
  async getVehicleTypes(): Promise<VehicleType[]> {
    const response = await apiClient.get("/vehicles/types");
    return response.data.types;
  },

  // دریافت برندها بر اساس نوع
  async getBrandsByType(typeId: number): Promise<VehicleBrand[]> {
    const response = await apiClient.get(`/vehicles/types/${typeId}/brands`);
    return response.data.brands;
  },

  // دریافت مدل‌ها بر اساس برند
  async getModelsByBrand(
    typeId: number,
    brandId: number
  ): Promise<VehicleModel[]> {
    const response = await apiClient.get(
      `/vehicles/types/${typeId}/brands/${brandId}/models`
    );
    return response.data.models;
  },

  // دریافت نسل‌ها بر اساس مدل
  async getGenerationsByModel(
    typeId: number,
    brandId: number,
    modelId: number
  ): Promise<VehicleGeneration[]> {
    const response = await apiClient.get(
      `/vehicles/types/${typeId}/brands/${brandId}/models/${modelId}/generations`
    );
    return response.data.generations;
  },

  // افزودن خودرو جدید
  async createUserVehicle(
    data: CreateUserVehicleRequest
  ): Promise<UserVehicleResponse> {
    const response = await apiRequest<UserVehicleResponse>("/user/vehicles", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  // دریافت لیست خودروهای کاربر
  async getUserVehicles(): Promise<UserVehicleResponse[]> {
    const response = await apiRequest<{ vehicles: UserVehicleResponse[] }>(
      "/user/vehicles"
    );
    return response.vehicles;
  },

  // دریافت جزئیات خودرو
  async getUserVehicle(vehicleId: number): Promise<UserVehicleResponse> {
    const response = await apiRequest<UserVehicleResponse>(
      `/user/vehicles/${vehicleId}`
    );
    return response;
  },

  // ویرایش خودرو
  async updateUserVehicle(
    vehicleId: number,
    data: Partial<CreateUserVehicleRequest>
  ): Promise<UserVehicleResponse> {
    const response = await apiRequest<UserVehicleResponse>(
      `/user/vehicles/${vehicleId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response;
  },

  // حذف خودرو
  async deleteUserVehicle(vehicleId: number): Promise<void> {
    await apiRequest(`/user/vehicles/${vehicleId}`, { method: "DELETE" });
  },
};
