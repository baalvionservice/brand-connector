
import { NextResponse } from 'next/server';
import { team } from '../route';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = team.findIndex(m => m.id === params.id);
  if (index !== -1) {
    team.splice(index, 1);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 404 });
}
