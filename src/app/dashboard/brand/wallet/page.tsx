
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  History, 
  Download, 
  Filter, 
  Search, 
  IndianRupee, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock Data for Spend Chart
const SPEND_DATA = [
  { month: 'Feb', amount: 45000 },
  { month: 'Mar', amount: 120000 },
  { month: 'Apr', amount: 85000 },
  { month: 'May', amount: 160000 },
  { month: 'Jun', amount: 210000 },
  { month: 'Jul', amount: 185000 },
];

// Mock Transactions
const MOCK_TRANSACTIONS = [
  { id: 'tx_101', date: '2024-07-20', campaign: 'AI Smart Home Review', creator: 'Sarah Chen', amount: 45000, type: 'ESCROW_LOCK', status: 'COMPLETED' },
  { id: 'tx_102', date: '2024-07-18', campaign: 'AI Smart Home Review', creator: 'Sarah Chen', amount: 6750, type: 'FEE', status: 'COMPLETED' },
  { id: 'tx_103', date: '2024-07-15', campaign: 'Sustainable Summer Reel', creator: 'Alex Rivers', amount: 12500, type: 'PAYOUT', status: 'COMPLETED' },
  { id: 'tx_104', date: '2024-07-10', campaign: 'Global Fitness Drive', creator: 'Marcus Thorne', amount: 25000, type: 'REFUND', status: 'COMPLETED' },
  { id: 'tx_105', date: '2024-07-05', campaign: 'N/A', creator: 'N/A', amount: 100000, type: 'DEPOSIT', status: 'COMPLETED' },
];

const CAMPAIGNS = ['AI Smart Home Review', 'Sustainable Summer Reel', 'Global Fitness Drive', 'Night Recovery Launch'];

