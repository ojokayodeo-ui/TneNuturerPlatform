'use client';

import { useNurtureStore } from '@/lib/store';
import AppShell from '@/components/layout/app-shell';
import ClientHealth from '@/components/retention/client-health';
import UpsellPanel from '@/components/retention/upsell-panel';
import CheckinScheduler from '@/components/retention/checkin-scheduler';
import { Heart, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RetentionPage() {
  const contacts = useNurtureStore((s) => s.contacts);
  const insights = useNurtureStore((s) => s.insights);

  const clients = contacts.filter((c) => c.isClient);
  const totalLTV = clients.reduce((sum, c) => sum + (c.ltv ?? 0), 0);
  const avgContract =
    clients.length > 0
      ? clients.reduce((sum, c) => sum + (c.contractValue ?? 0), 0) / clients.length
      : 0;
  const churnRiskCount = insights.filter((i) => i.type === 'churn_risk').length;
  const upsellInsights = insights.filter((i) => i.type === 'upsell_opportunity');
  const upsellPipeline = upsellInsights.reduce((sum, insight) => {
    const contact = contacts.find((c) => c.id === insight.contactId);
    return sum + (contact?.contractValue ? contact.contractValue * 0.4 : 2000);
  }, 0);

  const summaryStats = [
    {
      label: 'Total Client LTV',
      value: formatCurrency(totalLTV),
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      valueColor: 'text-emerald-400',
    },
    {
      label: 'Avg Contract Value',
      value: formatCurrency(avgContract),
      icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
      valueColor: 'text-indigo-400',
    },
    {
      label: 'Churn Risk',
      value: String(churnRiskCount),
      icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
      iconBg: 'bg-red-500/10 border-red-500/20',
      valueColor: churnRiskCount > 0 ? 'text-red-400' : 'text-emerald-400',
    },
    {
      label: 'Upsell Pipeline',
      value: formatCurrency(upsellPipeline),
      icon: <Heart className="w-4 h-4 text-purple-400" />,
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      valueColor: 'text-purple-400',
    },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#F1F5F9]">Retention &amp; Upsell</h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Keep clients happy, grow lifetime value
              </p>
            </div>
          </div>
        </div>

        {/* LTV Summary Bar */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-[#1A1D27] border rounded-xl p-4 flex items-center gap-4`}
              style={{ borderColor: 'rgb(42 45 62)' }}
            >
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}
              >
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-xl font-bold truncate ${stat.valueColor}`}>{stat.value}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Client Health — full width */}
        <ClientHealth />

        {/* 2-col grid: UpsellPanel + CheckinScheduler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpsellPanel />
          <CheckinScheduler />
        </div>
      </div>
    </AppShell>
  );
}
