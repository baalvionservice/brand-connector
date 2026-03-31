
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (userProfile?.role === 'BRAND') {
        router.replace('/dashboard/brand');
      } else if (userProfile?.role === 'CREATOR') {
        router.replace('/dashboard/creator');
      } else {
        // Default for prototype if no auth
        router.replace('/dashboard/brand');
      }
    }
  }, [userProfile, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
