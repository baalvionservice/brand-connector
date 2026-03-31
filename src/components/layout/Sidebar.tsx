
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
  FileText,
  UserCircle,
  Zap,
  ArrowLeftRight,
  BarChart3,
  ImageIcon,
  IndianRupee,
  Users,
  LineChart,
  UserPlus,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  History,
  Scale,
  Megaphone,
  Cpu,
  LifeBuoy,
  FileBarChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  mockRole?: 'BRAND' | 'CREATOR' | 'ADMIN';
  onToggleRole?: () => void;
}

export function DashboardSidebar({ mockRole, onToggleRole }: SidebarProps) {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  // Use either the real auth role or the provided mock role for prototyping
  const currentRole = userProfile?.role || mockRole || 'BRAND';

  const creatorLinks = [
    { name: 'Dashboard', href: '/dashboard/creator', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/creator/analytics', icon: BarChart3 },
    { name: 'Portfolio', href: '/dashboard/creator/portfolio', icon: ImageIcon },
    { name: 'Rate Card', href: '/dashboard/creator/rates', icon: IndianRupee },
    { name: 'Find Campaigns', href: '/dashboard/creator/campaigns', icon: Search },
    { name: 'My Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Wallet', href: '/dashboard/creator/wallet', icon: Wallet },
    { name: 'Messages', href: '/dashboard/creator/messages', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const brandLinks = [
    { name: 'Dashboard', href: '/dashboard/brand', icon: LayoutDashboard },
    { name: 'Performance', href: '/dashboard/brand/analytics', icon: LineChart },
    { name: 'My Campaigns', href: '/dashboard/brand/campaigns', icon: Briefcase },
    { name: 'Find Creators', href: '/dashboard/brand/creators', icon: Users },
    { name: 'Matchmaking', href: '/dashboard/matchmaking', icon: Zap },
    { name: 'Deliverables', href: '/dashboard/brand/deliverables', icon: FileText },
    { name: 'Team Hub', href: '/dashboard/brand/team', icon: UserPlus },
    { name: 'Billing & Plans', href: '/dashboard/brand/billing', icon: CreditCard },
    { name: 'Wallet', href: '/dashboard/brand/wallet', icon: Wallet },
    { name: 'Messages', href: '/dashboard/brand/messages', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/brand/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Platform Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports & Export', href: '/admin/reports', icon: FileBarChart },
    { name: 'User Directory', href: '/admin/users', icon: Users },
    { name: 'Content Review', href: '/admin/content', icon: ShieldAlert },
    { name: 'Verification Queue', href: '/admin/creators/verify', icon: ShieldCheck },
    { name: 'Moderation Flow', href: '/admin/campaigns', icon: ShieldAlert },
    { name: 'AI Monitoring', href: '/admin/ai', icon: Cpu },
    { name: 'Financial Control', href: '/admin/finance', icon: IndianRupee },
    { name: 'Plan & Tiers', href: '/admin/plans', icon: CreditCard },
    { name: 'Mediation Hub', href: '/admin/disputes', icon: Scale },
    { name: 'Audit Log', href: '/admin/audit', icon: History },
    { name: 'Broadcast Center', href: '/admin/notifications', icon: Megaphone },
    { name: 'Support Center', href: '/admin/support', icon: LifeBuoy },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = currentRole === 'ADMIN' ? adminLinks : currentRole === 'BRAND' ? brandLinks : creatorLinks;

  return (
    <div className="hidden border-r bg-card md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 shadow-sm z-30">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-6 border-b justify-between">
          <Link href="/" className="flex items-center">
            <div className="bg-primary p-1 rounded-md mr-2">
              <Zap className="h-5 w-5 text-white fill-current" />
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

        <div className="flex-shrink-0 p-4 space-y-2 border-t">
          {onToggleRole && currentRole !== 'ADMIN' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-[10px] h-8 font-bold border-dashed"
              onClick={onToggleRole}
            >
              <ArrowLeftRight className="h-3 w-3 mr-2" />
              SWITCH TO {currentRole === 'BRAND' ? 'CREATOR' : 'BRAND'} VIEW
            </Button>
          )}
          
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {currentRole === 'ADMIN' ? 'Admin Access' : currentRole === 'BRAND' ? 'Brand Account' : 'Creator Account'}
            </p>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/20">
                {currentRole === 'ADMIN' ? 'A' : currentRole === 'BRAND' ? 'L' : 'S'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {currentRole === 'ADMIN' ? 'Platform Admin' : currentRole === 'BRAND' ? 'Lumina Tech' : 'Sarah Chen'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tighter">
                  {currentRole === 'ADMIN' ? 'Full Control' : currentRole === 'BRAND' ? 'Enterprise Plan' : 'Verified Pro'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
