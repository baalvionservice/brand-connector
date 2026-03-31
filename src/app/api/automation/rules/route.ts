
import { NextResponse } from 'next/server';
import { automationDb } from '@/lib/automation-mock-db';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: automationDb.getRules()
  });
}
