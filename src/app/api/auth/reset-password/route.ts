import { NextRequest, NextResponse } from "next/server";
import {
  proxyToBackend,
  setAuthCookie,
  setRefreshCookie,
} from "@/lib/api-helper";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await proxyToBackend({
    endpoint: "/auth/reset-password",
    method: "POST",
    body,
  });

  // If it's already a NextResponse (error case), return it
  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;

  // If the backend returns tokens (successful password reset), set them in cookies
  if (data.access_token) {
    await setAuthCookie(data.access_token);
  }
  if (data.refresh_token) {
    await setRefreshCookie(data.refresh_token);
  }

  return NextResponse.json(data, { status: response.status });
}
