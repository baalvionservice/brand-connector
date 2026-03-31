
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  LayoutGrid, 
  Target, 
  Info, 
  CheckCircle2,
  Loader2,
  Zap,
  Save,
  Users,
  Search,
  Check,
  Calendar as CalendarIcon,
  IndianRupee,
  CreditCard,
  Building2,
  TrendingUp,
  Clock
} from 'lucide-react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { CampaignStatus } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CREATOR_NICHES } from '@/constants';
import { format } from "date-fns";

// Step 1 Schema
const campaignBasicsSchema = z.object({
  title: z.string().min(5, "Campaign title must be at least 5 characters").max(100, "Too long"),
  objective: z.string().min(1, "Objective is required"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  contentType: z.string().min(1, "Content type is required"),
  description: z.string().min(50, "Brief must be at least 50 characters").max(5000, "Brief too long"),
});

// Step 2 Schema
const creatorRequirementsSchema = z.object({
  creatorTier: z.enum(["NANO", "MICRO", "MID", "MACRO"]),
  minFollowers: z.number().min(0),
  maxFollowers: z.number().min(0),
  minEngagementRate: z.number().min(0).max(100),
  niches: z.array(z.string()).min(1, "Select at least one niche"),
  targetLocations: z.array(z.string()).min(1, "Select at least one location"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  audienceAgeMin: z.number().min(13),
  audienceAgeMax: z.number().min(13),
  audienceGender: z.enum(["ALL", "MALE", "FEMALE"]),
  minPosts: z.number().min(1),
  isExclusive: z.boolean(),
});

// Step 3 Schema
const budgetTimelineSchema = z.object({
  totalBudget: z.number().min(500, "Total budget must be at least ₹500"),
  budgetPerCreator: z.array(z.number()).length(2),
  paymentMethod: z.enum(["UPI", "CARD", "BANK"]),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  applicationDeadline: z.date({ required_error: "Application deadline is required" }),
  submissionDeadline: z.date({ required_error: "Submission deadline is required" }),
  postLiveDate: z.date({ required_error: "Post live date is required" }),
});

type CampaignBasicsValues = z.infer<typeof campaignBasicsSchema>;
type CreatorRequirementsValues = z.infer<typeof creatorRequirementsSchema>;
type BudgetTimelineValues = z.infer<typeof budgetTimelineSchema>;

const STEPS = [
  { id: 1, title: 'Basics', icon: LayoutGrid },
  { id: 2, title: 'Audience', icon: Target },
  { id: 3, title: 'Budget', icon: Sparkles },
  { id: 4, title: 'Review', icon: CheckCircle2 },
];

const OBJECTIVES = [
  { id: 'AWARENESS', label: 'Brand Awareness', desc: 'Reach as many people as possible.' },
  { id: 'ENGAGEMENT', label: 'Engagement', desc: 'Get likes, comments, and shares.' },
  { id: 'CONVERSIONS', label: 'Conversions', desc: 'Drive sales or sign-ups.' },
  { id: 'CONTENT', label: 'Content Creation', desc: 'Get high-quality raw assets.' },
];

const TIERS = [
  { id: 'NANO', label: 'Nano', range: '< 10k', desc: 'Hyper-engaged micro communities.' },
  { id: 'MICRO', label: 'Micro', range: '10k - 50k', desc: 'Niche authority & trust.' },
  { id: 'MID', label: 'Mid-Tier', range: '50k - 500k', desc: 'Professional reach.' },
  { id: 'MACRO', label: 'Macro', range: '500k+', desc: 'Mass market visibility.' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const db = useFirestore();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);

  // Forms
  const basicsForm = useForm<CampaignBasicsValues>({
    resolver: zodResolver(campaignBasicsSchema),
    defaultValues: {
      title: '',
      objective: 'AWARENESS',
      platforms: [],
      contentType: 'REEL',
      description: '',
    },
  });

  const requirementsForm = useForm<CreatorRequirementsValues>({
    resolver: zodResolver(creatorRequirementsSchema),
    defaultValues: {
      creatorTier: 'MICRO',
      minFollowers: 10000,
      maxFollowers: 50000,
      minEngagementRate: 3,
      niches: [],
      targetLocations: ['Global'],
      languages: ['English'],
      audienceAgeMin: 18,
      audienceAgeMax: 35,
      audienceGender: 'ALL',
      minPosts: 1,
      isExclusive: false,
    },
  });

  const budgetForm = useForm<BudgetTimelineValues>({
    resolver: zodResolver(budgetTimelineSchema),
    defaultValues: {
      totalBudget: 50000,
      budgetPerCreator: [5000, 15000],
      paymentMethod: 'UPI',
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      submissionDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      postLiveDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
    },
  });

  const onBasicsSubmit = async (values: CampaignBasicsValues) => {
    if (!userProfile) return;
    setIsSaving(true);

    const campaignData = {
      brandId: `brand_${userProfile.id}`,
      title: values.title,
      description: values.description,
      objectives: [values.objective],
      status: CampaignStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      step: 1
    };

    try {
      if (campaignId) {
        await updateDoc(doc(db, 'campaigns', campaignId), campaignData);
      } else {
        const docRef = await addDoc(collection(db, 'campaigns'), campaignData);
        setCampaignId(docRef.id);
      }
      
      toast({ title: "Basics Saved", description: "Configuring creator requirements..." });
      setCurrentStep(2);
    } catch (err: any) {
      errorEmitter.emitPermissionError(new FirestorePermissionError({
        path: '/campaigns',
        operation: campaignId ? 'update' : 'create',
        requestResourceData: campaignData
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const onRequirementsSubmit = async (values: CreatorRequirementsValues) => {
    if (!campaignId) return;
    setIsSaving(true);

    const updateData = {
      ...values,
      updatedAt: new Date().toISOString(),
      step: 2
    };

    try {
      await updateDoc(doc(db, 'campaigns', campaignId), updateData);
      toast({ title: "Requirements Saved", description: "Next: Set your campaign budget." });
      setCurrentStep(3);
    } catch (err: any) {
      errorEmitter.emitPermissionError(new FirestorePermissionError({
        path: `/campaigns/${campaignId}`,
        operation: 'update',
        requestResourceData: updateData
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const onBudgetSubmit = async (values: BudgetTimelineValues) => {
    if (!campaignId) return;
    setIsSaving(true);

    const updateData = {
      budget: values.totalBudget,
      minBudgetPerCreator: values.budgetPerCreator[0],
      maxBudgetPerCreator: values.budgetPerCreator[1],
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      applicationDeadline: values.applicationDeadline.toISOString(),
      submissionDeadline: values.submissionDeadline.toISOString(),
      postLiveDate: values.postLiveDate.toISOString(),
      updatedAt: new Date().toISOString(),
      step: 3
    };

    try {
      await updateDoc(doc(db, 'campaigns', campaignId), updateData);
      toast({ title: "Budget & Schedule Saved", description: "Almost done! Review your campaign details." });
      setCurrentStep(4);
    } catch (err: any) {
      errorEmitter.emitPermissionError(new FirestorePermissionError({
        path: `/campaigns/${campaignId}`,
        operation: 'update',
        requestResourceData: updateData
      }));
    } finally {
      setIsSaving(false);
    }
  };

  // Mock Reach Calculator
  const estimatedReach = useMemo(() => {
    const budget = budgetForm.watch('totalBudget') || 0;
    const tierMultiplier = requirementsForm.getValues('creatorTier') === 'MACRO' ? 8 : 12.5;
    return {
      reach: Math.round(budget * tierMultiplier),
      engagement: Math.round(budget * tierMultiplier * 0.04)
    };
  }, [budgetForm.watch('totalBudget'), requirementsForm.watch('creatorTier')]);

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Campaign</h1>
            <p className="text-slate-500 font-medium">Build your AI-powered campaign from scratch.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border shadow-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Auto-save Active</span>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                currentStep === s.id ? "border-primary bg-primary/5 text-primary scale-110 shadow-md" : 
                currentStep > s.id ? "border-green-500 bg-green-50 text-green-500" : "border-slate-200 bg-white text-slate-400"
              )}>
                {currentStep > s.id ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest hidden sm:block",
                currentStep === s.id ? "text-primary" : "text-slate-400"
              )}>{s.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-1.5 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b bg-slate-50/30">
                    <CardTitle className="text-xl">Step 1: Campaign Basics</CardTitle>
                    <CardDescription>Define the core identity and goals of your collaboration.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <form id="basics-form" onSubmit={basicsForm.handleSubmit(onBasicsSubmit)} className="space-y-8">
                      <div className="space-y-3">
                        <Label className="font-bold text-slate-700">Campaign Name</Label>
                        <Input 
                          placeholder="e.g. Summer AI Tech Launch 2024" 
                          className="h-12 rounded-xl bg-slate-50 border-none font-bold text-lg"
                          {...basicsForm.register('title')}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-700">Primary Objective</Label>
                          <Select onValueChange={(v) => basicsForm.setValue('objective', v)} defaultValue="AWARENESS">
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                              <SelectValue placeholder="Select objective" />
                            </SelectTrigger>
                            <SelectContent>
                              {OBJECTIVES.map((obj) => (
                                <SelectItem key={obj.id} value={obj.id}>{obj.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-700">Content Type</Label>
                          <Select onValueChange={(v) => basicsForm.setValue('contentType', v)} defaultValue="REEL">
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="REEL">Reel / Short</SelectItem>
                              <SelectItem value="VIDEO">Full Video</SelectItem>
                              <SelectItem value="POST">Feed Post</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="font-bold text-slate-700">Brief</Label>
                        <RichTextEditor 
                          value={basicsForm.watch('description')}
                          onChange={(v) => basicsForm.setValue('description', v)}
                          placeholder="What should creators do?"
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="p-8 border-t bg-slate-50/50 flex justify-end">
                    <Button form="basics-form" disabled={isSaving} className="rounded-xl font-black px-10 h-12">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Next: Requirements <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b bg-slate-50/30">
                    <CardTitle className="text-xl">Step 2: Creator Requirements</CardTitle>
                    <CardDescription>Specify who you want to work with. Our AI will use these to find matches.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-10">
                    <form id="requirements-form" onSubmit={requirementsForm.handleSubmit(onRequirementsSubmit)} className="space-y-10">
                      
                      {/* Creator Tier */}
                      <div className="space-y-4">
                        <Label className="font-bold text-slate-700">Creator Tier</Label>
                        <RadioGroup 
                          defaultValue={requirementsForm.getValues('creatorTier')} 
                          onValueChange={(v: any) => requirementsForm.setValue('creatorTier', v)}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          {TIERS.map((tier) => (
                            <div key={tier.id}>
                              <RadioGroupItem value={tier.id} id={tier.id} className="peer sr-only" />
                              <Label htmlFor={tier.id} className="flex flex-col p-4 rounded-2xl border-2 border-slate-100 bg-white cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-black text-lg">{tier.label}</span>
                                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[10px]">{tier.range}</Badge>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">{tier.desc}</p>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Performance & Niche */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Min. Engagement Rate (%)</Label>
                          <div className="flex items-center gap-4">
                            <Slider 
                              defaultValue={[requirementsForm.getValues('minEngagementRate')]} 
                              max={15} 
                              step={0.5} 
                              onValueChange={(v) => requirementsForm.setValue('minEngagementRate', v[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-center font-black text-primary bg-primary/5 rounded-lg py-1">{requirementsForm.watch('minEngagementRate')}%</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Follower Scale (Min)</Label>
                          <Input 
                            type="number" 
                            {...requirementsForm.register('minFollowers', { valueAsNumber: true })}
                            className="h-11 rounded-xl bg-slate-50 border-none font-bold"
                          />
                        </div>
                      </div>

                      {/* Niches Grid */}
                      <div className="space-y-4">
                        <Label className="font-bold text-slate-700">Target Niches (Select up to 5)</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {CREATOR_NICHES.slice(0, 12).map((niche) => (
                            <div 
                              key={niche}
                              onClick={() => {
                                const current = requirementsForm.getValues('niches');
                                const next = current.includes(niche) ? current.filter(n => n !== niche) : [...current, niche];
                                if (next.length <= 5) requirementsForm.setValue('niches', next);
                              }}
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer",
                                requirementsForm.watch('niches').includes(niche) ? "bg-primary/5 border-primary text-primary" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                              )}
                            >
                              <div className={cn("h-4 w-4 rounded border flex items-center justify-center", requirementsForm.watch('niches').includes(niche) ? "bg-primary border-primary" : "border-slate-300")}>
                                {requirementsForm.watch('niches').includes(niche) && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className="text-xs font-bold">{niche}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Demographics */}
                      <div className="space-y-6 pt-4 border-t border-slate-50">
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Audience Demographics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="font-bold text-slate-700">Target Locations</Label>
                            <Input placeholder="e.g. United States, India" {...requirementsForm.register('targetLocations.0')} className="h-11 rounded-xl bg-slate-50 border-none" />
                          </div>
                          <div className="space-y-4">
                            <Label className="font-bold text-slate-700">Audience Gender</Label>
                            <Select onValueChange={(v) => requirementsForm.setValue('audienceGender', v as any)} defaultValue="ALL">
                              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ALL">All Genders</SelectItem>
                                <SelectItem value="FEMALE">Mostly Female</SelectItem>
                                <SelectItem value="MALE">Mostly Male</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Campaign Terms */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                            <Save className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Creator Exclusivity</p>
                            <p className="text-xs text-slate-400 font-medium">Prevent creators from working with competitors.</p>
                          </div>
                        </div>
                        <Switch 
                          checked={requirementsForm.watch('isExclusive')} 
                          onCheckedChange={(v) => requirementsForm.setValue('isExclusive', v)}
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="p-8 border-t bg-slate-50/50 flex justify-between">
                    <Button variant="ghost" onClick={() => setCurrentStep(1)} className="rounded-xl font-bold h-12">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Basics
                    </Button>
                    <Button form="requirements-form" disabled={isSaving} className="rounded-xl font-black px-10 h-12">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Next: Budget <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b bg-slate-50/30">
                    <CardTitle className="text-xl">Step 3: Budget & Timeline</CardTitle>
                    <CardDescription>Allocate your investment and define key project milestones.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-10">
                    <form id="budget-form" onSubmit={budgetForm.handleSubmit(onBudgetSubmit)} className="space-y-10">
                      
                      {/* Budget Allocation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Total Campaign Budget (₹)</Label>
                          <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              type="number"
                              className="pl-12 h-14 rounded-2xl bg-slate-50 border-none text-2xl font-black text-primary"
                              {...budgetForm.register('totalBudget', { valueAsNumber: true })}
                            />
                          </div>
                          <p className="text-xs text-slate-400 font-medium">Market average for this niche: ₹45,000</p>
                        </div>
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Budget Per Creator Range</Label>
                          <div className="pt-4">
                            <Slider 
                              defaultValue={budgetForm.getValues('budgetPerCreator')}
                              max={50000}
                              step={500}
                              onValueChange={(v) => budgetForm.setValue('budgetPerCreator', v)}
                              className="mb-4"
                            />
                            <div className="flex justify-between items-center text-sm font-black text-slate-900">
                              <span>₹{budgetForm.watch('budgetPerCreator')[0].toLocaleString()}</span>
                              <span>₹{budgetForm.watch('budgetPerCreator')[1].toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-4">
                        <Label className="font-bold text-slate-700">Payment Infrastructure</Label>
                        <RadioGroup 
                          defaultValue={budgetForm.getValues('paymentMethod')}
                          onValueChange={(v: any) => budgetForm.setValue('paymentMethod', v)}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                        >
                          {[
                            { id: 'UPI', label: 'UPI ID', icon: Zap },
                            { id: 'CARD', label: 'Credit Card', icon: CreditCard },
                            { id: 'BANK', label: 'Bank Transfer', icon: Building2 },
                          ].map((m) => (
                            <div key={m.id}>
                              <RadioGroupItem value={m.id} id={m.id} className="peer sr-only" />
                              <Label htmlFor={m.id} className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                                <m.icon className="h-4 w-4 text-primary" />
                                <span className="font-bold text-sm">{m.label}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <Separator className="opacity-50" />

                      {/* Scheduling Grid */}
                      <div className="space-y-6">
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Project Milestones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { id: 'startDate', label: 'Campaign Launch', icon: Zap },
                            { id: 'endDate', label: 'Campaign End', icon: Clock },
                            { id: 'applicationDeadline', label: 'Hiring Closes', icon: Users },
                            { id: 'submissionDeadline', label: 'Submission Due', icon: Save },
                            { id: 'postLiveDate', label: 'Content Live', icon: Globe },
                          ].map((field) => (
                            <div key={field.id} className="space-y-2">
                              <Label className="font-bold text-slate-700 text-xs">{field.label}</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full h-12 justify-start text-left font-bold rounded-xl bg-slate-50 border-none",
                                      !budgetForm.watch(field.id as any) && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                    {budgetForm.watch(field.id as any) ? format(budgetForm.watch(field.id as any), "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden border-none shadow-2xl" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={budgetForm.watch(field.id as any)}
                                    onSelect={(date) => budgetForm.setValue(field.id as any, date as any)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          ))}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="p-8 border-t bg-slate-50/50 flex justify-between">
                    <Button variant="ghost" onClick={() => setCurrentStep(2)} className="rounded-xl font-bold h-12">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Audience
                    </Button>
                    <Button form="budget-form" disabled={isSaving} className="rounded-xl font-black px-10 h-12">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Next: Review & Launch <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-slate-900 text-white">
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black">Estimated Reach</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Potential Reach</p>
                    <p className="text-2xl font-black text-white">{estimatedReach.reach.toLocaleString()}+</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Est. Engagement</p>
                    <p className="text-2xl font-black text-emerald-400">{estimatedReach.engagement.toLocaleString()}+</p>
                  </div>
                </div>
                <Progress value={85} className="h-1 bg-white/10" />
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  {currentStep === 3 
                    ? "Your budget allows for ~15 high-quality Micro creators. This is optimized for high conversion in your selected niche." 
                    : "Complete Step 3 to see how your budget maps to market reach."
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-6 border-b bg-slate-50/50">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Campaign Logistics</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { title: 'Escrow Security', desc: 'Funds are held securely and released only after your approval.' },
                { title: 'Payment Window', desc: 'Creator payouts clear 48h after the post-live date validation.' },
                { title: 'Scheduling Tip', desc: 'Allow at least 7 days between hiring and submission for best quality.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-900 uppercase">{item.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
