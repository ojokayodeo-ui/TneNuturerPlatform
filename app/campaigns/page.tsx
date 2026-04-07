'use client';

import { useNurtureStore } from '@/lib/store';
import AppShell from '@/components/layout/app-shell';
import { CampaignMetrics } from '@/components/campaigns/campaign-metrics';
import { CampaignTable } from '@/components/campaigns/campaign-table';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone } from 'lucide-react';

export default function CampaignsPage() {
  const campaigns = useNurtureStore((s) => s.campaigns);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#F1F5F9]">Campaigns</h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Track performance, A/B tests, and conversions
              </p>
            </div>
          </div>
          <Button variant="default" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </div>

        <CampaignMetrics campaigns={campaigns} />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#F1F5F9]">All Campaigns</h2>
            <span className="text-xs text-[#64748B]">{campaigns.length} total</span>
          </div>
          <CampaignTable />
        </div>
      </div>
    </AppShell>
  );
}
