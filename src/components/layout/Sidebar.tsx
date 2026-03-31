
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  Wallet, 
  MessageSquare, 
  Settings, 
  Bell, 
  FileText,
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  const creatorLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Campaigns', href: '/dashboard/discover', icon: Search },
    { name: 'My Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'My Deliverables', href: '/dashboard/deliverables', icon: FileText },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  ];

  const brandLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Campaigns', href: '/dashboard/campaigns', icon: Briefcase },
    { name: 'Find Creators', href: '/dashboard/matchmaking', icon: Search },
    { name: 'Deliverables', href: '/dashboard/deliverables', icon: FileText },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const links = userProfile?.role === 'BRAND' ? brandLinks : creatorLinks;

  return (
    <div className="hidden border-r bg-card md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 shadow-sm z-30">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-6 border-b">
          <Link href="/dashboard" className="flex items-center">
            <div className="bg-primary p-1 rounded-md mr-2">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="font-headline font-bold text-lg">Baalvion</span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200'
                )}
              >
                <item.icon
                  className={cn(
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 p-4 border-t">
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</p>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {userProfile?.displayName?.charAt(0) || 'U'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{userProfile?.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{userProfile?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
