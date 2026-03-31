
import { NextResponse } from 'next/server';
import { payments } from '../../route';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const index = payments.findIndex(p => p.id === params.id);
  
  if (index === -1) return NextResponse.json({ success: false }, { status: 404 });

  payments[index] = {
    ...payments[index],
    status: 'paid',
    method: body.method,
    transactionId: 'txn_' + Math.random().toString(36).substring(7).toUpperCase(),
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json({ success: true, data: payments[index] });
}
