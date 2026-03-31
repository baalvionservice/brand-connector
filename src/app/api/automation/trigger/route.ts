
import { NextResponse } from 'next/server';
import { automationDb } from '@/lib/automation-mock-db';

export async function POST(request: Request) {
  const { event, payload } = await request.json();
  const actions = automationDb.trigger(event, payload);
  
  console.log(`[AUTOMATION] Event triggered: ${event}`, { actions, payload });

  return NextResponse.json({
    success: true,
    data: { actions }
  });
}
