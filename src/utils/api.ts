// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

// Default headers
export const getDefaultHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Accept: "application/json",
});

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Set auth token to localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// Set refresh token to localStorage
export const setRefreshToken = (token: string): void => {
  localStorage.setItem("refreshToken", token);
};

// Remove refresh token from localStorage
export const removeRefreshToken = (): void => {
  localStorage.removeItem("refreshToken");
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeAuthToken();
  removeRefreshToken();
};

// Get headers with auth token
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    ...getDefaultHeaders(),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Handle API errors
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = "خطایی رخ داده است";

    try {
      const errorData = await response.json();
      // Check for the new error structure
      if (errorData.error && errorData.error.Message) {
        errorMessage =
          errorData.error.Message.Persian || errorData.error.Message.English;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return response;
};

// Refresh token function
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Generic API request function with automatic token refresh
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // If token is expired (401), try to refresh
    if (response.status === 401 && !endpoint.includes("/auth/refresh-token")) {
      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiRequest<T>(endpoint, options);
        });
      }

      isRefreshing = true;

      try {
        // Try to refresh token
        const refreshResponse = await fetch(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            method: "POST",
            headers: getDefaultHeaders(),
            body: JSON.stringify({ refresh_token: getRefreshToken() }),
          }
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setAuthToken(refreshData.access_token);
          setRefreshToken(refreshData.refresh_token);

          // Retry the original request
          const retryConfig: RequestInit = {
            ...config,
            headers: {
              ...getDefaultHeaders(),
              Authorization: `Bearer ${refreshData.access_token}`,
            },
          };

          const retryResponse = await fetch(url, retryConfig);
          await handleApiError(retryResponse);
          const data = await retryResponse.json();

          processQueue(null, refreshData.access_token);
          return data;
        } else {
          // Refresh failed, clear auth data
          clearAuthData();
          processQueue(new Error("Token refresh failed"));
          throw new Error("Token refresh failed");
        }
      } catch (error) {
        clearAuthData();
        processQueue(error);
        throw error;
      } finally {
        isRefreshing = false;
      }
    } else {
      await handleApiError(response);
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};
    