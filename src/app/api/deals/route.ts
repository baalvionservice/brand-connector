
import { NextResponse } from 'next/server';
import { dealsDb } from '@/lib/deals-mock-db';

export async function GET() {
  await new Promise(r => setTimeout(r, 600));
  return NextResponse.json({
    success: true,
    data: dealsDb.getDeals()
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  await new Promise(r => setTimeout(r, 800));
  const deal = dealsDb.createDeal(body);
  return NextResponse.json({
    success: true,
    data: deal
  });
}
