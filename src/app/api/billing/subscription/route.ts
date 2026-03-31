
import { NextResponse } from 'next/server';
import { Subscription } from '@/types/billing';

let mockSubscription: Subscription = {
  id: 'sub_123',
  userId: 'mock_admin',
  plan: 'GROWTH',
  status: 'active',
  currentPeriodStart: new Date().toISOString(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  cancelAtPeriodEnd: false
};

export async function GET() {
  return NextResponse.json({ success: true, data: mockSubscription });
}

export { mockSubscription };
