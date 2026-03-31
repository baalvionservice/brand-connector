
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Wallet, 
  Star, 
  Clock, 
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  CalendarDays,
  IndianRupee
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const STATS = [
  { label: 'Pending Earnings', value: '₹42,500', icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-100' },
  { label: 'Active Jobs', value: '4', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Creator Rating', value: '4.9', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Completed Jobs', value: '28', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
];

const RECOMMENDED = [
  {
    id: '1',
    brand: 'Lumina Tech',
    title: 'AI Smart Home Review',
    budget: '₹12,000',
    match: 98,
    tags: ['Tech', 'UGC']
  },
  {
    id: '2',
    brand: 'EcoVibe',
    title: 'Summer Fashion Reel',
    budget: '₹8,500',
    match: 94,
    tags: ['Lifestyle', 'Fashion']
  }
];

export default function CreatorDashboard() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Welcome, Sarah!</h1>
          <p className="text-slate-500 mt-1">You have 2 new campaign invitations waiting for you.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold bg-white">
            <CalendarDays className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
            Browse Jobs
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
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
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
        {/* Recommended Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold text-slate-900">AI Matches For You</h2>
            <Button variant="link" className="text-primary font-bold text-xs">View Discovery Feed</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RECOMMENDED.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-xl border border-slate-100">
                          <AvatarImage src={`https://picsum.photos/seed/brand${job.id}/40/40`} />
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job.brand}</p>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">{job.title}</h4>
                        </div>
                      </div>
                      <div className="bg-primary/5 px-2 py-1 rounded-lg flex items-center gap-1">
                        <Zap className="h-3 w-3 text-primary fill-primary" />
                        <span className="text-[10px] font-black text-primary">{job.match}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-6">
                      {job.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[10px] py-0 px-2 font-bold">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-black">
                        <IndianRupee className="h-3.5 w-3.5" />
                        <span className="text-sm">{job.budget}</span>
                      </div>
                      <Button size="sm" className="h-8 rounded-lg font-bold text-[10px] group-hover:bg-primary transition-colors">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Deliverables Section */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden mt-8">
            <CardHeader className="border-b bg-white/50">
              <CardTitle className="text-lg font-bold">Upcoming Deliverables</CardTitle>
              <CardDescription>Your schedule for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {[
                { campaign: 'Summer Vibes', task: 'Instagram Reel Submission', date: 'Tomorrow, 5:00 PM', status: 'In Progress' },
                { campaign: 'Tech Review', task: 'Review Script Draft', date: 'Jul 24, 10:00 AM', status: 'Pending' },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 border-b last:border-0 border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{task.task}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{task.campaign} • {task.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold py-0 px-2 uppercase text-slate-500 border-slate-200">
                    {task.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-indigo-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-headline font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-white/80 text-xs mb-6 leading-relaxed">
                Get priority matching, instant payouts, and detailed audience insights.
              </p>
              <Button size="sm" className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl transition-all shadow-lg">
                View Plans
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">₹1,24,000</span>
                <span className="text-xs font-bold text-slate-400">INR</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold mt-2">Available for withdrawal</p>
              <div className="grid grid-cols-2 gap-2 mt-6">
                <Button size="sm" variant="outline" className="rounded-lg h-9 text-[10px] font-bold">History</Button>
                <Button size="sm" className="rounded-lg h-9 text-[10px] font-bold">Withdraw</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
