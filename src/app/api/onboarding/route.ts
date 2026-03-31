
import { NextResponse } from 'next/server';
import { OnboardingState } from '@/types/onboarding';

// Mock in-memory store for the session
let mockStore: OnboardingState = {
  userId: 'mock_user_123',
  currentStep: 1,
  completed: false,
  companyName: '',
  industry: '',
  goals: [],
  preferredPlatforms: [],
  budgetRange: ''
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockStore
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { step, ...data } = body;

  // Simulate save
  mockStore = {
    ...mockStore,
    ...data,
    currentStep: step
  };

  return NextResponse.json({
    success: true,
    data: mockStore
  });
}
