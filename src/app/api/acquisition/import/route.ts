
import { NextResponse } from 'next/server';
import { crmDb } from '@/lib/crm-mock-db';
import { ScrapedLead } from '@/types/acquisition';

export async function POST(request: Request) {
  const { leads }: { leads: ScrapedLead[] } = await request.json();
  
  await new Promise(r => setTimeout(r, 1000));

  // Convert and "Save" to CRM
  leads.forEach(l => {
    crmDb.createLead({
      companyName: l.companyName,
      niche: l.niche || 'Other',
      email: l.email,
      instagramHandle: l.platform === 'instagram' ? l.handle : undefined,
      website: l.website,
      score: l.score || 70,
      status: 'new'
    });
  });

  return NextResponse.json({
    success: true,
    data: { importedCount: leads.length }
  });
}
