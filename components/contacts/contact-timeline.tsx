'use client';

import {
  Mail,
  StickyNote,
  ArrowRight,
  Phone,
  Linkedin,
  MessageSquare,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Interaction, InteractionType } from '@/lib/types';

interface ContactTimelineProps {
  interactions: Interaction[];
}

interface TimelineItemConfig {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
}

function getItemConfig(type: InteractionType, direction?: string): TimelineItemConfig {
  switch (type) {
    case 'email_sent':
      return {
        icon: Mail,
        iconBg: 'bg-blue-500/15',
        iconColor: 'text-blue-400',
        label: 'Email Sent',
      };
    case 'email_received':
      return {
        icon: Mail,
        iconBg: 'bg-emerald-500/15',
        iconColor: 'text-emerald-400',
        label: 'Reply Received',
      };
    case 'note':
      return {
        icon: StickyNote,
        iconBg: 'bg-amber-500/15',
        iconColor: 'text-amber-400',
        label: 'Note',
      };
    case 'stage_change':
      return {
        icon: ArrowRight,
        iconBg: 'bg-purple-500/15',
        iconColor: 'text-purple-400',
        label: 'Stage Changed',
      };
    case 'call':
      return {
        icon: Phone,
        iconBg: 'bg-emerald-500/15',
        iconColor: 'text-emerald-400',
        label: 'Call',
      };
    case 'meeting':
      return {
        icon: Phone,
        iconBg: 'bg-cyan-500/15',
        iconColor: 'text-cyan-400',
        label: 'Meeting',
      };
    case 'linkedin_message':
      return {
        icon: Linkedin,
        iconBg: 'bg-indigo-500/15',
        iconColor: 'text-indigo-400',
        label: 'LinkedIn Message',
      };
    case 'sms':
      return {
        icon: MessageSquare,
        iconBg: 'bg-teal-500/15',
        iconColor: 'text-teal-400',
        label: 'SMS',
      };
    case 'sequence_enrolled':
      return {
        icon: ArrowRight,
        iconBg: 'bg-violet-500/15',
        iconColor: 'text-violet-400',
        label: 'Enrolled in Sequence',
      };
    default:
      return {
        icon: Mail,
        iconBg: 'bg-slate-500/15',
        iconColor: 'text-slate-400',
        label: 'Interaction',
      };
  }
}

function truncate(text: string, max = 120): string {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

export function ContactTimeline({ interactions }: ContactTimelineProps) {
  if (!interactions || interactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#2A2D3E] bg-[#1A1D27] py-14 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2A2D3E]">
          <MessageSquare className="h-5 w-5 text-[#64748B]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#F1F5F9]">No interactions yet</p>
          <p className="mt-1 text-xs text-[#64748B]">
            Interactions will appear here as you communicate with this contact.
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...interactions].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  return (
    <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D27] p-6">
      <h3 className="mb-5 text-sm font-semibold text-[#F1F5F9]">
        Activity Timeline
        <span className="ml-2 rounded-full bg-[#2A2D3E] px-2 py-0.5 text-xs font-normal text-[#94A3B8]">
          {sorted.length}
        </span>
      </h3>

      <div className="relative space-y-0">
        {sorted.map((item, index) => {
          const config = getItemConfig(item.type, item.direction);
          const Icon = config.icon;
          const isLast = index === sorted.length - 1;

          return (
            <div key={item.id} className="flex gap-4">
              {/* Icon column with connector line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    config.iconBg
                  )}
                >
                  <Icon className={cn('h-4 w-4', config.iconColor)} />
                </div>
                {!isLast && (
                  <div className="my-1 w-px flex-1 min-h-[1.5rem] bg-[#2A2D3E]" />
                )}
              </div>

              {/* Content column */}
              <div className={cn('flex-1 pb-5', isLast && 'pb-0')}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[#F1F5F9]">
                        {config.label}
                      </span>
                      {item.direction && (
                        <span
                          className={cn(
                            'rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
                            item.direction === 'inbound'
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                          )}
                        >
                          {item.direction}
                        </span>
                      )}
                    </div>

                    {item.subject && (
                      <p className="mt-1 text-xs font-medium text-[#94A3B8]">
                        {item.subject}
                      </p>
                    )}

                    {item.body && (
                      <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                        {truncate(item.body)}
                      </p>
                    )}

                    {/* Email status indicators */}
                    {(item.opened !== undefined ||
                      item.clicked !== undefined ||
                      item.replied !== undefined) && (
                      <div className="mt-2 flex items-center gap-3">
                        {item.opened !== undefined && (
                          <span
                            className={cn(
                              'text-[10px] font-medium',
                              item.opened ? 'text-emerald-400' : 'text-[#64748B]'
                            )}
                          >
                            {item.opened ? 'Opened' : 'Not opened'}
                          </span>
                        )}
                        {item.clicked !== undefined && (
                          <span
                            className={cn(
                              'text-[10px] font-medium',
                              item.clicked ? 'text-blue-400' : 'text-[#64748B]'
                            )}
                          >
                            {item.clicked ? 'Clicked' : 'Not clicked'}
                          </span>
                        )}
                        {item.replied !== undefined && (
                          <span
                            className={cn(
                              'text-[10px] font-medium',
                              item.replied ? 'text-violet-400' : 'text-[#64748B]'
                            )}
                          >
                            {item.replied ? 'Replied' : 'No reply'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="shrink-0 text-[11px] text-[#64748B] tabular-nums">
                    {formatDate(item.sentAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
