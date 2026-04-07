'use client';

import { useNurtureStore } from '@/lib/store';
import { formatCurrency, generateInitials, getAvatarColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function UpsellPanel() {
  const { insights, contacts } = useNurtureStore();
  const upsellInsights = insights.filter((i) => i.type === 'upsell_opportunity');

  if (upsellInsights.length === 0) {
    return (
      <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
        <Sparkles className="w-8 h-8 text-[#2A2D3E]" />
        <div>
          <p className="text-sm font-medium text-[#94A3B8]">No upsell opportunities yet</p>
          <p className="text-xs text-[#64748B] mt-1">AI will flag opportunities as clients engage more.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-[#2A2D3E]">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#F1F5F9]">Upsell Opportunities</h2>
          <p className="text-xs text-[#64748B]">{upsellInsights.length} opportunities detected</p>
        </div>
      </div>

      <div className="divide-y divide-[#2A2D3E]">
        {upsellInsights.map((insight) => {
          const contact = contacts.find((c) => c.id === insight.contactId);
          if (!contact) return null;
          const initials = generateInitials(contact.name);
          const avatarColor = getAvatarColor(contact.name);
          const upsellValue = contact.contractValue ? contact.contractValue * 0.4 : 2000;

          return (
            <div key={insight.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
              <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#F1F5F9] truncate">{contact.name}</p>
                  <span className="text-xs text-[#64748B]">·</span>
                  <p className="text-xs text-[#64748B] truncate">{contact.company}</p>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5 truncate">{insight.recommendation}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-emerald-400">+{formatCurrency(upsellValue)}</p>
                <p className="text-xs text-[#64748B]">est. value</p>
              </div>
              <Button size="sm" variant="default" className="shrink-0 text-xs">
                Propose
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
