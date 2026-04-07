'use client';

import Link from 'next/link';
import { Users, Zap, Kanban, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ACTIONS = [
  {
    label: 'Add Contact',
    href: '/contacts',
    Icon: Users,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10',
  },
  {
    label: 'Create Sequence',
    href: '/sequences',
    Icon: Zap,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
  },
  {
    label: 'View Pipeline',
    href: '/pipeline',
    Icon: Kanban,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  {
    label: 'Import CSV',
    href: '#',
    Icon: Upload,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
];

export default function QuickActions() {
  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map(({ label, href, Icon, iconColor, iconBg }) => (
          <Link key={label} href={href} className="block">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2.5 h-10 px-3 hover:border-[#4A4D5E] hover:bg-[#323545] transition-all"
            >
              <div className={`w-6 h-6 rounded ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
              </div>
              <span className="text-xs font-medium text-[#F1F5F9] truncate">{label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
