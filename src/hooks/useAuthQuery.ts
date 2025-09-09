import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, HTTP_METHODS } from "@/utils/api";
import { queryKeys } from "@/lib/react-query";
import { User, LoginRequest, SignupRequest, AuthResponse } from "@/types/api";
import { AuthService } from "@/services/authService";

// Get current user with caching
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async (): Promise<User> => {
      try {
        return await apiRequest<User>("/users/me");
      } catch (e: any) {
        // Treat unauthenticated (no token) as null user without surfacing a UI error
        if (typeof e?.message === "string" && e.message === "UNAUTHENTICATED") {
          return null as unknown as User;
        }
        // Surface real errors (including session expired)
        throw e;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if it's session expired or unauthenticated sentinel
      if (
        error?.message === "SESSION_EXPIRED" ||
        error?.message === "UNAUTHENTICATED" ||
        error?.message?.includes("منقضی شده")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Login mutation with cache updates
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      return await AuthService.login(credentials);
    },
    onSuccess: async () => {
      // After successful login, fetch and cache user data
      try {
        const user = await AuthService.getCurrentUser();
        queryClient.setQueryData(queryKeys.auth.user, user);
      } catch (error) {
        console.error("Failed to fetch user after login:", error);
      }
    },
    onError: () => {
      // Clear any existing user data on login error
      queryClient.removeQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

// Signup mutation with cache updates
export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: SignupRequest): Promise<AuthResponse> => {
      return await AuthService.signup(userData);
    },
    onSuccess: async () => {
      // After successful signup, fetch and cache user data
      try {
        const user = await AuthService.getCurrentUser();
        queryClient.setQueryData(queryKeys.auth.user, user);
      } catch (error) {
        console.error("Failed to fetch user after signup:", error);
      }
    },
    onError: () => {
      // Clear any existing user data on signup error
      queryClient.removeQueries({ queryKey: queryKeys.auth.user });
    },
  });
}

// Logout mutation with cache clearing
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await AuthService.logout();
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails, clear the cache (user might have invalid token)
      queryClient.clear();
    },
  });
}

// Update profile mutation
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<User>): Promise<User> => {
      return await apiRequest<User>("/users/me", {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(profileData),
      });
    },
    onSuccess: (updatedUser) => {
      // Update the user cache with new data
      queryClient.setQueryData(queryKeys.auth.user, updatedUser);
    },
  });
}

// Change password mutation
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (passwordData: {
      current_password: string;
      new_password: string;
    }): Promise<void> => {
      await apiRequest("/users/me/change-password", {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(passwordData),
      });
    },
  });
}

// Check if user data is available and valid
export function useIsAuthenticated() {
  const { data: user, isLoading, error } = useCurrentUser();

  return {
    isAuthenticated: !!user && !error,
    user,
    isLoading,
    // Hide the generic error if it's just unauthenticated; show a clean message if session expired
    error:
      error?.message === "UNAUTHENTICATED"
        ? null
        : error?.message === "SESSION_EXPIRED"
        ? "نشست شما منقضی شده است، لطفاً دوباره وارد شوید"
        : error,
  };
}
