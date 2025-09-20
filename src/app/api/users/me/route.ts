import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
  const result = await proxyToBackend({
    endpoint: "/users/me",
    method: "GET",
    includeAuthToken: true,
  });

  // If it's already a NextResponse (error case), return it
  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const result = await proxyToBackend({
    endpoint: "/users/me",
    method: "PUT",
    includeAuthToken: true,
    body,
  });

  // If it's already a NextResponse (error case), return it
  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;
  return NextResponse.json(data, { status: response.status });
}
