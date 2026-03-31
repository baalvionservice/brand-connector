
import { NextResponse } from 'next/server';
import { payments } from '../../route';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = payments.findIndex(p => p.id === params.id);
  if (index === -1) return NextResponse.json({ success: false }, { status: 404 });

  payments[index].status = 'escrow';
  payments[index].updatedAt = new Date().toISOString();

  return NextResponse.json({ success: true, data: payments[index] });
}
