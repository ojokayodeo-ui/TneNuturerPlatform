'use client';

import { useState, useEffect, useCallback } from 'react';
import { Brain, Thermometer, Wand2, ChevronDown, Loader2, AlertTriangle } from 'lucide-react';
import AppShell from '@/components/layout/app-shell';
import { AgentChat } from '@/components/ai-agent/agent-chat';
import { KnowledgeBasePanel } from '@/components/ai-agent/knowledge-base-panel';
import { SequenceGeneratorModal } from '@/components/ai-agent/sequence-generator-modal';
import { useNurtureStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { KnowledgeBaseItem, Contact, LeadAnalysis } from '@/lib/types';

const KB_STORAGE_KEY = 'nurture_knowledge_base';

function getTemperatureColor(score: number): string {
  if (score <= 20) return 'text-blue-400';
  if (score <= 40) return 'text-cyan-400';
  if (score <= 60) return 'text-amber-400';
  if (score <= 80) return 'text-orange-400';
  return 'text-red-400';
}

function getTemperatureBg(score: number): string {
  if (score <= 20) return 'bg-blue-500/10 border-blue-500/25';
  if (score <= 40) return 'bg-cyan-500/10 border-cyan-500/25';
  if (score <= 60) return 'bg-amber-500/10 border-amber-500/25';
  if (score <= 80) return 'bg-orange-500/10 border-orange-500/25';
  return 'bg-red-500/10 border-red-500/25';
}

interface LeadAnalysisCardProps {
  contact: Contact;
  knowledgeBase: KnowledgeBaseItem[];
  onSelectContact: (c: Contact) => void;
}

function LeadAnalysisCard({ contact, knowledgeBase, onSelectContact }: LeadAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const analyze = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
        setExpanded(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#2A2D3E] rounded-xl overflow-hidden bg-[#1A1D27]">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">
              {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#F1F5F9] truncate">{contact.name}</p>
            <p className="text-xs text-[#64748B] truncate">{contact.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {analysis && (
            <span className={cn('text-sm font-bold', getTemperatureColor(analysis.temperature))}>
              {analysis.temperatureEmoji} {analysis.temperature}
            </span>
          )}
          <button
            onClick={analyze}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-[#2A2D3E] text-[#94A3B8] hover:text-indigo-300 hover:bg-indigo-500/15 transition-all disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Thermometer className="w-3 h-3" />}
            {analysis ? 'Re-analyze' : 'Analyze'}
          </button>
          {analysis && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-6 h-6 flex items-center justify-center rounded text-[#64748B] hover:text-[#F1F5F9] transition-colors"
            >
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', expanded ? 'rotate-180' : '')} />
            </button>
          )}
        </div>
      </div>

      {analysis && expanded && (
        <div className={cn('border-t px-3 pb-3 space-y-3', getTemperatureBg(analysis.temperature).split(' ')[0].replace('bg-', 'border-').replace('/10', '/20'))}>
          <div className={cn('flex items-center gap-2 mt-3 px-3 py-2 rounded-lg border text-sm font-semibold', getTemperatureBg(analysis.temperature), getTemperatureColor(analysis.temperature))}>
            {analysis.temperatureEmoji} {analysis.temperatureLabel} — {analysis.temperature}/100
          </div>

          <div>
            <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1.5">Key Insights</p>
            <ul className="space-y-1">
              {analysis.insights.map((insight, i) => (
                <li key={i} className="text-xs text-[#94A3B8] flex gap-2">
                  <span className="text-indigo-400 shrink-0">•</span> {insight}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1.5">Recommended Actions</p>
            <ul className="space-y-1">
              {analysis.recommendedActions.map((action, i) => (
                <li key={i} className="text-xs text-[#94A3B8] flex gap-2">
                  <span className="text-emerald-400 shrink-0">{i + 1}.</span> {action}
                </li>
              ))}
            </ul>
          </div>

          {analysis.personalizedHook && (
            <div>
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1.5">Personalized Opening Line</p>
              <p className="text-xs text-[#F1F5F9] italic bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2">
                "{analysis.personalizedHook}"
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSelectContact(contact)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-indigo-600/80 text-white hover:bg-indigo-600 transition-colors"
            >
              <Brain className="w-3.5 h-3.5" />
              Chat about this lead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIAgentPage() {
  const { contacts } = useNurtureStore();
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [sequenceContact, setSequenceContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'leads'>('chat');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // Load knowledge base from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KB_STORAGE_KEY);
      if (saved) setKnowledgeBase(JSON.parse(saved));
    } catch {}
  }, []);

  // Save knowledge base to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(knowledgeBase));
    } catch {}
  }, [knowledgeBase]);

  const addKbItem = useCallback(
    (item: Omit<KnowledgeBaseItem, 'id' | 'createdAt'>) => {
      const newItem: KnowledgeBaseItem = {
        ...item,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setKnowledgeBase((prev) => [newItem, ...prev]);
    },
    []
  );

  const deleteKbItem = useCallback((id: string) => {
    setKnowledgeBase((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Pick a few contacts to display in the lead analysis tab
  const displayContacts = contacts.slice(0, 8);

  return (
    <AppShell>
      <div className="flex flex-col h-full gap-0">
        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl font-bold text-[#F1F5F9] flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              Marketing AI Agent
            </h1>
            <p className="text-sm text-[#64748B] mt-0.5">
              Your personal email marketing strategist — turns cold leads into raving fans
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSequenceContact(contacts[0] ?? null)}
              disabled={contacts.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity shadow-lg shadow-indigo-500/20"
            >
              <Wand2 className="w-4 h-4" />
              Generate Sequence
            </button>
          </div>
        </div>

        {/* API key warning */}
        {apiKeyMissing && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-sm text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>ANTHROPIC_API_KEY</strong> is not set. Go to your Railway project → Variables → add{' '}
              <code className="bg-black/30 px-1 rounded">ANTHROPIC_API_KEY</code> with your key from{' '}
              <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="underline">
                console.anthropic.com
              </a>
            </span>
          </div>
        )}

        {/* Main layout */}
        <div className="flex flex-1 gap-4 min-h-0">
          {/* Left: Chat + Lead Analyzer */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1A1D27] border border-[#2A2D3E] rounded-2xl overflow-hidden">
            {/* Tab switcher */}
            <div className="flex border-b border-[#2A2D3E] shrink-0">
              <button
                onClick={() => setActiveTab('chat')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-all',
                  activeTab === 'chat'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                    : 'text-[#64748B] hover:text-[#F1F5F9]'
                )}
              >
                <Brain className="w-4 h-4" />
                AI Chat
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-all',
                  activeTab === 'leads'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                    : 'text-[#64748B] hover:text-[#F1F5F9]'
                )}
              >
                <Thermometer className="w-4 h-4" />
                Lead Temperature
              </button>
            </div>

            {/* Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 overflow-hidden">
                <AgentChat
                  knowledgeBase={knowledgeBase}
                  selectedContact={selectedContact}
                />
              </div>
            )}

            {/* Lead Temperature Analyzer */}
            {activeTab === 'leads' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-xs text-[#64748B] mb-3">
                  Click <strong className="text-[#94A3B8]">Analyze</strong> on any contact to get an AI-powered temperature score, insights, and recommended next actions.
                </div>
                {displayContacts.map((contact) => (
                  <LeadAnalysisCard
                    key={contact.id}
                    contact={contact}
                    knowledgeBase={knowledgeBase}
                    onSelectContact={(c) => {
                      setSelectedContact(c);
                      setActiveTab('chat');
                    }}
                  />
                ))}
                {contacts.length === 0 && (
                  <div className="text-center py-12 text-[#475569] text-sm">
                    No contacts yet. Add some contacts to analyze their temperature.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Knowledge Base */}
          <div className="w-80 shrink-0 bg-[#1A1D27] border border-[#2A2D3E] rounded-2xl overflow-hidden">
            <KnowledgeBasePanel
              items={knowledgeBase}
              onAdd={addKbItem}
              onDelete={deleteKbItem}
            />
          </div>
        </div>
      </div>

      {/* Sequence Generator Modal */}
      {sequenceContact && (
        <SequenceGeneratorModal
          contact={sequenceContact}
          knowledgeBase={knowledgeBase}
          onClose={() => setSequenceContact(null)}
        />
      )}
    </AppShell>
  );
}
