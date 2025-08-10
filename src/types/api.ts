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

// Legacy types (keeping for backward compatibility)
export interface VerificationCodeRequest {
  phone_number: string;
}

export interface VerifyCodeRequest {
  phone_number: string;
  code: string;
}
