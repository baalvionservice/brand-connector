
import { NextResponse } from 'next/server';
import { Payment } from '@/types/payment';

// Shared mock storage
export let payments: Payment[] = [
  {
    id: 'pay_1',
    proposalId: 'prop_1',
    dealId: 'deal_1',
    companyName: 'Lumina Tech',
    amount: 4500,
    status: 'escrow',
    method: 'card',
    transactionId: 'txn_8F3K92JD',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const p = payments.find(item => item.id === id);
    return NextResponse.json({ success: true, data: p });
  }

  return NextResponse.json({ success: true, data: payments });
}
