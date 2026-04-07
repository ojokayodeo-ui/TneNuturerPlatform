'use client';

import { useNurtureStore } from '@/lib/store';
import { getInsightTypeLabel, getInsightTypeColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export default function NextActions() {
  const { insights, contacts } = useNurtureStore();
  const sorted = [...insights].sort((a, b) => b.confidence - a.confidence).slice(0, 8);

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-[#2A2D3E]">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#F1F5F9]">Next Best Actions</h2>
          <p className="text-xs text-[#64748B]">Prioritized by AI confidence score</p>
        </div>
      </div>

      <div className="divide-y divide-[#2A2D3E]">
        {sorted.map((insight, idx) => {
          const contact = contacts.find((c) => c.id === insight.contactId);
          if (!contact) return null;
          const colorClass = getInsightTypeColor(insight.type);
          const label = getInsightTypeLabel(insight.type);
          const isUrgent = idx < 3;

          return (
            <div key={insight.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-[#2A2D3E] text-[#64748B]'}`}>
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[#F1F5F9] truncate">{contact.name}</span>
                  <span className="text-xs text-[#64748B]">·</span>
                  <span className="text-xs text-[#64748B] truncate">{contact.company}</span>
                  {isUrgent && (
                    <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 text-[10px] font-medium">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{insight.recommendation}</p>
              </div>

              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium shrink-0 ${colorClass}`}>
                {label}
              </span>

              <Button size="sm" variant="secondary" className="shrink-0 text-xs">
                Do It
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
