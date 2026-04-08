'use client';

import { useState } from 'react';
import { Plus, Trash2, BookOpen, FileText, Link2, Lightbulb, Sparkles, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KnowledgeBaseItem, KnowledgeBaseItemType } from '@/lib/types';

const TYPE_OPTIONS: { value: KnowledgeBaseItemType; label: string; icon: string }[] = [
  { value: 'swipe_file', label: 'Swipe File', icon: '📋' },
  { value: 'email_template', label: 'Email Template', icon: '✉️' },
  { value: 'strategy', label: 'Strategy Doc', icon: '🗺️' },
  { value: 'case_study', label: 'Case Study', icon: '📈' },
  { value: 'hook_library', label: 'Hook Library', icon: '🎣' },
  { value: 'custom', label: 'Custom', icon: '📝' },
];

function getTypeConfig(type: KnowledgeBaseItemType) {
  return TYPE_OPTIONS.find((t) => t.value === type) ?? TYPE_OPTIONS[5];
}

interface AddItemFormProps {
  onAdd: (item: Omit<KnowledgeBaseItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

function AddItemForm({ onAdd, onCancel }: AddItemFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<KnowledgeBaseItemType>('swipe_file');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onAdd({ title: title.trim(), type, content: content.trim(), url: url.trim() || undefined, tags });
  };

  return (
    <div className="border border-indigo-500/30 rounded-xl p-4 bg-indigo-500/5 space-y-3">
      <h4 className="text-sm font-semibold text-[#F1F5F9]">Add Knowledge Base Item</h4>

      {/* Title */}
      <input
        type="text"
        placeholder="Title (e.g. 'Alex Hormozi Cold Email Framework')"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] outline-none focus:border-indigo-500/60 transition-all"
      />

      {/* Type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value as KnowledgeBaseItemType)}
        className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] outline-none focus:border-indigo-500/60 transition-all"
      >
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.icon} {opt.label}
          </option>
        ))}
      </select>

      {/* URL (optional) */}
      <input
        type="url"
        placeholder="Source URL (optional)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] outline-none focus:border-indigo-500/60 transition-all"
      />

      {/* Content */}
      <textarea
        placeholder="Paste your swipe file content, email copy, strategy notes, or any marketing material here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] outline-none focus:border-indigo-500/60 resize-none transition-all"
      />

      {/* Tags */}
      <div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add tag (e.g. cold-email)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] outline-none focus:border-indigo-500/60 transition-all"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 text-xs rounded-lg bg-[#2A2D3E] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm rounded-lg text-[#64748B] hover:text-[#F1F5F9] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add to KB
        </button>
      </div>
    </div>
  );
}

interface KnowledgeBaseItemCardProps {
  item: KnowledgeBaseItem;
  onDelete: (id: string) => void;
}

function KnowledgeBaseItemCard({ item, onDelete }: KnowledgeBaseItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = getTypeConfig(item.type);
  const preview = item.content.substring(0, 120) + (item.content.length > 120 ? '...' : '');

  return (
    <div className="border border-[#2A2D3E] rounded-lg bg-[#1A1D27] overflow-hidden group">
      <div className="flex items-start gap-3 p-3">
        <span className="text-lg shrink-0 mt-0.5">{typeConfig.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h5 className="text-sm font-medium text-[#F1F5F9] leading-tight">{item.title}</h5>
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-6 h-6 flex items-center justify-center rounded text-[#64748B] hover:text-[#F1F5F9] transition-colors"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="w-6 h-6 flex items-center justify-center rounded text-[#64748B] hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#2A2D3E] text-[#64748B] mt-1">
            {typeConfig.label}
          </span>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 mt-1 transition-colors truncate"
            >
              <Link2 className="w-3 h-3 shrink-0" />
              {item.url}
            </a>
          )}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-[#2A2D3E] pt-2">
          <pre className="text-xs text-[#94A3B8] whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
            {item.content}
          </pre>
        </div>
      )}

      {!expanded && (
        <div className="px-3 pb-3">
          <p className="text-xs text-[#475569] line-clamp-2">{preview}</p>
        </div>
      )}
    </div>
  );
}

interface KnowledgeBasePanelProps {
  items: KnowledgeBaseItem[];
  onAdd: (item: Omit<KnowledgeBaseItem, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeBasePanel({ items, onAdd, onDelete }: KnowledgeBasePanelProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2A2D3E]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-[#F1F5F9]">Knowledge Base</h3>
          {items.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
              {items.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
            showForm
              ? 'bg-[#2A2D3E] text-[#94A3B8]'
              : 'bg-indigo-600 text-white hover:bg-indigo-500'
          )}
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Add form */}
        {showForm && (
          <AddItemForm
            onAdd={(item) => {
              onAdd(item);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Empty state */}
        {items.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-sm font-medium text-[#F1F5F9] mb-1.5">No knowledge yet</h4>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-[220px]">
              Add your swipe files, email templates, and marketing strategies. The AI will use them to write copy in your style.
            </p>
            <div className="mt-4 space-y-2 text-left w-full max-w-[220px]">
              {[
                { icon: '📋', text: 'Swipe files from top copywriters' },
                { icon: '✉️', text: 'Your best-performing emails' },
                { icon: '🗺️', text: 'Nurture strategies that work' },
                { icon: '🎣', text: 'Hook and subject line libraries' },
              ].map((hint) => (
                <div key={hint.text} className="flex items-center gap-2 text-xs text-[#475569]">
                  <span>{hint.icon}</span>
                  <span>{hint.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items list */}
        {items.map((item) => (
          <KnowledgeBaseItemCard key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>

      {/* Footer hint */}
      {items.length > 0 && (
        <div className="p-3 border-t border-[#2A2D3E]">
          <div className="flex items-center gap-1.5 text-[10px] text-[#475569]">
            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{items.length} item{items.length !== 1 ? 's' : ''} active — AI uses all of these in every response</span>
          </div>
        </div>
      )}
    </div>
  );
}
