
import { Lead, LeadNote } from '@/types/crm';

// In-memory persistence for the mock API session
class MockLeadDB {
  private leads: Lead[] = [];
  private notes: LeadNote[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const niches = ['Tech', 'Fashion', 'Fitness', 'Beauty', 'Gaming', 'Education'];
    const statuses: any[] = ['new', 'contacted', 'replied', 'booked', 'closed', 'lost'];
    const users = ['Admin Sarah', 'Admin Alex', 'Root Admin', 'Unassigned'];

    this.leads = Array.from({ length: 35 }).map((_, i) => ({
      id: `lead_${i + 1}`,
      companyName: `${niches[i % niches.length]} Brand ${i + 1}`,
      niche: niches[i % niches.length],
      email: `contact@brand${i + 1}.com`,
      instagramHandle: `@brand_${i + 1}_official`,
      website: `https://brand${i + 1}.com`,
      score: Math.floor(Math.random() * 40) + 60,
      status: statuses[i % statuses.length],
      assignedTo: users[i % users.length],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Add some initial notes
    this.notes = [
      { id: 'note_1', leadId: 'lead_1', text: 'Highly interested in Q4 smart home campaign.', createdAt: new Date().toISOString() },
      { id: 'note_2', leadId: 'lead_1', text: 'Follow up scheduled for Monday.', createdAt: new Date().toISOString() },
    ];
  }

  getLeads(status?: string, niche?: string, search?: string, page: number = 1) {
    let filtered = [...this.leads];

    if (status && status !== 'all') {
      filtered = filtered.filter(l => l.status === status);
    }
    if (niche && niche !== 'all') {
      filtered = filtered.filter(l => l.niche === niche);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(l => 
        l.companyName.toLowerCase().includes(s) || 
        l.email?.toLowerCase().includes(s)
      );
    }

    // Sort by newest
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pageSize = 10;
    const total = filtered.length;
    const pages = Math.ceil(total / pageSize);
    const data = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { data, total, pages, page };
  }

  getLead(id: string) {
    return this.leads.find(l => l.id === id);
  }

  createLead(data: Partial<Lead>) {
    const newLead: Lead = {
      id: `lead_${this.leads.length + 1}`,
      companyName: data.companyName || 'Untitled',
      niche: data.niche || 'Other',
      email: data.email,
      instagramHandle: data.instagramHandle,
      score: Math.floor(Math.random() * 100),
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    } as Lead;
    this.leads.unshift(newLead);
    return newLead;
  }

  updateLead(id: string, updates: Partial<Lead>) {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    this.leads[index] = { ...this.leads[index], ...updates, updatedAt: new Date().toISOString() };
    return this.leads[index];
  }

  addNote(leadId: string, text: string) {
    const note: LeadNote = {
      id: `note_${Date.now()}`,
      leadId,
      text,
      createdAt: new Date().toISOString()
    };
    this.notes.unshift(note);
    return note;
  }

  getNotes(leadId: string) {
    return this.notes.filter(n => n.leadId === leadId);
  }
}

export const crmDb = new MockLeadDB();
