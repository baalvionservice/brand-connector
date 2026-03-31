
import { NextResponse } from 'next/server';
import { campaignExecutions } from '../../route';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { deliverableId } = await request.json();
  const index = campaignExecutions.findIndex(c => c.id === params.id);
  
  if (index === -1) return NextResponse.json({ success: false }, { status: 404 });

  const campaign = campaignExecutions[index];
  const delIndex = campaign.deliverables.findIndex(d => d.id === deliverableId);
  
  if (delIndex !== -1) {
    campaign.deliverables[delIndex].status = 'approved';
    
    // Update progress
    const approvedCount = campaign.deliverables.filter(d => d.status === 'approved').length;
    campaign.progress = Math.round((approvedCount / campaign.deliverables.length) * 100);
    campaign.updatedAt = new Date().toISOString();
  }

  return NextResponse.json({ success: true, data: campaign });
}
