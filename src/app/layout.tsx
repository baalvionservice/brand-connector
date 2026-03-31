import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { generateMetadata } from '@/lib/seo';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = generateMetadata();

export const viewport: Viewport = {
  themeColor: '#6C3AE8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Baalvion Connect',
    url: 'https://baalvion-connect.vercel.app',
    logo: 'https://baalvion-connect.vercel.app/logo.png',
    sameAs: [
      'https://twitter.com/baalvion',
      'https://linkedin.com/company/baalvion',
      'https://instagram.com/baalvion',
    ],
    description: 'The premier marketplace connecting innovative brands with creative talent using AI-powered matching.',
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Baalvion Connect',
    url: 'https://baalvion-connect.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://baalvion-connect.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
