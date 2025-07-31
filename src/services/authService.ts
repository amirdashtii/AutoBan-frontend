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
} from "../types/api";

// Auth Service
export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(credentials),
    });

    // Store both token
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

    // Store boeh tokens

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
}
