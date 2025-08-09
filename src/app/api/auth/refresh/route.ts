import { NextRequest, NextResponse } from "next/server";
import {
  proxyToBackend,
  setAuthCookie,
  setRefreshCookie,
  getRefreshToken,
} from "@/lib/api-helper";

export async function POST(request: NextRequest) {
  // Get refresh token from httpOnly cookie
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return NextResponse.json(
      {
        error: {
          message: {
            persian: "توکن تازه‌سازی یافت نشد",
            english: "Refresh token not found",
          },
        },
      },
      { status: 401 }
    );
  }

  const result = await proxyToBackend({
    endpoint: "/auth/refresh",
    method: "POST",
    includeAuthToken: false, // Don't include auth token, we're refreshing it
    body: { refresh_token: refreshToken },
  });

  // If it's already a NextResponse (error case), return it
  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;

  // Set new tokens if refresh successful
  if (data.access_token) {
    await setAuthCookie(data.access_token);
  }

  // Also set new refresh token if provided
  if (data.refresh_token) {
    await setRefreshCookie(data.refresh_token);
  }

  return NextResponse.json(data, { status: response.status });
}
