
import { NextResponse } from 'next/server';
import { campaigns } from '../campaigns/route';
import { OutreachCampaign } from '@/types/outreach';

export async function POST(request: Request) {
  const body = await request.json();
  
  const newCampaign: OutreachCampaign = {
    id: `out_${Date.now()}`,
    name: body.name,
    type: body.type,
    status: 'draft',
    totalLeads: body.leadIds.length,
    sentCount: 0,
    replyCount: 0,
    messageTemplate: body.messageTemplate,
    subject: body.subject,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  campaigns.unshift(newCampaign);

  return NextResponse.json({
    success: true,
    data: newCampaign
  });
}
