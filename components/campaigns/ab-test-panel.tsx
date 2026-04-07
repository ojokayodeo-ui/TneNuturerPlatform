'use client';

import { Campaign, ABVariant } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, PauseCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ABTestPanelProps {
  campaign: Campaign;
}

interface VariantCardProps {
  variant: ABVariant;
  isWinner: boolean;
}

function VariantCard({ variant, isWinner }: VariantCardProps) {
  return (
    <div
      className={cn(
        'flex-1 rounded-xl border p-5 flex flex-col gap-4 transition-all duration-200',
        isWinner
          ? 'border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
          : 'border-[#2A2D3E] bg-[#0F1117]'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#F1F5F9]">{variant.name}</span>
          {isWinner && (
            <Badge variant="success" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Winner
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Users className="w-3.5 h-3.5" />
          <span>{variant.audience.toLocaleString()} contacts</span>
        </div>
      </div>

      <div className="rounded-lg bg-[#1A1D27] border border-[#2A2D3E] px-3 py-2">
        <p className="text-xs text-[#64748B] mb-0.5">Subject line</p>
        <p className="text-sm text-[#F1F5F9] font-medium leading-snug">{variant.subject}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Open Rate</span>
            <span
              className={cn(
                'font-semibold',
                variant.openRate >= 30
                  ? 'text-emerald-400'
                  : variant.openRate >= 15
                  ? 'text-amber-400'
                  : 'text-red-400'
              )}
            >
              {variant.openRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={variant.openRate}
            color={variant.openRate >= 30 ? 'emerald' : variant.openRate >= 15 ? 'amber' : 'red'}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Click Rate</span>
            <span
              className={cn(
                'font-semibold',
                variant.clickRate >= 20
                  ? 'text-emerald-400'
                  : variant.clickRate >= 10
                  ? 'text-amber-400'
                  : 'text-red-400'
              )}
            >
              {variant.clickRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={variant.clickRate}
            color={variant.clickRate >= 20 ? 'emerald' : variant.clickRate >= 10 ? 'amber' : 'red'}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Reply Rate</span>
            <span
              className={cn(
                'font-semibold',
                variant.replyRate >= 10
                  ? 'text-emerald-400'
                  : variant.replyRate >= 5
                  ? 'text-amber-400'
                  : 'text-red-400'
              )}
            >
              {variant.replyRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={variant.replyRate}
            color={variant.replyRate >= 10 ? 'emerald' : variant.replyRate >= 5 ? 'amber' : 'red'}
          />
        </div>
      </div>
    </div>
  );
}

export function ABTestPanel({ campaign }: ABTestPanelProps) {
  if (!campaign.abVariants || campaign.abVariants.length < 2) {
    return (
      <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-6 text-center">
        <p className="text-sm text-[#64748B]">No A/B variants configured for this campaign.</p>
      </div>
    );
  }

  const [variantA, variantB] = campaign.abVariants;
  const winnerIndex = variantA.replyRate >= variantB.replyRate ? 0 : 1;

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[#F1F5F9]">A/B Test Results</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            {campaign.name} — comparing {campaign.abVariants.length} variants
          </p>
        </div>
        <Badge variant="default">Live Test</Badge>
      </div>

      <div className="flex gap-4 mb-5">
        <VariantCard variant={variantA} isWinner={winnerIndex === 0} />
        <VariantCard variant={variantB} isWinner={winnerIndex === 1} />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-[#2A2D3E]">
        <Button variant="success" size="sm" className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" />
          Pick Winner
        </Button>
        <Button variant="danger" size="sm" className="flex items-center gap-1.5">
          <PauseCircle className="w-3.5 h-3.5" />
          Pause Losing Variant
        </Button>
        <span className="text-xs text-[#64748B] ml-auto">
          Winner determined by reply rate
        </span>
      </div>
    </div>
  );
}
