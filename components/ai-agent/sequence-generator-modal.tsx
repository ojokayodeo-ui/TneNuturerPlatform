'use client';

import { useState } from 'react';
import { X, Loader2, Wand2, Copy, CheckCheck, ChevronDown, ChevronUp, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Contact, KnowledgeBaseItem, GeneratedSequence, GeneratedEmailStep } from '@/lib/types';

const SEQUENCE_TYPES = [
  { value: 'cold_to_warm', label: 'Cold → Warm', description: 'Pure value, build authority, zero pitch' },
  { value: 'warm_to_hot', label: 'Warm → Hot', description: 'Demonstrate expertise, soft offer' },
  { value: 'hot_to_client', label: 'Hot → Client', description: 'Close the deal, remove friction' },
  { value: 'client_to_fan', label: 'Client → Raging Fan', description: 'Delight, upsell, referral activation' },
  { value: 'full_journey', label: 'Full Journey', description: 'Ice Cold → Raging Fan (complete arc)' },
];

const TONES = [
  { value: 'professional yet conversational', label: 'Professional & Warm' },
  { value: 'casual and friendly', label: 'Casual & Friendly' },
  { value: 'bold and direct', label: 'Bold & Direct' },
  { value: 'educational and authoritative', label: 'Educational' },
  { value: 'storytelling and personal', label: 'Story-Driven' },
];

interface EmailStepPreviewProps {
  step: GeneratedEmailStep;
  index: number;
}

function EmailStepPreview({ step, index }: EmailStepPreviewProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const text = `Subject: ${step.subject}\n\n${step.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-[#2A2D3E] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5 bg-[#1A1D27] hover:bg-[#1E2130] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-indigo-400">{step.step}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#F1F5F9] truncate">{step.name}</p>
            <p className="text-xs text-[#64748B] truncate">{step.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {step.delayDays > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[#64748B] bg-[#2A2D3E] px-2 py-0.5 rounded-full">
              <Calendar className="w-3 h-3" />
              Day {step.delayDays}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="p-4 border-t border-[#2A2D3E] bg-[#0F1117]/50 space-y-3">
          <div>
            <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1">Goal</p>
            <p className="text-xs text-[#94A3B8]">{step.goal}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1">Subject Line</p>
            <p className="text-sm font-medium text-[#F1F5F9] bg-[#1A1D27] border border-[#2A2D3E] rounded-lg px-3 py-2">
              {step.subject}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Email Body</p>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[10px] text-[#64748B] hover:text-indigo-400 transition-colors"
              >
                {copied ? (
                  <><CheckCheck className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                ) : (
                  <><Copy className="w-3 h-3" />Copy</>
                )}
              </button>
            </div>
            <pre className="text-xs text-[#E2E8F0] whitespace-pre-wrap font-sans leading-relaxed bg-[#1A1D27] border border-[#2A2D3E] rounded-lg p-3 max-h-60 overflow-y-auto">
              {step.body}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

interface SequenceGeneratorModalProps {
  contact: Contact;
  knowledgeBase: KnowledgeBaseItem[];
  onClose: () => void;
  onSave?: (sequence: GeneratedSequence) => void;
}

export function SequenceGeneratorModal({
  contact,
  knowledgeBase,
  onClose,
  onSave,
}: SequenceGeneratorModalProps) {
  const [sequenceType, setSequenceType] = useState('cold_to_warm');
  const [emailCount, setEmailCount] = useState(5);
  const [tone, setTone] = useState('professional yet conversational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedSequence | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerated(null);

    try {
      const res = await fetch('/api/ai/generate-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, sequenceType, emailCount, tone, knowledgeBase }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }

      const data: GeneratedSequence = await res.json();
      setGenerated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#1A1D27] border border-[#2A2D3E] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2D3E] shrink-0">
          <div>
            <h2 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-indigo-400" />
              AI Sequence Generator
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              For: <span className="text-[#94A3B8]">{contact.name}</span> at{' '}
              <span className="text-[#94A3B8]">{contact.company}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Config (shown when not yet generated) */}
          {!generated && (
            <div className="p-6 space-y-5">
              {/* Sequence type */}
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase tracking-wider">
                  Journey Type
                </label>
                <div className="space-y-2">
                  {SEQUENCE_TYPES.map((st) => (
                    <label
                      key={st.value}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                        sequenceType === st.value
                          ? 'border-indigo-500/50 bg-indigo-500/10'
                          : 'border-[#2A2D3E] bg-[#0F1117]/50 hover:border-[#3A3D4E]'
                      )}
                    >
                      <input
                        type="radio"
                        name="sequenceType"
                        value={st.value}
                        checked={sequenceType === st.value}
                        onChange={() => setSequenceType(st.value)}
                        className="mt-0.5 accent-indigo-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#F1F5F9]">{st.label}</p>
                        <p className="text-xs text-[#64748B]">{st.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email count + tone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase tracking-wider">
                    Number of Emails
                  </label>
                  <select
                    value={emailCount}
                    onChange={(e) => setEmailCount(Number(e.target.value))}
                    className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] outline-none focus:border-indigo-500/60 transition-all"
                  >
                    {[3, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>{n} emails</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase tracking-wider">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] outline-none focus:border-indigo-500/60 transition-all"
                  >
                    {TONES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {knowledgeBase.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                  <span>✓</span>
                  <span>{knowledgeBase.length} knowledge base item{knowledgeBase.length !== 1 ? 's' : ''} will be used to personalize this sequence</span>
                </div>
              )}

              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Generated sequence */}
          {generated && (
            <div className="p-6 space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/25 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-[#F1F5F9] mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  {generated.name}
                </h3>
                <p className="text-xs text-[#94A3B8]">{generated.description}</p>
                <p className="text-xs text-indigo-400 mt-1">Journey: {generated.targetJourney}</p>
              </div>

              <div className="space-y-2">
                {generated.emails.map((email, i) => (
                  <EmailStepPreview key={i} step={email} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2A2D3E] shrink-0">
          {generated ? (
            <>
              <button
                onClick={() => setGenerated(null)}
                className="text-sm text-[#64748B] hover:text-[#F1F5F9] transition-colors"
              >
                ← Regenerate
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 transition-all"
                >
                  Close
                </button>
                {onSave && (
                  <button
                    onClick={() => { onSave(generated); onClose(); }}
                    className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                  >
                    Save Sequence
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={generate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-indigo-500/20"
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
                ) : (
                  <><Wand2 className="w-4 h-4" />Generate Sequence</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
