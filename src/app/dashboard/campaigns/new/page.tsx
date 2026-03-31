
'use client';

import React, { useState } from 'react';
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
  Save
} from 'lucide-react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const campaignBasicsSchema = z.object({
  title: z.string().min(5, "Campaign title must be at least 5 characters").max(100, "Too long"),
  objective: z.string().min(1, "Objective is required"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  contentType: z.string().min(1, "Content type is required"),
  description: z.string().min(50, "Brief must be at least 50 characters").max(5000, "Brief too long"),
});

type CampaignBasicsValues = z.infer<typeof campaignBasicsSchema>;

const STEPS = [
  { id: 1, title: 'Basics', icon: LayoutGrid },
  { id: 2, title: 'Audience', icon: Target },
  { id: 3, title: 'Budget', icon: Sparkles },
  { id: 4, title: 'Review', icon: CheckCircle2 },
];

const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'X (Twitter)', 'LinkedIn'];
const OBJECTIVES = [
  { id: 'AWARENESS', label: 'Brand Awareness', desc: 'Reach as many people as possible.' },
  { id: 'ENGAGEMENT', label: 'Engagement', desc: 'Get likes, comments, and shares.' },
  { id: 'CONVERSIONS', label: 'Conversions', desc: 'Drive sales or sign-ups.' },
  { id: 'CONTENT', label: 'Content Creation', desc: 'Get high-quality raw assets.' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const db = useFirestore();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CampaignBasicsValues>({
    resolver: zodResolver(campaignBasicsSchema),
    defaultValues: {
      title: '',
      objective: 'AWARENESS',
      platforms: [],
      contentType: 'REEL',
      description: '',
    },
  });

  const onSubmit = async (values: CampaignBasicsValues) => {
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
      // For prototypes, we just save the basics and "move to next step"
      // In a real app, we might use a single doc and update it
      const docRef = await addDoc(collection(db, 'campaigns'), campaignData);
      
      toast({
        title: "Draft Saved",
        description: "Moving to Step 2: Target Audience",
      });
      
      // Since this is Step 1 implementation, we simulate moving to step 2
      // In a full build, this would update local state or router
      setCurrentStep(2);
    } catch (err: any) {
      errorEmitter.emitPermissionError(new FirestorePermissionError({
        path: '/campaigns',
        operation: 'create',
        requestResourceData: campaignData
      }));
    } finally {
      setIsSaving(false);
    }
  };

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
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b bg-slate-50/30">
              <CardTitle className="text-xl">Step 1: Campaign Basics</CardTitle>
              <CardDescription>Define the core identity and goals of your collaboration.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <form id="campaign-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Campaign Title */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <Label className="font-bold text-slate-700">Campaign Name</Label>
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {form.watch('title').length}/100
                    </span>
                  </div>
                  <Input 
                    placeholder="e.g. Summer AI Tech Launch 2024" 
                    className="h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary font-bold text-lg"
                    {...form.register('title')}
                  />
                  {form.formState.errors.title && (
                    <p className="text-xs text-red-500 font-bold">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Objective */}
                  <div className="space-y-3">
                    <Label className="font-bold text-slate-700">Primary Objective</Label>
                    <Select 
                      onValueChange={(v) => form.setValue('objective', v)} 
                      defaultValue={form.getValues('objective')}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none focus:ring-primary font-bold">
                        <SelectValue placeholder="Select objective" />
                      </SelectTrigger>
                      <SelectContent>
                        {OBJECTIVES.map((obj) => (
                          <SelectItem key={obj.id} value={obj.id} className="p-3">
                            <div className="space-y-0.5">
                              <p className="font-bold">{obj.label}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{obj.desc}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Content Type */}
                  <div className="space-y-3">
                    <Label className="font-bold text-slate-700">Deliverable Type</Label>
                    <Select 
                      onValueChange={(v) => form.setValue('contentType', v)} 
                      defaultValue={form.getValues('contentType')}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none focus:ring-primary font-bold">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REEL" className="font-bold">Short-form (Reel/TikTok)</SelectItem>
                        <SelectItem value="VIDEO" className="font-bold">Dedicated Video (YouTube)</SelectItem>
                        <SelectItem value="POST" className="font-bold">Main Feed Post</SelectItem>
                        <SelectItem value="STORY" className="font-bold">Instagram Story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Platforms */}
                <div className="space-y-4">
                  <Label className="font-bold text-slate-700">Target Platforms</Label>
                  <div className="flex flex-wrap gap-3">
                    {PLATFORMS.map((plat) => (
                      <div 
                        key={plat}
                        onClick={() => {
                          const current = form.getValues('platforms');
                          const next = current.includes(plat) 
                            ? current.filter(p => p !== plat) 
                            : [...current, plat];
                          form.setValue('platforms', next, { shouldValidate: true });
                        }}
                        className={cn(
                          "cursor-pointer px-6 py-3 rounded-xl border-2 transition-all font-bold text-sm",
                          form.watch('platforms').includes(plat) 
                            ? "bg-primary/5 border-primary text-primary" 
                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        {plat}
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.platforms && (
                    <p className="text-xs text-red-500 font-bold">{form.formState.errors.platforms.message}</p>
                  )}
                </div>

                {/* Rich Text Description */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <Label className="font-bold text-slate-700">Campaign Brief</Label>
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {form.watch('description').length}/5000
                    </span>
                  </div>
                  <RichTextEditor 
                    value={form.watch('description')}
                    onChange={(v) => form.setValue('description', v, { shouldValidate: true })}
                    placeholder="Provide a detailed brief for creators. Include your vision, key talking points, and specific requirements..."
                  />
                  {form.formState.errors.description && (
                    <p className="text-xs text-red-500 font-bold">{form.formState.errors.description.message}</p>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="p-8 border-t bg-slate-50/50 flex justify-between items-center">
              <Button variant="ghost" className="rounded-xl font-bold h-12 px-6 text-slate-400">
                Cancel Draft
              </Button>
              <Button 
                form="campaign-form"
                disabled={isSaving}
                className="h-12 px-10 rounded-xl font-black text-md shadow-xl shadow-primary/20"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Next: Audience <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-slate-900 text-white">
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">AI Strategy Check</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Complete Step 1 to unlock real-time optimization tips. Our AI will analyze your brief to ensure it's "Creator-Friendly" and clear.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Vetting Status</span>
                <span className="text-orange-500">Pending Input</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="p-6 border-b bg-slate-50/50">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { title: 'Be Specific', desc: 'Clearly state what creators SHOULD NOT do to avoid revisions.' },
                { title: 'Goal Oriented', desc: 'Select "Conversions" if you have a discount code or tracking link.' },
                { title: 'Platform Mix', desc: 'Brands with multi-platform campaigns see 2.4x higher overall ROI.' },
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

          <div className="p-6 rounded-3xl bg-white border border-dashed border-slate-300 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Info className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase">Need assistance?</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Our creative strategy team can help you polish your brief.
              </p>
            </div>
            <Button variant="link" className="text-xs font-bold text-primary h-auto p-0">Contact Strategist</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
