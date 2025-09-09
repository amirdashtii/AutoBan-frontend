// API Configuration for client-side requests
export const API_BASE_URL = "/api";

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

// Handle API errors
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = "خطایی رخ داده است";

    try {
      const errorData = await response.json();

      // Check for the actual backend error structure
      if (errorData.error?.message?.persian) {
        errorMessage = errorData.error.message.persian;
      } else if (errorData.error?.message?.english) {
        errorMessage = errorData.error.message.english;
      } else if (errorData.error?.Message?.Persian) {
        // For different error structure that might exist
        errorMessage = errorData.error.Message.Persian;
      } else if (errorData.error?.Message?.English) {
        errorMessage = errorData.error.Message.English;
      } else if (errorData.message) {
        // For simple message field
        errorMessage = errorData.message;
      } else if (typeof errorData.error === "string") {
        // For simple string error messages
        errorMessage = errorData.error;
      }
    } catch (parseError) {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return response;
};

// Generic API request function for client-side requests
// Now all authentication is handled server-side via cookies
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: getDefaultHeaders(),
    credentials: "include", // Include cookies in requests
    ...options,
  };

  let response = await fetch(url, config);

  // If 401 and not already a refresh request, decide based on token presence
  if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
    const hasAuthToken =
      typeof document !== "undefined" &&
      (document.cookie.includes("auth-token=") ||
        document.cookie.includes("refresh-token="));

    // If there's no auth/refresh token, user is simply unauthenticated
    if (!hasAuthToken) {
      // Throw a sentinel error that callers can interpret as non-fatal unauthenticated
      throw new Error("UNAUTHENTICATED");
    }

    try {
      // Try to refresh token
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: getDefaultHeaders(),
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (refreshResponse.ok) {
        // Wait a bit for cookie to be set
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Retry original request with new token
        response = await fetch(url, config);

        // If still 401 after refresh, throw error
        if (response.status === 401) {
          throw new Error("نشست شما منقضی شده است، لطفاً دوباره وارد شوید");
        }
      } else {
        // Refresh failed
        throw new Error("SESSION_EXPIRED");
      }
    } catch (refreshError) {
      throw new Error("SESSION_EXPIRED");
    }
  }

  await handleApiError(response);

  // Tolerate empty responses (e.g., 204 No Content, or empty 200)
  const contentLength = response.headers.get("content-length");
  const contentType = response.headers.get("content-type") || "";
  if (
    response.status === 204 ||
    contentLength === "0" ||
    (!contentType.includes("application/json") && response.ok)
  ) {
    return undefined as unknown as T;
  }

  const data = await response.json();
  return data;
};
