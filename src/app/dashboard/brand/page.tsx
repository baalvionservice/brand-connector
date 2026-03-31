
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  IndianRupee, 
  Plus, 
  MoreHorizontal,
  ChevronRight,
  Target,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const STATS = [
  { label: 'Active Campaigns', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Active Creators', value: '48', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Total Budget Spent', value: '₹12.5L', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { label: 'Campaign Reach', value: '2.4M', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const CAMPAIGNS = [
  {
    id: '1',
    name: 'Tech Launch 2024',
    status: 'Active',
    creators: 8,
    progress: 65,
    budget: '₹4,50,000',
    spent: '₹2,80,000'
  },
  {
    id: '2',
    name: 'Summer Influencer Meet',
    status: 'Draft',
    creators: 0,
    progress: 0,
    budget: '₹1,20,000',
    spent: '₹0'
  },
  {
    id: '3',
    name: 'Eco-Friendly Campaign',
    status: 'Completed',
    creators: 12,
    progress: 100,
    budget: '₹3,00,000',
    spent: '₹3,00,000'
  }
];

export default function BrandDashboard() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Brand Dashboard</h1>
          <p className="text-slate-500 mt-1">Monitor your campaign performance and creator engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold bg-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Report
          </Button>
          <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-bold">
                    +12% vs last mo
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Campaigns */}
        <Card className="lg:col-span-2 border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-white/50">
            <div>
              <CardTitle className="text-lg font-bold">Recent Campaigns</CardTitle>
              <CardDescription>Performance of your latest initiatives</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 pl-6">Campaign</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Creators</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Progress</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Budget</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CAMPAIGNS.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-900">{campaign.name}</span>
                        <Badge 
                          className={`w-fit mt-1 text-[10px] uppercase font-black px-1.5 py-0 border-none ${
                            campaign.status === 'Active' ? 'bg-blue-100 text-blue-600' : 
                            campaign.status === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'
                          }`}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <Avatar key={i} className="h-7 w-7 border-2 border-white ring-1 ring-slate-100">
                            <AvatarImage src={`https://picsum.photos/seed/${campaign.id}${i}/40/40`} />
                            <AvatarFallback>C</AvatarFallback>
                          </Avatar>
                        ))}
                        {campaign.creators > 3 && (
                          <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +{campaign.creators - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500">{campaign.progress}% Completed</span>
                        <Progress value={campaign.progress} className="h-1.5 bg-slate-100" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm">{campaign.budget}</span>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Performing Creators */}
        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden flex flex-col">
          <CardHeader className="border-b bg-white/50">
            <CardTitle className="text-lg font-bold">Top Talent</CardTitle>
            <CardDescription>Creators delivering best ROI</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 space-y-6">
            {[
              { name: 'Elena Vance', handle: '@elena_gadgets', roi: '4.8x', reach: '420k' },
              { name: 'Sarah Chen', handle: '@sarah_tech', roi: '4.2x', reach: '180k' },
              { name: 'Marco Rossi', handle: '@marco_style', roi: '3.9x', reach: '95k' },
            ].map((talent, i) => (
              <div key={talent.handle} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-xl border border-slate-100">
                    <AvatarImage src={`https://picsum.photos/seed/talent${i}/40/40`} />
                    <AvatarFallback>{talent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{talent.name}</p>
                    <p className="text-xs text-primary font-medium">{talent.handle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">{talent.roi} ROI</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{talent.reach} Reach</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 rounded-xl border-dashed border-slate-200 text-slate-500 font-bold text-xs hover:text-primary transition-colors">
              Discover More Talent
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
