
import { NextResponse } from 'next/server';
import { EnrichedLead, ScrapedLead } from '@/types/acquisition';

export async function POST(request: Request) {
  const { leads }: { leads: ScrapedLead[] } = await request.json();
  
  // Simulate data enrichment lookup
  await new Promise(r => setTimeout(r, 1500));

  const enriched: EnrichedLead[] = leads.map(l => ({
    id: l.id,
    companyName: l.companyName,
    website: l.website || `https://www.${l.companyName.toLowerCase().replace(/\s+/g, '')}.io`,
    estimatedTraffic: Math.floor(Math.random() * 99000) + 1000,
    emailPattern: `${Math.random() > 0.5 ? 'info' : 'contact'}@${l.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
    confidenceScore: Math.floor(Math.random() * 20) + 80
  }));

  return NextResponse.json({
    success: true,
    data: enriched
  });
}
