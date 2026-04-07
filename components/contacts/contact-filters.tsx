'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn, getStageColor, getStageLabel } from '@/lib/utils';
import { useNurtureStore } from '@/lib/store';
import { ContactStage, ContactSource } from '@/lib/types';

interface ContactFiltersProps {
  onFilterChange?: () => void;
}

const STAGES: ContactStage[] = [
  'new_lead',
  'contacted',
  'engaged',
  'nurturing',
  'sales_qualified',
  'client',
  'retained',
];

const SOURCES: { value: ContactSource; label: string }[] = [
  { value: 'cold', label: 'Cold Outreach' },
  { value: 'warm', label: 'Warm Lead' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'inbound', label: 'Inbound' },
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#2A2D3E] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" />
        )}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function ContactFilters({ onFilterChange }: ContactFiltersProps) {
  const {
    stageFilter,
    sourceFilter,
    healthScoreMin,
    setStageFilter,
    setSourceFilter,
    setHealthScoreMin,
    clearFilters,
  } = useNurtureStore();

  const hasActiveFilters =
    stageFilter !== null || sourceFilter !== null || healthScoreMin > 0;

  function handleStageToggle(stage: ContactStage) {
    setStageFilter(stageFilter === stage ? null : stage);
    onFilterChange?.();
  }

  function handleSourceToggle(source: ContactSource) {
    setSourceFilter(sourceFilter === source ? null : source);
    onFilterChange?.();
  }

  function handleHealthScoreChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHealthScoreMin(Number(e.target.value));
    onFilterChange?.();
  }

  function handleClearAll() {
    clearFilters();
    onFilterChange?.();
  }

  return (
    <div className="flex h-full flex-col bg-[#1A1D27] border border-[#2A2D3E] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2D3E]">
        <span className="text-sm font-semibold text-[#F1F5F9]">Filters</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Stage filter */}
      <FilterSection title="Stage">
        <div className="space-y-2">
          {STAGES.map((stage) => (
            <label
              key={stage}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={stageFilter === stage}
                onChange={() => handleStageToggle(stage)}
                className="h-4 w-4 rounded border-[#3A3D4E] bg-[#0F1117] text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-indigo-500"
              />
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                  getStageColor(stage)
                )}
              >
                {getStageLabel(stage)}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Source filter */}
      <FilterSection title="Source">
        <div className="space-y-2">
          {SOURCES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={sourceFilter === value}
                onChange={() => handleSourceToggle(value)}
                className="h-4 w-4 rounded border-[#3A3D4E] bg-[#0F1117] text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-indigo-500"
              />
              <span className="text-sm text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Health Score slider */}
      <FilterSection title="Min Health Score">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Minimum</span>
            <span className="text-xs font-semibold text-[#F1F5F9] tabular-nums">
              {healthScoreMin}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={healthScoreMin}
            onChange={handleHealthScoreChange}
            className="w-full h-1.5 appearance-none rounded-full bg-[#2A2D3E] cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-[#64748B]">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </FilterSection>
    </div>
  );
}
