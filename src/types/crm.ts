
export type LeadStatus = "new" | "contacted" | "replied" | "booked" | "closed" | "lost";

export interface Lead {
  id: string;
  companyName: string;
  niche: string;
  email?: string;
  instagramHandle?: string;
  website?: string;
  score: number;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  text: string;
  createdAt: string;
}

export interface LeadFilters {
  status?: LeadStatus | 'all';
  niche?: string | 'all';
  search?: string;
  page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}
