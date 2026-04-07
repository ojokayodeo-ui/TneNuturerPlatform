'use client';

import { useNurtureStore } from '@/lib/store';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CX = 60;
const CY = 60;

function getStrokeColor(score: number): string {
  if (score >= 70) return '#6366F1';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}

export default function HealthScore() {
  const contacts = useNurtureStore((s) => s.contacts);
  const getDashboardMetrics = useNurtureStore((s) => s.getDashboardMetrics);
  const { avgHealthScore } = getDashboardMetrics();

  const healthy = contacts.filter((c) => c.healthScore > 70).length;
  const atRisk = contacts.filter((c) => c.healthScore >= 40 && c.healthScore <= 70).length;
  const critical = contacts.filter((c) => c.healthScore < 40).length;

  const progress = Math.min(100, Math.max(0, avgHealthScore));
  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
  const strokeColor = getStrokeColor(avgHealthScore);

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-5 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-[#F1F5F9] mb-5 self-start">Nurture Health</h3>

      <div className="relative flex items-center justify-center mb-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="#2A2D3E"
            strokeWidth={8}
          />
          {/* Progress arc */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${CX} ${CY})`}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#F1F5F9] leading-none">{avgHealthScore}</span>
          <span className="text-sm text-[#64748B] leading-none mt-0.5">%</span>
        </div>
      </div>

      <p className="text-xs text-[#64748B] mb-5">Overall Nurture Health</p>

      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-xs text-[#94A3B8]">Healthy (&gt;70)</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">{healthy}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="text-xs text-[#94A3B8]">At Risk (40–70)</span>
          </div>
          <span className="text-xs font-semibold text-amber-400">{atRisk}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
            <span className="text-xs text-[#94A3B8]">Critical (&lt;40)</span>
          </div>
          <span className="text-xs font-semibold text-red-400">{critical}</span>
        </div>
      </div>
    </div>
  );
}
