import { NextResponse } from "next/server";
import { proposals } from "../../data";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = proposals.findIndex((p: any) => p.id === params.id);
  if (index === -1)
    return NextResponse.json({ success: false }, { status: 404 });

  proposals[index].status = "approved";
  proposals[index].updatedAt = new Date().toISOString();

  return NextResponse.json({ success: true, data: proposals[index] });
}
