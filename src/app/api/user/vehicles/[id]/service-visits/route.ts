import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api-helper";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await proxyToBackend({
    endpoint: `/user/vehicles/${id}/service-visits`,
    method: "GET",
    includeAuthToken: true,
  });

  if (result instanceof NextResponse) return result;
  const { data, response } = result;
  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const { id } = await context.params;

  const result = await proxyToBackend({
    endpoint: `/user/vehicles/${id}/service-visits`,
    method: "POST",
    includeAuthToken: true,
    body,
  });

  if (result instanceof NextResponse) return result;
  const { data, response } = result;
  return NextResponse.json(data, { status: response.status });
}


