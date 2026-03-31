'use client';

/**
 * @fileOverview Baalvion Master Mock Data & Seeding Engine
 * 
 * Provides high-fidelity data generation for 30 brands, 100 creators, 
 * 50 campaigns, 200 transactions, and 20 disputes.
 */

import { 
  CampaignStatus, 
  ApplicationStatus, 
  UserRole, 
  TransactionStatus, 
  DisputeStatus,
  OnboardingStatus
} from '@/types';
import { db } from './firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';

const NICHES = ['Tech & Gadgets', 'Fashion & Style', 'Beauty & Personal Care', 'Travel & Adventure', 'Food & Cooking', 'Fitness & Wellness', 'Gaming', 'Education', 'Lifestyle'];
const PLATFORMS = ['Instagram', 'YouTube', 'TikTok'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Singapore'];

// Helper to get random item from array
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Generates 30 realistic Brands
 */
export const MOCK_BRANDS = Array.from({ length: 30 }).map((_, i) => {
  const names = ["Lumina Tech", "EcoVibe", "FitFlow", "Velvet Moon", "Azure Travel", "Nova Spark", "Green Leaf", "Swift Delivery", "Pulse Fitness", "Zen Yoga", "Tech Titan", "Style Haven", "Organic Orchard", "Velocity Auto", "Glitch Gaming", "Bloom Beauty", "Aura Wellness", "Summit Peak", "Ocean Drift", "Stellar Space", "Rooted Roots", "Mainframe", "Prism Art", "Urban Edge", "Retro Relics", "Pure Pet", "Kiddo Cloud", "Active Apex", "Legacy Law", "Future Fintech"];
  const name = names[i] || `Brand ${i + 1}`;
  const industry = rand(['Technology', 'Sustainability', 'Fitness', 'Fashion', 'Travel', 'E-commerce']);
  
  return {
    id: `brand_${i + 1}`,
    userId: `user_b_${i + 1}`,
    companyName: name,
    industry,
    website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
    teamSize: rand(['1-10', '11-50', '51-200', '201-500']),
    plan: rand(['STARTER', 'GROWTH', 'ENTERPRISE']),
    logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C3AE8&color=fff&rounded=true`,
    brandGuidelines: `We focus on ${industry.toLowerCase()} innovation. Our content should be clean, professional, and forward-thinking.`,
    onboardingStatus: OnboardingStatus.COMPLETED,
    onboardingStep: 4,
    createdAt: new Date(Date.now() - randRange(1, 100) * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

/**
 * Generates 100 realistic Creators
 */
export const MOCK_CREATORS = Array.from({ length: 100 }).map((_, i) => {
  const handlePrefixes = ['tech', 'urban', 'minimal', 'vibe', 'pure', 'peak', 'nomad', 'daily', 'pro', 'fit'];
  const handleSuffixes = ['guru', 'explorer', 'creates', 'lifestyle', 'vision', 'pulse', 'spark', 'shots', 'vlogs'];
  const username = `${rand(handlePrefixes)}_${rand(handleSuffixes)}_${i + 1}`;
  
  return {
    id: `creator_${i + 1}`,
    userId: `user_c_${i + 1}`,
    username,
    bio: `Passionate about ${rand(NICHES).toLowerCase()}. Sharing my journey and helping brands reach the right audience.`,
    photoURL: `https://picsum.photos/seed/${username}/400/400`,
    niches: [rand(NICHES), rand(NICHES)].filter((v, i, a) => a.indexOf(v) === i),
    location: rand(COUNTRIES),
    rating: Number((4 + Math.random()).toFixed(1)),
    isVerified: Math.random() > 0.3,
    authenticityScore: randRange(85, 99),
    baseRates: {
      instagram_reel: randRange(5000, 25000),
      youtube_video: randRange(15000, 80000),
      tiktok_video: randRange(4000, 20000)
    },
    socialStats: {
      instagram: { followers: randRange(10000, 500000), engagementRate: Number((Math.random() * 8 + 2).toFixed(1)) },
      youtube: { followers: randRange(5000, 1000000), engagementRate: Number((Math.random() * 5 + 1).toFixed(1)) }
    },
    onboardingStatus: OnboardingStatus.COMPLETED,
    onboardingStep: 5,
    createdAt: new Date(Date.now() - randRange(1, 200) * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

/**
 * Generates 50 Campaigns
 */
export const MOCK_CAMPAIGNS = Array.from({ length: 50 }).map((_, i) => {
  const brand = rand(MOCK_BRANDS);
  const status = i < 10 ? CampaignStatus.DRAFT : i < 35 ? CampaignStatus.ACTIVE : i < 45 ? CampaignStatus.COMPLETED : CampaignStatus.PAUSED;
  const budget = randRange(10000, 500000);
  const niche = rand(NICHES);

  return {
    id: `camp_${i + 1}`,
    brandId: brand.id,
    title: `${niche} ${rand(['Innovation', 'Summer', 'Launch', 'Challenge', 'Promo', 'Awareness'])} ${2024 + Math.floor(i/20)}`,
    description: `A high-impact campaign for ${brand.companyName} focusing on ${niche.toLowerCase()} audience engagement.`,
    status,
    budget,
    escrowBalance: status === CampaignStatus.ACTIVE ? budget : 0,
    niches: [niche],
    creatorTier: rand(['MICRO', 'MID', 'MACRO']),
    deliverables: [
      { type: 'REEL', qty: 1, platform: 'Instagram', specs: '60s video' },
      { type: 'STORY', qty: 3, platform: 'Instagram', specs: 'With link stickers' }
    ],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

/**
 * Generates 200 Transactions
 */
export const MOCK_TRANSACTIONS = Array.from({ length: 200 }).map((_, i) => {
  const type = rand(['DEPOSIT', 'ESCROW_LOCK', 'ESCROW_RELEASE', 'PAYOUT', 'FEE']);
  const amount = randRange(1000, 50000);
  const user = i % 2 === 0 ? rand(MOCK_BRANDS) : rand(MOCK_CREATORS);

  return {
    id: `tx_${i + 1}`,
    userId: user.userId,
    amount,
    type,
    status: TransactionStatus.COMPLETED,
    description: `${type.replace('_', ' ')} for project activity`,
    createdAt: new Date(Date.now() - randRange(1, 60) * 86400000).toISOString()
  };
});

/**
 * Generates 20 Disputes
 */
export const MOCK_DISPUTES = Array.from({ length: 20 }).map((_, i) => {
  const camp = rand(MOCK_CAMPAIGNS);
  const creator = rand(MOCK_CREATORS);
  
  return {
    id: `disp_${i + 1}`,
    campaignId: camp.id,
    creatorId: creator.userId,
    brandId: camp.brandId,
    category: rand(['UNFAIR_REJECTION', 'PAYMENT_ISSUE', 'SCOPE_CREEP']),
    reason: "Disagreement over the visual style of the second deliverable. Brand claims it doesn't match guidelines.",
    status: i < 5 ? DisputeStatus.RESOLVED : DisputeStatus.FILED,
    createdAt: new Date(Date.now() - randRange(1, 10) * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

/**
 * Master seeding function to populate Firestore
 */
export async function seedFirestore() {
  console.log('🚀 Starting Seeding Process...');
  
  try {
    const batchSize = 400; // Firestore limit is 500
    
    // Seed Brands
    console.log('Seeding Brands...');
    for (const brand of MOCK_BRANDS) {
      const bRef = doc(db, 'brands', brand.id);
      const uRef = doc(db, 'users', brand.userId);
      await writeBatch(db).set(bRef, brand).set(uRef, {
        id: brand.userId,
        email: `${brand.id}@mock.com`,
        role: 'BRAND',
        displayName: brand.companyName,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt
      }).commit();
    }

    // Seed Creators
    console.log('Seeding Creators...');
    for (const creator of MOCK_CREATORS) {
      const cRef = doc(db, 'creators', creator.id);
      const uRef = doc(db, 'users', creator.userId);
      await writeBatch(db).set(cRef, creator).set(uRef, {
        id: creator.userId,
        email: `${creator.username}@mock.com`,
        role: 'CREATOR',
        displayName: creator.username,
        photoURL: creator.photoURL,
        createdAt: creator.createdAt,
        updatedAt: creator.updatedAt
      }).commit();
    }

    // Seed Campaigns
    console.log('Seeding Campaigns...');
    for (const camp of MOCK_CAMPAIGNS) {
      await writeBatch(db).set(doc(db, 'campaigns', camp.id), camp).commit();
    }

    // Seed Transactions
    console.log('Seeding Transactions...');
    for (const tx of MOCK_TRANSACTIONS) {
      await writeBatch(db).set(doc(db, 'transactions', tx.id), tx).commit();
    }

    // Seed Disputes
    console.log('Seeding Disputes...');
    for (const disp of MOCK_DISPUTES) {
      await writeBatch(db).set(doc(db, 'disputes', disp.id), disp).commit();
    }

    console.log('✅ Seeding Complete! Baalvion is now alive with data.');
    return { success: true };
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    throw error;
  }
}
