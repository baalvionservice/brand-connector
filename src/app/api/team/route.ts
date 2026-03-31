
import { NextResponse } from 'next/server';
import { TeamMember } from '@/types/team';

let team: TeamMember[] = [
  { id: 'tm_1', name: 'Root Admin', email: 'admin@baalvion.com', role: 'admin', status: 'active', joinedAt: '2024-01-01' },
  { id: 'tm_2', name: 'Sarah Manager', email: 'sarah@baalvion.com', role: 'manager', status: 'active', joinedAt: '2024-02-15' },
  { id: 'tm_3', name: 'Mark Observer', email: 'mark@baalvion.com', role: 'viewer', status: 'active', joinedAt: '2024-03-10' },
];

export async function GET() {
  return NextResponse.json({ success: true, data: team });
}

export async function POST(request: Request) {
  const { email, role } = await request.json();
  
  const newUser: TeamMember = {
    id: `tm_${Date.now()}`,
    name: email.split('@')[0],
    email,
    role: role as any,
    status: 'invited',
    joinedAt: new Date().toISOString()
  };

  team.push(newUser);
  return NextResponse.json({ success: true, data: newUser });
}

export { team };
