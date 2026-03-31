
import { NextResponse } from 'next/server';
import { dealsDb } from '@/lib/deals-mock-db';

export async function POST(request: Request) {
  const { messageId } = await request.json();
  await new Promise(r => setTimeout(r, 1000));
  
  // Logic: Extract info from message (mocked)
  const deal = dealsDb.createDeal({
    companyName: "Potential Brand from Reply",
    value: 5000,
    source: 'outreach',
    stage: 'qualified'
  });

  return NextResponse.json({
    success: true,
    data: deal
  });
}
