
import { NextResponse } from 'next/server';
import { ScrapedLead } from '@/types/acquisition';

const NICHES = ['D2C', 'SaaS', 'Fitness', 'Beauty', 'Tech', 'Food & Bev'];
const COMPANIES = ['GlowSkin', 'TechNova', 'FitFuel', 'PureHydrate', 'CloudScale', 'UrbanEdge', 'AuraBeauty', 'ZenHealth', 'LuminaSmart', 'SwiftLogistic'];

export async function POST(request: Request) {
  const { platform, query, limit = 20 } = await request.json();
  
  // Simulate heavy scraping latency
  await new Promise(r => setTimeout(r, 1200));

  const leads: ScrapedLead[] = Array.from({ length: limit }).map((_, i) => {
    const name = `${COMPANIES[i % COMPANIES.length]} ${i > 9 ? i : ''}`;
    return {
      id: `scraped_${Date.now()}_${i}`,
      platform,
      companyName: name,
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      followers: Math.floor(Math.random() * 450000) + 1000,
      niche: NICHES[Math.floor(Math.random() * NICHES.length)],
      bio: `Official account for ${name}. Pioneering the future of ${query}.`,
      website: Math.random() > 0.3 ? `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com` : undefined,
      score: Math.floor(Math.random() * 40) + 60,
      createdAt: new Date().toISOString()
    };
  });

  return NextResponse.json({
    success: true,
    data: leads
  });
}
