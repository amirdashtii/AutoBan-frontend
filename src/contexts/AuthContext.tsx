"use client";

import React, { ReactNode, useCallback, useEffect, useReducer } from "react";
import { LoginRequest, SignupRequest, User } from "@/types/api";
import { AuthService } from "@/services/authService";
import { apiRequest } from "@/utils/api";
import { useRouter, usePathname } from "next/navigation";
import {
  AuthContext,
  AuthContextType,
  authReducer,
  initialState,
} from "./authUtils";

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      // Ensure we're on the client side
      if (typeof window === "undefined") {
        return;
      }

      const currentPath = window.location.pathname;

      // Don't check auth on public pages
      if (
        currentPath === "/signin" ||
        currentPath === "/signup" ||
        currentPath === "/"
      ) {
        // For public pages, only check if user has token and might be already logged in
        const hasAuthToken = document.cookie.includes("auth-token=");

        if (hasAuthToken) {
          try {
            // User has token, check if it's valid
            const user = await apiRequest<User>("/users/me");
            dispatch({ type: "AUTH_SUCCESS", payload: { user } });

            // Redirect to dashboard if on public page but authenticated
            if (
              currentPath === "/signin" ||
              currentPath === "/signup" ||
              currentPath === "/"
            ) {
              router.replace("/dashboard");
            }
          } catch (error) {
            // Token invalid, set to logout state
            dispatch({ type: "AUTH_LOGOUT" });
          }
        } else {
          // No token, set to logout state
          dispatch({ type: "AUTH_LOGOUT" });
        }
        return;
      }

      // For protected pages, always check authentication
      try {
        const user = await apiRequest<User>("/users/me");
        dispatch({ type: "AUTH_SUCCESS", payload: { user } });
      } catch (error) {
        // If auth fails completely (including refresh), user is not authenticated
        dispatch({ type: "AUTH_LOGOUT" });
        router.replace("/signin");
      }
    };

    initializeAuth();
  }, [router]);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await AuthService.login(credentials);
      // Get user data after successful login
      const user = await AuthService.getCurrentUser();
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user },
      });
      return response;
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: (error as Error).message });
      throw error;
    }
  }, []);

  // Signup function
  const signup = useCallback(async (credentials: SignupRequest) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await AuthService.signup(credentials);
      // Get user data after successful signup
      const user = await AuthService.getCurrentUser();
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user },
      });
      return response;
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: (error as Error).message });
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "AUTH_LOGOUT" });
      // Always redirect to signin after logout
      router.replace("/signin");
    }
  }, [router]);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
