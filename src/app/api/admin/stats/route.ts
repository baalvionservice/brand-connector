
import { NextResponse } from 'next/server';
import { PlatformStats } from '@/types/admin';

export async function GET() {
  await new Promise(r => setTimeout(r, 600));

  const stats: PlatformStats = {
    totalUsers: 11440,
    activeUsers: 4500,
    totalRevenue: 7840000,
    totalCampaigns: 156,
    totalPayments: 1240,
    activeSubscriptions: 840,
    growthRate: 18.4,
    avgOrderValue: 34500
  };

  return NextResponse.json({
    success: true,
    data: stats
  });
}
