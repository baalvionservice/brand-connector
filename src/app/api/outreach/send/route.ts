
import { NextResponse } from 'next/server';
import { campaigns } from '../campaigns/route';
import { messages } from '../messages/route';

export async function POST(request: Request) {
  const { campaignId } = await request.json();
  
  const campaign = campaigns.find(c => c.id === campaignId);
  if (!campaign) return NextResponse.json({ success: false }, { status: 404 });

  // Update status
  campaign.status = 'running';
  
  // Simulate batch sending
  // In a real app, this would trigger a background worker
  const count = campaign.totalLeads - campaign.sentCount;
  
  for (let i = 0; i < count; i++) {
    campaign.sentCount++;
    messages.push({
      id: `msg_live_${Date.now()}_${i}`,
      leadId: `lead_batch_${i}`,
      leadName: `Target Brand ${campaign.sentCount}`,
      campaignId: campaign.id,
      message: campaign.messageTemplate,
      status: 'sent',
      sentAt: new Date().toISOString()
    });
  }

  campaign.status = 'completed';
  campaign.updatedAt = new Date().toISOString();

  return NextResponse.json({
    success: true,
    data: { sent: count }
  });
}
