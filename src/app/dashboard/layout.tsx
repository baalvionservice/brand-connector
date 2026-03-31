'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardSidebar } from '@/components/layout/Sidebar';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Loader2,
  Zap,
  Briefcase,
  Wallet,
  MessageSquare,
  Clock,
  AlertCircle,
  Target,
  FileText,
  ShieldAlert
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { CreatorProfile, BrandProfile, OnboardingStatus, Notification, NotificationType } from '@/types';
import { collection, query, where, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { markNotificationAsRead } from '@/lib/notifications';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, userProfile, loading, signOut } = useAuth();
  const db = useFirestore();
  
  // Real-time hook for creator onboarding status
  const { data: creatorProfile } = useDoc<CreatorProfile>(
    userProfile?.role === 'CREATOR' ? `creators/creator_${userProfile.id}` : null
  );

  // Real-time hook for brand onboarding status
  const { data: brandProfile } = useDoc<BrandProfile>(
    userProfile?.role === 'BRAND' ? `brands/brand_${userProfile.id}` : null
  );

  // Real-time notifications for the bell
  const notificationsQuery = useMemo(() => {
    if (!userProfile?.id) return null;
    return query(
      collection(db, 'notifications'),
      where('userId', '==', userProfile.id),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
  }, [db, userProfile?.id]);

  const { data: notifications } = useCollection<Notification>(notificationsQuery);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [role, setRole] = useState<'BRAND' | 'CREATOR'>('BRAND');

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace('/auth/login');
      } else if (!currentUser.emailVerified) {
        router.replace('/auth/verify-email');
      } else if (userProfile) {
        setRole(userProfile.role as 'BRAND' | 'CREATOR');
        
        if (userProfile.role === 'CREATOR' && creatorProfile) {
          if (creatorProfile.onboardingStatus !== OnboardingStatus.COMPLETED && !pathname.startsWith('/onboarding')) {
            router.replace('/onboarding/creator');
          }
        }

        if (userProfile.role === 'BRAND' && brandProfile) {
          if (brandProfile.onboardingStatus !== OnboardingStatus.COMPLETED && !pathname.startsWith('/onboarding')) {
            router.replace('/onboarding/brand');
          }
        }
      }
    }
  }, [currentUser, userProfile, loading, router, creatorProfile, brandProfile, pathname]);

  const toggleRole = () => {
    const nextRole = role === 'BRAND' ? 'CREATOR' : 'BRAND';
    setRole(nextRole);
    router.push(`/dashboard/${nextRole.toLowerCase()}`);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'NEW_MATCH': return <Target className="h-4 w-4 text-primary" />;
      case 'APPLICATION_UPDATE': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'PAYMENT_RECEIVED': return <Wallet className="h-4 w-4 text-emerald-500" />;
      case 'NEW_MESSAGE': return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case 'DISPUTE_UPDATE': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'DEADLINE_REMINDER': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'SYSTEM': return <ShieldAlert className="h-4 w-4 text-slate-500" />;
      default: return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

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
            {/* Notification Bell Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                    <Bell className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 h-4 w-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-none">
                <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Notifications</h3>
                  <Link href="/dashboard/notifications" className="text-[10px] font-bold text-primary hover:underline">View All</Link>
                </div>
                <ScrollArea className="max-h-[400px]">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(db, n.id);
                            if (n.link) router.push(n.link);
                          }}
                          className={cn(
                            "w-full p-4 flex gap-3 text-left hover:bg-slate-50 transition-colors",
                            !n.read && "bg-primary/5"
                          )}
                        >
                          <div className="h-8 w-8 rounded-lg bg-white border shadow-sm flex items-center justify-center shrink-0">
                            {getNotificationIcon(n.type)}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-2">{n.message}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!n.read && <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <Bell className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                      <p className="text-xs font-bold text-slate-400">All caught up!</p>
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

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
                <DropdownMenuItem className="rounded-lg py-2" onClick={() => router.push('/dashboard/settings')}>
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
