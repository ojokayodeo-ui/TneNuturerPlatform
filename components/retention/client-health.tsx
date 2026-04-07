'use client';

import { useNurtureStore } from '@/lib/store';
import { formatCurrency, formatDate, getAvatarColor, generateInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp } from 'lucide-react';

function HealthCircle({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#6366F1' : score >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#2A2D3E" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="41" textAnchor="middle" fill={color} fontSize="14" fontWeight="700">{score}</text>
    </svg>
  );
}

export default function ClientHealth() {
  const { contacts } = useNurtureStore();
  const clients = contacts.filter((c) => c.isClient);

  const getCategory = (score: number) => {
    if (score >= 80) return { label: 'Thriving', color: 'text-emerald-400' };
    if (score >= 60) return { label: 'Stable', color: 'text-indigo-400' };
    if (score >= 40) return { label: 'At Risk', color: 'text-amber-400' };
    return { label: 'Critical', color: 'text-red-400' };
  };

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-[#2A2D3E]">
        <div>
          <h2 className="text-sm font-semibold text-[#F1F5F9]">Client Health</h2>
          <p className="text-xs text-[#64748B] mt-0.5">{clients.length} active clients</p>
        </div>
        <Button size="sm" variant="secondary">Schedule Check-ins</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
        {clients.map((client) => {
          const initials = generateInitials(client.name);
          const avatarColor = getAvatarColor(client.name);
          const category = getCategory(client.healthScore);
          const nextCheckIn = new Date(client.lastContactedAt);
          nextCheckIn.setDate(nextCheckIn.getDate() + 30);

          return (
            <div key={client.id} className="bg-[#0F1117] border border-[#2A2D3E] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F1F5F9] leading-tight">{client.name}</p>
                    <p className="text-xs text-[#64748B]">{client.company}</p>
                  </div>
                </div>
                <HealthCircle score={client.healthScore} />
              </div>

              <div className={`text-xs font-medium ${category.color}`}>{category.label}</div>

              <div className="grid grid-cols-2 gap-2">
                {client.contractValue && (
                  <div className="bg-[#1A1D27] rounded-lg p-2">
                    <p className="text-xs text-[#64748B]">Contract</p>
                    <p className="text-sm font-semibold text-[#F1F5F9]">{formatCurrency(client.contractValue)}</p>
                  </div>
                )}
                {client.ltv && (
                  <div className="bg-[#1A1D27] rounded-lg p-2">
                    <p className="text-xs text-[#64748B]">LTV</p>
                    <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {formatCurrency(client.ltv)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Next check-in: {nextCheckIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>

              <Button size="sm" variant="outline" className="w-full text-xs">Schedule Check-in</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
