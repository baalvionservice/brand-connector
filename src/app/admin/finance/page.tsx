'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Zap, 
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  RefreshCcw,
  BarChart3,
  Wallet,
  Settings,
  MoreVertical,
  Plus,
  ShieldAlert,
  History
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
  Cell
} from 'recharts';
import { collection, query, orderBy, doc, updateDoc, addDoc, where } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { Transaction, TransactionStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock Data for Revenue Chart
const REVENUE_DATA = [
  { month: 'Feb', gmv: 800000, revenue: 120000 },
  { month: 'Mar', gmv: 1200000, revenue: 180000 },
  { month: 'Apr', gmv: 950000, revenue: 142500 },
  { month: 'May', gmv: 1600000, revenue: 240000 },
  { month: 'Jun', gm: 2100000, revenue: 315000 },
  { month: 'Jul', gmv: 1850000, revenue: 277500 },
];

export default function AdminFinancialManagementPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isManualPayoutOpen, setIsManualPayoutOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Fetch Global Transactions
  const { data: transactions, loading } = useCollection<any>(
    query(collection(db, 'transactions'), orderBy('createdAt', 'desc'))
  );

  const stats = useMemo(() => {
    // In a real app, these would be calculated via complex Firestore queries or server-side functions
    return {
      totalEscrow: 1245000,
      feesCollected: 482500,
      pendingPayouts: 8,
      failedTx: 2
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tx.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const handleManualPayout = async () => {
    if (!selectedTx || isProcessing) return;
    setIsProcessing(true);

    const txRef = doc(db, 'transactions', selectedTx.id);
    const updateData = {
      status: 'COMPLETED',
      updatedAt: new Date().toISOString(),
      moderatedBy: 'ADMIN_MANUAL'
    };

    try {
      await updateDoc(txRef, updateData);
      
      // Notify User
      await addDoc(collection(db, 'notifications'), {
        userId: selectedTx.userId,
        title: 'Payout Processed Manually',
        message: `Your payout of ₹${selectedTx.amount.toLocaleString()} has been manually authorized by an administrator.`,
        type: 'PAYMENT',
        read: false,
        createdAt: new Date().toISOString()
      });

      toast({ title: "Manual Payout Successful", description: "Funds have been marked as cleared." });
      setIsManualPayoutOpen(false);
      setSelectedTx(null);
    } catch (err: any) {
      errorEmitter.emitPermissionError(new FirestorePermissionError({
        path: txRef.path,
        operation: 'update',
        requestResourceData: updateData
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED': return { label: 'Settled', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 };
      case 'PENDING': return { label: 'Processing', color: 'bg-orange-100 text-orange-600', icon: Clock };
      case 'FAILED': return { label: 'Failed', color: 'bg-red-100 text-red-600', icon: AlertCircle };
      default: return { label: status, color: 'bg-slate-100 text-slate-500', icon: History };
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'CREDIT': return <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px]">CREDIT</Badge>;
      case 'DEBIT': return <Badge className="bg-blue-50 text-blue-600 border-none text-[9px]">DEBIT</Badge>;
      case 'FEE': return <Badge className="bg-primary/10 text-primary border-none text-[9px]">FEE</Badge>;
      default: return <Badge variant="outline" className="text-[9px]">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <IndianRupee className="h-8 w-8 text-primary" />
            Financial Command
          </h1>
          <p className="text-slate-500 font-medium">Platform treasury oversight, revenue auditing, and manual payout authorization.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold bg-white h-11 border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export Audit Log
          </Button>
          <Button className="rounded-xl font-bold shadow-xl shadow-primary/20 h-11 px-6">
            <Zap className="mr-2 h-4 w-4" /> Run Reconciliation
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Escrow Held', value: `₹${(stats.totalEscrow / 100000).toFixed(1)}L`, trend: '8 active holds', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Fees Collected', value: `₹${(stats.feesCollected / 100000).toFixed(1)}L`, trend: '+12.5% this mo', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Pending Payouts', value: stats.pendingPayouts, trend: 'Awaiting clearance', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Failed Transactions', value: stats.failedTx, trend: 'Needs intervention', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm rounded-2xl p-6 bg-white group hover:shadow-md transition-shadow">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1 text-slate-900">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{stat.trend}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Revenue Charts */}
        <div className="lg:col-span-8 space-y-8">
          
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Marketplace Velocity</CardTitle>
                <CardDescription>Platform revenue vs. total Gross Merchandise Value (GMV).</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                  <div className="h-2 w-2 rounded-full bg-primary" /> Revenue
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase">
                  <div className="h-2 w-2 rounded-full bg-slate-200" /> GMV
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C3AE8" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6C3AE8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="revenue" stroke="#6C3AE8" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="gmv" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Ledger */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Global Ledger
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search by ID or User..." 
                    className="pl-10 h-10 rounded-xl bg-white border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] h-10 rounded-xl bg-white font-bold text-xs">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-bold">All Transactions</SelectItem>
                    <SelectItem value="COMPLETED" className="font-bold">Settled</SelectItem>
                    <SelectItem value="PENDING" className="font-bold text-orange-600">Pending</SelectItem>
                    <SelectItem value="FAILED" className="font-bold text-red-600">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 h-16">
                      <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest">Transaction Ref</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Type</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Amount</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                      <TableHead className="pr-8 text-right font-black text-[10px] uppercase tracking-widest">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-64 text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary/30 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx, idx) => {
                        const status = getStatusConfig(tx.status);
                        return (
                          <TableRow key={tx.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors h-20">
                            <TableCell className="pl-8">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 truncate max-w-[180px]">{tx.description || tx.id}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                  {new Date(tx.createdAt).toLocaleDateString()} • {tx.id.substring(0, 8)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {getTypeBadge(tx.type)}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={cn(
                                "text-lg font-black",
                                tx.type === 'CREDIT' || tx.type === 'DEPOSIT' ? "text-emerald-600" : "text-slate-900"
                              )}>
                                {tx.type === 'DEBIT' ? '-' : '+'} ₹{tx.amount.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border-none", status.color)}>
                                <status.icon className="h-3 w-3 mr-1" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="pr-8 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {tx.status === 'FAILED' && (
                                  <Button 
                                    size="sm" 
                                    className="rounded-lg font-bold h-8 bg-red-500 hover:bg-red-600 text-white px-3"
                                    onClick={() => { setSelectedTx(tx); setIsManualPayoutOpen(true); }}
                                  >
                                    Retry Payout
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-300">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                              <Wallet className="h-8 w-8 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions recorded</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Ops */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Reconciliation Summary */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Audit Integrity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                { label: 'Escrow Coverage', status: 'MATCHED', desc: 'All active campaigns have 100% funded holds.' },
                { label: 'Payout Latency', status: 'OPTIMAL', desc: 'Average clearing time is 42 hours.' },
                { label: 'Failed Rate', status: 'LOW (0.2%)', desc: '2 bank settlements require manual intervention.' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-slate-400 uppercase tracking-widest">{item.label}</span>
                    <span className="text-emerald-600">{item.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  <Separator className="opacity-50" />
                </div>
              ))}
            </CardContent>
            <CardFooter className="p-4 bg-slate-50/30 border-t flex justify-center">
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-primary hover:bg-primary/5">
                Full Reconciliation Report
              </Button>
            </CardFooter>
          </Card>

          {/* Tax & Compliance Banner */}
          <Card className="border-none shadow-xl shadow-primary/10 rounded-3xl overflow-hidden bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <FileText className="h-16 w-16" />
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">Fiscal Compliance</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  GST invoices for July have been generated for all 156 active brands. Payout tax data is ready for export.
                </p>
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 text-[10px] uppercase tracking-widest shadow-lg">
                Generate Tax Package
              </Button>
            </CardContent>
          </Card>

          {/* Quick Config */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2">Treasury Controls</h4>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 rounded-[1.5rem] flex flex-col gap-2 font-black text-[10px] uppercase tracking-tighter bg-white border-slate-200">
                <Settings className="h-5 w-5 text-slate-400" /> Fee Setup
              </Button>
              <Button variant="outline" className="h-20 rounded-[1.5rem] flex flex-col gap-2 font-black text-[10px] uppercase tracking-tighter bg-white border-slate-200">
                <RefreshCcw className="h-5 w-5 text-emerald-500" /> Auto-Sweep
              </Button>
            </div>
          </div>

        </aside>
      </div>

      {/* Manual Payout Dialog */}
      <Dialog open={isManualPayoutOpen} onOpenChange={setIsManualPayoutOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-lg border-none shadow-2xl">
          <DialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <IndianRupee className="h-6 w-6 text-emerald-600" />
            </div>
            <DialogTitle className="text-2xl font-black">Authorize Manual Payout</DialogTitle>
            <DialogDescription>Bypass automated gateway errors and mark this payout as cleared. Use only after verifying bank receipt.</DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 p-6 rounded-2xl my-6 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-400">Amount</span>
              <span className="text-lg font-black text-slate-900">₹{selectedTx?.amount.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-400">User ID</span>
              <span className="font-mono text-xs">{selectedTx?.userId}</span>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsManualPayoutOpen(false)}>Cancel</Button>
            <Button 
              disabled={isProcessing}
              onClick={handleManualPayout}
              className="rounded-xl font-black px-8 bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm & Release Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
