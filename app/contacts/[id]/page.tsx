'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Tag,
  User,
  GitBranch,
  Zap,
  Calendar,
  ChevronRight,
  StickyNote,
  PhoneCall,
  Layers,
} from 'lucide-react';
import AppShell from '@/components/layout/app-shell';
import { ContactTimeline } from '@/components/contacts/contact-timeline';
import { EngagementScore } from '@/components/contacts/engagement-score';
import { Button } from '@/components/ui/button';
import { useNurtureStore } from '@/lib/store';
import {
  cn,
  getStageColor,
  getStageLabel,
  getAvatarColor,
  getHealthScoreColor,
  getHealthScoreBarColor,
  generateInitials,
  getInsightTypeLabel,
  getInsightTypeColor,
  formatDate,
  formatFullDate,
} from '@/lib/utils';

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  href?: string;
}

function InfoRow({ icon: Icon, label, value, href }: InfoRowProps) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2A2D3E]">
        <Icon className="h-3.5 w-3.5 text-[#64748B]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-[#64748B]">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm text-indigo-400 hover:text-indigo-300 transition-colors block"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-sm text-[#F1F5F9]">{value}</p>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D27] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#64748B]" />
        <h3 className="text-sm font-semibold text-[#F1F5F9]">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const { getContactById, insights, sequences } = useNurtureStore();
  const contact = getContactById(id);

  if (!contact) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2A2D3E]">
            <User className="h-6 w-6 text-[#64748B]" />
          </div>
          <div>
            <p className="text-base font-semibold text-[#F1F5F9]">Contact not found</p>
            <p className="mt-1 text-sm text-[#64748B]">
              This contact may have been deleted or the link is invalid.
            </p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/contacts')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Contacts
          </Button>
        </div>
      </AppShell>
    );
  }

  const insight = insights.find((ins) => ins.contactId === contact.id) ?? null;
  const sequence = contact.sequenceId
    ? sequences.find((s) => s.id === contact.sequenceId) ?? null
    : null;

  const avatarBg = getAvatarColor(contact.name);
  const initials = generateInitials(contact.name);
  const healthColor = getHealthScoreColor(contact.healthScore);
  const healthBarColor = getHealthScoreBarColor(contact.healthScore);

  return (
    <AppShell>
      <div className="flex flex-col gap-6 pb-10">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.push('/contacts')}
          className="flex w-fit items-center gap-1.5 text-sm text-[#64748B] hover:text-[#F1F5F9] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Contacts
        </button>

        {/* Header card */}
        <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D27] p-6">
          <div className="flex flex-wrap items-start gap-5">
            {/* Large avatar */}
            <div
              className={cn(
                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg',
                avatarBg
              )}
            >
              {initials}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-bold text-[#F1F5F9]">{contact.name}</h1>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                    getStageColor(contact.stage)
                  )}
                >
                  {getStageLabel(contact.stage)}
                </span>
                {contact.isClient && (
                  <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    Client
                  </span>
                )}
              </div>
              {contact.jobTitle && (
                <p className="mt-0.5 text-sm text-[#94A3B8]">
                  {contact.jobTitle}
                  {contact.company && (
                    <span className="text-[#64748B]"> at {contact.company}</span>
                  )}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {/* Health score circle */}
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="13" fill="none" stroke="#2A2D3E" strokeWidth="3" />
                      <circle
                        cx="16"
                        cy="16"
                        r="13"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${(contact.healthScore / 100) * 81.7} 81.7`}
                        className={cn(
                          contact.healthScore >= 70
                            ? 'stroke-emerald-500'
                            : contact.healthScore >= 40
                            ? 'stroke-amber-500'
                            : 'stroke-red-500'
                        )}
                      />
                    </svg>
                    <span className={cn('absolute inset-0 flex items-center justify-center text-[9px] font-bold', healthColor)}>
                      {contact.healthScore}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#64748B]">Health</p>
                    <p className={cn('text-xs font-semibold', healthColor)}>{contact.healthScore}/100</p>
                  </div>
                </div>

                {/* Engagement */}
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#64748B] mb-1">Engagement</p>
                  <EngagementScore score={contact.engagementScore} showLabel />
                </div>

                {/* Joined */}
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#64748B]">Added</p>
                  <p className="text-xs text-[#94A3B8]">{formatFullDate(contact.createdAt)}</p>
                </div>

                {/* Last contact */}
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#64748B]">Last Contact</p>
                  <p className="text-xs text-[#94A3B8]">{formatDate(contact.lastContactedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#2A2D3E] pt-5">
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-blue-500/20">
              <Mail className="h-3.5 w-3.5" />
              Send Email
            </Button>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <StickyNote className="h-3.5 w-3.5" />
              Add Note
            </Button>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" />
              Book Call
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Change Stage
            </Button>
          </div>
        </div>

        {/* 3-column info grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Col 1: Contact info */}
          <SectionCard title="Contact Info" icon={User}>
            <InfoRow icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
            <InfoRow icon={Phone} label="Phone" value={contact.phone} href={`tel:${contact.phone}`} />
            <InfoRow icon={Globe} label="Website" value={contact.website} href={contact.website} />
            <InfoRow
              icon={Linkedin}
              label="LinkedIn"
              value={contact.linkedinUrl ? 'View Profile' : undefined}
              href={contact.linkedinUrl}
            />
            <InfoRow icon={User} label="Source" value={contact.source ? contact.source.charAt(0).toUpperCase() + contact.source.slice(1) : undefined} />
            {contact.assignedTo && (
              <InfoRow icon={User} label="Assigned To" value={contact.assignedTo} />
            )}
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2A2D3E]">
                  <Tag className="h-3.5 w-3.5 text-[#64748B]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#64748B]">Tags</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-[#2A2D3E] px-2 py-0.5 text-[11px] font-medium text-[#94A3B8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Col 2: Sequence info */}
          <SectionCard title="Sequence" icon={GitBranch}>
            {sequence ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2A2D3E]">
                    <GitBranch className="h-3.5 w-3.5 text-[#64748B]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#64748B]">Active Sequence</p>
                    <p className="text-sm font-medium text-[#F1F5F9]">{sequence.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2A2D3E]">
                    <Calendar className="h-3.5 w-3.5 text-[#64748B]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#64748B]">Status</p>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium mt-0.5',
                        sequence.status === 'active'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : sequence.status === 'paused'
                          ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                          : 'border-[#2A2D3E] bg-[#2A2D3E] text-[#94A3B8]'
                      )}
                    >
                      {sequence.status.charAt(0).toUpperCase() + sequence.status.slice(1)}
                    </span>
                  </div>
                </div>
                {sequence.steps.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2A2D3E]">
                      <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#64748B]">Next Step</p>
                      <p className="text-sm text-[#94A3B8]">
                        Step {sequence.steps[0].order}:{' '}
                        <span className="capitalize">{sequence.steps[0].type}</span>
                        {sequence.steps[0].subject && (
                          <span className="text-[#64748B]"> — {sequence.steps[0].subject}</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-1 rounded-lg border border-[#2A2D3E] bg-[#0F1117] p-3">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-base font-bold text-[#F1F5F9] tabular-nums">{sequence.stats.enrolled}</p>
                      <p className="text-[10px] text-[#64748B]">Enrolled</p>
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#F1F5F9] tabular-nums">{sequence.stats.replied}</p>
                      <p className="text-[10px] text-[#64748B]">Replied</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2D3E]">
                  <GitBranch className="h-4 w-4 text-[#64748B]" />
                </div>
                <p className="text-sm text-[#64748B]">Not enrolled in any sequence</p>
                <Button variant="outline" size="sm" className="mt-1 gap-1.5 text-xs">
                  <GitBranch className="h-3 w-3" />
                  Assign Sequence
                </Button>
              </div>
            )}
          </SectionCard>

          {/* Col 3: AI Insight */}
          <SectionCard title="AI Insight" icon={Zap}>
            {insight ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                      getInsightTypeColor(insight.type)
                    )}
                  >
                    {getInsightTypeLabel(insight.type)}
                  </span>
                  <span className="text-xs text-[#64748B]">{formatDate(insight.createdAt)}</span>
                </div>

                {/* Confidence bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[#64748B]">Confidence</span>
                    <span className="text-xs font-semibold text-[#F1F5F9] tabular-nums">{insight.confidence}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2A2D3E]">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        insight.confidence >= 80
                          ? 'bg-emerald-500'
                          : insight.confidence >= 60
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      )}
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                </div>

                {insight.signalStrength !== undefined && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-[#64748B]">Signal Strength</span>
                      <span className="text-xs font-semibold text-[#F1F5F9] tabular-nums">{insight.signalStrength}/10</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-1.5 flex-1 rounded-full',
                            i < (insight.signalStrength ?? 0)
                              ? insight.signalStrength! >= 8
                                ? 'bg-emerald-500'
                                : insight.signalStrength! >= 5
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                              : 'bg-[#2A2D3E]'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="rounded-lg border border-[#2A2D3E] bg-[#0F1117] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B] mb-2">Recommendation</p>
                  <p className="text-xs leading-relaxed text-[#94A3B8]">{insight.recommendation}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2D3E]">
                  <Zap className="h-4 w-4 text-[#64748B]" />
                </div>
                <p className="text-sm text-[#64748B]">No AI insight available yet</p>
                <p className="text-xs text-[#64748B]/70">
                  Insights are generated as you interact with this contact.
                </p>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Notes section */}
        {contact.notes && (
          <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D27] p-5">
            <div className="mb-3 flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-[#64748B]" />
              <h3 className="text-sm font-semibold text-[#F1F5F9]">Notes</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{contact.notes}</p>
          </div>
        )}

        {/* Activity timeline */}
        <ContactTimeline interactions={contact.interactions} />
      </div>
    </AppShell>
  );
}
