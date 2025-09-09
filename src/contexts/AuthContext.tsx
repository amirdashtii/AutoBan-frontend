"use client";

import React, { ReactNode, useCallback, useEffect } from "react";
import { LoginRequest, SignupRequest } from "@/types/api";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext, AuthContextType } from "./authUtils";
import {
  useIsAuthenticated,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
} from "@/hooks/useAuthQuery";

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Use React Query hooks for auth state
  const { isAuthenticated, user, isLoading, error } = useIsAuthenticated();
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const logoutMutation = useLogoutMutation();

  // Handle authentication redirects
  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;

    const currentPath = pathname;
    const isPublicPage = ["/signin", "/signup", "/"].includes(currentPath);
    const isProtectedPage = currentPath.startsWith("/home") || currentPath.startsWith("/vehicles") || currentPath.startsWith("/profile");

    if (isAuthenticated && isPublicPage) {
      // Authenticated user on public page → redirect to dashboard
      router.replace("/dashboard");
    } else if (!isAuthenticated && isProtectedPage) {
      // Unauthenticated user on protected page → redirect to signin without flashing global error
      router.replace("/signin");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Login function with React Query
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await loginMutation.mutateAsync(credentials);
        return response;
      } catch (error) {
        throw error;
      }
    },
    [loginMutation]
  );

  // Signup function with React Query
  const signup = useCallback(
    async (credentials: SignupRequest) => {
      try {
        const response = await signupMutation.mutateAsync(credentials);
        return response;
      } catch (error) {
        throw error;
      }
    },
    [signupMutation]
  );

  // Logout function with React Query
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      router.replace("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      router.replace("/signin");
    }
  }, [logoutMutation, router]);

  // Clear error function
  const clearError = useCallback(() => {
    // Reset mutation errors
    loginMutation.reset();
    signupMutation.reset();
    logoutMutation.reset();
  }, [loginMutation, signupMutation, logoutMutation]);

  // Context value
  const value: AuthContextType = {
    user: user || null,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending,
    error:
      error?.message ||
      loginMutation.error?.message ||
      signupMutation.error?.message ||
      logoutMutation.error?.message ||
      null,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
