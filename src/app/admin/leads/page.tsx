
'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  TrendingUp, 
  Clock, 
  Zap, 
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  Target,
  ArrowUpRight,
  ShieldCheck,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { useLeadStore } from '@/store/useLeadStore';
import { LeadsTable } from '@/components/crm/LeadsTable';
import { LeadDrawer } from '@/components/crm/LeadDrawer';
import { CreateLeadModal } from '@/components/crm/CreateLeadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { CREATOR_NICHES } from '@/constants';

export default function LeadsDashboard() {
  const { fetchLeads, filters, setFilters, loading, totalLeads } = useLeadStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const stats = [
    { label: 'New This Week', value: '+12', icon: Zap, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Avg. Lead Score', value: '82', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Conversion Rate', value: '14.2%', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Follow-ups', value: '08', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Lead Acquisition Pipeline
          </h1>
          <p className="text-slate-500 font-medium">Manage brand partnerships, acquisition funnel, and lifecycle transitions.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold bg-white h-11 border-slate-200" onClick={() => fetchLeads()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          </Button>
          <Button variant="outline" className="rounded-xl font-bold bg-white h-11 border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="rounded-xl font-black shadow-xl shadow-primary/20 h-11 px-6" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Lead Entry
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm group hover:shadow-md transition-shadow"
          >
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1 text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Control & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by company, email or agent..." 
              className="pl-10 h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-primary"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={filters.status} onValueChange={(v: any) => setFilters({ status: v })}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs min-w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">All Lifecycles</SelectItem>
                <SelectItem value="new" className="font-bold">Inbound (New)</SelectItem>
                <SelectItem value="contacted" className="font-bold">Contacted</SelectItem>
                <SelectItem value="replied" className="font-bold">Engaged</SelectItem>
                <SelectItem value="booked" className="font-bold">Meeting Booked</SelectItem>
                <SelectItem value="closed" className="font-bold">Converted</SelectItem>
                <SelectItem value="lost" className="font-bold">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.niche} onValueChange={(v: any) => setFilters({ niche: v })}>
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold text-xs min-w-[140px]">
                <SelectValue placeholder="Niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">All Niches</SelectItem>
                {CREATOR_NICHES.slice(0, 10).map(n => (
                  <SelectItem key={n} value={n} className="font-bold">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-primary/5 text-primary border-none h-8 px-4 font-black text-[10px] uppercase">
            {totalLeads} Active Leads
          </Badge>
        </div>
      </div>

      {/* Main Table */}
      <LeadsTable />

      {/* Detail Views & Modals */}
      <AnimatePresence>
        <LeadDrawer />
      </AnimatePresence>
      <CreateLeadModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />

      {/* Strategy Banner */}
      <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex items-start gap-6 shadow-xl relative overflow-hidden group">
        <Zap className="absolute -right-4 -top-4 h-24 w-24 text-white/5 group-hover:scale-110 transition-transform" />
        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-md border border-white/10">
          <ArrowUpRight className="h-8 w-8 text-emerald-400" />
        </div>
        <div className="space-y-2 relative z-10">
          <h3 className="text-lg font-bold">Acquisition Strategy: Q3</h3>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Focus outreach on leads with propensity scores above **85**. Data shows a **3.4x higher** conversion rate for brands in the **Gaming** and **Tech** niches this month.
          </p>
        </div>
      </div>
    </div>
  );
}
