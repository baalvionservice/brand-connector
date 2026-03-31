
import { CampaignStatus, ApplicationStatus, UserRole } from '@/types';

export const MOCK_BRANDS = [
  { id: 'b1', name: 'Lumina Tech', industry: 'Technology', logo: 'https://picsum.photos/seed/lumina/200' },
  { id: 'b2', name: 'EcoVibe', industry: 'Sustainability', logo: 'https://picsum.photos/seed/ecovibe/200' },
  { id: 'b3', name: 'FitFlow', industry: 'Health & Fitness', logo: 'https://picsum.photos/seed/fitflow/200' },
  { id: 'b4', name: 'Velvet Moon', industry: 'Fashion', logo: 'https://picsum.photos/seed/velvet/200' },
  { id: 'b5', name: 'Azure Travel', industry: 'Travel', logo: 'https://picsum.photos/seed/azure/200' },
];

export const MOCK_CREATORS = [
  { id: 'c1', name: 'Alex Rivers', niches: ['Travel', 'Photography'], followers: 120000, er: 0.045 },
  { id: 'c2', name: 'Sarah Chen', niches: ['Tech', 'Gaming'], followers: 85000, er: 0.062 },
  { id: 'c3', name: 'Jordan Smith', niches: ['Fitness', 'Lifestyle'], followers: 250000, er: 0.038 },
  { id: 'c4', name: 'Mia Wong', niches: ['Beauty', 'Fashion'], followers: 45000, er: 0.081 },
  { id: 'c5', name: 'Leo Messi', niches: ['Sports', 'Business'], followers: 1000000, er: 0.025 },
];

export const MOCK_CAMPAIGNS = [
  {
    id: 'camp1',
    brandId: 'b1',
    title: 'The Future of Remote Work',
    description: 'A campaign focused on how Lumina Tech tools empower remote workers globally.',
    status: CampaignStatus.ACTIVE,
    budget: 5000,
    niches: ['Tech', 'Business'],
    requirements: ['1 Instagram Post', '3 Stories', '1 LinkedIn Post']
  },
  {
    id: 'camp2',
    brandId: 'b2',
    title: 'Sustainable Summer',
    description: 'Promoting our new line of biodegradable beachwear.',
    status: CampaignStatus.ACTIVE,
    budget: 2500,
    niches: ['Sustainability', 'Fashion'],
    requirements: ['2 TikTok Videos', '1 Reel']
  },
  {
    id: 'camp3',
    brandId: 'b3',
    title: 'Morning Yoga Challenge',
    description: 'A 30-day challenge using our FitFlow premium app.',
    status: CampaignStatus.PAUSED,
    budget: 3000,
    niches: ['Fitness', 'Wellness'],
    requirements: ['Daily Stories for 7 days', '1 Main Feed Post']
  }
];

export async function seedFirestore() {
  console.log('Seeding process simulated... Real implementation requires Firestore Admin or Client SDK calls for each collection.');
  // In a real dev environment, you'd iterate and call createDocument for each above.
}
