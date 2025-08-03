import {
  apiRequest,
  clearAuthData,
  HTTP_METHODS,
  setAuthToken,
  setRefreshToken,
} from "../utils/api";
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
  VerificationCodeRequest,
  VerifyCodeRequest,
  VerificationResponse,
} from "../types/api";

// Auth Service
export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(credentials),
    });

    // Store both tokens
    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);
    return response;
  }

  // Register user
  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(userData),
    });

    // Store both tokens
    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);
    return response;
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await apiRequest<ApiResponse>("/auth/logout", {
        method: HTTP_METHODS.POST,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    const response = await apiRequest<User>("/users/me", {
      method: HTTP_METHODS.GET,
    });

    return response;
  }

  // Send verification code
  static async sendVerificationCode(
    data: VerificationCodeRequest
  ): Promise<VerificationResponse> {
    return await apiRequest<VerificationResponse>(
      "/auth/send-verification-code",
      {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(data),
      }
    );
  }

  // Verify phone number
  static async verifyPhoneNumber(
    data: VerifyCodeRequest
  ): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/verify-code", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });

    // Store both tokens after verification
    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);
    return response;
  }

  // Refresh token
  static async refreshToken(): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/refresh-token", {
      method: HTTP_METHODS.POST,
    });

    // Update both tokens
    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);
    return response;
  }
}
