
import { NextResponse } from 'next/server';
import { crmDb } from '@/lib/crm-mock-db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { text } = await request.json();
  
  await new Promise(r => setTimeout(r, 400));

  const note = crmDb.addNote(id, text);

  return NextResponse.json({
    success: true,
    data: note
  });
}
