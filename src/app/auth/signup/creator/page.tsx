'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Rocket, Mail, Lock, Star, User, ArrowLeft, Loader2, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const creatorSignupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  handle: z.string().min(2, { message: "Social handle is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type CreatorSignupValues = z.infer<typeof creatorSignupSchema>;

export default function CreatorSignupPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreatorSignupValues>({
    resolver: zodResolver(creatorSignupSchema),
    defaultValues: {
      fullName: '',
      handle: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: CreatorSignupValues) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Creator profile ready!",
        description: "Welcome to the community, " + values.handle,
      });
      router.push('/dashboard/creator');
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <Link 
          href="/auth/signup" 
          className="inline-flex items-center text-sm text-slate-500 hover:text-orange-600 font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to selection
        </Link>

        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center mb-6">
            <div className="bg-orange-600 p-2 rounded-xl mr-2">
              <Star className="h-8 w-8 text-white fill-white" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight">Baalvion <span className="text-orange-600">Creator</span></span>
          </Link>
          <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Join as a Creator</h1>
          <p className="text-slate-500 mt-2">Monetize your influence and reach new brands</p>
        </div>

        <Card className="border-slate-200 shadow-xl rounded-2xl overflow-hidden border-t-4 border-t-orange-600">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-orange-600">Creator Profile</CardTitle>
            <CardDescription>Tell us about your creative persona</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="Jane Smith" className="pl-10 h-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="handle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Social Handle</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Instagram className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="@janesmith_creations" className="pl-10 h-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="jane@example.com" className="pl-10 h-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input type="password" placeholder="••••••••" className="pl-10 h-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl text-md font-bold mt-6 shadow-lg bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20"
                  disabled={isLoading}
                >
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Profile...</> : "Start Creating"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}