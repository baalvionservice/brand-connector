
import { NextResponse } from 'next/server';
import { crmDb } from '@/lib/crm-mock-db';

export async function GET() {
  await new Promise(r => setTimeout(r, 300));
  
  const insights = crmDb.getInsights();

  return NextResponse.json({
    success: true,
    data: insights
  });
}
