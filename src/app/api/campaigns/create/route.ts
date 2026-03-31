
import { NextResponse } from 'next/server';
import { campaignExecutions } from '../route';
import { proposals } from '../../proposals/route';
import { CampaignExecution } from '@/types/campaign';

export async function POST(request: Request) {
  const { proposalId } = await request.json();
  const proposal = proposals.find(p => p.id === proposalId);

  if (!proposal) return NextResponse.json({ success: false, message: 'Proposal not found' }, { status: 404 });

  const newExecution: CampaignExecution = {
    id: 'exec_' + Date.now(),
    proposalId,
    dealId: proposal.dealId,
    name: proposal.companyName + ' Campaign',
    companyName: proposal.companyName,
    status: 'not_started',
    creators: [
      { creatorId: 'mock_c', name: 'Selected Talent', status: 'pending' }
    ],
    deliverables: proposal.deliverables.flatMap(d => 
      Array.from({ length: d.quantity }).map((_, i) => ({
        id: `del_${Date.now()}_${i}`,
        creatorId: 'mock_c',
        creatorName: 'Selected Talent',
        type: d.type,
        status: 'pending',
        dueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
      }))
    ),
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  campaignExecutions.unshift(newExecution);

  return NextResponse.json({ success: true, data: newExecution });
}
