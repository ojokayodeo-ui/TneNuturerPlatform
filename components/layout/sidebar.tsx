'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Zap,
  BarChart3,
  Brain,
  Heart,
  Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', href: '/contacts', icon: Users },
  { label: 'Pipeline', href: '/pipeline', icon: Kanban },
  { label: 'Sequences', href: '/sequences', icon: Zap },
  { label: 'Campaigns', href: '/campaigns', icon: BarChart3 },
  { label: 'AI Insights', href: '/ai-insights', icon: Brain },
  { label: 'Retention', href: '/retention', icon: Heart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1A1D27] border-r border-[#2A2D3E] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#2A2D3E]">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[#F1F5F9] font-semibold text-sm leading-tight truncate">
            Client Nurture OS
          </span>
          <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            Beta
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500 rounded-r-none pr-[calc(0.75rem_-_2px)]'
                  : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 border-r-2 border-transparent rounded-r-none'
              }`}
            >
              <Icon
                className={`w-4.5 h-4.5 shrink-0 ${
                  isActive ? 'text-indigo-400' : 'text-[#64748B] group-hover:text-[#F1F5F9]'
                }`}
                size={18}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[#2A2D3E]">
        {/* Settings */}
        <div className="px-3 pt-3 pb-2">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group border-r-2 rounded-r-none ${
              pathname === '/settings' || pathname.startsWith('/settings/')
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500'
                : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 border-transparent'
            }`}
          >
            <Settings
              size={18}
              className={`shrink-0 ${
                pathname === '/settings' || pathname.startsWith('/settings/')
                  ? 'text-indigo-400'
                  : 'text-[#64748B] group-hover:text-[#F1F5F9]'
              }`}
            />
            Settings
          </Link>
        </div>

        {/* User Section */}
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0">
            <span className="text-white text-xs font-semibold">AJ</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#F1F5F9] text-sm font-medium truncate">Alex Johnson</p>
            <p className="text-[#64748B] text-xs truncate">alex@agency.com</p>
          </div>
          <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            Admin
          </span>
        </div>
      </div>
    </aside>
  );
}
