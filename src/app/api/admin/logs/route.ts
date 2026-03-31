
import { NextResponse } from 'next/server';
import { SystemLog } from '@/types/admin';

export async function GET() {
  const logs: SystemLog[] = [
    { id: 'l1', event: 'user_signup', message: 'New creator registration: @marcus_fit', timestamp: new Date().toISOString() },
    { id: 'l2', event: 'payment_success', message: 'Campaign #492 funded: ₹5,00,000 by Nexus Brand', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'l3', event: 'campaign_complete', message: 'Smart Home Launch successfully completed', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'l4', event: 'system_alert', message: 'Peak database load detected (92%)', timestamp: new Date(Date.now() - 14400000).toISOString() },
  ];

  return NextResponse.json({
    success: true,
    data: logs
  });
}
