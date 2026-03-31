
import { NextResponse } from 'next/server';
import { dealsDb } from '@/lib/deals-mock-db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { text } = await request.json();
  await new Promise(r => setTimeout(r, 400));
  const note = dealsDb.addNote(params.id, text);
  return NextResponse.json({
    success: true,
    data: note
  });
}
