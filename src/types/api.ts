// API Response Types
export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
}

// Error Types
export interface ApiError {
  Message: {
    English: string;
    Persian: string;
  };
}

// Auth Types
export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface SignupRequest {
  phone_number: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
  birthday?: string;
  email?: string;
  status: string; // "Active", "Deactivated", "Deleted"
  role: string; // "User", "Admin", "SuperAdmin"
  created_at: string;
  updated_at: string;
}

// Profile Update Types
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  birthday?: string;
}

export interface UpdateProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
}

// Phone Verification Types
export interface SendVerificationCodeRequest {
  phone_number: string;
}

export interface VerifyPhoneRequest {
  phone_number: string;
  code: string;
}

export interface VerificationResponse {
  message: string;
}

// Forgot Password Types
export interface ForgotPasswordRequest {
  phone_number: string;
}

export interface ResetPasswordRequest {
  phone_number: string;
  new_password: string;
  verification_code: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// Vehicle Types
export interface VehicleType {
  id: number;
  name_fa: string;
  name_en: string;
  description_fa: string;
  description_en: string;
}

export interface VehicleBrand {
  id: number;
  vehicle_type_id: number;
  name_fa: string;
  name_en: string;
  description_fa: string;
  description_en: string;
}

export interface VehicleModel {
  id: number;
  brand_id: number;
  name_fa: string;
  name_en: string;
  description_fa: string;
  description_en: string;
}

export interface VehicleGeneration {
  id: number;
  model_id: number;
  name_fa: string;
  name_en: string;
  description_fa: string;
  description_en: string;
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
  battery: string;
  seller: string;
  assembly_type: string;
  assembler: string;
}

export interface UserVehicle {
  id: number;
  user_id: string;
  name: string;
  generation_id: number;
  production_year: number;
  color: string;
  license_plate: string;
  vin: string;
  current_mileage: number;
  purchase_date?: string;
  // Additional fields for display
  generation?: VehicleGeneration;
  model?: VehicleModel;
  brand?: VehicleBrand;
  type?: VehicleType;
}

// Vehicle Hierarchy Types
export interface VehicleGenerationTree {
  id: number;
  name_fa: string;
  name_en: string;
}

export interface VehicleModelTree {
  id: number;
  name_fa: string;
  name_en: string;
  generations: VehicleGenerationTree[];
}

export interface VehicleBrandTree {
  id: number;
  name_fa: string;
  name_en: string;
  models: VehicleModelTree[];
}

export interface VehicleTypeTree {
  id: number;
  name_fa: string;
  name_en: string;
  brands: VehicleBrandTree[];
}

export interface CompleteVehicleHierarchy {
  vehicle_types: VehicleTypeTree[];
  total_types: number;
  total_brands: number;
  total_models: number;
  total_generations: number;
}

// Vehicle Request Types
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

export interface UpdateUserVehicleRequest {
  name?: string;
  generation_id?: number;
  production_year?: number;
  color?: string;
  license_plate?: string;
  vin?: string;
  current_mileage?: number;
  purchase_date?: string;
}

// Vehicle Response Types
export interface ListUserVehiclesResponse {
  vehicles: UserVehicle[];
}

export interface UserVehicleResponse {
  vehicle: UserVehicle;
}

// Legacy types (keeping for backward compatibility)
export interface VerificationCodeRequest {
  phone_number: string;
}

export interface VerifyCodeRequest {
  phone_number: string;
  code: string;
}
