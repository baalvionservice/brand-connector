
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  IndianRupee, 
  Calendar, 
  Download, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  CheckCircle2,
  ChevronRight,
  Target,
  Sparkles,
  PieChart as PieChartIcon
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
  Cell,
  PieChart,
  Pie
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock Aggregated Data
const AGGREGATED_TRENDS = [
  { month: 'Jan', spend: 45000, reach: 120000 },
  { month: 'Feb', spend: 85000, reach: 280000 },
  { month: 'Mar', spend: 120000, reach: 450000 },
  { month: 'Apr', spend: 95000, reach: 380000 },
  { month: 'May', spend: 160000, reach: 680000 },
  { month: 'Jun', spend: 210000, reach: 920000 },
  { month: 'Jul', spend: 185000, reach: 1245000 },
];

const NICHE_PERFORMANCE = [
  { niche: 'Tech', roi: 4.8, color: '#6C3AE8' },
  { niche: 'Lifestyle', roi: 3.2, color: '#F97316' },
  { niche: 'Gaming', roi: 5.1, color: '#10B981' },
  { niche: 'Fashion', roi: 2.9, color: '#3B82F6' },
  { niche: 'Fitness', roi: 4.2, color: '#EC4899' },
];

const TOP_CREATORS = [
  { name: 'Sarah Chen', campaigns: 12, reach: '2.4M', roi: '5.2x', rating: 4.9, avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { name: 'Alex Rivers', campaigns: 8, reach: '1.1M', roi: '4.8x', rating: 4.8, avatar: 'https://picsum.photos/seed/alex/100/100' },
  { name: 'Elena Vance', campaigns: 5, reach: '850k', roi: '4.1x', rating: 5.0, avatar: 'https://picsum.photos/seed/elena/100/100' },
  { name: 'Marcus Thorne', campaigns: 9, reach: '1.8M', roi: '3.9x', rating: 4.7, avatar: 'https://picsum.photos/seed/marcus/100/100' },
];

const CAMPAIGN_TABLE = [
  { title: 'AI Smart Home Review', status: 'ACTIVE', spend: 45000, reach: '1.2M', roi: '4.5x' },
  { title: 'Summer Organic Linen', status: 'COMPLETED', spend: 12500, reach: '450k', roi: '3.8x' },
  { title: 'Morning Vitality Series', status: 'COMPLETED', spend: 22000, reach: '890k', roi: '4.1x' },
  { title: 'Night Recovery Serum', status: 'ACTIVE', spend: 35000, reach: '620k', roi: '3.2x' },
];

export default function GlobalBrandAnalytics() {
  const [timeRange, setTimeRange] = useState('90');

  const stats = [
    { label: 'Total Portfolio Reach', value: '4.8M+', trend: '+18.4%', icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Total Capital Spent', value: '₹8,42,500', trend: '+12.5%', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg. Campaign ROI', value: '4.2x', trend: '+0.8x', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Top Performing Niche', value: 'Gaming', trend: '5.1x ROI', icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Analytics</h1>
          <p className="text-slate-500 font-medium">Aggregate performance overview for all campaigns and creators.</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] h-11 rounded-xl bg-white font-bold border-slate-200">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Last 90 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="year">Full Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl font-bold bg-white h-11 border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl p-6 bg-white group hover:shadow-md transition-shadow">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors", stat.bg, stat.color)}>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Growth Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Spend vs Reach Timeline */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Spending Velocity & Impact</CardTitle>
                <CardDescription>Correlation between capital allocation and audience reach.</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spend (₹)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reach</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={AGGREGATED_TRENDS}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C3AE8" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6C3AE8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                      tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="spend" 
                      stroke="#6C3AE8" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorSpend)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="reach" 
                      stroke="#10B981" 
                      strokeWidth={4} 
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Comparison Table */}
          <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b bg-slate-50/50">
              <CardTitle className="text-xl">Campaign ROI Audit</CardTitle>
              <CardDescription>Comparative overview of marketing project efficiency.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100 h-16">
                    <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest">Campaign</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Budget</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Total Reach</TableHead>
                    <TableHead className="pr-8 font-black text-[10px] uppercase tracking-widest text-right">ROI Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CAMPAIGN_TABLE.map((row, i) => (
                    <TableRow key={row.title} className="border-slate-50 group hover:bg-slate-50/50 transition-colors h-20">
                      <TableCell className="pl-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{row.title}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reference #{i+100}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border-none",
                          row.status === 'ACTIVE' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                        )}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">₹{row.spend.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-black text-primary">{row.reach}</TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/5 text-primary border border-primary/10">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-sm font-black">{row.roi}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Insights */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Niche ROI Ranking */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-primary" />
                Niche Efficiency Ranking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {NICHE_PERFORMANCE.map((item, i) => (
                <div key={item.niche} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-700">{item.niche}</span>
                    <span className="text-primary">{item.roi}x ROI</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(item.roi / 6) * 100}%`, backgroundColor: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Creators Leaderboard */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-6 border-b bg-slate-50/50">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Top Strategic Partners</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {TOP_CREATORS.map((c, i) => (
                  <div key={c.name} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border shadow-sm">
                          <AvatarImage src={c.avatar} />
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        {i === 0 && (
                          <div className="absolute -top-1 -right-1 bg-yellow-400 p-0.5 rounded-full border-2 border-white">
                            <Sparkles className="h-2 w-2 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{c.name}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{c.reach} REACH</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-primary">{c.roi}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.campaigns} JOBS</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-slate-50/30 border-t flex justify-center">
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-primary">
                View Full Network <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>

          {/* AI Strategy Digest */}
          <Card className="border-none shadow-xl shadow-primary/10 rounded-3xl overflow-hidden bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="h-16 w-16" />
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                <Sparkles className="h-6 w-6 text-yellow-300 fill-yellow-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">AI Recommendations</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Your portfolio ROI is <span className="text-emerald-400 font-bold">15% higher</span> than the platform average for consumer electronics. 
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Niche Pivot</p>
                  <p className="text-[11px] text-white/80 font-medium">Allocating 15% more budget to **Gaming** creators in Q4 could lift overall ROI by 0.8x.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Partner Alert</p>
                  <p className="text-[11px] text-white/80 font-medium">**Sarah Chen** has high audience overlap with your Q3 product launches. Recommend a 3-month contract.</p>
                </div>
              </div>

              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 text-[10px] uppercase tracking-[0.2em] shadow-lg">
                Generate Full Strategy Report
              </Button>
            </CardContent>
          </Card>

        </aside>
      </div>
    </div>
  );
}