export default function BrandWalletPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCampaign, setFilterCampaign] = useState('all');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const stats = {
    totalSpent: 842500,
    escrowed: 125000,
    available: 45000,
  };

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      const matchesSearch = tx.campaign.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tx.creator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCampaign = filterCampaign === 'all' || tx.campaign === filterCampaign;
      return matchesSearch && matchesCampaign;
    });
  }, [searchQuery, filterCampaign]);

  const handleDeposit = () => {
    if (!depositAmount || Number(depositAmount) <= 0) return;
    toast({
      title: "Deposit Initiated",
      description: `₹${Number(depositAmount).toLocaleString()} is being added to your available credit.`,
    });
    setIsDepositOpen(false);
    setDepositAmount('');
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'ESCROW_LOCK': return { label: 'Escrow Lock', color: 'bg-blue-100 text-blue-600', icon: ShieldCheck };
      case 'PAYOUT': return { label: 'Payout', color: 'bg-emerald-100 text-emerald-600', icon: ArrowUpRight };
      case 'REFUND': return { label: 'Refund', color: 'bg-orange-100 text-orange-600', icon: ArrowDownLeft };
      case 'FEE': return { label: 'Platform Fee', color: 'bg-slate-100 text-slate-600', icon: Zap };
      case 'DEPOSIT': return { label: 'Deposit', color: 'bg-primary/10 text-primary', icon: Plus };
      default: return { label: type, color: 'bg-slate-100 text-slate-600', icon: FileText };
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Treasury</h1>
          <p className="text-slate-500 font-medium">Manage your marketing capital and track escrowed campaign funds.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold bg-white h-11 border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Download Yearly Report
          </Button>
          
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 h-11 px-6">
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
              <DialogHeader>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-black">Top Up Credit</DialogTitle>
                <DialogDescription>Add funds to your available credit to launch new campaigns instantly.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-3">
                  <Label className="font-bold text-slate-700">Deposit Amount (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                    <Input 
                      type="number" 
                      placeholder="50,000" 
                      className="h-16 pl-12 rounded-2xl text-2xl font-black border-slate-100 bg-slate-50"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">Lumina Corporate (SBI ****9012)</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary font-bold text-xs uppercase tracking-widest">Change</Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleDeposit} className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20">
                  Confirm Deposit <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-slate-950 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Total Campaign Spend</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">₹{(stats.totalSpent / 100000).toFixed(1)}L</span>
              <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] tracking-widest">LIFETIME</Badge>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-4 flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              12% under budget this quarter
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Funds in Escrow</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">₹{stats.escrowed.toLocaleString()}</span>
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 font-bold mt-4">Secured for 8 active milestones</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Available Credit</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-600">₹{stats.available.toLocaleString()}</span>
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs text-emerald-700 font-bold leading-relaxed">
                Ready to fund 3 more mid-tier creators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Spend Chart */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Spending Trajectory</CardTitle>
                <CardDescription>Monthly marketing capital allocation</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border shadow-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment</span>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SPEND_DATA}>
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
                      tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#6C3AE8" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorSpend)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Transaction History
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search creator or campaign..." 
                    className="pl-10 h-10 rounded-xl bg-white border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterCampaign} onValueChange={setFilterCampaign}>
                  <SelectTrigger className="w-[200px] h-10 rounded-xl bg-white font-bold text-xs">
                    <SelectValue placeholder="All Campaigns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-bold">All Campaigns</SelectItem>
                    {CAMPAIGNS.map(c => <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-50 h-16">
                      <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest">Date</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest">Transaction Details</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest">Type</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest">Amount</TableHead>
                      <TableHead className="pr-8 text-right font-black text-[10px] uppercase tracking-widest">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredTransactions.map((tx, idx) => {
                        const typeInfo = getTypeConfig(tx.type);
                        return (
                          <motion.tr
                            key={tx.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group border-slate-50 hover:bg-slate-50/50 transition-colors h-20"
                          >
                            <TableCell className="pl-8">
                              <span className="text-sm font-bold text-slate-500">
                                {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 truncate max-w-[200px]">{tx.campaign}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                  {tx.creator !== 'N/A' ? `Creator: ${tx.creator}` : 'Corporate Deposit'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border-none", typeInfo.color)}>
                                <typeInfo.icon className="h-3 w-3 mr-1.5" />
                                {typeInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={cn(
                                "text-lg font-black",
                                tx.type === 'REFUND' || tx.type === 'DEPOSIT' ? "text-emerald-600" : "text-slate-900"
                              )}>
                                {tx.type === 'REFUND' || tx.type === 'DEPOSIT' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="pr-8 text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl text-slate-300 hover:text-primary hover:bg-primary/5 opacity-0 group-hover:opacity-100 transition-all"
                                onClick={() => toast({ title: "Invoice Generating", description: `Statement for #${tx.id} is being prepared.` })}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-slate-50/50 p-6 flex justify-center border-t border-slate-50">
                <Button variant="ghost" className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-primary">
                  Load Full Statement
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Sidebar panels */}
        <aside className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-xl shadow-primary/10 rounded-3xl overflow-hidden bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <ShieldCheck className="h-16 w-16" />
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">Escrow Guarantee</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Your funds are protected by Baalvion's secure escrow layer. They are only released once content meets your specific brief requirements.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Holds</p>
                  <p className="text-lg font-black">₹{stats.escrowed.toLocaleString()}</p>
                </div>
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      C{i}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/50 p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Upcoming Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {[
                  { title: 'Sarah Chen - Milestone 2', amount: 15000, date: 'Tomorrow' },
                  { title: 'Alex Rivers - Full Payout', amount: 12500, date: 'Jul 24' },
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.date}</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-slate-50/30 border-t flex justify-center">
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-primary">
                View Full Payout Schedule
              </Button>
            </CardFooter>
          </Card>

          <div className="p-6 rounded-3xl bg-white border border-dashed border-slate-300 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase">Need Tax Invoices?</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Access your consolidated GST-compliant monthly invoices in the reports section.
              </p>
            </div>
            <Button variant="link" className="text-xs font-bold text-primary h-auto p-0">Go to Reports</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
