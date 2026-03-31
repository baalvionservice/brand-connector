'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Rocket, Mail, Lock, Building2, User, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const brandSignupSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required." }),
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type BrandSignupValues = z.infer<typeof brandSignupSchema>;

export default function BrandSignupPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<BrandSignupValues>({
    resolver: zodResolver(brandSignupSchema),
    defaultValues: {
      companyName: '',
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: BrandSignupValues) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome to Baalvion Connect, " + values.companyName,
      });
      router.push('/dashboard/brand');
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <Link 
          href="/auth/signup" 
          className="inline-flex items-center text-sm text-slate-500 hover:text-primary font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to selection
        </Link>

        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center mb-6">
            <div className="bg-primary p-2 rounded-xl mr-2">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight">Baalvion <span className="text-primary">Connect</span></span>
          </Link>
          <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Create Brand Account</h1>
          <p className="text-slate-500 mt-2">Start hiring top creative talent today</p>
        </div>

        <Card className="border-slate-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Brand Details</CardTitle>
            <CardDescription>Enter your professional information</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="Acme Inc." className="pl-10 h-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="John Doe" className="pl-10 h-11" {...field} />
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
                      <FormLabel>Work Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="john@acme.com" className="pl-10 h-11" {...field} />
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
                  className="w-full h-12 rounded-xl text-md font-bold mt-6 shadow-lg shadow-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Join as a Brand"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}