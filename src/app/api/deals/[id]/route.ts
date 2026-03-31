
import { NextResponse } from 'next/server';
import { dealsDb } from '@/lib/deals-mock-db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  await new Promise(r => setTimeout(r, 500));
  const updated = dealsDb.updateDeal(params.id, body);
  return NextResponse.json({
    success: true,
    data: updated
  });
}
