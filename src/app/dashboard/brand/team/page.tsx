
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Trash2, 
  ShieldCheck, 
  Loader2, 
  Mail, 
  Clock, 
  CheckCircle2, 
  UserCircle,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, doc, deleteDoc, updateDoc, addDoc, orderBy } from 'firebase/firestore';
import { BrandMember, BrandMemberRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ROLE_CONFIG: Record<BrandMemberRole, { label: string, color: string, desc: string }> = {
  OWNER: { label: 'Owner', color: 'bg-slate-900 text-white', desc: 'Full administrative control including billing and team management.' },
  MANAGER: { label: 'Manager', color: 'bg-primary text-white', desc: 'Full access to campaigns, talent sourcing, and messaging.' },
  REVIEWER: { label: 'Reviewer', color: 'bg-orange-100 text-orange-600', desc: 'Can review and approve deliverables. Read-only for billing.' },
  VIEWER: { label: 'Viewer', color: 'bg-slate-100 text-slate-500', desc: 'Read-only access to campaign analytics and creator profiles.' }
};

export default function TeamManagementPage() {
  const { userProfile } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<BrandMemberRole>('MANAGER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Team Members
  const brandId = userProfile?.id ? `brand_${userProfile.id}` : null;
  const membersQuery = useMemo(() => {
    if (!brandId) return null;
    return query(
      collection(db, 'brands', brandId, 'members'),
      orderBy('joinedAt', 'desc')
    );
  }, [db, brandId]);

  const { data: members, loading } = useCollection<BrandMember>(membersQuery);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const currentUserMember = useMemo(() => 
    members.find(m => m.userId === userProfile?.id),
    [members, userProfile?.id]
  );

  const isOwner = currentUserMember?.role === 'OWNER';

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !brandId) return;
    setIsSubmitting(true);

    const memberData = {
      userId: `invited_${Math.random().toString(36).substring(7)}`, // Mock ID for invite
      email: inviteEmail,
      role: inviteRole,
      joinedAt: new Date().toISOString(),
      lastActive: 'Never'
    };

    try {
      await addDoc(collection(db, 'brands', brandId, 'members'), memberData);
      toast({ title: "Invitation sent", description: `${inviteEmail} has been added to the team.` });
      setInviteEmail('');
      setIsInviteOpen(false);
    } catch (err: any) {
      errorEmitter.emitPermissionError(new FirestorePermissionError({
        path: `/brands/${brandId}/members`,
        operation: 'create',
        requestResourceData: memberData
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!brandId) return;
    try {
      await deleteDoc(doc(db, 'brands', brandId, 'members', memberId));
      toast({ title: "Member removed" });
    } catch (e) {
      toast({ variant: 'destructive', title: "Failed to remove member" });
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: BrandMemberRole) => {
    if (!brandId) return;
    try {
      await updateDoc(doc(db, 'brands', brandId, 'members', memberId), { role: newRole });
      toast({ title: "Role updated" });
    } catch (e) {
      toast({ variant: 'destructive', title: "Failed to update role" });
    }
  };

  const handleTransferOwnership = async (memberId: string) => {
    if (!brandId || !currentUserMember) return;
    
    try {
      // 1. Demote self to Manager
      await updateDoc(doc(db, 'brands', brandId, 'members', currentUserMember.id), { role: 'MANAGER' });
      // 2. Promote target to Owner
      await updateDoc(doc(db, 'brands', brandId, 'members', memberId), { role: 'OWNER' });
      
      toast({ title: "Ownership transferred", description: "You are now a Manager." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Transfer failed" });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Workspace</h1>
          <p className="text-slate-500 font-medium">Manage collaborators and define project access levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 h-11 px-6">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Collaborator
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
              <DialogHeader>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-black">Invite Team Member</DialogTitle>
                <DialogDescription>Add a colleague to your brand account with specific permissions.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <Input 
                      placeholder="name@company.com" 
                      className="pl-10 h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Assign Role</Label>
                  <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key} className="font-bold">
                          <div className="flex flex-col">
                            <span>{config.label}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{config.desc}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInvite} disabled={!inviteEmail || isSubmitting} className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20">
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Member List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search team members..." 
                className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/5 text-primary border-none h-8 px-3 font-bold">
                {members.length} Members
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing team directory...</p>
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredMembers.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                  >
                    <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white hover:shadow-md transition-all group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Avatar className="h-12 w-12 rounded-xl border border-slate-100 shadow-sm shrink-0">
                              <AvatarFallback className="bg-primary/5 text-primary font-black">
                                {member.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 truncate">{member.email}</h3>
                                {member.userId === userProfile?.id && <Badge className="bg-slate-100 text-slate-400 text-[8px] h-4">YOU</Badge>}
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                <Clock className="h-3 w-3" /> Last active: {member.lastActive || 'Just now'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <Badge className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border-none", ROLE_CONFIG[member.role].color)}>
                              {ROLE_CONFIG[member.role].label}
                            </Badge>

                            {isOwner && member.userId !== userProfile?.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                                  <DropdownMenuLabel>Modify Access</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'MANAGER')} className="rounded-lg font-bold">
                                    Change to Manager
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'REVIEWER')} className="rounded-lg font-bold">
                                    Change to Reviewer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'VIEWER')} className="rounded-lg font-bold">
                                    Change to Viewer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleTransferOwnership(member.id)} className="rounded-lg font-bold text-orange-600">
                                    <ShieldAlert className="mr-2 h-4 w-4" /> Transfer Ownership
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="rounded-lg font-bold text-red-600 hover:bg-red-50">
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove from Team
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center">
              <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6">
                <Users className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">No team members found</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Invite colleagues to help manage your campaigns and review creator content.</p>
            </div>
          )}
        </div>

        {/* Permissions Guide */}
        <aside className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Permission Levels</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                <div key={role} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", config.color.split(' ')[0])} />
                    <span className="text-sm font-black text-slate-900">{config.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium pl-4">{config.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-primary/10 rounded-3xl overflow-hidden bg-slate-900 text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <ShieldCheck className="h-16 w-16" />
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">Secure Workspace</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Team members can only access data relevant to their assigned role. Payout authorization always requires Owner or Manager approval.
                </p>
              </div>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl h-12 text-[10px] uppercase tracking-widest">
                Security Policy Docs
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-white border border-dashed border-slate-300 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase">Need more seats?</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Your current plan supports up to 10 team members. Upgrade to Enterprise for unlimited seats.
              </p>
            </div>
            <Button variant="link" className="text-xs font-bold text-primary h-auto p-0">Upgrade Plan</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
