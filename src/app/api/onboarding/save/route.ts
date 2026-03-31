
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  // This logic is currently shared in the base route for simplicity in mock
  return NextResponse.json({
    success: true,
    data: body
  });
}
