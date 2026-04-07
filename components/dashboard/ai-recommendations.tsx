'use client';

import Link from 'next/link';
import { Brain, ChevronRight } from 'lucide-react';
import { useNurtureStore } from '@/lib/store';
import { getInsightTypeLabel, getInsightTypeColor } from '@/lib/utils';
import { AIInsightType } from '@/lib/types';
import { Button } from '@/components/ui/button';

const BORDER_COLOR: Record<AIInsightType, string> = {
  ready_to_buy: 'border-l-emerald-500',
  churn_risk: 'border-l-red-500',
  upsell_opportunity: 'border-l-purple-500',
  cold_reengagement: 'border-l-blue-500',
};

export default function AIRecommendations() {
  const insights = useNurtureStore((s) => s.insights);
  const contacts = useNurtureStore((s) => s.contacts);

  const topInsights = insights.slice(0, 3);

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-[#F1F5F9]">AI Recommendations</h3>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
        </div>
        <span className="text-xs text-[#64748B]">{insights.length} insights</span>
      </div>

      {/* Insight items */}
      <div className="space-y-3">
        {topInsights.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-6">No insights available</p>
        ) : (
          topInsights.map((insight) => {
            const contact = contacts.find((c) => c.id === insight.contactId);
            const borderColor = BORDER_COLOR[insight.type];
            const badgeClasses = getInsightTypeColor(insight.type);
            const typeLabel = getInsightTypeLabel(insight.type);

            return (
              <div
                key={insight.id}
                className={`border-l-2 ${borderColor} bg-[#1E2130] rounded-r-lg pl-3 pr-3 py-3 flex items-start gap-3`}
              >
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-medium text-[#F1F5F9] truncate">
                      {contact ? contact.name : 'Unknown Contact'}
                    </span>
                    {contact?.company && (
                      <span className="text-xs text-[#64748B] truncate hidden sm:inline">
                        · {contact.company}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border ${badgeClasses} mb-1.5`}
                  >
                    {typeLabel}
                  </span>
                  <p className="text-xs text-[#94A3B8] truncate leading-snug">
                    {insight.recommendation}
                  </p>
                </div>

                {/* Act button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 h-7 px-2.5 text-[10px]"
                >
                  Act
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-4 border-t border-[#2A2D3E]">
        <Link
          href="/ai-insights"
          className="flex items-center justify-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all insights
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
