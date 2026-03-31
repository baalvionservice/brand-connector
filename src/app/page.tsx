'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, ShieldCheck, Zap, ArrowRight, BarChart3, Star, Users, Cpu, UserCheck, Globe } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ParticlesBackground } from '@/components/landing/ParticlesBackground';
import { StatsBanner } from '@/components/landing/StatsBanner';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { MatchingDemo } from '@/components/landing/MatchingDemo';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';

export default function LandingPage() {
  const features = [
    {
      title: "AI Matching Engine",
      desc: "Our proprietary algorithm finds the perfect creators for your specific brand objectives and audience demographics.",
      icon: Cpu,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Escrow Payments",
      desc: "Funds are held in escrow and released only when deliverables are approved. Total security for both parties.",
      icon: ShieldCheck,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Deep Analytics",
      desc: "Track ROI, engagement rates, and campaign performance in real-time with deep data integration and reporting.",
      icon: BarChart3,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Creator Verification",
      desc: "We vet every creator to ensure a high-quality community of real people with verified performance statistics.",
      icon: UserCheck,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Multi-Currency",
      desc: "Support for global campaigns with automatic currency conversion and localized payment methods worldwide.",
      icon: Globe,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      title: "Community Hub",
      desc: "Connect with other creators and brands in our exclusive forum to share insights and marketing best practices.",
      icon: Users,
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center" href="#">
          <div className="bg-primary p-1.5 rounded-lg mr-2">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">Baalvion <span className="text-primary">Connect</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="hidden sm:inline-flex rounded-full">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#4c1d95] via-[#312e81] to-[#1e1b4b] text-white py-12 lg:py-0">
          <ParticlesBackground />
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col space-y-8"
              >
                <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-primary-foreground border border-white/20 backdrop-blur-sm w-fit">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400 fill-yellow-400" />
                  AI-Powered Market Insights
                </div>
                
                <h1 className="text-4xl font-headline font-extrabold tracking-tighter sm:text-6xl xl:text-7xl/none">
                  Connect Brands with <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
                    Creators Who Deliver <br /> Real ROI
                  </span>
                </h1>
                
                <p className="max-w-[600px] text-indigo-100/80 md:text-xl font-light leading-relaxed">
                  The data-driven marketplace where performance meets creativity. 
                  Skip the guesswork and start building campaigns that actually convert.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-white text-indigo-900 hover:bg-indigo-50 shadow-xl shadow-indigo-900/20">
                    Start as Brand <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur-sm">
                    Join as Creator
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-[#312e81] overflow-hidden">
                        <Image 
                          src={`https://picsum.photos/seed/user-${i}/100/100`} 
                          alt="User" 
                          width={40} 
                          height={40} 
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-indigo-200/60">
                    Trusted by <span className="text-white font-bold">2,500+</span> creators worldwide
                  </p>
                </div>
              </motion.div>

              {/* Right Mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="relative hidden lg:block"
              >
                <div className="relative z-20 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-md shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="aspect-[16/10] relative rounded-xl overflow-hidden border border-white/10 shadow-inner">
                    <Image 
                      src="https://picsum.photos/seed/baalvion-dashboard/1000/625" 
                      alt="Baalvion Dashboard" 
                      fill 
                      className="object-cover"
                      priority
                      data-ai-hint="dashboard design"
                    />
                    {/* Floating elements inside mockup */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg text-indigo-900 flex items-center gap-3 animate-bounce">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-60">Engagement</p>
                        <p className="text-sm font-extrabold">+24.8%</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/20 blur-[100px] -z-10 rounded-full" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Banner Section */}
        <StatsBanner />

        {/* How It Works Section */}
        <HowItWorks />

        {/* AI Matching Demo Section */}
        <MatchingDemo />

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32 bg-slate-50 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-5xl">Everything You Need to Scale</h2>
                <p className="max-w-[900px] text-muted-foreground mt-4 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Powerful tools built for both sides of the marketplace, powered by advanced matching algorithms and secure infrastructure.
                </p>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative bg-background p-8 rounded-2xl border transition-all hover:shadow-xl hover:border-primary/20"
                >
                  <div className={`mb-6 w-14 h-14 flex items-center justify-center rounded-2xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  <Link href="#" className="inline-flex items-center text-sm font-bold text-primary hover:underline group/link">
                    Learn More <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Pricing Section */}
        <Pricing />

        {/* CTA Section */}
        <section className="w-full py-24 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-5xl">Ready to Start Your Next Big Collaboration?</h2>
              <p className="max-w-[600px] text-primary-foreground/80 md:text-xl font-light">
                Join thousands of creators and brands already growing their reach on Baalvion Connect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" variant="secondary" className="rounded-full px-8 font-bold text-lg h-14">
                  Create Free Account
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent text-white border-white/30 hover:bg-white/10 h-14 text-lg">
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-slate-900 text-slate-300">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link className="flex items-center mb-6" href="#">
                <Rocket className="h-8 w-8 text-primary mr-2" />
                <span className="font-headline font-bold text-2xl text-white">Baalvion</span>
              </Link>
              <p className="max-w-xs mb-6 text-sm">
                The leading influencer marketplace connecting visionary brands with world-class creative talent.
              </p>
            </div>
            <div>
              <h4 className="font-headline font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">Campaign Discovery</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">AI Matching</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2024 Baalvion Connect. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-primary">Twitter</Link>
              <Link href="#" className="hover:text-primary">LinkedIn</Link>
              <Link href="#" className="hover:text-primary">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
