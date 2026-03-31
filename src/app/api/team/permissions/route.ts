
import { NextResponse } from 'next/server';

const PERMISSION_MATRIX = {
  admin: [
    { module: 'deals', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'proposals', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
    { module: 'campaigns', actions: ['view', 'manage', 'delete'] },
    { module: 'payments', actions: ['view', 'approve', 'payout'] },
    { module: 'team', actions: ['view', 'invite', 'remove', 'manage_roles'] },
  ],
  manager: [
    { module: 'deals', actions: ['view', 'create', 'edit'] },
    { module: 'proposals', actions: ['view', 'create', 'edit', 'send'] },
    { module: 'campaigns', actions: ['view', 'manage'] },
    { module: 'payments', actions: ['view'] },
  ],
  viewer: [
    { module: 'deals', actions: ['view'] },
    { module: 'proposals', actions: ['view'] },
    { module: 'campaigns', actions: ['view'] },
    { module: 'analytics', actions: ['view'] },
  ]
};

export async function GET() {
  return NextResponse.json({ success: true, data: PERMISSION_MATRIX });
}
