'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Download, 
  ArrowUpRight, 
  ShieldCheck, 
  Info, 
  AlertCircle,
  FileText,
  ChevronRight,
  Loader2,
  Trash2,
  X,
  History,
  Building2,
  Star,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFirestore, useDoc } from '@/firebase';
import { BrandProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { subscribeToPlan, cancelSubscription, PlanType, PLAN_LIMITS } from '@/lib/subscriptions';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock Invoice Data
const MOCK_INVOICES = [
  { id: 'INV-2024-001', date: '2024-07-01', amount: 9999, status: 'PAID', plan: 'Growth Plan' },
  { id: 'INV-2024-002', date: '2024-06-01', amount: 9999, status: 'PAID', plan: 'Growth Plan' },
  { id: 'INV-2024-003', date: '2024-05-01', amount: 9999, status: 'PAID', plan: 'Growth Plan' },
  { id: 'INV-2024-004', date: '2024-04-01', amount: 0, status: 'PAID', plan: 'Starter Plan' },
];

const PLAN_FEATURES = {
  STARTER: ["1 Active Campaign", "Basic AI Matching", "Standard Support"],
  GROWTH: ["5 Active Campaigns", "Advanced AI Insights", "Priority Support", "Team Access (3 seats)"],
  ENTERPRISE: ["Unlimited Campaigns", "White-label Analytics", "Dedicated Manager", "API Access"]
};

export default function BrandBillingPage() {
  const { userProfile } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  const brandId = userProfile?.id ? `brand_${userProfile.id}` : null;
  const { data: brand, loading } = useDoc<BrandProfile>(brandId ? `brands/${brandId}` : null);

  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [showRetention, setShowRetention] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Usage Mock (In a real app, calculate from Firestore queries)
  const usage = {
    campaigns: { used: 3, limit: brand?.plan === 'GROWTH' ? 5 : brand?.plan === 'STARTER' ? 1 : 100 },
    creators: { used: 12, limit: brand?.plan === 'GROWTH' ? 25 : brand?.plan === 'STARTER' ? 5 : 500 }
  };

  const handleUpdatePayment = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsUpdateCardOpen(false);
      toast({ title: "Payment method updated", description: "Your card ending in 4242 has been saved." });
    }, 1500);
  };

  const handlePlanChange = async (newPlan: PlanType) => {
    if (!brandId) return;
    setIsProcessing(true);

    try {
      await subscribeToPlan(db, brandId, newPlan);
      toast({ title: `Switched to ${newPlan}`, description: "Your billing will be adjusted from the next cycle." });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!brandId) return;
    setIsProcessing(true);

    try {
      await cancelSubscription(db, brandId);
      setIsCancelOpen(false);
      setShowRetention(false);
      toast({ title: "Subscription scheduled for cancellation", description: "You will have access until the end of the period." });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const currentPlanLimits = PLAN_LIMITS[brand?.plan || 'STARTER'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription & Billing</h1>
          <p className="text-slate-500 font-medium">Manage your corporate plan, payment methods, and invoice history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn(
            "px-4 py-2 rounded-xl border-none font-black text-[10px] tracking-widest uppercase shadow-sm",
            brand?.subscriptionStatus === 'ACTIVE' ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-600"
          )}>
            {brand?.subscriptionStatus || 'ACCOUNT ACTIVE'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Plan & Usage */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Current Plan Card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-100">
            <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-xl">Active Subscription</CardTitle>
                  <Badge className="bg-primary text-white border-none font-black text-[9px] uppercase tracking-tighter">
                    {brand?.plan || 'GROWTH'} PLAN
                  </Badge>
                </div>
                <CardDescription>
                  {brand?.cancelAtPeriodEnd 
                    ? `Expiring on ${new Date(brand.currentPeriodEnd!).toLocaleDateString()}` 
                    : `Renews on ${new Date(brand?.currentPeriodEnd || Date.now() + 864000000).toLocaleDateString()} for ₹${currentPlanLimits.monthlyPrice.toLocaleString()}/mo.`}
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary fill-primary/20" />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Features</p>
                  <ul className="space-y-3">
                    {PLAN_FEATURES[brand?.plan || 'GROWTH'].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Usage</p>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-500">
                        <span>Active Campaigns</span>
                        <span>{usage.campaigns.used} / {currentPlanLimits.maxCampaigns}</span>
                      </div>
                      <Progress value={(usage.campaigns.used / currentPlanLimits.maxCampaigns) * 100} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-500">
                        <span>Team Access</span>
                        <span>1 / {currentPlanLimits.maxTeamMembers} Seats</span>
                      </div>
                      <Progress value={(1 / currentPlanLimits.maxTeamMembers) * 100} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 bg-slate-50/30 border-t flex flex-wrap gap-4">
              {brand?.plan !== 'ENTERPRISE' && (
                <Button 
                  onClick={() => handlePlanChange('ENTERPRISE')} 
                  disabled={isProcessing}
                  className="rounded-xl font-bold h-11 px-8 shadow-lg shadow-primary/20"
                >
                  Upgrade to Enterprise
                </Button>
              )}
              {brand?.plan === 'STARTER' && (
                <Button 
                  onClick={() => handlePlanChange('GROWTH')} 
                  disabled={isProcessing}
                  className="rounded-xl font-bold h-11 px-8 shadow-lg shadow-primary/20"
                >
                  Switch to Growth
                </Button>
              )}
              {brand?.plan !== 'STARTER' && (
                <Button 
                  variant="outline" 
                  onClick={() => handlePlanChange('STARTER')} 
                  disabled={isProcessing}
                  className="rounded-xl font-bold h-11 px-8 bg-white border-slate-200"
                >
                  Switch to Starter
                </Button>
              )}
              {!brand?.cancelAtPeriodEnd && brand?.plan !== 'STARTER' && (
                <Button variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold ml-auto" onClick={() => setIsCancelOpen(true)}>
                  Cancel Subscription
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Invoice History */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 px-2">
              <History className="h-5 w-5 text-primary" />
              Invoice History
            </h2>
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-100 h-14">
                      <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Invoice ID</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Date</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Plan</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Amount</TableHead>
                      <TableHead className="pr-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_INVOICES.map((inv) => (
                      <TableRow key={inv.id} className="group hover:bg-slate-50 transition-colors border-slate-50 h-16">
                        <TableCell className="pl-8 font-bold text-slate-900">{inv.id}</TableCell>
                        <TableCell className="text-sm font-medium text-slate-500">
                          {new Date(inv.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase">{inv.plan}</Badge>
                        </TableCell>
                        <TableCell className="font-black text-slate-900">₹{inv.amount.toLocaleString()}</TableCell>
                        <TableCell className="pr-8 text-right">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-primary hover:bg-primary/5 group-hover:opacity-100 transition-all">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: Payment Methods & Help */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Payment Method Card */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Payment Method</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-primary hover:bg-primary/5" onClick={() => setIsUpdateCardOpen(true)}>
                Change
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 bg-white">
                <div className="h-10 w-14 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 leading-none">Visa •••• 4242</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">Expires 12/26</p>
                </div>
                <div className="ml-auto">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-4">
                Primary card used for subscription and initial escrow funding.
              </p>
            </CardContent>
          </Card>

          {/* Upgrade Banner */}
          <Card className="border-none shadow-xl shadow-primary/10 rounded-3xl overflow-hidden bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Star className="h-16 w-16" />
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">Strategic Partner</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Switch to **Enterprise** to unlock white-label reports, dedicated account managers, and custom contract templates.
                </p>
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 text-[10px] uppercase tracking-widest shadow-lg">
                View Enterprise Benefits
              </Button>
            </CardContent>
          </Card>

          {/* Help Center */}
          <div className="p-6 rounded-3xl bg-white border border-dashed border-slate-300 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
              <Info className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase">Billing Questions?</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Our accounts team is available 24/7 to help with invoicing, GST compliance, and corporate discounts.
              </p>
            </div>
            <Button variant="link" className="text-xs font-bold text-primary h-auto p-0">Contact Accounts</Button>
          </div>
        </aside>
      </div>

      {/* UPDATE PAYMENT DIALOG */}
      <Dialog open={isUpdateCardOpen} onOpenChange={setIsUpdateCardOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-lg border-none shadow-2xl">
          <DialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-black">Update Card</DialogTitle>
            <DialogDescription>Add a new primary card for subscription billing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Cardholder Name</Label>
              <Input placeholder="Lumina Tech Inc." className="h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary font-medium" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input placeholder="0000 0000 0000 0000" className="pl-10 h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Expiry</Label>
                <Input placeholder="MM / YY" className="h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">CVC</Label>
                <Input placeholder="•••" className="h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
              onClick={handleUpdatePayment}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Confirm & Save Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CANCELLATION DIALOG */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent className="rounded-[2.5rem] p-0 overflow-hidden border-none max-w-lg shadow-2xl">
          <AnimatePresence mode="wait">
            {!showRetention ? (
              <motion.div key="cancel-initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 space-y-8">
                <DialogHeader className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <DialogTitle className="text-2xl font-black">Cancel Subscription?</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium">
                    We're sad to see you go. You'll lose access to advanced AI matching and campaign resource limits.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-slate-300 shrink-0" />
                    <p className="text-xs text-slate-500 font-medium">Your current campaign data will be preserved, but you won't be able to launch new projects.</p>
                  </div>
                  <Button variant="ghost" className="w-full h-12 rounded-xl font-bold text-slate-400" onClick={() => setIsCancelOpen(false)}>I'll stay for now</Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-red-100 text-red-500 hover:bg-red-50" onClick={() => setShowRetention(true)}>Proceed to Cancel</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="retention" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 space-y-8">
                <DialogHeader className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <DialogTitle className="text-2xl font-black">Wait! Don't go empty-handed.</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium">
                    We'd love to keep supporting your brand growth. Here's an exclusive offer for you:
                  </DialogDescription>
                </DialogHeader>
                
                <div className="bg-primary p-8 rounded-[2rem] text-center text-white relative overflow-hidden group">
                  <Sparkles className="absolute -top-4 -right-4 h-20 w-20 text-white/10 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Retention Exclusive</p>
                  <h4 className="text-4xl font-black mt-2">50% OFF</h4>
                  <p className="text-sm font-medium mt-1">FOR THE NEXT 3 MONTHS</p>
                  <Button className="mt-6 w-full bg-white text-primary hover:bg-slate-100 font-black rounded-xl h-12">
                    Claim Discount & Stay
                  </Button>
                </div>

                <div className="text-center">
                  <button 
                    onClick={handleCancel}
                    disabled={isProcessing}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest underline underline-offset-4"
                  >
                    {isProcessing ? 'Processing...' : 'No thanks, continue with cancellation'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
