'use client';

import { useNurtureStore } from '@/lib/store';
import InsightCards from './insight-cards';
import { Snowflake } from 'lucide-react';

export default function ColdLeads() {
  const { insights, contacts } = useNurtureStore();
  const filtered = insights.filter((i) => i.type === 'cold_reengagement');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Snowflake className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">Needs Re-engagement</h2>
            <span className="inline-flex items-center rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 px-2 py-0.5 text-xs font-medium">
              {filtered.length}
            </span>
          </div>
          <p className="text-xs text-[#64748B]">These contacts have gone cold. Time to warm them up with a re-engagement sequence.</p>
        </div>
      </div>
      <InsightCards insights={filtered} contacts={contacts} emptyMessage="No cold leads flagged for re-engagement." />
    </div>
  );
}
