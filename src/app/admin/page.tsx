
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Briefcase, 
  IndianRupee, 
  AlertTriangle, 
  UserCheck, 
  Zap, 
  BarChart3, 
  Settings, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight,
  Sparkles,
  Search,
  Plus,
  RefreshCcw,
  LayoutDashboard,
  ShieldAlert,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Mock Aggregated Data
const REVENUE_TRENDS = [
  { name: 'Jan', revenue: 120000, gmv: 800000 },
  { name: 'Feb', revenue: 185000, gmv: 1230000 },
  { name: 'Mar', revenue: 240000, gmv: 1600000 },
  { name: 'Apr', revenue: 210000, gmv: 1400000 },
  { name: 'May', revenue: 320000, gmv: 2130000 },
  { name: 'Jun', revenue: 410000, gmv: 2730000 },
  { name: 'Jul', revenue: 385000, gmv: 2560000 },
];

const USER_GROWTH = [
  { name: 'Jan', creators: 4200, brands: 450 },
  { name: 'Feb', creators: 5100, brands: 580 },
  { name: 'Mar', creators: 6400, brands: 720 },
  { name: 'Apr', creators: 7200, brands: 890 },
  { name: 'May', creators: 8500, brands: 1050 },
  { name: 'Jun', creators: 9800, brands: 1180 },
  { name: 'Jul', creators: 10200, brands: 1240 },
];

const RECENT_ACTIVITY = [
  { id: 1, user: 'Nexus Brand', action: 'Requested Verification', type: 'VERIFY', time: '12m ago', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 2, user: 'Sarah Chen', action: 'Filed Payout Dispute', type: 'DISPUTE', time: '45m ago', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 3, user: 'Lumina Tech', action: 'Funded Campaign (₹5L)', type: 'FINANCE', time: '2h ago', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 4, user: 'System', action: 'Server Load Peak (92%)', type: 'SYSTEM', time: '4h ago', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
];

export default function AdminDashboardPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userProfile?.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [userProfile, loading, router]);

  const stats = [
    { label: 'Total GMV (Lifetime)', value: '₹5.2 Cr', trend: '+18.4%', icon: IndianRupee, color: 'text-slate-900', bg: 'bg-slate-100' },
    { label: 'Platform Revenue', value: '₹78.4 L', trend: '+12.5%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Active Campaigns', value: '156', trend: '+12 this week', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Users', value: '11,440', trend: '+840 this mo', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (loading || userProfile?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 pb-20">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-slate-900 p-2 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin <span className="text-primary">Control Center</span></h1>
          </div>
          <p className="text-slate-500 font-medium">Baalvion Connect Global Marketplace Oversight.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold bg-white h-11 border-slate-200">
            <Settings className="h-4 w-4 mr-2" /> System Status
          </Button>
          <Button className="rounded-xl font-bold shadow-xl shadow-primary/20 h-11 px-6">
            <Sparkles className="h-4 w-4 mr-2" /> AI Platform Health
          </Button>
        </div>
      </div>

      {/* Critical Alerts Row */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-[2rem] bg-red-50 border border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-red-400 tracking-widest leading-none">Active Disputes</p>
              <p className="text-xl font-black text-red-900 mt-1">3 Cases Pending Resolution</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-red-600 font-black text-[10px] uppercase group">
            Open Mediation <ChevronRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="p-6 rounded-[2rem] bg-blue-50 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest leading-none">Brand Verification</p>
              <p className="text-xl font-black text-blue-900 mt-1">24 Applications Review Needed</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-blue-600 font-black text-[10px] uppercase group">
            Start Auditing <ChevronRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl p-6 bg-white group hover:shadow-md transition-shadow">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1 text-slate-900">{stat.value}</h3>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold mt-2",
                stat.trend.startsWith('+') ? "text-emerald-600" : "text-slate-500"
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Growth Charts */}
        <div className="lg:col-span-8 space-y-8">
          
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Platform Revenue & GMV Velocity</CardTitle>
                <CardDescription>Monthly platform cut (15%) against total market volume.</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                  <div className="h-2 w-2 rounded-full bg-primary" /> Revenue
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase">
                  <div className="h-2 w-2 rounded-full bg-slate-200" /> Total GMV
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_TRENDS}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C3AE8" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6C3AE8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                      tickFormatter={(val) => `₹${val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`}`}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#6C3AE8" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gmv" 
                      stroke="#e2e8f0" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Network Expansion</CardTitle>
                <CardDescription>Brand vs. Creator growth across the ecosystem.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={USER_GROWTH}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                    <Line type="monotone" dataKey="creators" stroke="#6C3AE8" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="brands" stroke="#F97316" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Ops */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Recent Global Activity */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-6 border-b bg-slate-50/50">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Global Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {RECENT_ACTIVITY.map((act) => (
                  <div key={act.id} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", act.bg, act.color)}>
                      <act.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="text-xs font-black text-slate-900 uppercase">{act.user}</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{act.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-slate-50/30 border-t flex justify-center">
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-primary">
                View Full Audit Log <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Admin Actions */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2">Rapid Response</h4>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 rounded-[1.5rem] flex flex-col gap-2 font-black text-[10px] uppercase tracking-tighter shadow-lg shadow-primary/10">
                <ShieldCheck className="h-5 w-5" /> Verify Brands
              </Button>
              <Button variant="outline" className="h-20 rounded-[1.5rem] flex flex-col gap-2 font-black text-[10px] uppercase tracking-tighter bg-white border-slate-200">
                <AlertTriangle className="h-5 w-5 text-orange-500" /> Resolve Disputes
              </Button>
              <Button variant="outline" className="h-20 rounded-[1.5rem] flex flex-col gap-2 font-black text-[10px] uppercase tracking-tighter bg-white border-slate-200">
                <Download className="h-5 w-5 text-primary" /> Tax Statements
              </Button>
              <Button variant="outline" className="h-20 rounded-[1.5rem] flex flex-col gap-2 font-black text-[10px] uppercase tracking-tighter bg-white border-slate-200">
                <Plus className="h-5 w-5 text-emerald-500" /> Payout Bulk
              </Button>
            </div>
          </div>

          {/* Infrastructure Health */}
          <Card className="border-none shadow-xl shadow-primary/10 rounded-3xl overflow-hidden bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <RefreshCcw className="h-16 w-16" />
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">Platform Uptime</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  All systems operational. AI Matcher is processing <span className="text-white font-bold">142 queries/sec</span>.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                  <span>Server Load</span>
                  <span>42%</span>
                </div>
                <Progress value={42} className="h-1 bg-white/5" />
              </div>

              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 text-[10px] uppercase tracking-widest shadow-lg">
                View Infrastructure Details
              </Button>
            </CardContent>
          </Card>

        </aside>
      </div>
    </div>
  );
}
