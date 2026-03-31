
import { NextResponse } from 'next/server';
import { payments } from '../route';
import { Payment } from '@/types/payment';

export async function POST(request: Request) {
  const body = await request.json();
  
  const newPayment: Payment = {
    id: 'pay_' + Date.now(),
    proposalId: body.proposalId,
    dealId: 'deal_mock', // Simplified
    companyName: body.companyName,
    amount: body.amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  payments.unshift(newPayment);

  return NextResponse.json({ success: true, data: newPayment });
}
