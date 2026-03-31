
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Baalvion Route Protection Middleware
 * 
 * Logic:
 * 1. Unauthenticated -> /auth/login
 * 2. Authenticated but Unverified -> /auth/verify-email
 * 3. Verified but Wrong Dashboard Role -> Redirect to correct dashboard
 * 4. Verified but Incomplete Onboarding -> /onboarding/[role]
 * 5. Authenticated users hitting /auth routes -> Redirect to dashboard
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract state from cookies
  const session = request.cookies.get('baalvion_session')?.value;
  const role = request.cookies.get('baalvion_role')?.value;
  const isVerified = request.cookies.get('baalvion_verified')?.value === 'true';
  const isOnboarded = request.cookies.get('baalvion_onboarded')?.value === 'true';

  const isAuthRoute = pathname.startsWith('/auth');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isOnboardingRoute = pathname.startsWith('/onboarding');
  const isVerifyEmailRoute = pathname === '/auth/verify-email';

  // 1. Redirect unauthenticated users
  if (!session && (isDashboardRoute || isOnboardingRoute)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 2. Redirect authenticated users away from login/signup
  if (session && isAuthRoute && !isVerifyEmailRoute) {
    const target = role === 'CREATOR' ? '/dashboard/creator' : '/dashboard/brand';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 3. Handle Email Verification
  if (session && !isVerified && !isVerifyEmailRoute && (isDashboardRoute || isOnboardingRoute)) {
    return NextResponse.redirect(new URL('/auth/verify-email', request.url));
  }

  // 4. Role-based Dashboard Protection
  if (session && isVerified && isDashboardRoute) {
    if (role === 'CREATOR' && pathname.startsWith('/dashboard/brand')) {
      return NextResponse.redirect(new URL('/dashboard/creator', request.url));
    }
    if (role === 'BRAND' && pathname.startsWith('/dashboard/creator')) {
      return NextResponse.redirect(new URL('/dashboard/brand', request.url));
    }
  }

  // 5. Onboarding Protection
  if (session && isVerified && !isOnboarded && isDashboardRoute && !isOnboardingRoute) {
    const target = role === 'BRAND' ? '/onboarding/brand' : '/onboarding/creator';
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|logo.png).*)',
  ],
};
