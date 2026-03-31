
import { NextResponse } from 'next/server';
import { campaignExecutions } from '../../route';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { deliverableId, submissionUrl } = await request.json();
  const index = campaignExecutions.findIndex(c => c.id === params.id);
  
  if (index === -1) return NextResponse.json({ success: false }, { status: 404 });

  const campaign = campaignExecutions[index];
  const delIndex = campaign.deliverables.findIndex(d => d.id === deliverableId);
  
  if (delIndex !== -1) {
    campaign.deliverables[delIndex].status = 'submitted';
    campaign.deliverables[delIndex].submissionUrl = submissionUrl;
    campaign.status = 'in_review';
    campaign.updatedAt = new Date().toISOString();
  }

  return NextResponse.json({ success: true, data: campaign });
}
