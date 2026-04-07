'use client';

import { useNurtureStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Users, Zap, Heart, TrendingUp, DollarSign, Target } from 'lucide-react';

const metrics = [
  {
    key: 'totalContacts' as const,
    label: 'Total Contacts',
    Icon: Users,
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    trend: '+12%',
    trendUp: true,
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'activeSequences' as const,
    label: 'Active Sequences',
    Icon: Zap,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    trend: '+3',
    trendUp: true,
    format: (v: number) => v.toString(),
  },
  {
    key: 'avgHealthScore' as const,
    label: 'Avg Health Score',
    Icon: Heart,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    trend: '+5%',
    trendUp: true,
    format: (v: number) => `${v}%`,
  },
  {
    key: 'dealsInPipeline' as const,
    label: 'Deals in Pipeline',
    Icon: Target,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    trend: '+2',
    trendUp: true,
    format: (v: number) => v.toString(),
  },
  {
    key: 'monthlyConversions' as const,
    label: 'Monthly Conversions',
    Icon: TrendingUp,
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    trend: '+8%',
    trendUp: true,
    format: (v: number) => v.toString(),
  },
  {
    key: 'totalLTV' as const,
    label: 'Total LTV',
    Icon: DollarSign,
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    trend: '+$24K',
    trendUp: true,
    format: (v: number) => formatCurrency(v),
  },
];

export default function MetricsGrid() {
  const getDashboardMetrics = useNurtureStore((s) => s.getDashboardMetrics);
  const data = getDashboardMetrics();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map(({ key, label, Icon, iconBg, iconColor, trend, trendUp, format }) => (
        <Card key={key} className="bg-[#1A1D27] rounded-xl border border-[#2A2D3E] p-5">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                trendUp
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-red-400 bg-red-500/10'
              }`}
            >
              {trend}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-[#F1F5F9] leading-none">
              {format(data[key])}
            </p>
            <p className="text-xs text-[#64748B]">{label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
