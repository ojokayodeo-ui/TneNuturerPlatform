'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/app-shell';
import SequenceBuilder from '@/components/sequences/sequence-builder';
import SequenceTemplates from '@/components/sequences/sequence-templates';
import { Button } from '@/components/ui/button';
import { useNurtureStore } from '@/lib/store';
import { Sequence, SequenceStep, SequenceType } from '@/lib/types';
import { ArrowLeft, Save, Zap } from 'lucide-react';

// ---------------------------------------------------------------------------
// Pre-built cold outreach 7-step sequence (Cold → Booked Call)
// ---------------------------------------------------------------------------
function buildColdOutreachSteps(sequenceId: string): SequenceStep[] {
  return [
    {
      id: `${sequenceId}-s1`,
      sequenceId,
      order: 1,
      type: 'email',
      subject: 'Quick question about {company}',
      body: `Hi {name},\n\nI came across {company} and noticed you're doing some interesting work in {industry}.\n\nI wanted to reach out because we help companies like yours [specific outcome]. Would it make sense to connect briefly?\n\nBest,\n[Your name]`,
      delayDays: 0,
      delayHours: 0,
      condition: 'always',
    },
    {
      id: `${sequenceId}-s2`,
      sequenceId,
      order: 2,
      type: 'linkedin',
      body: `Hi {name}, I just sent you an email about [topic]. Would love to connect here too — following your work at {company}!`,
      delayDays: 2,
      delayHours: 0,
      condition: 'always',
    },
    {
      id: `${sequenceId}-s3`,
      sequenceId,
      order: 3,
      type: 'email',
      subject: 'Re: Quick question about {company}',
      body: `Hi {name},\n\nFollowing up on my last note. I know your inbox is busy so I'll keep this short.\n\nWe've helped similar companies in {industry} achieve [specific result]. Worth a 15-minute call?\n\n[Calendar link]\n\nBest,\n[Your name]`,
      delayDays: 4,
      delayHours: 0,
      condition: 'if_not_replied',
    },
    {
      id: `${sequenceId}-s4`,
      sequenceId,
      order: 4,
      type: 'task',
      body: 'Call {name} at {company} — reference previous emails. Goal: book a 15-min discovery call.',
      delayDays: 7,
      delayHours: 0,
      condition: 'always',
    },
    {
      id: `${sequenceId}-s5`,
      sequenceId,
      order: 5,
      type: 'email',
      subject: 'One more thought for {company}',
      body: `Hi {name},\n\nI'll keep this brief — I have one specific idea for {company} that I think could make a real difference for your {industry} work.\n\nWould you be open to a quick call this week? I'll do the heavy lifting.\n\nIf now isn't the right time, just let me know and I'll circle back in a few months.\n\nBest,\n[Your name]`,
      delayDays: 10,
      delayHours: 0,
      condition: 'if_not_replied',
    },
    {
      id: `${sequenceId}-s6`,
      sequenceId,
      order: 6,
      type: 'sms',
      body: `Hi {name}, this is [Your name] — I've sent a couple of emails about helping {company} with [topic]. Worth a quick chat? Reply YES and I'll send a calendar link.`,
      delayDays: 13,
      delayHours: 0,
      condition: 'if_not_replied',
    },
    {
      id: `${sequenceId}-s7`,
      sequenceId,
      order: 7,
      type: 'email',
      subject: 'Closing the loop — {company}',
      body: `Hi {name},\n\nI've reached out a few times and haven't heard back — totally fine if the timing isn't right.\n\nI'll leave it here for now, but if things change and you'd like to explore how we can help {company}, my door is always open.\n\nWishing you all the best.\n\n[Your name]`,
      delayDays: 18,
      delayHours: 0,
      condition: 'if_not_replied',
    },
  ];
}

