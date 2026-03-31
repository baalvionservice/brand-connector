
import { NextResponse } from 'next/server';
import { PricingPlan } from '@/types/billing';

const PLANS: PricingPlan[] = [
  {
    id: "STARTER",
    name: "Starter",
    description: "Perfect for testing the waters with your first campaign.",
    monthlyPrice: 0,
    annualPrice: 0,
    commission: 5,
    features: [
      "1 Active Campaign",
      "Limited Marketplace Access",
      "Basic Analytics",
      "Community Support"
    ],
    limits: {
      maxCampaigns: 1,
      maxTeamMembers: 1,
      aiMatching: false,
      advancedAnalytics: false
    }
  },
  {
    id: "GROWTH",
    name: "Growth",
    description: "Everything you need to scale your brand presence.",
    monthlyPrice: 9999,
    annualPrice: 7999,
    commission: 3,
    features: [
      "10 Active Campaigns",
      "Full Marketplace Access",
      "AI Matching Engine",
      "Advanced ROI Analytics",
      "Team Collaboration (3 seats)"
    ],
    limits: {
      maxCampaigns: 10,
      maxTeamMembers: 3,
      aiMatching: true,
      advancedAnalytics: true
    }
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    description: "Advanced controls and unlimited scale for global brands.",
    monthlyPrice: 49999,
    annualPrice: 39999,
    commission: 2,
    features: [
      "Unlimited Campaigns",
      "Priority Support",
      "White-label Reporting",
      "API Access",
      "Dedicated Account Manager"
    ],
    limits: {
      maxCampaigns: 1000,
      maxTeamMembers: 10,
      aiMatching: true,
      advancedAnalytics: true
    }
  }
];

export async function GET() {
  return NextResponse.json({ success: true, data: PLANS });
}
