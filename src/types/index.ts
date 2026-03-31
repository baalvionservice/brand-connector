
export type UserRole = 'BRAND' | 'CREATOR' | 'ADMIN';

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum DeliverableStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
  APPROVED = 'APPROVED'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  bio: string;
  niches: string[];
  portfolioLinks: string[];
  socialStats: Record<string, { followers: number; engagementRate: number }>;
  location: string;
  rating: number;
}

export interface BrandProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  website: string;
  brandGuidelines: string;
  logoUrl?: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  niches: string[];
  budget: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  requirements: string[];
  deliverablesCount: number;
}

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  status: ApplicationStatus;
  pitch: string;
  proposedBudget?: number;
  appliedAt: string;
}

export interface Deliverable {
  id: string;
  applicationId: string;
  title: string;
  description: string;
  status: DeliverableStatus;
  submissionUrl?: string;
  feedback?: string;
  submittedAt?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'PAYOUT';
  status: TransactionStatus;
  description: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  link?: string;
  createdAt: string;
}

export interface MatchScore {
  campaignId: string;
  creatorId: string;
  score: number;
  reasoning: string;
}
