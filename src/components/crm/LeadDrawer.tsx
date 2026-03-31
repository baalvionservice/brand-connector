
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Building2, 
  Mail, 
  Instagram, 
  Globe, 
  Zap, 
  Clock, 
  MessageSquare, 
  Send, 
  UserPlus, 
  ArrowUpRight,
  TrendingUp,
  History,
  CheckCircle2,
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';
import { useLeadStore } from '@/store/useLeadStore';
import { LeadStatus } from '@/types/crm';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export function LeadDrawer() {
  const { 
    selectedLead, 
    selectedLeadNotes, 
    detailsLoading, 
    selectLead, 
    updateLead, 
    addNote, 
    convertLead 
  } = useLeadStore();
  const { toast } = useToast();
  
  const [noteText, setNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleStatusChange = (status: LeadStatus) => {
    if (!selectedLead) return;
    updateLead(selectedLead.id, { status });
    toast({ title: "Status Updated", description: `Lead marked as ${status}` });
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedLead) return;
    
    setIsSubmittingNote(true);
    try {
      await addNote(selectedLead.id, noteText);
      setNoteText('');
      toast({ title: "Note Added" });
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleConvert = async () => {
    if (!selectedLead) return;
    setIsConverting(true);
    try {
      await convertLead(selectedLead.id);
      toast({ title: "Conversion Successful!", description: `${selectedLead.companyName} is now a platform brand.` });
    } finally {
      setIsConverting(false);
    }
  };

  if (!selectedLead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => selectLead(null)}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-100"
      >
        {/* Header */}
        <header className="p-8 border-b bg-slate-50/50 flex flex-col gap-6 shrink-0">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase h-6 px-3">
              CRM Detail View
            </Badge>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white" onClick={() => selectLead(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center shrink-0">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 truncate">
                {selectedLead.companyName}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold text-[9px] uppercase">{selectedLead.niche}</Badge>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  Score: <span className="font-black text-slate-900">{selectedLead.score}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select value={selectedLead.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200 font-bold text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['new', 'contacted', 'replied', 'booked', 'closed', 'lost'].map(s => (
                  <SelectItem key={s} value={s} className="font-bold uppercase text-[10px]">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              disabled={isConverting || selectedLead.status === 'closed'} 
              onClick={handleConvert}
              className="rounded-xl font-black h-11 shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isConverting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              Convert to Brand
            </Button>
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-8 space-y-10">
            {/* Score Breakdown */}
            {selectedLead.scoreBreakdown && (
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" /> AI Score Breakdown
                </h3>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-6">
                  {[
                    { label: 'Engagement', val: selectedLead.scoreBreakdown.engagement, max: 30 },
                    { label: 'Completeness', val: selectedLead.scoreBreakdown.completeness, max: 20 },
                    { label: 'Niche Value', val: selectedLead.scoreBreakdown.nicheValue, max: 30 },
                    { label: 'Activity', val: selectedLead.scoreBreakdown.activity, max: 20 }
                  ].map(item => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-500 uppercase">{item.label}</span>
                        <span className="text-slate-900">{item.val} / {item.max}</span>
                      </div>
                      <Progress value={(item.val / item.max) * 100} className="h-1" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Info Section */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contact & Reach</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">{selectedLead.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <a href={selectedLead.website} target="_blank" className="text-sm font-bold text-primary hover:underline truncate">{selectedLead.website || 'No website'}</a>
                </div>
              </div>
            </section>

            {/* Timeline/Notes Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                  <History className="h-3 w-3" /> Communication Logs
                </h3>
                <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-none font-bold text-[9px]">{selectedLeadNotes.length} Entries</Badge>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="relative">
                <Textarea 
                  placeholder="Log an interaction..." 
                  className="rounded-2xl min-h-[100px] bg-slate-50 border-none focus-visible:ring-primary p-5 pb-12 resize-none text-sm"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="absolute bottom-3 right-3">
                  <Button size="sm" type="submit" disabled={isSubmittingNote || !noteText.trim()} className="rounded-lg font-bold px-4 h-8">
                    {isSubmittingNote ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3 mr-1.5" />}
                    Log
                  </Button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-4">
                {selectedLeadNotes.map((note) => (
                  <div key={note.id} className="relative pl-6 last:after:hidden after:absolute after:left-0 after:top-2 after:bottom-0 after:w-px after:bg-slate-100">
                    <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-primary/20 ring-4 ring-white" />
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{note.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        <footer className="p-6 border-t bg-slate-50/50 flex items-center justify-center gap-2">
          <Clock className="h-3 w-3 text-slate-300" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Last Activity: {new Date(selectedLead.updatedAt).toLocaleDateString()}
          </span>
        </footer>
      </motion.div>
    </div>
  );
}
