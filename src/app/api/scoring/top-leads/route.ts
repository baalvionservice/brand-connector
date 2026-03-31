
import { NextResponse } from 'next/server';
import { crmDb } from '@/lib/crm-mock-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  
  await new Promise(r => setTimeout(r, 400));
  
  const leads = crmDb.getTopLeads(limit);

  return NextResponse.json({
    success: true,
    data: leads
  });
}
