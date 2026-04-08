'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell, Plus, ChevronRight } from 'lucide-react';

function getPageName(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)[0] ?? 'dashboard';
  const names: Record<string, string> = {
    dashboard: 'Dashboard',
    contacts: 'Contacts',
    pipeline: 'Pipeline',
    sequences: 'Sequences',
    campaigns: 'Campaigns',
    'ai-insights': 'AI Insights',
    retention: 'Retention',
    settings: 'Settings',
  };
  return names[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Header() {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  return (
    <header className="sticky top-0 h-16 bg-[#1A1D27] border-b border-[#2A2D3E] flex items-center px-6 gap-4 z-30 shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0 flex-shrink-0">
        <span className="text-[#64748B] text-sm">Home</span>
        <ChevronRight className="text-[#2A2D3E] w-3.5 h-3.5 shrink-0" />
        <span className="text-[#F1F5F9] text-sm font-medium">{pageName}</span>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search contacts, sequences..."
            className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F1F5F9] placeholder-[#64748B] outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-150"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notification Bell */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 transition-all duration-150">
          <Bell className="w-4.5 h-4.5" size={18} />
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold leading-none">
            3
          </span>
        </button>

        {/* Add Contact Button */}
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 active:opacity-80 transition-opacity duration-150 shadow-lg shadow-indigo-500/20">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>

        {/* User Avatar */}
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0 cursor-pointer hover:opacity-90 transition-opacity duration-150">
          <span className="text-white text-xs font-semibold">AJ</span>
        </div>
      </div>
    </header>
  );
}
