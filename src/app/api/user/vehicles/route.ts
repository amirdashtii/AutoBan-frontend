import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
  const result = await proxyToBackend({
    endpoint: "/user/vehicles",
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

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await proxyToBackend({
    endpoint: "/user/vehicles",
    method: "POST",
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
