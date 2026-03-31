
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Instagram, 
  Youtube, 
  Music2, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Zap, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Share2,
  ExternalLink,
  IndianRupee,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data generator for the public profile
const getCreatorData = (username: string) => ({
  fullName: 'Sarah Chen',
  username: username || 'sarah_creates',
  bio: 'Visual storyteller and tech enthusiast. I help brands reach Gen-Z through high-energy unboxings and aesthetic lifestyle content. 5+ years of experience in content production.',
  photoURL: 'https://picsum.photos/seed/sarah/400/400',
  coverURL: 'https://picsum.photos/seed/baalvion-cover/1200/400',
  location: 'Mumbai, India',
  rating: 4.9,
  reviewCount: 124,
  isVerified: true,
  niches: ['Tech & Gadgets', 'Lifestyle', 'Gaming', 'Education'],
  socialStats: {
    instagram: { followers: '850k', er: '5.8%', color: 'text-pink-600', icon: Instagram },
    youtube: { followers: '1.2M', er: '4.2%', color: 'text-red-600', icon: Youtube },
    tiktok: { followers: '420k', er: '8.1%', color: 'text-slate-900', icon: Music2 },
  },
  baseRates: [
    { deliverable: 'Instagram Reel (30-60s)', price: '₹45,000' },
    { deliverable: 'YouTube Dedicated Video', price: '₹1,20,000' },
    { deliverable: 'TikTok Product Showcase', price: '₹35,000' },
    { deliverable: 'Static Feed Post + Story', price: '₹25,000' },
  ],
  portfolio: [
    { id: 1, title: 'Lumina Tech Unboxing', type: 'VIDEO', url: 'https://picsum.photos/seed/p1/600/800' },
    { id: 2, title: 'EcoVibe Lifestyle Shot', type: 'IMAGE', url: 'https://picsum.photos/seed/p2/600/800' },
    { id: 3, title: 'Gaming Setup Tour', type: 'VIDEO', url: 'https://picsum.photos/seed/p3/600/800' },
    { id: 4, title: 'Morning Routine', type: 'VIDEO', url: 'https://picsum.photos/seed/p4/600/800' },
  ],
  reviews: [
    { id: 1, user: 'Lumina Tech', rating: 5, comment: 'Sarah delivered ahead of schedule and the content quality was exceptional. Our ROI was 4.2x.', date: '2 months ago' },
    { id: 2, user: 'FitFlow', rating: 5, comment: 'Highly professional. Her audience is very engaged and actually asks questions about the product.', date: '4 months ago' },
  ]
});

export default function CreatorPublicProfile() {
  const params = useParams();
  const username = params.username as string;
  const data = getCreatorData(username);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero / Header Section */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <Image 
          src={data.coverURL} 
          alt="Cover" 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="container relative h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full text-center md:text-left">
            <div className="relative group">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-2xl ring-4 ring-primary/20">
                <AvatarImage src={data.photoURL} />
                <AvatarFallback className="text-4xl font-black">S</AvatarFallback>
              </Avatar>
              {data.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                  <CheckCircle2 className="h-8 w-8 text-primary fill-primary/10" />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-2 mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  {data.fullName}
                </h1>
                <Badge className="bg-primary/20 backdrop-blur-md border-primary/30 text-white w-fit self-center">
                  @{data.username}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {data.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> 
                  {data.rating} ({data.reviewCount} Reviews)
                </span>
              </div>
            </div>

            <div className="flex gap-3 mb-2">
              <Button size="lg" className="rounded-xl font-bold shadow-xl shadow-primary/20 px-8">
                Work with Sarah <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white hover:text-primary transition-all">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details & Portfolio */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* About Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" /> About Sarah
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              {data.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {data.niches.map(niche => (
                <Badge key={niche} variant="secondary" className="rounded-lg px-4 py-1.5 bg-white border-slate-200 text-slate-600 font-bold hover:border-primary transition-colors">
                  {niche}
                </Badge>
              ))}
            </div>
          </section>

          {/* Social Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.socialStats).map(([platform, stats]: [string, any]) => (
              <Card key={platform} className="border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <stats.icon className={`h-6 w-6 ${stats.color}`} />
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black">
                      VERIFIED REACH
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{platform}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">{stats.followers}</span>
                      <span className="text-xs font-bold text-slate-400">Fans</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {stats.er} Avg. ER
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Portfolio Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Recent Collaborations
              </h3>
              <Button variant="link" className="text-primary font-bold">View Full Portfolio</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.portfolio.map((item) => (
                <div key={item.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                  <Image src={item.url} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-xs font-black text-white/80 uppercase mb-1">{item.type}</p>
                    <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Brand Feedback
            </h3>
            <div className="space-y-4">
              {data.reviews.map(review => (
                <Card key={review.id} className="border-none shadow-sm shadow-slate-200/50 rounded-2xl bg-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-100">
                          <AvatarFallback className="bg-primary/5 text-primary font-bold">{review.user[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900">{review.user}</p>
                          <p className="text-xs text-slate-400 font-medium">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Rate Card & CTA */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Match Score (For Brand context) */}
          <Card className="border-none shadow-xl shadow-primary/10 rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-indigo-700 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                </div>
                <Badge className="bg-white/20 text-white border-none backdrop-blur-md font-bold">SMART MATCH</Badge>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-xs font-black uppercase tracking-widest text-white/60">Campaign Fit Score</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-5xl font-black">98%</h4>
                  <span className="text-sm font-bold text-white/80">Excellent</span>
                </div>
                <Progress value={98} className="h-2 bg-white/20" />
              </div>
              <p className="text-sm text-white/80 font-medium leading-relaxed">
                Sarah's audience demographics align perfectly with premium lifestyle brands. Her high engagement rate on Reels suggests viral potential for product launches.
              </p>
            </CardContent>
          </Card>

          {/* Rate Card */}
          <Card className="border-none shadow-sm shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/50 py-6 px-8">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" /> Rate Card
              </CardTitle>
              <CardDescription className="font-medium">Estimated base rates for 2024</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {data.baseRates.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-bold text-slate-700">{item.deliverable}</span>
                    <span className="text-md font-black text-primary">{item.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex flex-col gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 items-start border border-slate-100 mt-6">
                <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 font-medium">Rates are negotiable based on campaign volume and usage rights.</p>
              </div>
              <Button size="lg" className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20">
                Send Campaign Invite
              </Button>
            </CardFooter>
          </Card>

          {/* Trust Seal */}
          <div className="p-6 rounded-3xl bg-slate-100/50 border border-dashed border-slate-300 flex flex-col items-center text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase">Secure Collaboration</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Payments held in escrow. Content verified by Baalvion AI before payout.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
