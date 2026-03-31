
import { NextResponse } from 'next/server';
import { CreatorAnalytics } from '@/types/analytics';

export async function GET(
  request: Request,
  { params }: { params: { campaignId: string } }
) {
  await new Promise(r => setTimeout(r, 500));

  const names = ['Sarah Chen', 'Alex Rivers', 'Elena Vance', 'Marcus Thorne'];
  
  const data: CreatorAnalytics[] = names.map((name, i) => ({
    creatorId: `c_${i}`,
    name,
    impressions: Math.floor(Math.random() * 150000) + 50000,
    engagement: Number((Math.random() * 5 + 3).toFixed(1)),
    clicks: Math.floor(Math.random() * 5000) + 1000,
    conversions: Math.floor(Math.random() * 200) + 50,
    roiScore: Math.floor(Math.random() * 20) + 80
  }));

  return NextResponse.json({
    success: true,
    data
  });
}
