
import { NextResponse } from 'next/server';
import { mockCreators } from '../../creators/route';
import { dealsDb } from '@/lib/deals-mock-db';
import { MatchResult } from '@/types/matching';

export async function GET(
  request: Request,
  { params }: { params: { dealId: string } }
) {
  const { dealId } = params;
  const deal = dealsDb.getDeal(dealId);

  if (!deal) {
    return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });
  }

  // Simulate AI Processing Latency
  await new Promise(r => setTimeout(r, 1200));

  // Deterministic Scoring Logic (Mock AI)
  const matches: MatchResult[] = mockCreators.map(creator => {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Niche Match (30 pts)
    // For simplicity in mock, we assume tech/saas is high value for most seeded deals
    if (creator.niche.toLowerCase().includes('tech') || creator.niche.toLowerCase().includes('lifestyle')) {
      score += 30;
      matchReasons.push('Perfect niche alignment');
    } else {
      score += 10;
    }

    // 2. Followers Fit (20 pts)
    if (creator.followers > 50000 && creator.followers < 500000) {
      score += 20;
      matchReasons.push('Optimal reach for deal size');
    } else {
      score += 10;
    }

    // 3. Engagement Rate (20 pts)
    if (creator.engagementRate > 5) {
      score += 20;
      matchReasons.push('High engagement potential');
    } else if (creator.engagementRate > 3) {
      score += 10;
    } else {
      score += 5;
    }

    // 4. Budget Fit (20 pts)
    // Assume creators are within budget if their min rate < deal value
    if (creator.priceRange.min <= deal.value) {
      score += 20;
      matchReasons.push('Within budget parameters');
    } else {
      score += 5;
    }

    // 5. Location Match (10 pts)
    score += 10;
    matchReasons.push('Global market compatibility');

    return {
      creator,
      score: Math.min(score, 100),
      matchReasons: matchReasons.slice(0, 3)
    };
  });

  // Sort by score DESC
  const sortedMatches = matches.sort((a, b) => b.score - a.score).slice(0, 15);

  return NextResponse.json({
    success: true,
    data: sortedMatches
  });
}
