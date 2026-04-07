export type ContactSource = 'cold' | 'warm' | 'referral' | 'website' | 'inbound';

export type ContactStage =
  | 'new_lead'
  | 'contacted'
  | 'engaged'
  | 'nurturing'
  | 'sales_qualified'
  | 'client'
  | 'retained';

export type SequenceType =
  | 'cold_outreach'
  | 'warm_nurture'
  | 'client_onboarding'
  | 'retention'
  | 'upsell';

export type SequenceStatus = 'draft' | 'active' | 'paused';

export type StepType = 'email' | 'linkedin' | 'sms' | 'task' | 'wait';

export type InteractionType =
  | 'email_sent'
  | 'email_received'
  | 'call'
  | 'meeting'
  | 'note'
  | 'stage_change'
  | 'sequence_enrolled'
  | 'linkedin_message'
  | 'sms';

export type InteractionDirection = 'inbound' | 'outbound';

export type AIInsightType =
  | 'ready_to_buy'
  | 'cold_reengagement'
  | 'upsell_opportunity'
  | 'churn_risk';

export type CampaignType = 'email' | 'sequence' | 'linkedin' | 'sms';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface Interaction {
  id: string;
  contactId: string;
  type: InteractionType;
  direction: InteractionDirection;
  subject?: string;
  body?: string;
  sentAt: string;
  opened?: boolean;
  clicked?: boolean;
  replied?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  website?: string;
  phone?: string;
  source: ContactSource;
  stage: ContactStage;
  tags: string[];
  industry?: string;
  jobTitle?: string;
  linkedinUrl?: string;
  engagementScore: number;
  healthScore: number;
  lastContactedAt: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  interactions: Interaction[];
  assignedTo?: string;
  sequenceId?: string;
  isClient: boolean;
  contractValue?: number;
  ltv?: number;
  avatar?: string;
}

export interface SequenceStep {
  id: string;
  sequenceId: string;
  order: number;
  type: StepType;
  subject?: string;
  body?: string;
  delayDays: number;
  delayHours: number;
  condition?: string;
}

export interface SequenceStats {
  enrolled: number;
  completed: number;
  replied: number;
  converted: number;
}

export interface Sequence {
  id: string;
  name: string;
  description: string;
  type: SequenceType;
  steps: SequenceStep[];
  status: SequenceStatus;
  stats: SequenceStats;
  createdAt: string;
  updatedAt: string;
}

export interface ABVariant {
  id: string;
  name: string;
  subject: string;
  body: string;
  openRate: number;
  clickRate: number;
  replyRate: number;
  audience: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  sequenceId?: string;
  audienceCount: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
  startDate: string;
  endDate?: string;
  abVariants: ABVariant[];
}

export interface AIInsight {
  id: string;
  contactId: string;
  type: AIInsightType;
  confidence: number;
  recommendation: string;
  createdAt: string;
  signalStrength?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
}

export interface DashboardMetrics {
  totalContacts: number;
  activeSequences: number;
  avgHealthScore: number;
  dealsInPipeline: number;
  monthlyConversions: number;
  totalLTV: number;
}
