import { NextResponse } from "next/server";
import { proposals } from "../data";
import { CreatorTier, DeliverableType } from "@/types/proposal";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const index = proposals.findIndex((p: any) => p.id === params.id);

  if (index === -1)
    return NextResponse.json({ success: false }, { status: 404 });

  // Recalculate Pricing if deliverables changed
  if (body.deliverables) {
    const bases = { micro: 100, mid: 350, macro: 1250 };
    const multis = {
      reel: 1.5,
      story: 0.5,
      instagram_post: 1.0,
      youtube_video: 2.0,
    };

    let subtotal = 0;
    body.deliverables.forEach((d: any) => {
      const price =
        bases[d.creatorTier as CreatorTier] * multis[d.type as DeliverableType];
      d.pricePerUnit = price;
      subtotal += price * d.quantity;
    });

    const fee = Math.round(subtotal * 0.15);
    body.totalPrice = subtotal + fee;
    body.pricingBreakdown = [
      { label: "Subtotal", amount: Math.round(subtotal) },
      { label: "Platform Fee (15%)", amount: fee },
    ];
  }

  proposals[index] = {
    ...proposals[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data: proposals[index] });
}
