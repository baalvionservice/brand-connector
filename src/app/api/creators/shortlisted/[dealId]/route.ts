
import { NextResponse } from 'next/server';
import { SHORTLISTS } from '../../shortlist/route';
import { mockCreators } from '../../route';

export async function GET(
  request: Request,
  { params }: { params: { dealId: string } }
) {
  const creatorIds = SHORTLISTS[params.dealId] || [];
  const shortlisted = mockCreators.filter(c => creatorIds.includes(c.id));

  return NextResponse.json({ success: true, data: shortlisted });
}