// ---------------------------------------------------------------------------
// Blank sequence factory
// ---------------------------------------------------------------------------
function createBlankSequence(type: SequenceType): Sequence {
  const id = `seq-${Date.now()}`;
  const typeNames: Record<SequenceType, string> = {
    cold_outreach: 'Cold Outreach Sequence',
    warm_nurture: 'Warm Nurture Sequence',
    client_onboarding: 'Client Onboarding Sequence',
    retention: 'Retention Sequence',
    upsell: 'Upsell Sequence',
  };
  return {
    id,
    name: typeNames[type],
    description: '',
    type,
    status: 'draft',
    steps: type === 'cold_outreach' ? buildColdOutreachSteps(id) : [],
    stats: { enrolled: 0, completed: 0, replied: 0, converted: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Inner component (uses useSearchParams — must be wrapped in Suspense)
// ---------------------------------------------------------------------------
function BuilderInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { sequences, addSequence, updateSequence } = useNurtureStore();

  const existingId = searchParams.get('id');
  const isNew = !existingId;

  const [showTemplates, setShowTemplates] = useState(isNew);
  const [currentSequence, setCurrentSequence] = useState<Sequence | null>(() => {
    if (existingId) {
      return sequences.find((s) => s.id === existingId) ?? null;
    }
    return null;
  });
  const [isSaved, setIsSaved] = useState(false);

  // If editing an existing sequence and it wasn't found yet, fall back to blank
  useEffect(() => {
    if (!isNew && !currentSequence && sequences.length > 0) {
      const found = sequences.find((s) => s.id === existingId);
      if (found) setCurrentSequence(found);
    }
  }, [sequences, existingId, isNew, currentSequence]);

  const handleTemplateSelect = (type: SequenceType) => {
    const seq = createBlankSequence(type);
    setCurrentSequence(seq);
    setShowTemplates(false);
  };

  const handleTemplateClose = () => {
    // "Start blank" path — create a default blank cold outreach sequence
    if (!currentSequence) {
      const seq = createBlankSequence('cold_outreach');
      seq.steps = [];
      seq.name = 'New Sequence';
      setCurrentSequence(seq);
    }
    setShowTemplates(false);
  };

  const handleSave = (updated: Sequence) => {
    setCurrentSequence(updated);
    const exists = sequences.find((s) => s.id === updated.id);
    if (exists) {
      updateSequence(updated.id, updated);
    } else {
      addSequence(updated);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleActivate = () => {
    if (!currentSequence) return;
    const activated: Sequence = {
      ...currentSequence,
      status: 'active',
      updatedAt: new Date().toISOString(),
    };
    handleSave(activated);
  };

  const sequenceName = currentSequence?.name ?? 'New Sequence';

  return (
    <AppShell>
      <div className="flex flex-col h-full gap-0 -m-6">
        {/* Builder top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#2A2D3E] bg-[#0F1117] flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/sequences"
              className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#F1F5F9] text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Sequences
            </Link>
            <span className="text-[#2A2D3E]">/</span>
            <span className="text-[#94A3B8] text-sm truncate max-w-[240px]">{sequenceName}</span>
          </div>

          <div className="flex items-center gap-2">
            {currentSequence && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  onClick={() =>
                    handleSave({
                      ...currentSequence,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaved ? 'Saved!' : 'Save'}
                </Button>
                {currentSequence.status !== 'active' && (
                  <Button size="sm" className="gap-1.5" onClick={handleActivate}>
                    <Zap className="w-3.5 h-3.5" />
                    Activate
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Main builder canvas */}
        <div className="flex-1 overflow-hidden">
          {currentSequence ? (
            <SequenceBuilder sequence={currentSequence} onSave={handleSave} />
          ) : (
            // Still loading / no template chosen yet
            <div className="flex items-center justify-center h-full">
              <p className="text-[#475569] text-sm">Select a template to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Template picker overlay */}
      {showTemplates && (
        <SequenceTemplates
          onSelect={handleTemplateSelect}
          onClose={handleTemplateClose}
        />
      )}
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Page export — wraps inner component in Suspense for useSearchParams
// ---------------------------------------------------------------------------
export default function SequenceBuilderPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="flex items-center justify-center h-full">
            <p className="text-[#475569] text-sm">Loading…</p>
          </div>
        </AppShell>
      }
    >
      <BuilderInner />
    </Suspense>
  );
}
