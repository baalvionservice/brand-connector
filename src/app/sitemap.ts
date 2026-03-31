import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baalvion-connect.vercel.app';
  
  // In a real app, you might fetch campaigns or creators IDs to generate dynamic paths
  const routes = [
    '',
    '/auth/login',
    '/auth/signup',
    '#features',
    '#how-it-works',
    '#pricing',
    '#faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
