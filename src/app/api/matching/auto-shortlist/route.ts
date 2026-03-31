
import { NextResponse } from 'next/server';
import { SHORTLISTS } from '../../creators/shortlist/route';

export async function POST(request: Request) {
  const { dealId, creatorIds } = await request.json();
  
  if (!SHORTLISTS[dealId]) {
    SHORTLISTS[dealId] = [];
  }
  
  // Add all top matches to shortlist
  creatorIds.forEach((id: string) => {
    if (!SHORTLISTS[dealId].includes(id)) {
      SHORTLISTS[dealId].push(id);
    }
  });

  return NextResponse.json({ success: true, count: creatorIds.length });
}
