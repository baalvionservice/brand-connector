
import { NextResponse } from 'next/server';
import { crmDb } from '@/lib/crm-mock-db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  await new Promise(r => setTimeout(r, 400));

  const lead = crmDb.getLead(id);
  const notes = crmDb.getNotes(id);

  if (!lead) {
    return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: { lead, notes }
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();
  
  await new Promise(r => setTimeout(r, 500));

  const updated = crmDb.updateLead(id, body);

  if (!updated) {
    return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: updated
  });
}
