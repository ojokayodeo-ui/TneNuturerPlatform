'use client';

import AppShell from '@/components/layout/app-shell';
import ReadySignals from '@/components/ai-insights/ready-signals';
import ColdLeads from '@/components/ai-insights/cold-leads';
import NextActions from '@/components/ai-insights/next-actions';
import InsightCards from '@/components/ai-insights/insight-cards';
import { useNurtureStore } from '@/lib/store';
import { Brain } from 'lucide-react';
import { useState } from 'react';
import { AIInsightType } from '@/lib/types';

const TABS: { id: AIInsightType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ready_to_buy', label: 'Ready to Buy' },
  { id: 'cold_reengagement', label: 'Re-engagement' },
  { id: 'upsell_opportunity', label: 'Upsell' },
  { id: 'churn_risk', label: 'Churn Risk' },
];

export default function AIInsightsPage() {
  const { insights, contacts } = useNurtureStore();
  const [activeTab, setActiveTab] = useState<AIInsightType | 'all'>('all');

  const counts = {
    ready_to_buy: insights.filter((i) => i.type === 'ready_to_buy').length,
    cold_reengagement: insights.filter((i) => i.type === 'cold_reengagement').length,
    upsell_opportunity: insights.filter((i) => i.type === 'upsell_opportunity').length,
    churn_risk: insights.filter((i) => i.type === 'churn_risk').length,
  };

  const filtered = activeTab === 'all' ? insights : insights.filter((i) => i.type === activeTab);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#F1F5F9]">AI Intelligence</h1>
              <p className="text-sm text-[#64748B] mt-0.5">Your AI-powered relationship advisor</p>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Ready to Buy', count: counts.ready_to_buy, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Re-engagement', count: counts.cold_reengagement, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'Upsell Opp.', count: counts.upsell_opportunity, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
            { label: 'Churn Risk', count: counts.churn_risk, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 bg-[#0F1117] rounded-lg p-1 w-fit border border-[#2A2D3E]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1A1D27] text-[#F1F5F9] shadow'
                  : 'text-[#64748B] hover:text-[#F1F5F9]'
              }`}
            >
              {tab.label}
              {tab.id !== 'all' && counts[tab.id as AIInsightType] > 0 && (
                <span className="ml-1.5 bg-[#2A2D3E] text-[#94A3B8] rounded-full px-1.5 text-[10px]">
                  {counts[tab.id as AIInsightType]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'all' ? (
          <div className="flex flex-col gap-8">
            <ReadySignals />
            <ColdLeads />
            <InsightCards
              insights={insights.filter((i) => i.type === 'upsell_opportunity')}
              contacts={contacts}
              emptyMessage="No upsell opportunities detected yet."
            />
          </div>
        ) : (
          <InsightCards insights={filtered} contacts={contacts} />
        )}

        {/* Next best actions — always visible */}
        <NextActions />
      </div>
    </AppShell>
  );
}
