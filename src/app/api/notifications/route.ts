
import { NextResponse } from 'next/server';
import { automationDb } from '@/lib/automation-mock-db';

export async function GET() {
  await new Promise(r => setTimeout(r, 400));
  return NextResponse.json({
    success: true,
    data: automationDb.getNotifications()
  });
}
