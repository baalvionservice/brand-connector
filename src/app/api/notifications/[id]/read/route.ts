
import { NextResponse } from 'next/server';
import { automationDb } from '@/lib/automation-mock-db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const n = automationDb.markAsRead(params.id);
  return NextResponse.json({
    success: true,
    data: n
  });
}
