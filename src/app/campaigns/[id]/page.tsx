'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Calendar, 
  IndianRupee, 
  Clock, 
  Target, 
  Info, 
  ShieldCheck, 
  FileText, 
  Users, 
  ThumbsUp, 
  ThumbsDown,
  ChevronRight,
  Send,
  Star,
  Globe
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Mock data for a specific campaign
const MOCK_CAMPAIGN = {
  id: '1',
  brand: {
    name: 'Lumina Tech',
    logo: 'https://picsum.photos/seed/lumina/200/200',
    isVerified: true,
    industry: 'Consumer Electronics & AI',
    website: 'https://lumina.tech',
    location: 'San Francisco, CA'
  },
  title: 'AI Smart Home Ecosystem Review',
  description: 'We are looking for tech-savvy creators to do a deep-dive review of our new "Lumina Hub" ecosystem. The focus should be on how AI automates daily routines and saves energy.',
  budget: '₹45,000',
  deadline: 'July 28, 2024',
  startDate: 'July 15, 2024',
  spots: 3,
  applicantsCount: 42,
  matchScore: 98,
  niche: 'Tech & Gadgets',
  objectives: [
    'Demonstrate the seamless integration of Lumina Hub with existing appliances.',
    'Highlight the AI "Energy Save" mode which reduces bills by up to 20%.',
    'Drive high-quality traffic to the Lumina product page.'
  ],
  guidelines: [
    'The video must be at least 8 minutes long.',
    'Focus on natural, high-aesthetic home settings.',
    'Show the mobile app interface clearly.',
    'The community posts should feature the hardware in a minimalist lifestyle setting.'
  ],
  dos: [
    'Mention the energy-saving benefits twice.',
    'Use the hashtag #LuminaAI and #SmartHomeReview.',
    'Include the custom discount code provided in your description.'
  ],
  donts: [
    'Do not mention competitors by name.',
    'Do not use excessive filters or unnatural lighting.',
    'Avoid jargon; explain things for a general audience.'
  ],
  deliverables: [
    { title: 'Dedicated YouTube Review', desc: 'Detailed unboxing and setup (8-12 mins)' },
    { title: 'Community Post - Teaser', desc: 'Hardware aesthetic shot with engagement poll' },
    { title: 'Community Post - Follow-up', desc: 'Direct link to store with discount code' }
  ]
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSaving] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsApplied(true);
      toast({
        title: "Application Sent!",
        description: "Lumina Tech has been notified of your interest.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="container h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={MOCK_CAMPAIGN.brand.logo} />
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter leading-none">Campaign Detail</p>
                <h1 className="text-sm font-bold text-slate-900 leading-tight truncate max-w-[200px] md:max-w-md">
                  {MOCK_CAMPAIGN.title}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex rounded-xl font-bold border-slate-200">
              Save for Later
            </Button>
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      <main className="container mt-8 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Brief & Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Brief Card */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 md:p-10 bg-slate-50/50 border-b">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none font-bold">
                      {MOCK_CAMPAIGN.niche}
                    </Badge>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50/50 font-bold">
                      Active
                    </Badge>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                    {MOCK_CAMPAIGN.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage src={MOCK_CAMPAIGN.brand.logo} />
                      </Avatar>
                      <span className="font-bold text-slate-900">{MOCK_CAMPAIGN.brand.name}</span>
                      {MOCK_CAMPAIGN.brand.isVerified && <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500/10" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> {MOCK_CAMPAIGN.brand.location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Budget</p>
                    <p className="text-3xl font-black text-primary">{MOCK_CAMPAIGN.budget}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 md:p-10 space-y-10">
              {/* Objective */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> Campaign Objective
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {MOCK_CAMPAIGN.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {MOCK_CAMPAIGN.objectives.map((obj, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-xs font-black text-primary shadow-sm border border-slate-100 shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Guidelines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-emerald-500" /> Content Dos
                  </h3>
                  <ul className="space-y-3">
                    {MOCK_CAMPAIGN.dos.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm font-medium text-slate-600">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-red-600">
                    <ThumbsDown className="h-5 w-5" /> Content Don'ts
                  </h3>
                  <ul className="space-y-3">
                    {MOCK_CAMPAIGN.donts.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm font-medium text-slate-600">
                        <div className="h-5 w-5 rounded-full border-2 border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Required Deliverables */}
              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Required Deliverables
                </h3>
                <div className="space-y-3">
                  {MOCK_CAMPAIGN.deliverables.map((del, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 bg-white hover:border-primary/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                          <CheckCircle2 className="h-6 w-6 text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{del.title}</p>
                          <p className="text-xs text-slate-500 font-medium">{del.desc}</p>
                        </div>
                      </div>
                      <Badge className="bg-slate-100 text-slate-500 border-none font-bold uppercase text-[9px] py-0 px-2 h-5">Pending</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          {!isApplied ? (
            <Card className="border-none shadow-xl shadow-primary/10 rounded-[2rem] overflow-hidden bg-white ring-1 ring-primary/20">
              <CardHeader className="p-8 md:p-10 border-b bg-primary/5">
                <CardTitle className="text-2xl">Submit Application</CardTitle>
                <CardDescription>Tell the brand why you're the perfect fit for this campaign.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleApply} className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Your Creative Pitch</Label>
                    <Textarea 
                      placeholder="Share your vision. How will you make this hardware look exciting? What's your unique hook?"
                      className="min-h-[180px] rounded-2xl p-6 resize-none bg-slate-50 border-slate-200 focus-visible:ring-primary text-lg"
                      required
                    />
                    <p className="text-xs text-slate-400 font-medium">Tip: Brands love when you mention specific scenes or audience demographics.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-lg font-bold">Proposed Rate</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                        <Input 
                          placeholder="45,000" 
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-200 text-lg font-black"
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Standard budget for this job is {MOCK_CAMPAIGN.budget}.</p>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-lg font-bold">Estimated Timeline</Label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                        <Input 
                          placeholder="e.g. 10 days from receipt of hub" 
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-200 text-lg font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {isSubmitting ? (
                        <><Zap className="mr-2 h-6 w-6 animate-bounce" /> Sending to Lumina Tech...</>
                      ) : (
                        <><Send className="mr-2 h-6 w-6" /> Submit Application</>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="p-8 pt-0 flex justify-center border-t bg-slate-50/50 py-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Verified Secure Proposal
                </div>
              </CardFooter>
            </Card>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-[2.5rem] bg-emerald-50 border-2 border-emerald-100 flex flex-col items-center text-center space-y-6"
            >
              <div className="h-24 w-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-200">
                <CheckCircle2 className="h-14 w-14 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-emerald-900">Application Received!</h2>
                <p className="text-emerald-700 font-medium text-lg max-w-md">
                  We've sent your proposal to Lumina Tech. They usually respond to tech reviews within 48 hours.
                </p>
              </div>
              <Button variant="outline" className="rounded-xl font-bold bg-white border-emerald-200 text-emerald-700 h-12 px-8 hover:bg-emerald-100" onClick={() => router.push('/dashboard/creator')}>
                Back to Dashboard
              </Button>
            </motion.div>
          )}
        </div>

        {/* Right Column: Contextual Info */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Match Breakdown */}
          <Card className="border-none shadow-xl shadow-primary/10 rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-indigo-700 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                </div>
                <Badge className="bg-white/20 text-white border-none backdrop-blur-md font-bold">SMART MATCH</Badge>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Campaign Fit Score</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-5xl font-black">{MOCK_CAMPAIGN.matchScore}%</h4>
                  <span className="text-sm font-bold text-white/80">Excellent</span>
                </div>
                <Progress value={MOCK_CAMPAIGN.matchScore} className="h-2 bg-white/20" />
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">Your "Smart Home" niche tag perfectly overlaps with campaign requirements.</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">Lumina Tech prioritizes YouTube creators with >5% Engagement Rate (You have 5.8%).</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline & Stats */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Campaign Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Applications Open</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">July 01, 2024</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Review Deadline</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">{MOCK_CAMPAIGN.deadline}</p>
                  </div>
                </div>
                <Badge className="bg-red-50 text-red-600 border-none font-bold text-[9px] px-2 h-5">Closing Soon</Badge>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">Total Applicants</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{MOCK_CAMPAIGN.applicantsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">Spots Remaining</span>
                  </div>
                  <span className="text-sm font-black text-primary">{MOCK_CAMPAIGN.spots}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Applicants (Anonymous) */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-6 border-b bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Who's Applying</CardTitle>
              <Users className="h-4 w-4 text-slate-300" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-200 text-[10px] font-black">PRO</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Verified Creator</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{i * 4}5k+ Followers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-2 w-2 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-[9px] font-black text-emerald-600 uppercase">90%+ Match</p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-[10px] text-center text-slate-400 font-medium italic">Competition is moderate for this campaign.</p>
              </div>
            </CardContent>
          </Card>

          {/* Help Center */}
          <div className="p-6 rounded-3xl bg-white border border-dashed border-slate-300 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Info className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase">Need help with your pitch?</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Our support team is available 24/7 to help you refine your proposal strategy.
              </p>
            </div>
            <Button variant="link" className="text-xs font-bold text-primary h-auto p-0">Visit Creator Hub</Button>
          </div>

        </div>
      </main>
    </div>
  );
}
