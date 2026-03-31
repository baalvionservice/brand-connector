
import { NextResponse } from 'next/server';
import { CampaignAnalytics } from '@/types/analytics';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await new Promise(r => setTimeout(r, 800));

  const spend = 45000;
  const revenue = 185000;
  
  const data: CampaignAnalytics = {
    campaignId: params.id,
    impressions: 450000,
    reach: 320000,
    clicks: 12400,
    conversions: 850,
    engagementRate: 5.8,
    spend,
    revenueGenerated: revenue,
    roi: Number(((revenue - spend) / spend * 100).toFixed(1)),
    timeline: Array.from({ length: 7 }).map((_, i) => ({
      date: `Jul ${15 + i}`,
      impressions: Math.floor(Math.random() * 50000) + 20000,
      clicks: Math.floor(Math.random() * 2000) + 500
    }))
  };

  return NextResponse.json({
    success: true,
    data
  });
}
