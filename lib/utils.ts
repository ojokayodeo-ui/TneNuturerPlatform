import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ContactStage, ContactSource, AIInsightType, SequenceType, StepType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getStageLabel(stage: ContactStage): string {
  const labels: Record<ContactStage, string> = {
    new_lead: "New Lead",
    contacted: "Contacted",
    engaged: "Engaged",
    nurturing: "Nurturing",
    sales_qualified: "Sales Qualified",
    client: "Client",
    retained: "Retained",
  };
  return labels[stage];
}

export function getStageColor(stage: ContactStage): string {
  const colors: Record<ContactStage, string> = {
    new_lead: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    contacted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    engaged: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    nurturing: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    sales_qualified: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    client: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    retained: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  };
  return colors[stage];
}

export function getSourceColor(source: ContactSource): string {
  const colors: Record<ContactSource, string> = {
    cold: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    warm: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    referral: "bg-green-500/20 text-green-300 border-green-500/30",
    website: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    inbound: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };
  return colors[source];
}

export function getHealthScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

export function getHealthScoreBarColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function getInsightTypeLabel(type: AIInsightType): string {
  const labels: Record<AIInsightType, string> = {
    ready_to_buy: "Ready to Buy",
    cold_reengagement: "Re-engagement",
    upsell_opportunity: "Upsell Opportunity",
    churn_risk: "Churn Risk",
  };
  return labels[type];
}

export function getInsightTypeColor(type: AIInsightType): string {
  const colors: Record<AIInsightType, string> = {
    ready_to_buy: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    cold_reengagement: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    upsell_opportunity: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    churn_risk: "text-red-400 border-red-500/30 bg-red-500/10",
  };
  return colors[type];
}

export function getSequenceTypeLabel(type: SequenceType): string {
  const labels: Record<SequenceType, string> = {
    cold_outreach: "Cold Outreach",
    warm_nurture: "Warm Nurture",
    client_onboarding: "Client Onboarding",
    retention: "Retention",
    upsell: "Upsell",
  };
  return labels[type];
}

export function getStepTypeIcon(type: StepType): string {
  const icons: Record<StepType, string> = {
    email: "Mail",
    linkedin: "Linkedin",
    sms: "MessageSquare",
    task: "CheckSquare",
    wait: "Clock",
  };
  return icons[type];
}

export function getStepTypeColor(type: StepType): string {
  const colors: Record<StepType, string> = {
    email: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    linkedin: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    sms: "bg-green-500/20 text-green-300 border-green-500/30",
    task: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    wait: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };
  return colors[type];
}

export function generateInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function getAvatarColor(name: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-violet-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
