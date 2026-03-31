
import { NextResponse } from 'next/server';
import { OutreachCampaign } from '@/types/outreach';

// In-memory store for the demo
let campaigns: OutreachCampaign[] = [
  {
    id: 'out_1',
    name: 'Q3 SaaS Brand Awareness',
    type: 'email',
    status: 'completed',
    totalLeads: 45,
    sentCount: 45,
    replyCount: 12,
    messageTemplate: 'Hi {{companyName}}, checking in...',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'out_2',
    name: 'D2C Skincare DM Blast',
    type: 'dm',
    status: 'running',
    totalLeads: 120,
    sentCount: 85,
    replyCount: 4,
    messageTemplate: 'Love your latest post! Would you be open to...',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const campaign = campaigns.find(c => c.id === id);
    return NextResponse.json({ success: true, data: campaign });
  }

  return NextResponse.json({ success: true, data: campaigns });
}

export { campaigns };
