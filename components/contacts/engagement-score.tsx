'use client';

import { cn } from '@/lib/utils';

interface EngagementScoreProps {
  score: number;
  showLabel?: boolean;
}

function getEngagementConfig(score: number): {
  pill: string;
  label: string;
  tier: string;
} {
  if (score >= 80) {
    return {
      pill: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      label: 'Hot',
      tier: 'hot',
    };
  }
  if (score >= 60) {
    return {
      pill: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
      label: 'Good',
      tier: 'good',
    };
  }
  if (score >= 30) {
    return {
      pill: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      label: 'Medium',
      tier: 'medium',
    };
  }
  return {
    pill: 'bg-red-500/10 text-red-400 border border-red-500/20',
    label: 'Low',
    tier: 'low',
  };
}

export function EngagementScore({ score, showLabel = true }: EngagementScoreProps) {
  const { pill, label } = getEngagementConfig(score);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        pill
      )}
    >
      <span className="tabular-nums font-semibold">{score}</span>
      {showLabel && <span className="opacity-80">{label}</span>}
    </span>
  );
}
