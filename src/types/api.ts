// API Response Types
export interface ApiResponse<T = any> {
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
  role: number;
  status: number;
  created_at: string;
 
 updated_at: string;
}