import { create } from 'zustand'
import { Contact, Sequence, Campaign, AIInsight, ContactStage, ContactSource } from './types'
import { contacts, sequences, campaigns, insights } from './data'

interface NurtureStore {
  // State
  contacts: Contact[];
  sequences: Sequence[];
  campaigns: Campaign[];
  insights: AIInsight[];
  selectedContactId: string | null;
  selectedStage: ContactStage | null;
  searchQuery: string;
  stageFilter: ContactStage | null;
  sourceFilter: ContactSource | null;
  industryFilter: string | null;
  healthScoreMin: number;
  sidebarCollapsed: boolean;

  // Contact actions
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  moveContactToStage: (id: string, stage: ContactStage) => void;
  setSelectedContactId: (id: string | null) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setStageFilter: (stage: ContactStage | null) => void;
  setSourceFilter: (source: ContactSource | null) => void;
  setIndustryFilter: (industry: string | null) => void;
  setHealthScoreMin: (min: number) => void;
  clearFilters: () => void;

  // Sequence actions
  setSequences: (sequences: Sequence[]) => void;
  addSequence: (sequence: Sequence) => void;
  updateSequence: (id: string, updates: Partial<Sequence>) => void;

  // UI actions
  toggleSidebar: () => void;

  // Computed/derived
  getFilteredContacts: () => Contact[];
  getContactsByStage: (stage: ContactStage) => Contact[];
  getContactById: (id: string) => Contact | undefined;
  getDashboardMetrics: () => {
    totalContacts: number;
    activeSequences: number;
    avgHealthScore: number;
    dealsInPipeline: number;
    monthlyConversions: number;
    totalLTV: number;
  };
}

export const useNurtureStore = create<NurtureStore>()((set, get) => ({
  // Initial state
  contacts: contacts,
  sequences: sequences,
  campaigns: campaigns,
  insights: insights,
  selectedContactId: null,
  selectedStage: null,
  searchQuery: '',
  stageFilter: null,
  sourceFilter: null,
  industryFilter: null,
  healthScoreMin: 0,
  sidebarCollapsed: false,

  // Contact actions
  setContacts: (contacts) => set({ contacts }),

  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    })),

  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  moveContactToStage: (id, stage) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, stage, updatedAt: new Date().toISOString() } : c
      ),
    })),

  setSelectedContactId: (id) => set({ selectedContactId: id }),

  // Filter actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setStageFilter: (stage) => set({ stageFilter: stage }),

  setSourceFilter: (source) => set({ sourceFilter: source }),

  setIndustryFilter: (industry) => set({ industryFilter: industry }),

  setHealthScoreMin: (min) => set({ healthScoreMin: min }),

  clearFilters: () =>
    set({
      searchQuery: '',
      stageFilter: null,
      sourceFilter: null,
      industryFilter: null,
      healthScoreMin: 0,
    }),

  // Sequence actions
  setSequences: (sequences) => set({ sequences }),

  addSequence: (sequence) =>
    set((state) => ({ sequences: [...state.sequences, sequence] })),

  updateSequence: (id, updates) =>
    set((state) => ({
      sequences: state.sequences.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      ),
    })),

  // UI actions
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // Computed/derived
  getFilteredContacts: () => {
    const { contacts, searchQuery, stageFilter, sourceFilter, industryFilter, healthScoreMin } = get()

    return contacts.filter((contact) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          contact.name.toLowerCase().includes(q) ||
          contact.company.toLowerCase().includes(q) ||
          contact.email.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }

      if (stageFilter !== null && contact.stage !== stageFilter) return false

      if (sourceFilter !== null && contact.source !== sourceFilter) return false

      if (industryFilter !== null && contact.industry !== industryFilter) return false

      if (contact.healthScore < healthScoreMin) return false

      return true
    })
  },

  getContactsByStage: (stage) => {
    return get().contacts.filter((c) => c.stage === stage)
  },

  getContactById: (id) => {
    return get().contacts.find((c) => c.id === id)
  },

  getDashboardMetrics: () => {
    const { contacts, sequences } = get()

    const totalContacts = contacts.length

    const activeSequences = sequences.filter((s) => s.status === 'active').length

    const avgHealthScore =
      contacts.length > 0
        ? Math.round(contacts.reduce((sum, c) => sum + c.healthScore, 0) / contacts.length)
        : 0

    const dealsInPipeline = contacts.filter(
      (c) => c.stage === 'sales_qualified' || c.stage === 'engaged'
    ).length

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthlyConversions = contacts.filter(
      (c) => c.isClient && c.updatedAt >= startOfMonth
    ).length

    const totalLTV = contacts.reduce((sum, c) => sum + (c.ltv ?? 0), 0)

    return {
      totalContacts,
      activeSequences,
      avgHealthScore,
      dealsInPipeline,
      monthlyConversions,
      totalLTV,
    }
  },
}))
