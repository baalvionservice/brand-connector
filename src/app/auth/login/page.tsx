
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Rocket, ShieldCheck, Building2, UserCircle2, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();

  const bypassLogin = () => {
    // In mock mode, simply redirecting to the dashboard is enough
    // because AuthContext is hardcoded to an Admin user.
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center mb-6">
            <div className="bg-primary p-2 rounded-xl mr-2">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight">Baalvion <span className="text-primary">Connect</span></span>
          </Link>
          <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">One-Click Entry</h1>
          <p className="text-slate-500 mt-2">Authorization has been disabled for this demo session.</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="space-y-1 pb-4 bg-slate-50/50 border-b text-center">
            <CardTitle className="text-xl font-bold">Mock Access Active</CardTitle>
            <CardDescription>
              Explore all roles instantly without credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                onClick={bypassLogin}
                className="w-full h-16 rounded-2xl text-lg font-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                <Zap className="h-6 w-6 fill-current" />
                Enter Workspace
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-3 text-slate-400 font-black tracking-[0.2em]">
                  Role Selection
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-lg h-20 px-0 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-2 border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all"
                onClick={() => router.push('/admin')}
              >
                <ShieldCheck className="h-6 w-6 text-slate-400" />
                Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-lg h-20 px-0 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-2 border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all"
                onClick={() => router.push('/dashboard/brand')}
              >
                <Building2 className="h-6 w-6 text-slate-400" />
                Brand
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-lg h-20 px-0 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-2 border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all"
                onClick={() => router.push('/dashboard/creator')}
              >
                <UserCircle2 className="h-6 w-6 text-slate-400" />
                Creator
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center pb-8 pt-4">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center px-8">
              Firebase Auth is currently bypassed to avoid API Key mismatches.
            </p>
          </CardFooter>
        </Card>

        <div className="flex justify-center gap-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
          <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="#" className="hover:text-primary transition-colors">Security</Link>
        </div>
      </div>
    </div>
  );
}
