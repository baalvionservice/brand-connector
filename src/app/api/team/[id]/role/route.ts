
import { NextResponse } from 'next/server';
import { team } from '../../route';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { role } = await request.json();
  const index = team.findIndex(m => m.id === params.id);
  
  if (index !== -1) {
    team[index].role = role;
    return NextResponse.json({ success: true, data: team[index] });
  }

  return NextResponse.json({ success: false }, { status: 404 });
}
