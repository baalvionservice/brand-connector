'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  IndianRupee, 
  History, 
  Plus, 
  ShieldCheck, 
  Loader2,
  ChevronRight,
  MoreHorizontal,
  Download,
  Building2,
  Zap,
  Check
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock Transaction Data
const MOCK_TRANSACTIONS = [
  { id: 'tx_1', date: '2024-07-15', campaign: 'AI Smart Home Review', amount: 45000, status: 'COMPLETED', type: 'CREDIT', brand: 'Lumina Tech' },
  { id: 'tx_2', date: '2024-07-10', campaign: 'Withdrawal to Bank', amount: 25000, status: 'COMPLETED', type: 'DEBIT', bank: 'HDFC Bank ****4242' },
  { id: 'tx_3', date: '2024-07-05', campaign: 'Sustainable Summer Reel', amount: 12500, status: 'PENDING', type: 'CREDIT', brand: 'EcoVibe' },
  { id: 'tx_4', date: '2024-06-28', campaign: 'Night Recovery Launch', amount: 35000, status: 'COMPLETED', type: 'CREDIT', brand: 'Azure Skincare' },
  { id: 'tx_5', date: '2024-06-20', campaign: 'Withdrawal to UPI', amount: 10000, status: 'COMPLETED', type: 'DEBIT', upi: 'sarah@okaxis' },
];

export default function CreatorWalletPage() {
  const { toast } = useToast();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'input' | 'processing' | 'success'>('input');
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('upi');

  const stats = {
    available: 62500,
    pending: 12500,
    total: 422500
  };

  const handleWithdrawSubmit = () => {
    if (!amount || Number(amount) <= 0) {
      return toast({ variant: 'destructive', title: 'Invalid amount', description: 'Please enter a valid amount to withdraw.' });
    }
    if (Number(amount) > stats.available) {
      return toast({ variant: 'destructive', title: 'Insufficient balance', description: 'You cannot withdraw more than your available balance.' });
    }

    setWithdrawStep('processing');
    
    // Simulate API delay
    setTimeout(() => {
      setWithdrawStep('success');
      toast({
        title: "Payout Initiated",
        description: `₹${amount} is being transferred to your ${payoutMethod.toUpperCase()} account.`,
      });
    }, 3000);
  };

  const resetWithdrawFlow = () => {
    setIsWithdrawModalOpen(false);
    setTimeout(() => {
      setWithdrawStep('input');
      setAmount('');
    }, 300);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Financial Wallet</h1>
          <p className="text-slate-500 mt-1">Manage your earnings, payouts, and campaign financial security.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold bg-white">
            <Download className="h-4 w-4 mr-2" />
            Statements
          </Button>
          
          <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 h-11 px-6">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] p-0 overflow-hidden border-none max-w-md">
              <AnimatePresence mode="wait">
                {withdrawStep === 'input' && (
                  <motion.div 
                    key="input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8"
                  >
                    <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-black">Withdraw Funds</DialogTitle>
                      <DialogDescription>Transfer your available balance to your bank or UPI.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="font-bold">Amount to Withdraw</Label>
                          <span className="text-[10px] font-black text-primary uppercase">Max: ₹{stats.available.toLocaleString()}</span>
                        </div>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                          <Input 
                            type="number" 
                            placeholder="5,000" 
                            className="pl-10 h-12 rounded-xl text-lg font-bold"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="font-bold">Select Payout Method</Label>
                        <RadioGroup defaultValue="upi" onValueChange={setPayoutMethod} className="grid grid-cols-2 gap-3">
                          <div>
                            <RadioGroupItem value="upi" id="upi-method" className="peer sr-only" />
                            <Label htmlFor="upi-method" className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                              <Zap className="h-5 w-5 text-primary mb-1" />
                              <span className="text-xs font-bold">UPI ID</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="bank" id="bank-method" className="peer sr-only" />
                            <Label htmlFor="bank-method" className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                              <Building2 className="h-5 w-5 text-emerald-600 mb-1" />
                              <span className="text-xs font-bold">Bank A/C</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border text-[10px] text-slate-500 leading-relaxed italic">
                        "Funds will be credited within 2-4 working hours."
                      </div>

                      <Button onClick={handleWithdrawSubmit} className="w-full h-12 rounded-xl font-bold shadow-xl shadow-primary/20">
                        Confirm Withdrawal
                      </Button>
                    </div>
                  </motion.div>
                )}

                {withdrawStep === 'processing' && (
                  <motion.div 
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 flex flex-col items-center text-center space-y-6"
                  >
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                      <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black">Securing Transaction</h3>
                      <p className="text-sm text-slate-500">Verifying your identity and checking gateway availability...</p>
                    </div>
                  </motion.div>
                )}

                {withdrawStep === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 flex flex-col items-center text-center space-y-6"
                  >
                    <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black">Request Sent!</h3>
                      <p className="text-sm text-slate-500">Your payout request for <span className="font-bold text-slate-900">₹{amount}</span> has been queued. Check your registered {payoutMethod.toUpperCase()} shortly.</p>
                    </div>
                    <Button onClick={resetWithdrawFlow} variant="outline" className="w-full rounded-xl font-bold border-slate-200">
                      Close
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-slate-950 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Available Balance</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">₹{stats.available.toLocaleString()}</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[10px]">+15%</Badge>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-4 flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              Funds fully cleared and ready for payout
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Pending Clearance</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">₹{stats.pending.toLocaleString()}</span>
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                <span>Escrow Progress</span>
                <span>In Review</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-orange-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Lifetime Earned</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-primary">₹{stats.total.toLocaleString()}</span>
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-primary font-bold leading-relaxed">
                You're in the top 5% of creators this month! Keep up the quality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Transaction History
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white rounded-xl h-8 px-3 font-bold border-slate-200">
              All Types
            </Badge>
            <Badge variant="outline" className="bg-white rounded-xl h-8 px-3 font-bold border-slate-200">
              Last 30 Days
            </Badge>
          </div>
        </div>

        <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 pl-8">Date</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Details</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Type</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Amount</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 text-right pr-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id} className="group hover:bg-slate-50 transition-colors border-slate-50 h-20">
                    <TableCell className="pl-8">
                      <span className="text-sm font-bold text-slate-500">
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{tx.campaign}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {tx.brand || tx.bank || tx.upi}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.type === 'CREDIT' ? (
                          <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                            <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
                            <ArrowUpRight className="h-4 w-4 text-orange-600" />
                          </div>
                        )}
                        <span className={cn(
                          "text-[10px] font-black uppercase",
                          tx.type === 'CREDIT' ? "text-emerald-600" : "text-orange-600"
                        )}>
                          {tx.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-lg font-black",
                        tx.type === 'CREDIT' ? "text-emerald-600" : "text-slate-900"
                      )}>
                        {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn(
                        "font-black text-[9px] uppercase border-none px-3 py-1 rounded-full",
                        tx.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"
                      )}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-slate-50/50 p-6 flex justify-center border-t border-slate-50">
            <Button variant="ghost" className="text-slate-400 font-bold text-xs hover:text-primary rounded-xl">
              Load More History
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Financial Security Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex items-start gap-6 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Escrow Protected</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every campaign payment is secured in Baalvion Escrow before you start work. Your efforts are guaranteed to be compensated upon approval.
            </p>
          </div>
        </div>
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex items-start gap-6 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Clearing Period</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Funds clear 48 hours after brand approval to ensure compliance and quality. Once cleared, they move to your "Available" balance instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
