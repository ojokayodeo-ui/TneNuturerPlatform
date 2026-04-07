'use client';

import { useNurtureStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Users, DollarSign, Heart, TrendingUp } from 'lucide-react';

export default function StageStats() {
  const contacts = useNurtureStore((s) => s.contacts);

  const totalContacts = contacts.length;

  const totalPipelineValue = contacts.reduce(
    (sum, c) => sum + (c.contractValue ?? 0),
    0
  );

  const avgHealth =
    contacts.length > 0
      ? Math.round(
          contacts.reduce((sum, c) => sum + c.healthScore, 0) / contacts.length
        )
      : 0;

  const clients = contacts.filter(
    (c) => c.stage === 'client' || c.stage === 'retained'
  ).length;
  const conversionRate =
    totalContacts > 0 ? Math.round((clients / totalContacts) * 100) : 0;

  const stats = [
    {
      label: 'Total Contacts',
      value: totalContacts.toString(),
      icon: Users,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10',
      sub: 'across all stages',
    },
    {
      label: 'Pipeline Value',
      value: formatCurrency(totalPipelineValue),
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      sub: 'total contract value',
    },
    {
      label: 'Avg Health Score',
      value: `${avgHealth}%`,
      icon: Heart,
      iconColor:
        avgHealth >= 70
          ? 'text-emerald-400'
          : avgHealth >= 40
          ? 'text-amber-400'
          : 'text-red-400',
      iconBg:
        avgHealth >= 70
          ? 'bg-emerald-500/10'
          : avgHealth >= 40
          ? 'bg-amber-500/10'
          : 'bg-red-500/10',
      sub: 'overall engagement health',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      sub: `${clients} clients converted`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-[#1A1D27] rounded-lg border border-[#2A2D3E] p-3 flex items-center gap-3"
          >
            <div className={`${stat.iconBg} rounded-lg p-2 flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${stat.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-white leading-tight">
                {stat.value}
              </p>
              <p className="text-[11px] text-[#64748B] truncate">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
