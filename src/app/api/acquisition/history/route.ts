
import { NextResponse } from 'next/server';
import { ScrapeSession } from '@/types/acquisition';

export async function GET() {
  const history: ScrapeSession[] = [
    { id: '1', query: 'D2C Skincare', platform: 'instagram', leadCount: 45, timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', query: 'SaaS Fintech', platform: 'linkedin', leadCount: 22, timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: '3', query: 'Energy Drinks', platform: 'instagram', leadCount: 88, timestamp: new Date(Date.now() - 259200000).toISOString() },
  ];

  return NextResponse.json({
    success: true,
    data: history
  });
}
