
import { NextResponse } from 'next/server';
import { OutreachMessage } from '@/types/outreach';

// Mock messages store
let messages: OutreachMessage[] = [];

// Seed some initial messages for existing campaigns
if (messages.length === 0) {
  messages = Array.from({ length: 20 }).map((_, i) => ({
    id: `msg_${i}`,
    leadId: `lead_${i}`,
    leadName: `Company ${i + 1}`,
    campaignId: 'out_1',
    message: 'Hi there, we love your brand...',
    status: i % 3 === 0 ? 'replied' : 'sent',
    replyText: i % 3 === 0 ? 'Send more details please.' : undefined,
    sentAt: new Date().toISOString()
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('campaignId');

  const filtered = messages.filter(m => m.campaignId === campaignId);

  return NextResponse.json({
    success: true,
    data: filtered
  });
}

export { messages };
