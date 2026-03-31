
import { NextResponse } from 'next/server';
import { crmDb } from '@/lib/crm-mock-db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  await new Promise(r => setTimeout(r, 1200));

  const lead = crmDb.getLead(id);
  if (!lead) {
    return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
  }

  crmDb.updateLead(id, { status: 'closed' });

  return NextResponse.json({
    success: true,
    data: { brandId: `brand_${Date.now()}` }
  });
}
