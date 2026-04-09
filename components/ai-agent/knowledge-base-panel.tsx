'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Plus, Trash2, BookOpen, Link2, Lightbulb, Sparkles,
  ChevronDown, ChevronUp, Upload, Globe, FileText,
  Loader2, CheckCircle2, AlertCircle, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KnowledgeBaseItem, KnowledgeBaseItemType } from '@/lib/types';

const TYPE_OPTIONS: { value: KnowledgeBaseItemType; label: string; icon: string }[] = [
  { value: 'swipe_file',     label: 'Swipe File',     icon: '📋' },
  { value: 'email_template', label: 'Email Template',  icon: '✉️' },
  { value: 'strategy',       label: 'Strategy Doc',    icon: '🗺️' },
  { value: 'case_study',     label: 'Case Study',      icon: '📈' },
  { value: 'hook_library',   label: 'Hook Library',    icon: '🎣' },
  { value: 'custom',         label: 'Custom',           icon: '📝' },
];

function getTypeConfig(type: KnowledgeBaseItemType) {
  return TYPE_OPTIONS.find((t) => t.value === type) ?? TYPE_OPTIONS[5];
}

// ─────────────────────────────────────────────────────────────────────────────
// AddItemForm
// ─────────────────────────────────────────────────────────────────────────────

type InputMode = 'paste' | 'file' | 'url';

