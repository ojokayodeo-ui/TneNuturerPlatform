'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Kanban, Zap, BarChart3,
  Brain, Heart, Settings, ChevronLeft, ChevronRight, Bot,
} from 'lucide-react';
import { useNurtureStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard',   href: '/dashboard',    icon: LayoutDashboard },
  { label: 'Contacts',    href: '/contacts',     icon: Users },
  { label: 'Pipeline',    href: '/pipeline',     icon: Kanban },
  { label: 'Sequences',   href: '/sequences',    icon: Zap },
  { label: 'Campaigns',   href: '/campaigns',    icon: BarChart3 },
  { label: 'AI Insights', href: '/ai-insights',  icon: Brain },
  { label: 'Retention',   href: '/retention',    icon: Heart },
  { label: 'AI Agent',    href: '/ai-agent',     icon: Bot,  badge: 'New' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useNurtureStore();
  const collapsed = sidebarCollapsed;

  return (
    <aside
      className={cn(
        'relative h-screen bg-[#1A1D27] border-r border-[#2A2D3E] flex flex-col shrink-0 transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b border-[#2A2D3E] py-5 shrink-0',
        collapsed ? 'justify-center px-0' : 'gap-3 px-5'
      )}>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#F1F5F9] font-semibold text-sm truncate">Client Nurture OS</span>
            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Beta
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon, ...rest }) => {
          const badge = 'badge' in rest ? (rest as { badge?: string }).badge : undefined;
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                collapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5'
              )}
            >
              <Icon size={18} className={cn('shrink-0', isActive ? 'text-indigo-400' : 'text-[#64748B] group-hover:text-[#F1F5F9]')} />
              {!collapsed && (
                <span className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="truncate">{label}</span>
                  {badge && (
                    <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {badge}
                    </span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#2A2D3E] px-2 pt-2 pb-2 space-y-0.5">
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={cn(
            'flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
            collapsed ? 'justify-center' : '',
            pathname.startsWith('/settings')
              ? 'bg-indigo-500/10 text-indigo-400'
              : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5'
          )}
        >
          <Settings size={18} className={cn('shrink-0', pathname.startsWith('/settings') ? 'text-indigo-400' : 'text-[#64748B] group-hover:text-[#F1F5F9]')} />
          {!collapsed && 'Settings'}
        </Link>

        {/* User row */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">AJ</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#F1F5F9] text-xs font-medium truncate">Alex Johnson</p>
              <p className="text-[#64748B] text-[11px] truncate">alex@agency.com</p>
            </div>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shrink-0">
              Admin
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">AJ</span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1A1D27] border border-[#2A2D3E] flex items-center justify-center text-[#64748B] hover:text-[#F1F5F9] hover:border-indigo-500/50 transition-all duration-150 z-50"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft className="w-3 h-3" />
        }
      </button>
    </aside>
  );
}
