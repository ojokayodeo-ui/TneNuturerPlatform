'use client';

import { useState } from 'react';
import { useNurtureStore } from '@/lib/store';
import { Campaign, CampaignType, CampaignStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ABTestPanel } from './ab-test-panel';
import { ChevronDown, ChevronRight, MoreHorizontal, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

function typeBadge(type: CampaignType) {
  const map: Record<CampaignType, { label: string; className: string }> = {
    email: { label: 'Email', className: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    sequence: { label: 'Sequence', className: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
    linkedin: { label: 'LinkedIn', className: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
    sms: { label: 'SMS', className: 'bg-green-500/15 text-green-300 border-green-500/30' },
  };
  const { label, className } = map[type];
  return <Badge className={className}>{label}</Badge>;
}

function statusBadge(status: CampaignStatus) {
  const map: Record<CampaignStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'secondary' }> = {
    active: { label: 'Active', variant: 'success' },
    paused: { label: 'Paused', variant: 'warning' },
    completed: { label: 'Completed', variant: 'default' },
    draft: { label: 'Draft', variant: 'secondary' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function RateCell({ value, thresholdHigh, thresholdMid }: { value: number; thresholdHigh: number; thresholdMid: number }) {
  const color =
    value >= thresholdHigh
      ? 'text-emerald-400'
      : value >= thresholdMid
      ? 'text-amber-400'
      : 'text-red-400';
  return <span className={cn('font-medium tabular-nums', color)}>{value.toFixed(1)}%</span>;
}

interface CampaignRowProps {
  campaign: Campaign;
  isExpanded: boolean;
  onToggle: () => void;
}

function CampaignRow({ campaign, isExpanded, onToggle }: CampaignRowProps) {
  return (
    <>
      <tr
        className="border-b border-[#2A2D3E] hover:bg-white/[0.02] cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-[#F1F5F9] truncate max-w-[180px]">
              {campaign.name}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">{typeBadge(campaign.type)}</td>
        <td className="px-4 py-3">{statusBadge(campaign.status)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
            <Users className="w-3.5 h-3.5 text-[#64748B]" />
            {campaign.audienceCount.toLocaleString()}
          </div>
        </td>
        <td className="px-4 py-3">
          <RateCell value={campaign.openRate} thresholdHigh={30} thresholdMid={15} />
        </td>
        <td className="px-4 py-3">
          <RateCell value={campaign.clickRate} thresholdHigh={20} thresholdMid={10} />
        </td>
        <td className="px-4 py-3">
          <RateCell value={campaign.replyRate} thresholdHigh={10} thresholdMid={5} />
        </td>
        <td className="px-4 py-3">
          <RateCell value={campaign.conversionRate} thresholdHigh={5} thresholdMid={2} />
        </td>
        <td className="px-4 py-3">
          {campaign.abVariants.length > 0 ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <span className="text-xs text-[#475569]">—</span>
          )}
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </td>
      </tr>
      {isExpanded && campaign.abVariants.length > 0 && (
        <tr className="border-b border-[#2A2D3E] bg-[#0F1117]/50">
          <td colSpan={10} className="px-4 py-4">
            <ABTestPanel campaign={campaign} />
          </td>
        </tr>
      )}
    </>
  );
}

export function CampaignTable() {
  const campaigns = useNurtureStore((s) => s.campaigns);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const headers = [
    'Name',
    'Type',
    'Status',
    'Audience',
    'Open Rate',
    'Click Rate',
    'Reply Rate',
    'Conversion',
    'A/B',
    'Actions',
  ];

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#2A2D3E] bg-[#0F1117]/50">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-sm text-[#64748B]">
                  No campaigns yet. Create your first campaign to get started.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  isExpanded={expandedId === campaign.id}
                  onToggle={() => toggle(campaign.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
