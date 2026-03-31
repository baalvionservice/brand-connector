
import { NextResponse } from 'next/server';
import { mockSubscription } from '../subscription/route';

export async function POST() {
  mockSubscription.cancelAtPeriodEnd = true;
  return NextResponse.json({ success: true, data: mockSubscription });
}
