
import { NextResponse } from 'next/server';
import { mockSubscription } from '../subscription/route';

export async function POST(request: Request) {
  const { plan } = await request.json();
  
  // Update mock state
  mockSubscription.plan = plan;
  mockSubscription.status = 'active';
  mockSubscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  mockSubscription.cancelAtPeriodEnd = false;

  return NextResponse.json({ success: true, data: mockSubscription });
}
