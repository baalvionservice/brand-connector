
import { NextResponse } from 'next/server';
import { Invoice } from '@/types/billing';

const INVOICES: Invoice[] = [
  { id: 'INV-4921', amount: 9999, currency: 'INR', status: 'paid', planName: 'Growth Plan', createdAt: new Date().toISOString() },
  { id: 'INV-4882', amount: 9999, currency: 'INR', status: 'paid', planName: 'Growth Plan', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'INV-4751', amount: 9999, currency: 'INR', status: 'paid', planName: 'Growth Plan', createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
];

export async function GET() {
  return NextResponse.json({ success: true, data: INVOICES });
}
