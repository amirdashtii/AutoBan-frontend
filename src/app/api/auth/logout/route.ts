import { NextRequest, NextResponse } from "next/server";
import {
  proxyToBackend,
  clearAuthCookie,
  getRefreshToken,
} from "@/lib/api-helper";

export async function POST(request: NextRequest) {
  // Get refresh token for logout request
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    // If no refresh token, just clear cookies and return success
    await clearAuthCookie();
    return NextResponse.json({ message: "Logged out successfully" });
  }

  const result = await proxyToBackend({
    endpoint: "/auth/logout",
    method: "POST",
    includeAuthToken: true,
    body: { refresh_token: refreshToken },
  });

  // Clear auth cookies regardless of backend response
  await clearAuthCookie();

  // If it's already a NextResponse (error case), return it
  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;
  return NextResponse.json(data, { status: response.status });
}
