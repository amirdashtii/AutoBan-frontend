import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api-helper";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await proxyToBackend({
    endpoint: `/user/vehicles/${id}`,
    method: "GET",
    includeAuthToken: true,
  });

  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const { id } = await context.params;

  const result = await proxyToBackend({
    endpoint: `/user/vehicles/${id}`,
    method: "PUT",
    includeAuthToken: true,
    body,
  });

  if (result instanceof NextResponse) {
    return result;
  }

  const { data, response } = result;
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await proxyToBackend({
    endpoint: `/user/vehicles/${id}`,
    method: "DELETE",
    includeAuthToken: true,
  });

  if (result instanceof NextResponse) {
    return result;
  }

  const { response } = result;
  return new NextResponse(null, {
    status: 204,
    statusText: response.statusText,
  });
}
