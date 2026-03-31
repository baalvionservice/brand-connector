
import { NextResponse } from 'next/server';
import { crmDb } from '@/lib/crm-mock-db';

export async function POST(request: Request) {
  const body = await request.json();
  const { leadIds } = body;
  
  await new Promise(r => setTimeout(r, 1000));
  
  const updatedCount = crmDb.runScoring(leadIds);

  return NextResponse.json({
    success: true,
    data: { updated: updatedCount }
  });
}