interface AddItemFormProps {
  onAdd: (item: Omit<KnowledgeBaseItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

function AddItemForm({ onAdd, onCancel }: AddItemFormProps) {
  const [mode, setMode] = useState<InputMode>('paste');
  const [title, setTitle]   = useState('');
  const [type, setType]     = useState<KnowledgeBaseItemType>('swipe_file');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags]     = useState<string[]>([]);

  // File upload state
  const [isDragging, setIsDragging]   = useState(false);
  const [extracting, setExtracting]   = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractDone, setExtractDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL fetch state
  const [fetchUrlInput, setFetchUrlInput] = useState('');
  const [fetching, setFetching]       = useState(false);
  const [fetchError, setFetchError]   = useState<string | null>(null);
  const [fetchDone, setFetchDone]     = useState(false);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };
  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onAdd({
      title: title.trim(),
      type,
      content: content.trim(),
      url: sourceUrl.trim() || undefined,
      tags,
    });
  };

  // ── File extraction ────────────────────────────────────────────────────────
  const extractFile = useCallback(async (file: File) => {
    setExtracting(true);
    setExtractError(null);
    setExtractDone(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/ai/extract-file', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed');

      setTitle((prev) => prev || data.title);
      setContent(data.content);
      setExtractDone(true);
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : 'Could not read file');
    } finally {
      setExtracting(false);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) extractFile(file);
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) extractFile(file);
    },
    [extractFile]
  );

  // ── URL fetch ─────────────────────────────────────────────────────────────
  const fetchUrl = useCallback(async () => {
    if (!fetchUrlInput.trim()) return;
    setFetching(true);
    setFetchError(null);
    setFetchDone(false);

    try {
      const res = await fetch('/api/ai/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fetchUrlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fetch failed');

      setTitle((prev) => prev || data.title);
      setContent(data.content);
      setSourceUrl(fetchUrlInput.trim());
      setFetchDone(true);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Could not fetch URL');
    } finally {
      setFetching(false);
    }
  }, [fetchUrlInput]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="border border-indigo-500/30 rounded-xl p-4 bg-indigo-500/5 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#F1F5F9]">Add to Knowledge Base</h4>
        <button onClick={onCancel} className="text-[#475569] hover:text-[#94A3B8] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex rounded-lg overflow-hidden border border-[#2A2D3E] bg-[#0F1117] text-xs font-medium">
        {([
          { id: 'paste', label: 'Paste Text', icon: FileText },
          { id: 'file',  label: 'Upload File', icon: Upload },
          { id: 'url',   label: 'Fetch URL', icon: Globe },
        ] as { id: InputMode; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setMode(id); setExtractError(null); setFetchError(null); }}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 transition-all',
              mode === id
                ? 'bg-indigo-600 text-white'
                : 'text-[#64748B] hover:text-[#F1F5F9]'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── File upload mode ─────────────────────────────── */}
      {mode === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md"
            onChange={onFileChange}
            className="hidden"
          />
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all',
              isDragging
                ? 'border-indigo-400 bg-indigo-500/15'
                : 'border-[#2A2D3E] hover:border-indigo-500/50 hover:bg-white/3'
            )}
          >
            {extracting ? (
              <>
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-sm text-[#94A3B8]">Extracting content…</p>
                <p className="text-xs text-[#475569]">PDFs use Claude to read text</p>
              </>
            ) : extractDone ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <p className="text-sm text-emerald-400 font-medium">Content extracted!</p>
                <p className="text-xs text-[#64748B]">Review and edit below, then click Add</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#475569]" />
                <p className="text-sm text-[#94A3B8]">Drop your file here or click to browse</p>
                <p className="text-xs text-[#475569]">PDF, DOCX, TXT, MD — up to 25 MB</p>
              </>
            )}
          </div>
          {extractError && (
            <div className="flex items-start gap-2 mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {extractError}
            </div>
          )}
        </div>
      )}

      {/* ── URL fetch mode ────────────────────────────────── */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://yoursite.com/swipe-files"
              value={fetchUrlInput}
              onChange={(e) => setFetchUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUrl()}
              className="flex-1 bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] outline-none focus:border-indigo-500/60 transition-all"
            />
            <button
              onClick={fetchUrl}
              disabled={fetching || !fetchUrlInput.trim()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {fetching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              {fetching ? 'Fetching…' : 'Fetch'}
            </button>
          </div>
          {fetchDone && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Content fetched and cleaned by Claude! Review below.
            </div>
          )}
          {fetchError && (
            <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {fetchError}
            </div>
          )}
          <p className="text-[10px] text-[#475569]">
            Claude will automatically clean the page — removing nav, ads, and footers — keeping only the valuable content.
          </p>
        </div>
      )}

      {/* ── Common fields (always shown) ──────────────────── */}
      <input
        type="text"
        placeholder="Title (e.g. 'Hormozi Cold Email Framework')"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] outline-none focus:border-indigo-500/60 transition-all"
      />

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

      {/* Content — always shown, auto-filled when file/URL used */}
      <div>
        {(mode === 'file' || mode === 'url') && content && (
          <p className="text-[10px] text-[#64748B] mb-1">
            Content extracted — edit freely before saving:
          </p>
        )}
        <textarea
          placeholder={
            mode === 'paste'
              ? 'Paste your swipe file, email copy, strategy notes, hooks, or any marketing material here…'
              : 'Extracted content will appear here. You can edit before saving.'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={mode === 'paste' ? 7 : 5}
          className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-[#F1F5F9] placeholder-[#475569] outline-none focus:border-indigo-500/60 resize-none transition-all"
        />
        {content && (
          <p className="text-[10px] text-[#475569] mt-1 text-right">
            {content.length.toLocaleString()} chars
          </p>
        )}
      </div>

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
                <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!title.trim() || !content.trim()}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        <Plus className="w-3.5 h-3.5" />
        Add to Knowledge Base
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KnowledgeBaseItemCard
// ─────────────────────────────────────────────────────────────────────────────

interface KnowledgeBaseItemCardProps {
  item: KnowledgeBaseItem;
  onDelete: (id: string) => void;
}

function KnowledgeBaseItemCard({ item, onDelete }: KnowledgeBaseItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const typeConfig = getTypeConfig(item.type);

  const copyContent = async () => {
    await navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                title={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="w-6 h-6 flex items-center justify-center rounded text-[#64748B] hover:text-red-400 transition-colors"
                title="Remove"
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

          {!expanded && (
            <p className="text-xs text-[#475569] mt-2 line-clamp-2">
              {item.content.substring(0, 140)}…
            </p>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-[#2A2D3E] pt-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#475569]">
              {item.content.length.toLocaleString()} chars
            </span>
            <button
              onClick={copyContent}
              className="text-[10px] text-[#64748B] hover:text-indigo-400 transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <pre className="text-xs text-[#94A3B8] whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto bg-[#0F1117] border border-[#2A2D3E] rounded-lg p-3">
            {item.content}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KnowledgeBasePanel (exported)
// ─────────────────────────────────────────────────────────────────────────────

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
        {showForm && (
          <AddItemForm
            onAdd={(item) => { onAdd(item); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {items.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-sm font-medium text-[#F1F5F9] mb-1.5">No knowledge yet</h4>
            <p className="text-xs text-[#64748B] leading-relaxed max-w-[220px]">
              Upload PDFs, fetch URLs, or paste text. The AI uses everything here to write copy in your style.
            </p>
            <div className="mt-5 space-y-2 text-left w-full max-w-[220px]">
              {[
                { icon: '📄', text: 'Drag & drop any PDF' },
                { icon: '🔗', text: 'Paste a URL to fetch content' },
                { icon: '📋', text: 'Paste swipe files as text' },
                { icon: '✉️', text: 'Add your best-performing emails' },
              ].map((h) => (
                <div key={h.text} className="flex items-center gap-2 text-xs text-[#475569]">
                  <span>{h.icon}</span>
                  <span>{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.map((item) => (
          <KnowledgeBaseItemCard key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>

      {items.length > 0 && (
        <div className="p-3 border-t border-[#2A2D3E]">
          <div className="flex items-center gap-1.5 text-[10px] text-[#475569]">
            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
            <span>
              {items.length} item{items.length !== 1 ? 's' : ''} active — included in every AI response
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
