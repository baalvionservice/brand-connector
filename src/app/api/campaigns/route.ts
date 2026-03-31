
import { NextResponse } from 'next/server';
import { CampaignExecution } from '@/types/campaign';

// Shared mock storage for execution
export let campaignExecutions: CampaignExecution[] = [
  {
    id: 'exec_1',
    proposalId: 'prop_1',
    dealId: 'deal_1',
    name: 'AI Smart Home Launch',
    companyName: 'Lumina Tech',
    status: 'active',
    creators: [
      { creatorId: 'cre_1', name: 'Sarah Chen', status: 'accepted' }
    ],
    deliverables: [
      { id: 'del_1', creatorId: 'cre_1', creatorName: 'Sarah Chen', type: 'reel', status: 'pending', dueDate: '2024-08-15' },
      { id: 'del_2', creatorId: 'cre_1', creatorName: 'Sarah Chen', type: 'story', status: 'approved', submissionUrl: 'https://insta.com/p/123', dueDate: '2024-08-10' }
    ],
    startDate: '2024-08-01',
    endDate: '2024-08-30',
    progress: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json({ success: true, data: campaignExecutions });
}
