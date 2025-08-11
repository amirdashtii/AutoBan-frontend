import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:8080/api/v1";

interface ProxyOptions {
  endpoint: string;
  method: string;
  includeAuthToken?: boolean;
  body?: unknown;
}

export async function proxyToBackend({
  endpoint,
  method,
  includeAuthToken = false,
  body,
}: ProxyOptions) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add auth token if needed
  if (includeAuthToken) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");
    if (token) {
      headers.Authorization = `Bearer ${token.value}`;
    }
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle 204 No Content or successful non-JSON responses gracefully
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      if (response.ok) {
        // Success with no JSON body (e.g., 204)
        return { data: null, response };
      }
      // Not OK and not JSON → try to read text and return standardized error
      const text = await response.text();
      console.error("Non-JSON error response from backend:", text);
      return NextResponse.json(
        {
          error: {
            message: {
              persian: "خطا در سرور بک‌اند",
              english: "Backend server error",
            },
          },
        },
        { status: response.status || 500 }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return NextResponse.json(
        {
          error: {
            message: {
              persian: "پاسخ نامعتبر از سرور",
              english: "Invalid response from server",
            },
          },
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return { data, response };
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      {
        error: {
          Message: {
            Persian: "خطا در اتصال به سرور",
            English: "Server connection error",
          },
        },
      },
      { status: 500 }
    );
  }
}

export async function setAuthCookie(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", accessToken, {
    httpOnly: false, // Allow JavaScript access for client-side auth checks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function setRefreshCookie(refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("refresh-token", refreshToken, {
    httpOnly: true, // Keep refresh token httpOnly for security
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh-token");
  return token?.value || null;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  cookieStore.delete("refresh-token");
}
