
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Share2, 
  Trash2, 
  Camera, 
  Loader2, 
  CheckCircle2,
  Mail,
  Lock,
  Smartphone,
  Instagram,
  Youtube,
  Music2,
  Globe,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { CreatorProfile, BrandProfile } from '@/types';

export default function SettingsPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  // Real-time hook for role-specific profile data
  const creatorId = userProfile?.role === 'CREATOR' ? `creator_${userProfile.id}` : null;
  const brandId = userProfile?.role === 'BRAND' ? `brand_${userProfile.id}` : null;
  
  const { data: creatorData } = useDoc<CreatorProfile>(creatorId ? `creators/${creatorId}` : null);
  const { data: brandData } = useDoc<BrandProfile>(brandId ? `brands/${brandId}` : null);

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Local state for personal info
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhone(userProfile.phone || '');
    }
    if (creatorData) {
      setBio(creatorData.bio || '');
    } else if (brandData) {
      setBio(brandData.brandGuidelines || '');
    }
  }, [userProfile, creatorData, brandData]);

  const handleUpdateUser = () => {
    if (!userProfile) return;
    setIsSaving(true);
    
    const updateData = {
      displayName,
      phone,
      updatedAt: new Date().toISOString(),
    };

    updateDoc(doc(db, 'users', userProfile.id), updateData)
      .then(() => {
        toast({ title: "Profile updated", description: "Your changes have been saved." });
      })
      .catch(async (err) => {
        errorEmitter.emitPermissionError(new FirestorePermissionError({
          path: `/users/${userProfile.id}`,
          operation: 'update',
          requestResourceData: updateData
        }));
      })
      .finally(() => setIsSaving(false));
  };

  const handleTogglePref = (key: 'email' | 'push' | 'marketing') => {
    if (!userProfile) return;
    
    const currentPrefs = userProfile.notificationPreferences || { email: true, push: true, marketing: false };
    const newPrefs = { ...currentPrefs, [key]: !currentPrefs[key] };

    // Optimistic Update
    updateDoc(doc(db, 'users', userProfile.id), {
      notificationPreferences: newPrefs,
      updatedAt: new Date().toISOString()
    }).catch(async () => {
      errorEmitter.emitPermissionError(new FirestorePermissionError({
        path: `/users/${userProfile.id}`,
        operation: 'update',
        requestResourceData: { notificationPreferences: newPrefs }
      }));
    });
  };

  const handleResetPassword = async () => {
    if (!userProfile?.email) return;
    try {
      await sendPasswordResetEmail(auth, userProfile.email);
      toast({
        title: "Reset link sent",
        description: "Check your email to reset your password.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account preferences and profile visibility.</p>
        </div>
        <Button 
          onClick={handleUpdateUser} 
          disabled={isSaving}
          className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start h-auto p-1 bg-slate-100/50 rounded-2xl border mb-8 overflow-x-auto">
          <TabsTrigger value="profile" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">
            <ShieldCheck className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="accounts" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-md font-bold">
            <Share2 className="h-4 w-4 mr-2" /> Connected
          </TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* PROFILE SECTION */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>Update your public profile details.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                      <AvatarImage src={userProfile?.photoURL || `https://picsum.photos/seed/${userProfile?.id}/200`} />
                      <AvatarFallback className="text-2xl font-black">{userProfile?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <h3 className="text-lg font-bold">Profile Picture</h3>
                    <p className="text-sm text-slate-500">JPG, GIF or PNG. Max size of 800K.</p>
                    <div className="flex gap-2 mt-4 justify-center md:justify-start">
                      <Button variant="outline" size="sm" className="rounded-lg h-9">Upload</Button>
                      <Button variant="ghost" size="sm" className="rounded-lg h-9 text-red-500 hover:bg-red-50">Remove</Button>
                    </div>
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Full Name</Label>
                    <Input 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="rounded-xl h-11" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <Input disabled value={userProfile?.email || ''} className="pl-10 rounded-xl h-11 bg-slate-50 border-slate-200" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Phone Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <Input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 234 567 890" 
                        className="pl-10 rounded-xl h-11" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">{userProfile?.role === 'CREATOR' ? 'Niches' : 'Industry'}</Label>
                    <Input 
                      disabled 
                      value={userProfile?.role === 'CREATOR' ? creatorData?.niches?.join(', ') : brandData?.industry} 
                      className="rounded-xl h-11 bg-slate-50" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">{userProfile?.role === 'CREATOR' ? 'Biography' : 'Brand Guidelines'}</Label>
                  <Textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell brands about your style and audience..." 
                    className="rounded-xl min-h-[120px] resize-none" 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY SECTION */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl">Account Security</CardTitle>
                <CardDescription>Manage your password and authentication methods.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold">Change Password</h4>
                    <p className="text-sm text-slate-500">We'll send you a secure link to update your password.</p>
                  </div>
                  <Button onClick={handleResetPassword} variant="outline" className="rounded-xl font-bold">
                    Send Reset Link
                  </Button>
                </div>

                <Separator className="opacity-50" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-slate-100 text-slate-500 border-none uppercase text-[10px] py-0 px-2 font-bold">Not Enabled</Badge>
                    <Switch 
                      checked={userProfile?.twoFactorEnabled} 
                      onCheckedChange={() => {
                        updateDoc(doc(db, 'users', userProfile!.id), { twoFactorEnabled: !userProfile?.twoFactorEnabled });
                      }} 
                    />
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-4">
                  <h4 className="font-bold text-red-600">Danger Zone</h4>
                  <div className="p-6 rounded-2xl bg-red-50 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-red-900">Delete Account</p>
                      <p className="text-xs text-red-700">Once you delete your account, there is no going back. All campaign data will be lost.</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="rounded-xl font-bold px-6">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl p-8">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-black text-red-600">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-600 mt-4 leading-relaxed">
                            This action cannot be undone. This will permanently delete your Baalvion account
                            and remove all associated data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8 gap-3">
                          <AlertDialogCancel className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                          <AlertDialogAction className="rounded-xl font-bold bg-red-600 hover:bg-red-700">Yes, delete account</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS SECTION */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl">Notification Preferences</CardTitle>
                <CardDescription>Control how and when we reach out to you.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-0">
                {[
                  { id: 'email', title: 'Email Notifications', desc: 'Campaign invites, payout alerts, and daily digests.', icon: Mail },
                  { id: 'push', title: 'Desktop Push', desc: 'Real-time alerts for messages and deliverable updates.', icon: Smartphone },
                  { id: 'marketing', title: 'Marketing & Offers', desc: 'Product updates and platform tips to grow your reach.', icon: Globe },
                ].map((item, idx) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold">{item.title}</h4>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={userProfile?.notificationPreferences?.[item.id as keyof typeof userProfile.notificationPreferences] ?? true} 
                        onCheckedChange={() => handleTogglePref(item.id as any)} 
                      />
                    </div>
                    {idx < 2 && <Separator className="opacity-50" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACCOUNTS SECTION */}
          <TabsContent value="accounts" className="space-y-6">
            <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl">Connected Social Accounts</CardTitle>
                <CardDescription>Verify your reach to unlock premium campaigns.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[
                  { id: 'ig', name: 'Instagram', icon: Instagram, color: 'text-pink-600', connected: true, handle: '@sarah_creates' },
                  { id: 'yt', name: 'YouTube', icon: Youtube, color: 'text-red-600', connected: false },
                  { id: 'tt', name: 'TikTok', icon: Music2, color: 'text-slate-900', connected: true, handle: '@sarah_vibe' },
                ].map((plat) => (
                  <div key={plat.id} className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 bg-white hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">
                        <plat.icon className={`h-6 w-6 ${plat.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black">{plat.name}</p>
                          {plat.connected && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                        </div>
                        <p className="text-xs text-slate-400">{plat.connected ? plat.handle : 'Not connected'}</p>
                      </div>
                    </div>
                    <Button variant={plat.connected ? "secondary" : "outline"} className="rounded-xl font-bold px-6">
                      {plat.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t p-6 text-center">
                <p className="text-xs text-slate-400 font-medium w-full">
                  We use OAuth to securely verify your engagement data. We never post on your behalf.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
