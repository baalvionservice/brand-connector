
import api from './axios';
import { Lead, LeadFilters, LeadNote, ApiResponse } from '@/types/crm';

export const crmApi = {
  getLeads: async (filters: LeadFilters): Promise<ApiResponse<Lead[]>> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.niche) params.append('niche', filters.niche);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));

    const { data } = await api.get(`/leads?${params.toString()}`);
    return data;
  },

  getLeadDetails: async (id: string): Promise<ApiResponse<{ lead: Lead; notes: LeadNote[] }>> => {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  },

  createLead: async (payload: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    const { data } = await api.post('/leads', payload);
    return data;
  },

  updateLead: async (id: string, payload: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    const { data } = await api.patch(`/leads/${id}`, payload);
    return data;
  },

  addNote: async (id: string, text: string): Promise<ApiResponse<LeadNote>> => {
    const { data } = await api.post(`/leads/${id}/notes`, { text });
    return data;
  },

  convertLead: async (id: string): Promise<ApiResponse<{ brandId: string }>> => {
    const { data } = await api.post(`/leads/${id}/convert`);
    return data;
  }
};
