'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Zap, 
  Star, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  MapPin, 
  IndianRupee, 
  Instagram, 
  Youtube, 
  Music2, 
  X, 
  Plus, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  List,
  Bookmark,
  Scale,
  Loader2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CREATOR_NICHES, SOCIAL_PLATFORMS, COUNTRIES } from '@/constants';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Robust Mock Data for Discovery
const MOCK_CREATORS = [
  { id: '1', name: 'Sarah Chen', handle: 'sarah_tech', niches: ['Tech & Gadgets', 'Education'], followers: 850000, er: 5.8, location: 'India', price: 12500, isVerified: true, platform: 'YouTube', match: 98, image: 'https://picsum.photos/seed/sarah/400/400', bio: 'AI researcher and gadget enthusiast. I help brands tell technical stories through lifestyle content.' },
  { id: '2', name: 'Alex Rivers', handle: 'alex_creates', niches: ['Photography', 'Travel & Adventure'], followers: 320000, er: 7.2, location: 'United Kingdom', price: 8500, isVerified: true, platform: 'Instagram', match: 94, image: 'https://picsum.photos/seed/alex/400/400', bio: 'Nomadic storyteller focusing on visual excellence. Award-winning aerial photographer.' },
  { id: '3', name: 'Marcus Thorne', handle: 'm_fitness', niches: ['Fitness & Wellness', 'Lifestyle'], followers: 1200000, er: 4.1, location: 'United States', price: 25000, isVerified: true, platform: 'TikTok', match: 91, image: 'https://picsum.photos/seed/marcus/400/400', bio: 'Elite performance coach. Helping people reach their peak through science-based training.' },
  { id: '4', name: 'Elena Vance', handle: 'elena_style', niches: ['Fashion & Style', 'Art & Design'], followers: 450000, er: 6.5, location: 'France', price: 15000, isVerified: false, platform: 'Instagram', match: 89, image: 'https://picsum.photos/seed/elena/400/400', bio: 'Parisian fashion curator. Minimalist aesthetics and high-end street style.' },
  { id: '5', name: 'David Miller', handle: 'dave_cooks', niches: ['Food & Cooking', 'DIY & Crafts'], followers: 280000, er: 8.9, location: 'India', price: 6000, isVerified: true, platform: 'YouTube', match: 96, image: 'https://picsum.photos/seed/david/400/400', bio: 'Traditional recipes with a modern twist. I make complex cooking accessible to everyone.' },
  { id: '6', name: 'Sophie Laurent', handle: 'sophie_wellness', niches: ['Mental Health', 'Self-Improvement'], followers: 150000, er: 9.4, location: 'Canada', price: 4500, isVerified: true, platform: 'TikTok', match: 92, image: 'https://picsum.photos/seed/sophie/400/400', bio: 'Mindfulness and mental health advocate. Creating a safer space on the internet.' },
];

