'use client';

import { AIInsight, AIInsightType, Contact } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
import { cn, generateInitials, getAvatarColor, getInsightTypeLabel } from '@/lib/utils';

interface InsightCardsProps {
  insights: AIInsight[];
  contacts: Contact[];
  title?: string;
  emptyMessage?: string;
}

const borderMap: Record<AIInsightType, string> = {
  ready_to_buy: 'border-emerald-500/40 shadow-emerald-500/10 hover:border-emerald-500/60',
  churn_risk: 'border-red-500/40 shadow-red-500/10 hover:border-red-500/60',
  upsell_opportunity: 'border-purple-500/40 shadow-purple-500/10 hover:border-purple-500/60',
  cold_reengagement: 'border-blue-500/40 shadow-blue-500/10 hover:border-blue-500/60',
};

const confidenceColorMap: Record<AIInsightType, 'emerald' | 'red' | 'indigo' | 'amber'> = {
  ready_to_buy: 'emerald',
  churn_risk: 'red',
  upsell_opportunity: 'indigo',
  cold_reengagement: 'amber',
};

const badgeVariantMap: Record<AIInsightType, 'success' | 'danger' | 'purple' | 'default'> = {
  ready_to_buy: 'success',
  churn_risk: 'danger',
  upsell_opportunity: 'purple',
  cold_reengagement: 'default',
};

function SignalDots({ strength }: { strength: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(strength / 2)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'w-1.5 h-1.5 rounded-full border',
            i < filled ? 'bg-indigo-400 border-indigo-400' : 'bg-transparent border-[#3A3D4E]'
          )}
        />
      ))}
    </div>
  );
}

interface InsightCardProps {
  insight: AIInsight;
  contact: Contact | undefined;
}

function InsightCard({ insight, contact }: InsightCardProps) {
  const initials = contact ? generateInitials(contact.name) : '??';
  const avatarBg = contact ? getAvatarColor(contact.name) : 'bg-slate-500';

  return (
    <div
      className={cn(
        'bg-[#1A1D27] border rounded-xl p-5 flex flex-col gap-4 shadow-lg transition-all duration-200',
        borderMap[insight.type]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0',
              avatarBg
            )}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#F1F5F9] truncate">
              {contact?.name ?? 'Unknown Contact'}
            </p>
            <p className="text-xs text-[#64748B] truncate">{contact?.company ?? '—'}</p>
          </div>
        </div>
        <Badge variant={badgeVariantMap[insight.type]} className="flex-shrink-0 whitespace-nowrap">
          {getInsightTypeLabel(insight.type)}
        </Badge>
      </div>

      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
        {insight.recommendation}
      </p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B]">AI Confidence</span>
          <span className="font-semibold text-[#F1F5F9]">{insight.confidence}%</span>
        </div>
        <Progress value={insight.confidence} color={confidenceColorMap[insight.type]} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#475569] uppercase tracking-wider">Signal strength</span>
          <SignalDots strength={insight.signalStrength ?? 5} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs h-7 px-2.5 text-[#64748B]">
            Dismiss
          </Button>
          <Button variant="default" size="sm" className="text-xs h-7 px-3">
            Take Action
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function InsightCards({ insights, contacts, emptyMessage }: InsightCardsProps) {
  if (insights.length === 0) {
    return (
      <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-12 flex flex-col items-center justify-center gap-3 text-center">
        <Sparkles className="w-8 h-8 text-[#2A2D3E]" />
        <p className="text-sm text-[#64748B]">{emptyMessage ?? 'No insights available.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          contact={contacts.find((c) => c.id === insight.contactId)}
        />
      ))}
    </div>
  );
}
