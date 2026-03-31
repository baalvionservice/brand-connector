
import { NextResponse } from 'next/server';

// Mock storage for shortlisted creators per deal
const SHORTLISTS: Record<string, string[]> = {};

export async function POST(request: Request) {
  const { creatorId, dealId } = await request.json();
  
  if (!SHORTLISTS[dealId]) {
    SHORTLISTS[dealId] = [];
  }
  
  if (!SHORTLISTS[dealId].includes(creatorId)) {
    SHORTLISTS[dealId].push(creatorId);
  }

  return NextResponse.json({ success: true });
}

export { SHORTLISTS };