export default function CreatorSearchPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [minFollowers, setMinFollowers] = useState([0]);
  const [maxPrice, setMaxPrice] = useState([50000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [aiRecommended, setAiRecommended] = useState(false);
  
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const filteredCreators = useMemo(() => {
    return MOCK_CREATORS.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.handle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchNiche = selectedNiches.length === 0 || selectedNiches.some(n => c.niches.includes(n));
      const matchPlatform = selectedPlatform === 'all' || c.platform === selectedPlatform;
      const matchFollowers = c.followers >= minFollowers[0] * 1000;
      const matchPrice = c.price <= maxPrice[0];
      const matchVerified = !verifiedOnly || c.isVerified;
      
      return matchSearch && matchNiche && matchPlatform && matchFollowers && matchPrice && matchVerified;
    }).sort((a, b) => aiRecommended ? b.match - a.match : 0);
  }, [searchQuery, selectedNiches, selectedPlatform, minFollowers, maxPrice, verifiedOnly, aiRecommended]);

  const toggleShortlist = (id: string) => {
    setShortlist(prev => {
      const exists = prev.includes(id);
      if (!exists) toast({ title: "Creator Shortlisted", description: "Added to your campaign talent pool." });
      return exists ? prev.filter(i => i !== id) : [...prev, id];
    });
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      const exists = prev.includes(id);
      if (!exists && prev.length >= 3) {
        toast({ variant: "destructive", title: "Limit Reached", description: "You can compare up to 3 creators at a time." });
        return prev;
      }
      return exists ? prev.filter(i => i !== id) : [...prev, id];
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Talent Discovery</h1>
          <p className="text-slate-500 font-medium">Search across 10,000+ verified creators with AI performance scores.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className={cn("rounded-xl font-bold h-11 px-6 border-slate-200 transition-all", compareList.length > 0 && "border-primary bg-primary/5 text-primary")}
            onClick={() => setIsCompareOpen(true)}
            disabled={compareList.length < 2}
          >
            <Scale className="mr-2 h-4 w-4" />
            Compare ({compareList.length})
          </Button>
          <Badge className="bg-primary text-white h-11 px-4 rounded-xl flex items-center gap-2 border-none">
            <Zap className="h-4 w-4 fill-white" />
            <span className="font-black">AI ANALYTICS ACTIVE</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white sticky top-24">
            <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" /> Filter Talent
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[10px] font-black uppercase text-slate-400 hover:text-primary"
                onClick={() => {
                  setSelectedNiches([]);
                  setSelectedPlatform('all');
                  setMinFollowers([0]);
                  setMaxPrice([50000]);
                  setVerifiedOnly(false);
                }}
              >
                Reset
              </Button>
            </div>
            <CardContent className="p-6 space-y-8">
              {/* AI Toggle */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-primary uppercase">AI Recommendations</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Boost best matches</p>
                </div>
                <Checkbox checked={aiRecommended} onCheckedChange={(v) => setAiRecommended(!!v)} className="h-5 w-5 rounded-md" />
              </div>

              {/* Text Search */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Creator Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Name or @handle..." 
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-none focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Niches */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Niche</label>
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                  {CREATOR_NICHES.slice(0, 15).map(n => (
                    <div key={n} className="flex items-center gap-2">
                      <Checkbox 
                        id={`niche-${n}`} 
                        checked={selectedNiches.includes(n)}
                        onCheckedChange={(v) => {
                          setSelectedNiches(prev => v ? [...prev, n] : prev.filter(i => i !== n));
                        }}
                      />
                      <label htmlFor={`niche-${n}`} className="text-xs font-bold text-slate-600 cursor-pointer">{n}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Platform</label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-bold">All Platforms</SelectItem>
                    <SelectItem value="Instagram" className="font-bold">Instagram</SelectItem>
                    <SelectItem value="YouTube" className="font-bold">YouTube</SelectItem>
                    <SelectItem value="TikTok" className="font-bold">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Scale Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Min. Followers</label>
                  <span className="text-xs font-black text-primary">{minFollowers[0]}k+</span>
                </div>
                <Slider value={minFollowers} onValueChange={setMinFollowers} max={1000} step={50} />
              </div>

              {/* Price Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Max Rate (₹)</label>
                  <span className="text-xs font-black text-emerald-600">₹{maxPrice[0].toLocaleString()}</span>
                </div>
                <Slider value={maxPrice} onValueChange={setMaxPrice} max={100000} step={1000} />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-slate-900 uppercase">Verified Only</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Pro level creators</p>
                </div>
                <Checkbox checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(!!v)} />
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Search Results */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between px-2">
            <p className="text-sm font-medium text-slate-500">
              Found <span className="text-slate-900 font-black">{filteredCreators.length}</span> creators matching your criteria
            </p>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sort:</label>
              <Select defaultValue="match">
                <SelectTrigger className="h-9 w-32 rounded-lg bg-white border-slate-200 text-xs font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match" className="font-bold">By Match</SelectItem>
                  <SelectItem value="reach" className="font-bold">By Reach</SelectItem>
                  <SelectItem value="price" className="font-bold">Lowest Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              {filteredCreators.map((creator, idx) => (
                <CreatorResultCard 
                  key={creator.id} 
                  creator={creator} 
                  index={idx}
                  isShortlisted={shortlist.includes(creator.id)}
                  isComparing={compareList.includes(creator.id)}
                  onShortlist={() => toggleShortlist(creator.id)}
                  onCompare={() => toggleCompare(creator.id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredCreators.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Search className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">No creators found</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Try broadening your filters or adjusting your budget parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Drawer/Dialog */}
      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="max-w-5xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-50 p-12 overflow-y-auto max-h-[90vh]">
            <div className="text-center mb-12">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Side-by-Side Comparison</h2>
              <p className="text-slate-500 font-medium mt-1">Benchmarking metrics for your selected shortlist.</p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {compareList.map(id => {
                const c = MOCK_CREATORS.find(item => item.id === id)!;
                return (
                  <Card key={id} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="h-40 relative">
                        <img src={c.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="font-black text-lg leading-none">{c.name}</p>
                          <p className="text-xs font-bold opacity-80 mt-1">@{c.handle}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Rate</p>
                          <p className="text-lg font-black text-emerald-600">₹{c.price.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Match Score</p>
                          <p className="text-lg font-black text-primary">{c.match}%</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-400 flex items-center gap-2"><Users className="h-4 w-4" /> Reach</span>
                          <span className="text-slate-900">{(c.followers / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-400 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Engagement</span>
                          <span className="text-emerald-600">{c.er}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-400 flex items-center gap-2"><MapPin className="h-4 w-4" /> Region</span>
                          <span className="text-slate-900">{c.location}</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Top Niches</p>
                        <div className="flex flex-wrap gap-1.5">
                          {c.niches.map(n => <Badge key={n} variant="secondary" className="bg-slate-50 text-[9px] font-bold border-none h-5">{n}</Badge>)}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button className="w-full rounded-xl font-bold">Send Campaign Invite</Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreatorResultCard({ creator, index, isShortlisted, isComparing, onShortlist, onCompare }: { 
  creator: any, 
  index: number,
  isShortlisted: boolean,
  isComparing: boolean,
  onShortlist: () => void,
  onCompare: () => void
}) {
  const getPlatformIcon = (p: string) => {
    switch (p) {
      case 'YouTube': return <Youtube className="h-4 w-4 text-red-600" />;
      case 'Instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'TikTok': return <Music2 className="h-4 w-4 text-slate-900" />;
      default: return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2.5rem] overflow-hidden bg-white group ring-1 ring-slate-100 flex flex-col h-full relative">
        <CardHeader className="p-6 pb-2">
          <div className="flex items-start justify-between mb-4">
            <div className="relative group/avatar">
              <Avatar className="h-16 w-16 rounded-2xl border-2 border-white shadow-md ring-4 ring-primary/5">
                <AvatarImage src={creator.image} />
                <AvatarFallback className="font-black text-lg bg-primary/5 text-primary">{creator.name[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-slate-50">
                {getPlatformIcon(creator.platform)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="bg-primary/5 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-primary/10">
                <Zap className="h-3 w-3 text-primary fill-primary" />
                <span className="text-[10px] font-black text-primary uppercase">{creator.match}% Match</span>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onCompare}
                  className={cn("h-8 w-8 rounded-full transition-all", isComparing ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-100 hover:text-primary")}
                >
                  <Scale className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onShortlist}
                  className={cn("h-8 w-8 rounded-full transition-all", isShortlisted ? "bg-orange-100 text-orange-600" : "text-slate-300 hover:bg-slate-100 hover:text-orange-500")}
                >
                  <Bookmark className={cn("h-4 w-4", isShortlisted && "fill-current")} />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 leading-tight flex items-center gap-1.5 truncate">
              {creator.name}
              {creator.isVerified && <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500/10" />}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">@{creator.handle}</p>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 flex-1 space-y-6">
          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed italic">
            "{creator.bio}"
          </p>

          <div className="flex flex-wrap gap-1.5">
            {creator.niches.map((n: string) => (
              <Badge key={n} variant="secondary" className="bg-slate-50 text-slate-500 border-none font-black text-[9px] uppercase tracking-tighter px-2 h-5">
                {n}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Users className="h-2.5 w-2.5" /> Reach
              </p>
              <p className="text-sm font-black text-slate-900">{(creator.followers / 1000).toFixed(0)}k</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5 text-emerald-500" /> Engagement
              </p>
              <p className="text-sm font-black text-emerald-600">{creator.er}%</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-slate-50 bg-slate-50/30">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Starting Rate</p>
            <p className="text-md font-black text-slate-900">₹{creator.price.toLocaleString()}</p>
          </div>
          <Link href={`/creator/${creator.handle}`}>
            <Button size="sm" className="rounded-xl font-bold h-9 px-6 shadow-lg shadow-primary/20">
              View Analytics
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
