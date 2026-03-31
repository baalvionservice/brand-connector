
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Users, ShieldCheck, Zap, ArrowRight, BarChart3, Star } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
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
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="hidden sm:inline-flex">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-2">
                The Future of Influencer Marketing
              </div>
              <h1 className="text-3xl font-headline font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-4xl">
                Empowering Brands and Creators to <span className="text-primary italic">Thrive</span> Together
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl font-light">
                Baalvion Connect is the premier AI-driven marketplace for meaningful brand collaborations. Simple. Secure. Smart.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg">
                  I'm a Brand <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-primary text-primary hover:bg-primary/5">
                  I'm a Creator
                </Button>
              </div>
            </div>
          </div>
          {/* Hero Decorative Images */}
          <div className="container mt-16 flex justify-center">
            <div className="relative w-full max-w-5xl aspect-[21/9] rounded-2xl border-8 border-background shadow-2xl overflow-hidden">
              <Image 
                src="https://picsum.photos/seed/baalvion-hero/1200/500" 
                alt="Dashboard Preview" 
                fill 
                className="object-cover"
                priority
                data-ai-hint="dashboard design"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-5xl">Everything You Need to Scale</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Powerful tools built for both sides of the marketplace, powered by advanced matching algorithms.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Matching",
                  desc: "Our proprietary algorithm finds the perfect creators for your specific brand objectives and audience.",
                  icon: Zap,
                  color: "bg-purple-100 text-purple-600"
                },
                {
                  title: "Secure Payments",
                  desc: "Funds are held in escrow and released only when deliverables are approved. Total peace of mind.",
                  icon: ShieldCheck,
                  color: "bg-green-100 text-green-600"
                },
                {
                  title: "Insightful Analytics",
                  desc: "Track ROI, engagement rates, and campaign performance in real-time with deep data integration.",
                  icon: BarChart3,
                  color: "bg-blue-100 text-blue-600"
                },
                {
                  title: "Seamless Workflow",
                  desc: "From initial pitch to final deliverable, manage every step of the campaign within one unified platform.",
                  icon: Users,
                  color: "bg-orange-100 text-orange-600"
                },
                {
                  title: "Verified Profiles",
                  desc: "We vet every brand and creator to ensure a high-quality community of real people and businesses.",
                  icon: Star,
                  color: "bg-yellow-100 text-yellow-600"
                },
                {
                  title: "Real-time Chat",
                  desc: "Direct communication between brands and creators ensures alignment on vision and requirements.",
                  icon: Rocket,
                  color: "bg-red-100 text-red-600"
                }
              ].map((feature, i) => (
                <div key={i} className="group relative bg-background p-8 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-xl ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-5xl">Ready to Start Your Next Big Collaboration?</h2>
              <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
                Join thousands of creators and brands already growing their reach on Baalvion Connect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" variant="secondary" className="rounded-full px-8 font-bold">
                  Create Free Account
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent text-white border-white hover:bg-white/10">
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
                <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
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
