'use client';

import { useNurtureStore } from '@/lib/store';
import AppShell from '@/components/layout/app-shell';
import MetricsGrid from '@/components/dashboard/metrics-grid';
import PipelineFunnel from '@/components/dashboard/pipeline-funnel';
import ActivityFeed from '@/components/dashboard/activity-feed';
import HealthScore from '@/components/dashboard/health-score';
import QuickActions from '@/components/dashboard/quick-actions';
import AIRecommendations from '@/components/dashboard/ai-recommendations';

export default function DashboardPage() {
  const store = useNurtureStore();

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#F1F5F9]">Good morning 👋</h1>
        <p className="mt-1 text-sm text-slate-400">
          Here&apos;s what&apos;s happening with your pipeline today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <MetricsGrid />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PipelineFunnel />
            <HealthScore />
          </div>

          <ActivityFeed />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <QuickActions />
          <AIRecommendations />
        </div>
      </div>
    </AppShell>
  );
}
