import { NextRequest, NextResponse } from "next/server";
import {
  proxyToBackend,
  setAuthCookie,
  setRefreshCookie,
} from "@/lib/api-helper";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await proxyToBackend({
    endpoint: "/auth/login",
    method: "POST",
    body,
  });

  // If it's already a NextResponse (error case), return it
  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;

  // Set auth cookies if login successful
  if (data.access_token) {
    await setAuthCookie(data.access_token);
  }
  if (data.refresh_token) {
    await setRefreshCookie(data.refresh_token);
  }

  return NextResponse.json(data, { status: response.status });
}
