
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Check,
  Calendar as CalendarIcon,
  IndianRupee,
  CreditCard,
  Building2,
  TrendingUp,
  Clock,
  Rocket,
  FileText,
  ListPlus,
  X,
  PlusCircle,
  Eye,
  ShieldCheck,
  Instagram,
  Youtube,
  Music2,
  ChevronRight,
  AlertCircle,
  Copy,
  BarChart3,
  TrendingUp as TrendingIcon
} from 'lucide-react';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { CampaignStatus, CampaignDeliverable, Campaign } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { predictROI } from '@/lib/ai/roi';
import CountUp from 'react-countup';

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
import { CREATOR_NICHES, SOCIAL_PLATFORMS, PLATFORM_FEE_PERCENTAGE } from '@/constants';
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// Step 1 Schema
const campaignBasicsSchema = z.object({
  title: z.string().min(5, "Campaign title must be at least 5 characters").max(100, "Too long"),
  objective: z.string().min(1, "Objective is required"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  contentType: z.enum(["REEL", "VIDEO", "POST"]),
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

// Step 4 Schema
const guidelinesSchema = z.object({
  deliverables: z.array(z.object({
    type: z.string(),
    qty: z.number(),
    platform: z.string(),
    specs: z.string()
  })).min(1, "Add at least one deliverable"),
  dos: z.array(z.string()),
  donts: z.array(z.string()),
  hashtags: z.array(z.string()),
  handles: z.array(z.string()),
  links: z.array(z.string()),
  mandatoryMentions: z.string()
});

type CampaignBasicsValues = z.infer<typeof campaignBasicsSchema>;
type CreatorRequirementsValues = z.infer<typeof creatorRequirementsSchema>;
type BudgetTimelineValues = z.infer<typeof budgetTimelineSchema>;
type GuidelinesValues = z.infer<typeof guidelinesSchema>;

const STEPS = [
  { id: 1, title: 'Basics', icon: LayoutGrid },
  { id: 2, title: 'Target', icon: Target },
  { id: 3, title: 'Budget', icon: Sparkles },
  { id: 4, title: 'Rules', icon: FileText },
  { id: 5, title: 'Publish', icon: Rocket },
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
  const searchParams = useSearchParams();
  const sourceId = searchParams.get('sourceId');
  const db = useFirestore();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [particlesInit, setParticlesInit] = useState(false);
  const [sourceCampaign, setSourceCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  // Form initialization
  const basicsForm = useForm<CampaignBasicsValues>({
    resolver: zodResolver(campaignBasicsSchema),
    defaultValues: { title: '', objective: 'AWARENESS', platforms: ['Instagram'], contentType: 'REEL', description: '' },
  });

  const requirementsForm = useForm<CreatorRequirementsValues>({
    resolver: zodResolver(creatorRequirementsSchema),
    defaultValues: { creatorTier: 'MICRO', minFollowers: 10000, maxFollowers: 50000, minEngagementRate: 3, niches: [], targetLocations: ['India'], languages: ['English'], audienceAgeMin: 18, audienceAgeMax: 35, audienceGender: 'ALL', minPosts: 1, isExclusive: false },
  });

  const budgetForm = useForm<BudgetTimelineValues>({
    resolver: zodResolver(budgetTimelineSchema),
    defaultValues: { totalBudget: 50000, budgetPerCreator: [5000, 15000], paymentMethod: 'UPI', startDate: new Date(), endDate: new Date(Date.now() + 86400000 * 30), applicationDeadline: new Date(Date.now() + 86400000 * 7), submissionDeadline: new Date(Date.now() + 86400000 * 21), postLiveDate: new Date(Date.now() + 86400000 * 25) },
  });

  const guidelinesForm = useForm<GuidelinesValues>({
    resolver: zodResolver(guidelinesSchema),
    defaultValues: { deliverables: [], dos: [], donts: [], hashtags: [], handles: [], links: [], mandatoryMentions: '' },
  });

  // Handle Duplication logic
  useEffect(() => {
    if (sourceId && db) {
      const fetchSource = async () => {
        const docRef = doc(db, 'campaigns', sourceId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Campaign;
          setSourceCampaign(data);
          
          // Pre-fill forms
          basicsForm.reset({
            title: `${data.title} (Clone)`,
            objective: data.objectives?.[0] || 'AWARENESS',
            platforms: data.targetLocations ? ['Instagram'] : ['Instagram'], // Simplified for prototype
            contentType: 'REEL',
            description: data.description,
          });

          requirementsForm.reset({
            creatorTier: data.creatorTier || 'MICRO',
            minFollowers: data.minFollowers || 10000,
            maxFollowers: data.maxFollowers || 50000,
            minEngagementRate: data.minEngagementRate || 3,
            niches: data.niches || [],
            targetLocations: data.targetLocations || ['India'],
            languages: data.languages || ['English'],
            audienceAgeMin: data.audienceAgeMin || 18,
            audienceAgeMax: data.audienceAgeMax || 35,
            audienceGender: (data.audienceGender as any) || 'ALL',
            minPosts: data.minPosts || 1,
            isExclusive: data.isExclusive || false,
          });

          budgetForm.reset({
            totalBudget: data.budget || 50000,
            budgetPerCreator: [data.minBudgetPerCreator || 5000, data.maxBudgetPerCreator || 15000],
            paymentMethod: 'UPI',
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 30),
            applicationDeadline: new Date(Date.now() + 86400000 * 7),
            submissionDeadline: new Date(Date.now() + 86400000 * 21),
            postLiveDate: new Date(Date.now() + 86400000 * 25),
          });

          guidelinesForm.reset({
            deliverables: data.deliverables || [],
            dos: data.dos || [],
            donts: data.donts || [],
            hashtags: data.hashtags || [],
            handles: data.handles || [],
            links: data.links || [],
            mandatoryMentions: data.mandatoryMentions || ''
          });
        }
      };
      fetchSource();
    }
  }, [sourceId, db, basicsForm, requirementsForm, budgetForm, guidelinesForm]);

  const [newDel, setNewDel] = useState<CampaignDeliverable>({ type: 'REEL', qty: 1, platform: 'Instagram', specs: '' });
  const [tempItem, setTempItem] = useState('');

  const onBasicsSubmit = (values: CampaignBasicsValues) => {
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
      sourceCampaignId: sourceId || undefined,
      sourceCampaignTitle: sourceCampaign?.title || undefined,
      step: 1
    };

    if (campaignId) {
      updateDoc(doc(db, 'campaigns', campaignId), campaignData)
        .then(() => {
          toast({ title: "Basics Saved" });
          setCurrentStep(2);
          setIsSaving(false);
        })
        .catch(async (err) => {
          errorEmitter.emitPermissionError(new FirestorePermissionError({
            path: `/campaigns/${campaignId}`,
            operation: 'update',
            requestResourceData: campaignData
          } satisfies SecurityRuleContext));
          setIsSaving(false);
        });
    } else {
      addDoc(collection(db, 'campaigns'), campaignData)
        .then((docRef) => {
          setCampaignId(docRef.id);
          toast({ title: "Draft Created" });
          setCurrentStep(2);
          setIsSaving(false);
        })
        .catch(async (err) => {
          errorEmitter.emitPermissionError(new FirestorePermissionError({
            path: '/campaigns',
            operation: 'create',
            requestResourceData: campaignData
          } satisfies SecurityRuleContext));
          setIsSaving(false);
        });
    }
  };

  const onRequirementsSubmit = (values: CreatorRequirementsValues) => {
    if (!campaignId) return;
    setIsSaving(true);
    const updateData = { ...values, updatedAt: new Date().toISOString(), step: 2 };
    updateDoc(doc(db, 'campaigns', campaignId), updateData).then(() => {
      toast({ title: "Requirements Saved" });
      setCurrentStep(3);
      setIsSaving(false);
    }).catch(async (err) => {
      errorEmitter.emitPermissionError(new FirestorePermissionError({ path: `/campaigns/${campaignId}`, operation: 'update', requestResourceData: updateData }));
      setIsSaving(false);
    });
  };

  const onBudgetSubmit = (values: BudgetTimelineValues) => {
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
    updateDoc(doc(db, 'campaigns', campaignId), updateData).then(() => {
      toast({ title: "Budget Saved" });
      setCurrentStep(4);
      setIsSaving(false);
    }).catch(async (err) => {
      errorEmitter.emitPermissionError(new FirestorePermissionError({ path: `/campaigns/${campaignId}`, operation: 'update', requestResourceData: updateData }));
      setIsSaving(false);
    });
  };

  const onGuidelinesSubmit = (values: GuidelinesValues) => {
    if (!campaignId) return;
    setIsSaving(true);
    const updateData = { ...values, updatedAt: new Date().toISOString(), step: 4 };
    updateDoc(doc(db, 'campaigns', campaignId), updateData).then(() => {
      toast({ title: "Guidelines Saved" });
      setCurrentStep(5);
      setIsSaving(false);
    }).catch(async (err) => {
      errorEmitter.emitPermissionError(new FirestorePermissionError({ path: `/campaigns/${campaignId}`, operation: 'update', requestResourceData: updateData }));
      setIsSaving(false);
    });
  };

  const handlePublish = async () => {
    if (!campaignId) return;
    setIsSaving(true);
    const finalUpdate = { status: CampaignStatus.ACTIVE, updatedAt: new Date().toISOString() };
    updateDoc(doc(db, 'campaigns', campaignId), finalUpdate).then(() => {
      setShowConfetti(true);
      toast({ title: "Campaign Launched!", description: "AI matching engine has started finding creators." });
      setTimeout(() => router.push('/dashboard/brand'), 4000);
    }).catch(async (err) => {
      errorEmitter.emitPermissionError(new FirestorePermissionError({ path: `/campaigns/${campaignId}`, operation: 'update', requestResourceData: finalUpdate }));
      setIsSaving(false);
    });
  };

  const addArrayItem = (field: keyof GuidelinesValues, value: string) => {
    if (!value.trim()) return;
    const current = guidelinesForm.getValues(field) as string[];
    guidelinesForm.setValue(field, [...current, value] as any);
    setTempItem('');
  };

  const removeArrayItem = (field: keyof GuidelinesValues, index: number) => {
    const current = guidelinesForm.getValues(field) as string[];
    guidelinesForm.setValue(field, current.filter((_, i) => i !== index) as any);
  };

  const totals = useMemo(() => {
    const budget = budgetForm.watch('totalBudget') || 0;
    const fee = Math.round(budget * (PLATFORM_FEE_PERCENTAGE / 100));
    return { budget, fee, total: budget + fee };
  }, [budgetForm.watch('totalBudget')]);

  // AI ROI Forecast
  const roiForecast = useMemo(() => {
    const budget = budgetForm.watch('totalBudget') || 0;
    if (budget < 500) return null;

    return predictROI({
      budget,
      niche: requirementsForm.watch('niches')[0] || 'Tech & Gadgets',
      contentType: basicsForm.watch('contentType') as any,
      creatorTier: requirementsForm.watch('creatorTier')
    });
  }, [
    budgetForm.watch('totalBudget'),
    requirementsForm.watch('niches'),
    requirementsForm.watch('creatorTier'),
    basicsForm.watch('contentType')
  ]);

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {showConfetti && particlesInit && (
        <Particles
          id="confetti"
          options={{
            fullScreen: { zIndex: 100 },
            particles: {
              number: { value: 0 },
              color: { value: ["#6C3AE8", "#F97316", "#10B981"] },
              shape: { type: ["circle", "square"] },
              opacity: { value: 1 },
              size: { value: { min: 2, max: 4 } },
              move: { enable: true, gravity: { enable: true, acceleration: 10 }, speed: { min: 10, max: 20 }, decay: 0.1, direction: "top", straight: false, outModes: { default: "destroy", top: "none" } },
            },
            emitters: [ { direction: "top-right", rate: { count: 10, delay: 0.1 }, position: { x: 0, y: 100 }, size: { width: 0, height: 0 } }, { direction: "top-left", rate: { count: 10, delay: 0.1 }, position: { x: 100, y: 100 }, size: { width: 0, height: 0 } } ],
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {!showConfetti && (
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Creation</h1>
              {sourceId && (
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase flex items-center gap-1">
                  <Copy className="h-3 w-3" />
                  Duplicated from: {sourceCampaign?.title || 'Original'}
                </Badge>
              )}
            </div>
            <p className="text-slate-500 font-medium">Step {currentStep}: {STEPS[currentStep-1].title}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border shadow-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{campaignId ? 'Draft Saved' : 'Creating New'}</span>
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
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b bg-slate-50/30">
                    <CardTitle className="text-xl">Campaign Basics</CardTitle>
                    <CardDescription>Tell us about the identity and vision of your project.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <form id="basics-form" onSubmit={basicsForm.handleSubmit(onBasicsSubmit)} className="space-y-8">
                      <div className="space-y-3">
                        <Label className="font-bold text-slate-700">Campaign Name</Label>
                        <Input placeholder="e.g. Summer AI Tech Launch 2024" className="h-12 rounded-xl bg-slate-50 border-none font-bold text-lg" {...basicsForm.register('title')} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-700">Primary Objective</Label>
                          <Select onValueChange={(v) => basicsForm.setValue('objective', v)} value={basicsForm.watch('objective')}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent>{OBJECTIVES.map((obj) => <SelectItem key={obj.id} value={obj.id}>{obj.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label className="font-bold text-slate-700">Content Type</Label>
                          <Select onValueChange={(v) => basicsForm.setValue('contentType', v as any)} value={basicsForm.watch('contentType')}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="REEL">Reel / Short</SelectItem>
                              <SelectItem value="VIDEO">Full Video</SelectItem>
                              <SelectItem value="POST">Feed Post</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold text-slate-700">Campaign Brief</Label>
                        <RichTextEditor value={basicsForm.watch('description')} onChange={(v) => basicsForm.setValue('description', v)} placeholder="What should creators do? Detail your vision here..." />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="p-8 border-t bg-slate-50/50 flex justify-end">
                    <Button form="basics-form" disabled={isSaving} className="rounded-xl font-black px-10 h-12">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save & Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b bg-slate-50/30">
                    <CardTitle className="text-xl">Creator Requirements</CardTitle>
                    <CardDescription>Specify the target audience and influence scale.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-10">
                    <form id="requirements-form" onSubmit={requirementsForm.handleSubmit(onRequirementsSubmit)} className="space-y-10">
                      <div className="space-y-4">
                        <Label className="font-bold text-slate-700">Creator Tier</Label>
                        <RadioGroup value={requirementsForm.watch('creatorTier')} onValueChange={(v: any) => requirementsForm.setValue('creatorTier', v)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Min. Engagement Rate (%)</Label>
                          <div className="flex items-center gap-4">
                            <Slider value={[requirementsForm.watch('minEngagementRate')]} max={15} step={0.5} onValueChange={(v) => requirementsForm.setValue('minEngagementRate', v[0])} className="flex-1" />
                            <span className="w-12 text-center font-black text-primary bg-primary/5 rounded-lg py-1">{requirementsForm.watch('minEngagementRate')}%</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Follower Scale (Min)</Label>
                          <Input type="number" {...requirementsForm.register('minFollowers', { valueAsNumber: true })} className="h-11 rounded-xl bg-slate-50 border-none font-bold" />
                        </div>
                      </div>
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
                              className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer", requirementsForm.watch('niches').includes(niche) ? "bg-primary/5 border-primary text-primary" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200")}
                            >
                              <div className={cn("h-4 w-4 rounded border flex items-center justify-center", requirementsForm.watch('niches').includes(niche) ? "bg-primary border-primary" : "border-slate-300")}>
                                {requirementsForm.watch('niches').includes(niche) && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className="text-xs font-bold">{niche}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="p-8 border-t bg-slate-50/50 flex justify-between">
                    <Button variant="ghost" onClick={() => setCurrentStep(1)} className="rounded-xl font-bold h-12">Back</Button>
                    <Button form="requirements-form" disabled={isSaving} className="rounded-xl font-black px-10 h-12">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save & Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b bg-slate-50/30">
                    <CardTitle className="text-xl">Budget & Timeline</CardTitle>
                    <CardDescription>Define the commercial terms and milestones.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-10">
                    <form id="budget-form" onSubmit={budgetForm.handleSubmit(onBudgetSubmit)} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Total Campaign Budget (₹)</Label>
                          <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input type="number" className="pl-12 h-14 rounded-2xl bg-slate-50 border-none text-2xl font-black text-primary" {...budgetForm.register('totalBudget', { valueAsNumber: true })} />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Budget Per Creator Range</Label>
                          <div className="pt-4">
                            <Slider value={budgetForm.watch('budgetPerCreator')} max={50000} step={500} onValueChange={(v) => budgetForm.setValue('budgetPerCreator', v)} className="mb-4" />
                            <div className="flex justify-between items-center text-sm font-black text-slate-900">
                              <span>₹{budgetForm.watch('budgetPerCreator')[0].toLocaleString()}</span>
                              <span>₹{budgetForm.watch('budgetPerCreator')[1].toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI ROI Forecast Panel */}
                      <AnimatePresence mode="wait">
                        {roiForecast && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group shadow-2xl shadow-primary/10"
                          >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                              <Sparkles className="h-32 w-32" />
                            </div>
                            <div className="flex items-center justify-between mb-8 relative z-10">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                  <Zap className="h-5 w-5 text-primary fill-primary" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-black uppercase tracking-tight">AI Revenue Forecast</h4>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Expected Performance</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Confidence Score</p>
                                <p className="text-lg font-black text-emerald-400">{roiForecast.confidence}%</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                              <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Impressions (Est.)</p>
                                <div className="text-2xl font-black text-white">
                                  <CountUp end={roiForecast.impressions.min} separator="," duration={2} /> - <CountUp end={roiForecast.impressions.max} separator="," duration={2} />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Engagements</p>
                                <div className="text-2xl font-black text-primary">
                                  <CountUp end={roiForecast.engagements} separator="," duration={2} />+
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Target CPE</p>
                                <div className="text-2xl font-black text-emerald-400">
                                  ₹<CountUp end={roiForecast.cpe} decimals={2} duration={2} />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">CPM Benchmark</p>
                                <div className="text-2xl font-black text-blue-400">
                                  ₹<CountUp end={roiForecast.cpm} duration={2} />
                                </div>
                              </div>
                            </div>

                            <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                              <TrendingIcon className="h-4 w-4 text-emerald-400" />
                              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Optimized for **{requirementsForm.watch('creatorTier')}** tier creators in the **{requirementsForm.watch('niches')[0] || 'Tech'}** niche. Reach predicted to be **12% higher** than standard benchmark.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { id: 'startDate', label: 'Campaign Window Starts' },
                          { id: 'endDate', label: 'Campaign Window Ends' },
                          { id: 'applicationDeadline', label: 'Hiring Closes' },
                          { id: 'submissionDeadline', label: 'Content Due' },
                        ].map((field) => (
                          <div key={field.id} className="space-y-2">
                            <Label className="font-bold text-slate-700 text-xs">{field.label}</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full h-12 justify-start text-left font-bold rounded-xl bg-slate-50 border-none">
                                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                  {budgetForm.watch(field.id as any) ? format(budgetForm.watch(field.id as any), "PPP") : <span>Pick date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden border-none" align="start">
                                <Calendar mode="single" selected={budgetForm.watch(field.id as any)} onSelect={(date) => budgetForm.setValue(field.id as any, date as any)} initialFocus />
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="p-8 border-t bg-slate-50/50 flex justify-between">
                    <Button variant="ghost" onClick={() => setCurrentStep(2)} className="rounded-xl font-bold h-12">Back</Button>
                    <Button form="budget-form" disabled={isSaving} className="rounded-xl font-black px-10 h-12">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save & Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 border-b bg-slate-50/30">
                    <CardTitle className="text-xl">Deliverables & Guidelines</CardTitle>
                    <CardDescription>Clear rules lead to great content.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-10">
                    <form id="guidelines-form" onSubmit={guidelinesForm.handleSubmit(onGuidelinesSubmit)} className="space-y-10">
                      <div className="space-y-6">
                        <Label className="font-bold text-slate-700 text-lg flex items-center gap-2">
                          <ListPlus className="h-5 w-5 text-primary" /> Required Deliverables
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-end">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</Label>
                            <Select value={newDel.type} onValueChange={(v) => setNewDel({...newDel, type: v})}>
                              <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="REEL">Instagram Reel</SelectItem>
                                <SelectItem value="STORY">Instagram Story</SelectItem>
                                <SelectItem value="VIDEO">YouTube Video</SelectItem>
                                <SelectItem value="TIKTOK">TikTok Post</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</Label>
                            <Input type="number" value={newDel.qty} onChange={(e) => setNewDel({...newDel, qty: parseInt(e.target.value) || 1})} className="h-10 bg-white border-slate-200 rounded-xl font-bold" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Button type="button" onClick={() => {
                              guidelinesForm.setValue('deliverables', [...guidelinesForm.getValues('deliverables'), newDel]);
                              setNewDel({ type: 'REEL', qty: 1, platform: 'Instagram', specs: '' });
                            }} className="w-full h-10 rounded-xl font-bold gap-2">
                              <PlusCircle className="h-4 w-4" /> Add Deliverable
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {guidelinesForm.watch('deliverables').map((del, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl group">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-black">{del.qty}x</div>
                                <div>
                                  <p className="font-bold text-slate-900">{del.type}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">{del.platform}</p>
                                </div>
                              </div>
                              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 rounded-full" onClick={() => removeArrayItem('deliverables', i)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Content Dos</Label>
                          <div className="flex gap-2">
                            <Input placeholder="e.g. Natural lighting" value={tempItem} onChange={(e) => setTempItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('dos', tempItem))} className="rounded-xl h-11" />
                            <Button type="button" onClick={() => addArrayItem('dos', tempItem)} className="h-11 rounded-xl px-4 font-bold">Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {guidelinesForm.watch('dos').map((item, i) => (
                              <Badge key={i} className="bg-emerald-50 text-emerald-600 border-emerald-100 gap-1.5 font-bold py-1 px-3">
                                {item} <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('dos', i)} />
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="font-bold text-slate-700">Content Don'ts</Label>
                          <div className="flex gap-2">
                            <Input placeholder="e.g. No dark filters" value={tempItem} onChange={(e) => setTempItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('donts', tempItem))} className="rounded-xl h-11" />
                            <Button type="button" onClick={() => addArrayItem('donts', tempItem)} className="h-11 rounded-xl px-4 font-bold">Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {guidelinesForm.watch('donts').map((item, i) => (
                              <Badge key={i} className="bg-red-50 text-red-600 border-red-100 gap-1.5 font-bold py-1 px-3">
                                {item} <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('donts', i)} />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="p-8 border-t bg-slate-50/50 flex justify-between">
                    <Button variant="ghost" onClick={() => setCurrentStep(3)} className="rounded-xl font-bold h-12">Back</Button>
                    <Button form="guidelines-form" disabled={isSaving || guidelinesForm.watch('deliverables').length === 0} className="rounded-xl font-black px-10 h-12">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Final Review <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Summary Area */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                      <CardHeader className="p-8 border-b bg-slate-50/30">
                        <CardTitle className="text-xl">Campaign Summary</CardTitle>
                        <CardDescription>Review all details before funding the escrow.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-10">
                        {/* Section: Basics */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Basics</h4>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400">Campaign Name</p>
                              <p className="text-md font-bold text-slate-900">{basicsForm.getValues('title')}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400">Objective</p>
                              <p className="text-md font-bold text-slate-900">{OBJECTIVES.find(o => o.id === basicsForm.getValues('objective'))?.label}</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Section: Audience */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Target Audience</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none">{requirementsForm.getValues('creatorTier')} TIER</Badge>
                            {requirementsForm.getValues('niches').map(n => <Badge key={n} className="bg-slate-100 text-slate-600 border-none">{n}</Badge>)}
                          </div>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Section: Rules */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Deliverables</h4>
                          <div className="space-y-2">
                            {guidelinesForm.getValues('deliverables').map((del, i) => (
                              <div key={i} className="flex justify-between items-center text-sm font-medium">
                                <span className="text-slate-600">{del.qty}x {del.type} ({del.platform})</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Payment Panel */}
                  <div className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-900 text-white">
                      <CardHeader className="p-8 border-b border-white/10 bg-white/5">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-primary" /> Escrow Funding
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Campaign Budget</span>
                            <span className="font-bold">₹{totals.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Platform Fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                            <span className="font-bold">₹{totals.fee.toLocaleString()}</span>
                          </div>
                          <Separator className="bg-white/10" />
                          <div className="flex justify-between items-center">
                            <span className="text-md font-black uppercase text-primary">Total to Fund</span>
                            <span className="text-2xl font-black">₹{totals.total.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Secure Escrow
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                            Funds are held securely by Baalvion Connect. Release is only triggered after you approve the final content deliverables.
                          </p>
                        </div>

                        <Button onClick={handlePublish} disabled={isSaving || showConfetti} className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                          {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                          Fund & Launch Live
                        </Button>
                      </CardContent>
                    </Card>

                    <div className="p-6 rounded-[2rem] bg-white border border-dashed border-slate-300 text-center space-y-2">
                      <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-black uppercase text-slate-900">AI Matcher Ready</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Upon funding, we will instantly notify the top 15 matching creators in your niche.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Insights */}
        {!showConfetti && (
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-slate-950 text-white">
              <CardContent className="p-8 space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black">Market Reach Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Potential Reach</p>
                      <p className="text-2xl font-black text-white">
                        {roiForecast ? (
                          <CountUp end={roiForecast.impressions.max} separator="," />
                        ) : '---'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Engagement</p>
                      <p className="text-2xl font-black text-emerald-400">
                        {roiForecast ? (
                          <CountUp end={roiForecast.engagements} separator="," />
                        ) : '---'}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-relaxed font-medium">
                    Optimized for {requirementsForm.watch('creatorTier')} Tier. Campaign efficiency score: <span className="text-white font-bold">{roiForecast?.confidence || 0}/100</span>.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="p-6 border-b bg-slate-50/50">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Timeline Check</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-3 w-3 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-900 uppercase">Hiring Phase</p>
                    <p className="text-[10px] text-slate-500 font-medium">Closes {budgetForm.watch('applicationDeadline') ? format(budgetForm.watch('applicationDeadline'), "MMM dd") : '---'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <CalendarIcon className="h-3 w-3 text-orange-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-slate-900 uppercase">Production Phase</p>
                    <p className="text-[10px] text-slate-500 font-medium">Starts {budgetForm.watch('startDate') ? format(budgetForm.watch('startDate'), "MMM dd") : '---'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
