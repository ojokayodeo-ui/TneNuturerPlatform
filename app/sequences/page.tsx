'use client';

import Link from 'next/link';
import AppShell from '@/components/layout/app-shell';
import SequenceList from '@/components/sequences/sequence-list';
import { Button } from '@/components/ui/button';
import { useNurtureStore } from '@/lib/store';
import { Plus, GitBranch, Zap, TrendingUp } from 'lucide-react';

export default function SequencesPage() {
  const { sequences } = useNurtureStore();

  const totalSequences = sequences.length;
  const activeSequences = sequences.filter((s) => s.status === 'active').length;

  const totalEnrolled = sequences.reduce((sum, s) => sum + s.stats.enrolled, 0);
  const totalReplied = sequences.reduce((sum, s) => sum + s.stats.replied, 0);
  const avgReplyRate =
    totalEnrolled > 0 ? Math.round((totalReplied / totalEnrolled) * 100) : 0;

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#F1F5F9]">Sequences</h1>
            <p className="text-[#64748B] text-sm mt-0.5">
              Build and manage automated nurture sequences
            </p>
          </div>
          <Link href="/sequences/builder">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              New Sequence
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#F1F5F9] text-2xl font-bold">{totalSequences}</p>
              <p className="text-[#64748B] text-xs mt-0.5">Total Sequences</p>
            </div>
          </div>

          <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#F1F5F9] text-2xl font-bold">{activeSequences}</p>
              <p className="text-[#64748B] text-xs mt-0.5">Active</p>
            </div>
          </div>

          <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#F1F5F9] text-2xl font-bold">{avgReplyRate}%</p>
              <p className="text-[#64748B] text-xs mt-0.5">Avg Reply Rate</p>
            </div>
          </div>
        </div>

        {/* Sequence list */}
        <SequenceList />
      </div>
    </AppShell>
  );
}
