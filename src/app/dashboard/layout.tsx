'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/layout/Sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, userProfile, loading, signOut } = useAuth();
  const [role, setRole] = useState<'BRAND' | 'CREATOR'>('BRAND');

  // Guard: Redirect if not logged in or not verified
  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace('/auth/login');
      } else if (!currentUser.emailVerified) {
        // BLOCK: Redirect to verification if email is not confirmed
        router.replace('/auth/verify-email');
      } else if (userProfile) {
        setRole(userProfile.role as 'BRAND' | 'CREATOR');
      }
    }
  }, [currentUser, userProfile, loading, router]);

  const toggleRole = () => {
    const nextRole = role === 'BRAND' ? 'CREATOR' : 'BRAND';
    setRole(nextRole);
    router.push(`/dashboard/${nextRole.toLowerCase()}`);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Prevent flash of dashboard content for unverified users
  if (loading || (currentUser && !currentUser.emailVerified)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 font-medium">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardSidebar mockRole={role} onToggleRole={toggleRole} />
      
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <DashboardSidebar mockRole={role} onToggleRole={toggleRole} />
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search campaigns, creators..." 
                className="pl-10 bg-slate-100/50 border-none rounded-xl h-10 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="pl-2 pr-1 h-10 gap-2 hover:bg-slate-100 rounded-full transition-all">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/20">
                    {role === 'BRAND' ? 'L' : 'S'}
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-bold leading-tight">
                      {role === 'BRAND' ? (userProfile?.displayName || 'Lumina Tech') : (userProfile?.displayName || 'Sarah Chen')}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {role === 'BRAND' ? 'Brand Admin' : 'Verified Creator'}
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg py-2">
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="rounded-lg py-2 text-red-600 hover:bg-red-50" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
