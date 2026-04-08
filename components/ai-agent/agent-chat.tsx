'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Loader2, User, Bot, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, KnowledgeBaseItem, Contact } from '@/lib/types';

interface QuickAction {
  label: string;
  prompt: string;
  icon: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Write Cold Email',
    icon: '✉️',
    prompt:
      'Write me a cold email for a B2B prospect. It should be short (under 100 words), curiosity-driven, no pitch, just value. Ask for nothing except their attention.',
  },
  {
    label: 'Subject Line Vault',
    icon: '🎯',
    prompt:
      'Give me 10 high-converting email subject lines that use curiosity, specificity, or pattern interrupts. Include a variety of styles: question, bold claim, story teaser, benefit, and controversy.',
  },
  {
    label: 'Nurture Strategy',
    icon: '🗺️',
    prompt:
      'Help me build a 30-day nurture strategy to take a cold B2B lead from "who are you?" to "when can we start?" What should each week focus on?',
  },
  {
    label: 'Raving Fan Formula',
    icon: '🌋',
    prompt:
      'What are the key steps to turn a new client into a raving fan who sends referrals? Give me the exact sequence of actions, emails, and touchpoints.',
  },
  {
    label: 'Objection Crusher',
    icon: '🛡️',
    prompt:
      'Give me email scripts that handle the 5 most common B2B sales objections: too expensive, not the right time, need to think about it, already have a solution, and need to check with my boss.',
  },
  {
    label: 'Re-engagement Sequence',
    icon: '🔄',
    prompt:
      'Write a 3-email re-engagement sequence for contacts who went cold 3-6 months ago. Must be honest, creative, not desperate. Goal: restart the conversation.',
  },
];

interface AgentChatProps {
  knowledgeBase: KnowledgeBaseItem[];
  selectedContact?: Contact | null;
}

export function AgentChat({ knowledgeBase, selectedContact }: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hey! I'm your Marketing AI Agent — an elite email copywriter and relationship strategist.\n\nI can help you:\n- Write cold emails, nurture sequences, and re-engagement campaigns\n- Build strategies to turn cold leads into raving fans\n- Generate hooks, subject lines, and high-converting copy\n- Analyze what to say next to any specific lead\n\nAdd your swipe files and marketing knowledge to my knowledge base (right panel) and I'll tailor everything to your voice and proven frameworks.\n\nWhat can I write for you today?",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsStreaming(true);

      // Build lead context if a contact is selected
      const leadContext = selectedContact
        ? `The user is asking about this specific lead:\n- Name: ${selectedContact.name}\n- Company: ${selectedContact.company}\n- Title: ${selectedContact.jobTitle || 'Unknown'}\n- Stage: ${selectedContact.stage}\n- Engagement: ${selectedContact.engagementScore}/100\n- Notes: ${selectedContact.notes || 'None'}`
        : undefined;

      // Build message history (skip welcome message for API)
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      // Placeholder for streaming response
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
        },
      ]);

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages, knowledgeBase, leadContext }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Request failed');
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const { text } = JSON.parse(data);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + text } : m
                )
              );
            } catch {
              // ignore parse errors on incomplete chunks
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const errorText =
          err instanceof Error && err.message.includes('ANTHROPIC_API_KEY')
            ? 'The ANTHROPIC_API_KEY environment variable is not set. Add it in your Railway project settings under Variables.'
            : 'Something went wrong. Please try again.';

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: errorText } : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, knowledgeBase, selectedContact, isStreaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [input]);

  return (
    <div className="flex flex-col h-full">
      {/* Selected contact banner */}
      {selectedContact && (
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border-b border-indigo-500/20 text-xs text-indigo-400">
          <Zap className="w-3.5 h-3.5" />
          <span>
            Context: <strong>{selectedContact.name}</strong> at{' '}
            <strong>{selectedContact.company}</strong>
          </span>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-2 flex-wrap p-3 border-b border-[#2A2D3E] bg-[#0F1117]/30">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => sendMessage(action.prompt)}
            disabled={isStreaming}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#94A3B8] bg-[#1A1D27] border border-[#2A2D3E] hover:border-indigo-500/40 hover:text-indigo-300 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-3',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={cn(
                'max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-[#1A1D27] border border-[#2A2D3E] text-[#E2E8F0] rounded-bl-sm'
              )}
            >
              {msg.content === '' && msg.role === 'assistant' ? (
                <span className="flex items-center gap-1.5 text-[#64748B]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Thinking...
                </span>
              ) : (
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#2A2D3E]">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to write an email, generate a sequence, or build a strategy... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="w-full bg-[#1A1D27] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#475569] outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 resize-none transition-all duration-150"
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-[#475569] text-center flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Powered by Claude Opus — Your marketing knowledge base improves every response
        </p>
      </div>
    </div>
  );
}
