
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  IndianRupee, 
  TrendingUp, 
  ChevronRight,
  Plus,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Trash2,
  PlusCircle,
  Building2,
  History,
  Zap,
  Star
} from 'lucide-react';
import { useProposalStore } from '@/store/useProposalStore';
import { Proposal, Deliverable, CreatorTier, DeliverableType } from '@/types/proposal';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function ProposalsPage() {
  const { proposals, loading, fetchProposals, selectedProposal, selectProposal, updateProposal, sendProposal, approveProposal, rejectProposal } = useProposalStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleUpdateDeliverable = (delId: string, updates: Partial<Deliverable>) => {
    if (!selectedProposal) return;
    const newDeliverables = selectedProposal.deliverables.map(d => d.id === delId ? { ...d, ...updates } : d);
    updateProposal(selectedProposal.id, { deliverables: newDeliverables });
  };

  const handleAddDeliverable = () => {
    if (!selectedProposal) return;
    const newDel: Deliverable = {
      id: 'd_' + Date.now(),
      type: 'reel',
      quantity: 1,
      creatorTier: 'mid',
      pricePerUnit: 0 // Backend will calculate
    };
    updateProposal(selectedProposal.id, { deliverables: [...selectedProposal.deliverables, newDel] });
  };

  const handleRemoveDeliverable = (delId: string) => {
    if (!selectedProposal) return;
    const newDeliverables = selectedProposal.deliverables.filter(d => d.id !== delId);
    updateProposal(selectedProposal.id, { deliverables: newDeliverables });
  };

  const handleStatusAction = async (action: 'send' | 'approve' | 'reject') => {
    if (!selectedProposal) return;
    try {
      if (action === 'send') await sendProposal(selectedProposal.id);
      if (action === 'approve') await approveProposal(selectedProposal.id);
      if (action === 'reject') await rejectProposal(selectedProposal.id);
      toast({ title: `Proposal ${action}ed` });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Action failed' });
    }
  };

  const filteredProposals = proposals.filter(p => 
    p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Proposal Generator
          </h1>
          <p className="text-slate-500 font-medium">Build, price, and finalize professional campaign contracts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search proposals..." 
              className="pl-10 h-11 rounded-xl bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Proposal Ledger */}
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100 h-16 bg-slate-50/30">
                <TableHead className="pl-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Account</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Deliverables</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Price Quote</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="pr-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Workspace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/30 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredProposals.map((prop) => (
                <TableRow key={prop.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors h-24">
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none">{prop.companyName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5">ID: {prop.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase px-2.5 h-5">
                      {prop.deliverables.reduce((acc, d) => acc + d.quantity, 0)} Assets
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-lg font-black text-slate-900">₹{prop.totalPrice.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border-none shadow-sm",
                      prop.status === 'approved' ? "bg-emerald-100 text-emerald-600" :
                      prop.status === 'sent' ? "bg-blue-100 text-blue-600" :
                      prop.status === 'rejected' ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {prop.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-xl font-bold h-10 px-4 bg-slate-50 text-slate-600 hover:text-primary transition-all"
                      onClick={() => selectProposal(prop)}
                    >
                      Configure <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Proposal Editor Drawer */}
      <AnimatePresence>
        {selectedProposal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
              onClick={() => selectProposal(null)}
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white z-[70] shadow-2xl flex flex-col border-l"
            >
              <header className="p-8 border-b bg-slate-50/50 space-y-6 shrink-0">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase h-6 px-3">
                    Pricing Workspace
                  </Badge>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => selectProposal(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-start gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 truncate">
                      {selectedProposal.companyName}
                    </h2>
                    <p className="text-sm font-bold text-slate-400">Reviewing commercial terms for campaign launch.</p>
                  </div>
                </div>
              </header>

              <ScrollArea className="flex-1">
                <div className="p-8 space-y-10">
                  {/* Deliverables Builder */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" /> Deliverables Matrix
                      </h3>
                      <Button variant="outline" size="sm" className="rounded-lg font-bold text-[10px] uppercase h-8" onClick={handleAddDeliverable}>
                        <PlusCircle className="h-3 w-3 mr-1.5" /> Add Row
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {selectedProposal.deliverables.map((del) => (
                        <div key={del.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4 group">
                          <div className="flex-1 space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Asset Type</label>
                            <Select value={del.type} onValueChange={(v: any) => handleUpdateDeliverable(del.id, { type: v })}>
                              <SelectTrigger className="h-10 bg-white border-none rounded-xl font-bold text-xs uppercase">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="reel" className="font-bold uppercase text-[10px]">Instagram Reel</SelectItem>
                                <SelectItem value="story" className="font-bold uppercase text-[10px]">Instagram Story</SelectItem>
                                <SelectItem value="instagram_post" className="font-bold uppercase text-[10px]">Static Post</SelectItem>
                                <SelectItem value="youtube_video" className="font-bold uppercase text-[10px]">YouTube Dedicated</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="w-32 space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Creator Tier</label>
                            <Select value={del.creatorTier} onValueChange={(v: any) => handleUpdateDeliverable(del.id, { creatorTier: v })}>
                              <SelectTrigger className="h-10 bg-white border-none rounded-xl font-bold text-xs uppercase">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="micro" className="font-bold uppercase text-[10px]">Micro</SelectItem>
                                <SelectItem value="mid" className="font-bold uppercase text-[10px]">Mid-Tier</SelectItem>
                                <SelectItem value="macro" className="font-bold uppercase text-[10px]">Macro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="w-20 space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Qty</label>
                            <Input 
                              type="number" 
                              value={del.quantity} 
                              onChange={(e) => handleUpdateDeliverable(del.id, { quantity: Number(e.target.value) })}
                              className="h-10 bg-white border-none rounded-xl font-black text-center"
                            />
                          </div>

                          <Button variant="ghost" size="icon" className="mt-5 rounded-full text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" onClick={() => handleRemoveDeliverable(del.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Pricing Summary */}
                  <section className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                      <IndianRupee className="h-3 w-3" /> Pricing Engine Recap
                    </h3>
                    <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white space-y-6">
                      {selectedProposal.pricingBreakdown.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className={cn("text-sm font-bold", item.label === 'Subtotal' ? "text-slate-400" : "text-primary")}>
                            {item.label}
                          </span>
                          <span className="font-black">₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <Separator className="bg-white/10" />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-black uppercase tracking-widest">Total Quote</span>
                        <span className="text-4xl font-black text-emerald-400 tracking-tighter">₹{selectedProposal.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </ScrollArea>

              <footer className="p-8 border-t bg-slate-50/50 flex items-center gap-3 shrink-0">
                <Button variant="ghost" className="rounded-xl font-bold h-12 px-6" onClick={() => handleStatusAction('reject')}>Reject</Button>
                <div className="flex-1" />
                <Button variant="outline" className="rounded-xl font-bold h-12 px-8 bg-white border-slate-200" onClick={() => handleStatusAction('approve')}>
                  Simulate Client Approval
                </Button>
                <Button className="rounded-xl font-black h-12 px-10 shadow-xl shadow-primary/20" onClick={() => handleStatusAction('send')}>
                  <Send className="h-4 w-4 mr-2" /> Dispatch Proposal
                </Button>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
