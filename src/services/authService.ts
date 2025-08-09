import { apiRequest, HTTP_METHODS } from "@/utils/api";
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
  SendVerificationCodeRequest,
  VerifyPhoneRequest,
  VerificationResponse,
  // Legacy types
  VerificationCodeRequest,
  VerifyCodeRequest,
} from "@/types/api";

// Auth Service
export class AuthService {
  // Login
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(credentials),
    });
    return response;
  }

  // Signup
  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(userData),
    });
    return response;
  }

  // Logout
  static async logout(): Promise<void> {
    await apiRequest<void>("/auth/logout", {
      method: HTTP_METHODS.POST,
    });
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    const response = await apiRequest<User>("/users/me", {
      method: HTTP_METHODS.GET,
    });
    return response;
  }

  // Refresh token
  static async refreshToken(): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/refresh", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({}), // Empty body since refresh token is handled server-side
    });
    return response;
  }

  // Send verification code for account activation
  static async sendVerificationCode(
    data: SendVerificationCodeRequest
  ): Promise<VerificationResponse> {
    const response = await apiRequest<VerificationResponse>(
      "/auth/send-verifycode",
      {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      }
    );
    return response;
  }

  // Verify phone and activate account
  static async verifyPhone(data: VerifyPhoneRequest): Promise<ApiResponse> {
    const response = await apiRequest<ApiResponse>("/auth/verify-phone", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
    return response;
  }

  // Legacy methods (keeping for backward compatibility)
  static async sendVerificationCodeLegacy(
    data: VerificationCodeRequest
  ): Promise<VerificationResponse> {
    return this.sendVerificationCode(data);
  }

  static async verifyCodeLegacy(data: VerifyCodeRequest): Promise<ApiResponse> {
    return this.verifyPhone(data);
  }
}
