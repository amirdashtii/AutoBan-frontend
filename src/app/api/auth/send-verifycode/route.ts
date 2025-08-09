import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api-helper";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await proxyToBackend({
    endpoint: "/auth/send-verification-code",
    method: "POST",
    includeAuthToken: true, // Requires authentication
    body,
  });

  // If it's already a NextResponse (error case), return it
  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;
  return NextResponse.json(data, { status: response.status });
}
