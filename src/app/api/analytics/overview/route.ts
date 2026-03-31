
import { NextResponse } from 'next/server';
import { AnalyticsOverview } from '@/types/analytics';

export async function GET() {
  // Simulate DB aggregation
  await new Promise(r => setTimeout(r, 600));

  const data: AnalyticsOverview = {
    totalCampaigns: 156,
    totalRevenue: 7840000,
    totalSpend: 5200000,
    avgROI: 4.2,
    conversionRate: 3.8,
    activeCreators: 10240
  };

  return NextResponse.json({
    success: true,
    data
  });
}
