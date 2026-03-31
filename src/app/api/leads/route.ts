
import { NextResponse } from 'next/server';
import { crmDb } from '@/lib/crm-mock-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const niche = searchParams.get('niche') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1');

  // Simulate latency
  await new Promise(r => setTimeout(r, 600));

  const result = crmDb.getLeads(status, niche, search, page);

  return NextResponse.json({
    success: true,
    data: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      pages: result.pages
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  await new Promise(r => setTimeout(r, 800));
  
  const lead = crmDb.createLead(body);

  return NextResponse.json({
    success: true,
    data: lead
  });
}
