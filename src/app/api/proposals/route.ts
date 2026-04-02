import { NextResponse } from "next/server";
import {
  Proposal,
  Deliverable,
  CreatorTier,
  DeliverableType,
} from "@/types/proposal";
import { proposals } from "./data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const p = proposals.find((item) => item.id === id);
    return NextResponse.json({ success: true, data: p });
  }

  return NextResponse.json({ success: true, data: proposals });
}

export async function POST(request: Request) {
  const { dealId } = await request.json();

  // Pricing Logic Helper
  const calculatePrice = (tier: CreatorTier, type: DeliverableType) => {
    const bases = { micro: 100, mid: 350, macro: 1250 };
    const multis = {
      reel: 1.5,
      story: 0.5,
      instagram_post: 1.0,
      youtube_video: 2.0,
    };
    return bases[tier] * multis[type];
  };

  const initialDeliverable: Deliverable = {
    id: "d_" + Date.now(),
    type: "reel",
    quantity: 1,
    creatorTier: "mid",
    pricePerUnit: calculatePrice("mid", "reel"),
  };

  const subtotal = initialDeliverable.pricePerUnit;
  const fee = Math.round(subtotal * 0.15);

  const newProposal: Proposal = {
    id: "prop_" + Date.now(),
    dealId,
    companyName: "New Deal Proposal",
    totalPrice: subtotal + fee,
    status: "draft",
    deliverables: [initialDeliverable],
    pricingBreakdown: [
      { label: "Subtotal", amount: subtotal },
      { label: "Platform Fee (15%)", amount: fee },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  proposals.unshift(newProposal);

  return NextResponse.json({ success: true, data: newProposal });
}
