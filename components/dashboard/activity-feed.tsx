'use client';

import { useNurtureStore } from '@/lib/store';
import { formatDate, generateInitials, getAvatarColor } from '@/lib/utils';
import { Interaction, InteractionType } from '@/lib/types';
import {
  Mail,
  Phone,
  StickyNote,
  ArrowRightLeft,
  Linkedin,
  MessageSquare,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

interface EnrichedInteraction extends Interaction {
  contactName: string;
  contactCompany: string;
}

const TYPE_CONFIG: Record<
  InteractionType,
  { label: string; Icon: React.ElementType; color: string; bg: string }
> = {
  email_sent: { label: 'Email sent', Icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  email_received: { label: 'Email received', Icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  call: { label: 'Call', Icon: Phone, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  meeting: { label: 'Meeting', Icon: CalendarCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  note: { label: 'Note added', Icon: StickyNote, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  stage_change: { label: 'Stage changed', Icon: ArrowRightLeft, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  sequence_enrolled: { label: 'Enrolled in sequence', Icon: ArrowRightLeft, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  linkedin_message: { label: 'LinkedIn message', Icon: Linkedin, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  sms: { label: 'SMS', Icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export default function ActivityFeed() {
  const contacts = useNurtureStore((s) => s.contacts);

  const recentActivity: EnrichedInteraction[] = contacts
    .flatMap((contact) =>
      contact.interactions.map((interaction) => ({
        ...interaction,
        contactName: contact.name,
        contactCompany: contact.company,
      }))
    )
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, 10);

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-[#F1F5F9]">Recent Activity</h3>
        <span className="text-xs text-[#64748B]">{recentActivity.length} interactions</span>
      </div>

      <div className="space-y-3">
        {recentActivity.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-6">No recent activity</p>
        ) : (
          recentActivity.map((item) => {
            const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.note;
            const { Icon, color, bg, label } = config;
            const initials = generateInitials(item.contactName);
            const avatarColor = getAvatarColor(item.contactName);

            return (
              <div key={item.id} className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-[10px] font-semibold text-white">{initials}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-[#F1F5F9] truncate">
                      {item.contactName}
                    </span>
                    <span className="text-xs text-[#64748B] hidden sm:inline">·</span>
                    <span className="text-xs text-[#64748B] hidden sm:inline truncate">
                      {item.contactCompany}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-5 h-5 rounded ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-3 h-3 ${color}`} />
                    </div>
                    <span className="text-xs text-[#94A3B8] truncate">
                      {item.subject ?? label}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <span className="text-[10px] text-[#64748B] flex-shrink-0 mt-0.5">
                  {formatDate(item.sentAt)}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#2A2D3E]">
        <Link
          href="/contacts"
          className="flex items-center justify-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all activity
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
