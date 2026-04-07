'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNurtureStore } from '@/lib/store';
import { getSequenceTypeLabel, cn } from '@/lib/utils';
import { SequenceType, SequenceStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit2, BarChart2, Pause, Play, GitBranch } from 'lucide-react';

const typeFilters: { label: string; value: SequenceType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Cold Outreach', value: 'cold_outreach' },
  { label: 'Warm Nurture', value: 'warm_nurture' },
  { label: 'Onboarding', value: 'client_onboarding' },
  { label: 'Retention', value: 'retention' },
  { label: 'Upsell', value: 'upsell' },
];

const typeColors: Record<SequenceType, string> = {
  cold_outreach: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  warm_nurture: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  client_onboarding: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  retention: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  upsell: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
};

const statusColors: Record<SequenceStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  paused: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  draft: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

const statusLabels: Record<SequenceStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  draft: 'Draft',
};

export default function SequenceList() {
  const { sequences, updateSequence } = useNurtureStore();
  const [activeFilter, setActiveFilter] = useState<SequenceType | 'all'>('all');

  const filtered =
    activeFilter === 'all'
      ? sequences
      : sequences.filter((s) => s.type === activeFilter);

  const toggleStatus = (id: string, current: SequenceStatus) => {
    const next: SequenceStatus = current === 'active' ? 'paused' : 'active';
    updateSequence(id, { status: next });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
              activeFilter === f.value
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-[#1A1D27] text-[#64748B] border-[#2A2D3E] hover:border-[#3A3D4E] hover:text-[#94A3B8]'
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#475569]">
          {filtered.length} sequence{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Sequence cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1A1D27] border border-[#2A2D3E] flex items-center justify-center text-[#475569]">
            <GitBranch className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-[#94A3B8] font-medium">No sequences found</p>
            <p className="text-[#475569] text-sm mt-1">
              Try a different filter or create a new sequence
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((sequence) => {
            const replyRate =
              sequence.stats.enrolled > 0
                ? Math.round((sequence.stats.replied / sequence.stats.enrolled) * 100)
                : 0;
            const conversionRate =
              sequence.stats.enrolled > 0
                ? Math.round((sequence.stats.converted / sequence.stats.enrolled) * 100)
                : 0;

            return (
              <div
                key={sequence.id}
                className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-5 flex flex-col gap-4 hover:border-[#3A3D4E] transition-colors duration-150"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#F1F5F9] font-semibold text-sm truncate">
                      {sequence.name}
                    </h3>
                    {sequence.description && (
                      <p className="text-[#64748B] text-xs mt-1 line-clamp-2">
                        {sequence.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium',
                        typeColors[sequence.type]
                      )}
                    >
                      {getSequenceTypeLabel(sequence.type)}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium',
                        statusColors[sequence.status]
                      )}
                    >
                      {statusLabels[sequence.status]}
                    </span>
                  </div>
                </div>

                {/* Step count */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>{sequence.steps.length} {sequence.steps.length === 1 ? 'step' : 'steps'}</span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#2A2D3E]">
                  <div className="flex flex-col gap-0.5 text-center">
                    <span className="text-[#F1F5F9] text-sm font-semibold">
                      {sequence.stats.enrolled}
                    </span>
                    <span className="text-[#475569] text-xs">Enrolled</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-center">
                    <span className="text-[#F1F5F9] text-sm font-semibold">
                      {replyRate}%
                    </span>
                    <span className="text-[#475569] text-xs">Reply Rate</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-center">
                    <span className="text-[#F1F5F9] text-sm font-semibold">
                      {conversionRate}%
                    </span>
                    <span className="text-[#475569] text-xs">Conversion</span>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center gap-2">
                  <Link href={`/sequences/builder?id=${sequence.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5" />
                    Stats
                  </Button>
                  <button
                    onClick={() => toggleStatus(sequence.id, sequence.status)}
                    className={cn(
                      'p-2 rounded-lg border text-xs transition-all duration-150',
                      sequence.status === 'active'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                    )}
                    title={sequence.status === 'active' ? 'Pause sequence' : 'Activate sequence'}
                  >
                    {sequence.status === 'active' ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
