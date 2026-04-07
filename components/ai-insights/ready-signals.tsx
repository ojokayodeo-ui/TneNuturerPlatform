'use client';

import { useNurtureStore } from '@/lib/store';
import InsightCards from './insight-cards';
import { Brain } from 'lucide-react';

export default function ReadySignals() {
  const { insights, contacts } = useNurtureStore();
  const filtered = insights.filter((i) => i.type === 'ready_to_buy');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Ready to Buy Signals</h2>
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 text-xs font-medium">
              {filtered.length}
            </span>
          </div>
          <p className="text-xs text-[#64748B]">These leads are showing strong buying intent. Prioritize outreach now.</p>
        </div>
      </div>
      <InsightCards insights={filtered} contacts={contacts} emptyMessage="No ready-to-buy signals detected yet." />
    </div>
  );
}
