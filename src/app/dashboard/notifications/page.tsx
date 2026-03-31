
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Zap, 
  Briefcase, 
  Wallet, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  CheckCheck, 
  Trash2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { userProfile } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all notifications for the user
  const nQuery = useMemo(() => {
    if (!userProfile?.id) return null;
    return query(
      collection(db, 'notifications'),
      where('userId', '==', userProfile.id),
      orderBy('createdAt', 'desc')
    );
  }, [db, userProfile?.id]);

  const { data: notifications, loading } = useCollection<Notification>(nQuery);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'ALL' || n.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [notifications, searchQuery, activeTab]);

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;

    const batch = writeBatch(db);
    unread.forEach(n => {
      batch.update(doc(db, 'notifications', n.id), { read: true });
    });
    await batch.commit();
  };

  const deleteRead = async () => {
    const read = notifications.filter(n => n.read);
    const batch = writeBatch(db);
    read.forEach(n => {
      batch.delete(doc(db, 'notifications', n.id));
    });
    await batch.commit();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'CAMPAIGN': return <Zap className="h-5 w-5 text-primary" />;
      case 'PAYMENT': return <Wallet className="h-5 w-5 text-emerald-500" />;
      case 'MESSAGE': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'SYSTEM': return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
          </h1>
          <p className="text-slate-500 mt-1">Stay updated on your campaign activity and financial status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold bg-white" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="ghost" className="rounded-xl font-bold text-red-500 hover:text-red-600 hover:bg-red-50" onClick={deleteRead}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-6 border-b bg-slate-50/50">
              <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" /> Filter Inbox
              </h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search alerts..." 
                  className="pl-10 h-11 rounded-xl bg-slate-50 border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                {[
                  { id: 'ALL', label: 'All Notifications', icon: Bell },
                  { id: 'CAMPAIGN', label: 'Campaigns', icon: Zap },
                  { id: 'PAYMENT', label: 'Payments', icon: Wallet },
                  { id: 'MESSAGE', label: 'Messages', icon: MessageSquare },
                  { id: 'SYSTEM', label: 'System Alerts', icon: ShieldAlert },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                      activeTab === tab.id ? "bg-primary text-white shadow-lg" : "hover:bg-slate-50 text-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                      <span className="text-sm font-bold">{tab.label}</span>
                    </div>
                    {notifications.filter(n => !n.read && (tab.id === 'ALL' || n.type === tab.id)).length > 0 && (
                      <Badge className={cn("h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full border-none text-[10px] font-black", activeTab === tab.id ? "bg-white text-primary" : "bg-primary text-white")}>
                        {notifications.filter(n => !n.read && (tab.id === 'ALL' || n.type === tab.id)).length}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary/5 text-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5" />
                <h4 className="font-bold text-sm uppercase tracking-widest">Smart Digest</h4>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                You have <span className="font-black">{notifications.filter(n => !n.read && n.type === 'CAMPAIGN').length}</span> new campaign opportunities matching your profile today.
              </p>
              <Button variant="link" className="text-primary font-bold p-0 h-auto text-xs mt-4 group">
                Review Matches <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main List */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((n, idx) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                  >
                    <Card className={cn(
                      "border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-md transition-all",
                      !n.read ? "bg-white ring-1 ring-primary/10" : "bg-white/60 opacity-80"
                    )}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          <div className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 transition-colors",
                            !n.read ? "bg-white" : "bg-slate-50"
                          )}>
                            {getIcon(n.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-4">
                              <h3 className={cn("text-lg truncate", !n.read ? "font-black text-slate-900" : "font-bold text-slate-600")}>
                                {n.title}
                              </h3>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter shrink-0">
                                {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                              {n.message}
                            </p>
                            
                            <div className="flex items-center gap-4 pt-3">
                              {!n.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 rounded-lg text-[10px] font-black uppercase text-primary hover:bg-primary/5 p-0 px-3"
                                  onClick={() => updateDoc(doc(db, 'notifications', n.id), { read: true })}
                                >
                                  Mark as Read
                                </Button>
                              )}
                              {n.link && (
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  className="h-8 rounded-lg text-[10px] font-black uppercase px-4"
                                  onClick={() => router.push(n.link!)}
                                >
                                  Take Action <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 p-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteDoc(doc(db, 'notifications', n.id))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                <Bell className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Quiet in here...</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
                {searchQuery ? "We couldn't find any notifications matching your search." : "When brands interact with your applications or payments clear, you'll see them here."}
              </p>
              {searchQuery && (
                <Button variant="outline" className="mt-8 rounded-xl font-bold" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
