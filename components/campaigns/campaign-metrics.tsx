'use client';

import { Campaign } from '@/lib/types';
import { TrendingUp, TrendingDown, MousePointerClick, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignMetricsProps {
  campaigns: Campaign[];
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend: number;
  trendLabel: string;
  valueColor: string;
}

function MetricCard({ label, value, icon, iconBg, trend, trendLabel, valueColor }: MetricCardProps) {
  const isPositive = trend >= 0;
  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">{label}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className={cn('text-2xl font-bold', valueColor)}>{value}</span>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            isPositive
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-red-400 bg-red-500/10'
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function CampaignMetrics({ campaigns }: CampaignMetricsProps) {
  const avgOpenRate = avg(campaigns.map((c) => c.openRate));
  const avgClickRate = avg(campaigns.map((c) => c.clickRate));
  const avgReplyRate = avg(campaigns.map((c) => c.replyRate));
  const totalConversions = campaigns.reduce(
    (sum, c) => sum + Math.round((c.conversionRate / 100) * c.audienceCount),
    0
  );

  const openRateColor =
    avgOpenRate >= 40 ? 'text-emerald-400' : avgOpenRate >= 20 ? 'text-amber-400' : 'text-red-400';
  const clickRateColor =
    avgClickRate >= 20 ? 'text-emerald-400' : avgClickRate >= 10 ? 'text-amber-400' : 'text-red-400';
  const replyRateColor =
    avgReplyRate >= 15 ? 'text-emerald-400' : avgReplyRate >= 5 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        label="Avg Open Rate"
        value={`${avgOpenRate.toFixed(1)}%`}
        icon={<Mail className="w-4 h-4 text-indigo-400" />}
        iconBg="bg-indigo-500/10"
        trend={2.3}
        trendLabel="+2.3% vs last"
        valueColor={openRateColor}
      />
      <MetricCard
        label="Avg Click Rate"
        value={`${avgClickRate.toFixed(1)}%`}
        icon={<MousePointerClick className="w-4 h-4 text-purple-400" />}
        iconBg="bg-purple-500/10"
        trend={1.1}
        trendLabel="+1.1% vs last"
        valueColor={clickRateColor}
      />
      <MetricCard
        label="Avg Reply Rate"
        value={`${avgReplyRate.toFixed(1)}%`}
        icon={<MessageSquare className="w-4 h-4 text-cyan-400" />}
        iconBg="bg-cyan-500/10"
        trend={-0.4}
        trendLabel="-0.4% vs last"
        valueColor={replyRateColor}
      />
      <MetricCard
        label="Total Conversions"
        value={String(totalConversions)}
        icon={<ArrowRight className="w-4 h-4 text-emerald-400" />}
        iconBg="bg-emerald-500/10"
        trend={5}
        trendLabel="+5 this month"
        valueColor="text-emerald-400"
      />
    </div>
  );
}
