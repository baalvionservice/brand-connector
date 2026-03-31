
import { NextResponse } from 'next/server';
import { Creator, CreatorTier } from '@/types/creator';

const NICHES = ['Tech & Gadgets', 'Fashion', 'Fitness', 'Beauty', 'Gaming', 'Travel', 'Finance'];
const PLATFORMS = ['instagram', 'youtube', 'tiktok'];

// Generate 50 mock creators
const generateCreators = (): Creator[] => {
  return Array.from({ length: 50 }).map((_, i) => {
    const followers = Math.floor(Math.random() * 1000000) + 1000;
    let tier: CreatorTier = 'micro';
    if (followers > 100000) tier = 'macro';
    else if (followers > 10000) tier = 'mid';

    const niche = NICHES[i % NICHES.length];
    const platform = PLATFORMS[i % PLATFORMS.length] as any;

    return {
      id: `cre_${i + 1}`,
      name: `Creator ${i + 1}`,
      username: `creator_${i + 1}`,
      avatar: `https://picsum.photos/seed/creator${i}/200/200`,
      platform,
      followers,
      engagementRate: Number((Math.random() * 8 + 1).toFixed(1)),
      niche,
      location: 'India',
      tier,
      priceRange: {
        min: tier === 'macro' ? 50000 : tier === 'mid' ? 15000 : 2000,
        max: tier === 'macro' ? 200000 : tier === 'mid' ? 45000 : 10000,
      },
      rating: Number((4 + Math.random()).toFixed(1)),
      completedCampaigns: Math.floor(Math.random() * 50),
      bio: `Professional ${niche} creator focusing on high-quality ${platform} content.`
    };
  });
};

const mockCreators = generateCreators();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const niche = searchParams.get('niche');
  const platform = searchParams.get('platform');
  const tier = searchParams.get('tier');

  await new Promise(r => setTimeout(r, 600));

  let filtered = [...mockCreators];

  if (search) {
    filtered = filtered.filter(c => c.name.toLowerCase().includes(search) || c.username.toLowerCase().includes(search));
  }
  if (niche && niche !== 'all') {
    filtered = filtered.filter(c => c.niche === niche);
  }
  if (platform && platform !== 'all') {
    filtered = filtered.filter(c => c.platform === platform);
  }
  if (tier && tier !== 'all') {
    filtered = filtered.filter(c => c.tier === tier);
  }

  return NextResponse.json({ success: true, data: filtered });
}

export { mockCreators };
