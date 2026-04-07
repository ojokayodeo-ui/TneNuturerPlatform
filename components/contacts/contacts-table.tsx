'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  ArrowRight,
  GitBranch,
  Trash2,
  Users,
  ChevronRight,
} from 'lucide-react';
import { cn, getStageColor, getStageLabel, getSourceColor, getHealthScoreBarColor, generateInitials, getAvatarColor, formatDate } from '@/lib/utils';
import { useNurtureStore } from '@/lib/store';
import { Contact, ContactStage } from '@/lib/types';
import { EngagementScore } from './engagement-score';
import { AddContactModal } from './add-contact-modal';

const STAGES: ContactStage[] = [
  'new_lead',
  'contacted',
  'engaged',
  'nurturing',
  'sales_qualified',
  'client',
  'retained',
];

function HealthBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="relative h-1.5 flex-1 rounded-full bg-[#2A2D3E] overflow-hidden">
        <div
          className={cn('absolute inset-y-0 left-0 rounded-full transition-all', getHealthScoreBarColor(score))}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-[#94A3B8] w-7 text-right">{score}</span>
    </div>
  );
}

interface ActionMenuProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onChangeStage: (contact: Contact) => void;
}

function ActionMenu({ contact, onEdit, onDelete, onChangeStage }: ActionMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-[#2A2D3E] bg-[#1A1D27] py-1 shadow-xl shadow-black/40">
          <button
            type="button"
            onClick={() => { setOpen(false); router.push(`/contacts/${contact.id}`); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[#94A3B8] hover:bg-white/5 hover:text-[#F1F5F9] transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit(contact); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[#94A3B8] hover:bg-white/5 hover:text-[#F1F5F9] transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onChangeStage(contact); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[#94A3B8] hover:bg-white/5 hover:text-[#F1F5F9] transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            Change Stage
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[#94A3B8] hover:bg-white/5 hover:text-[#F1F5F9] transition-colors"
          >
            <GitBranch className="h-3.5 w-3.5" />
            Assign Sequence
          </button>
          <div className="my-1 border-t border-[#2A2D3E]" />
          <button
            type="button"
            onClick={() => { setOpen(false); onDelete(contact.id); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

interface ChangeStagePanelProps {
  contact: Contact;
  onClose: () => void;
}

function ChangeStagePanel({ contact, onClose }: ChangeStagePanelProps) {
  const { moveContactToStage } = useNurtureStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-8 top-0 z-30 w-48 rounded-xl border border-[#2A2D3E] bg-[#1A1D27] py-1 shadow-xl shadow-black/40"
    >
      <p className="px-3 py-2 text-xs font-semibold text-[#64748B] uppercase tracking-wide">
        Move to stage
      </p>
      {STAGES.map((stage) => (
        <button
          key={stage}
          type="button"
          onClick={() => {
            moveContactToStage(contact.id, stage);
            onClose();
          }}
          className={cn(
            'flex w-full items-center justify-between px-3 py-2 text-sm transition-colors',
            contact.stage === stage
              ? 'text-[#F1F5F9] bg-white/5'
              : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F1F5F9]'
          )}
        >
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
              getStageColor(stage)
            )}
          >
            {getStageLabel(stage)}
          </span>
          {contact.stage === stage && <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />}
        </button>
      ))}
    </div>
  );
}

export function ContactsTable() {
  const router = useRouter();
  const { getFilteredContacts, contacts: allContacts, removeContact } = useNurtureStore();
  const filtered = getFilteredContacts();
  const total = allContacts.length;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [stageContact, setStageContact] = useState<Contact | null>(null);

  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleDelete(id: string) {
    removeContact(id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleBulkDelete() {
    selected.forEach((id) => removeContact(id));
    setSelected(new Set());
  }

  return (
    <>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5">
          <span className="text-sm font-medium text-indigo-300">
            {selected.size} contact{selected.size !== 1 ? 's' : ''} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete selected
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="rounded-lg border border-[#2A2D3E] px-3 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-colors"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Count bar */}
      <div className="mb-2 px-1">
        <span className="text-xs text-[#64748B]">
          Showing{' '}
          <span className="font-semibold text-[#94A3B8]">{filtered.length}</span>
          {' '}of{' '}
          <span className="font-semibold text-[#94A3B8]">{total}</span>
          {' '}contacts
        </span>
      </div>

      {/* Table container */}
      <div className="rounded-xl border border-[#2A2D3E] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 bg-[#1A1D27] py-20 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2A2D3E]">
              <Users className="h-5 w-5 text-[#64748B]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F1F5F9]">No contacts found</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="sticky top-0 z-10 bg-[#1A1D27] border-b border-[#2A2D3E]">
                  <th className="w-10 px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = someSelected; }}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-[#3A3D4E] bg-[#0F1117] accent-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    Company
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    Stage
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide min-w-[120px]">
                    Health
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    Engagement
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    Source
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                    Last Contact
                  </th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact, idx) => {
                  const isSelected = selected.has(contact.id);
                  const isAlt = idx % 2 === 1;

                  return (
                    <tr
                      key={contact.id}
                      className={cn(
                        'group border-b border-[#2A2D3E] last:border-b-0 transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-indigo-500/5'
                          : isAlt
                          ? 'bg-[#0F1117] hover:bg-white/[0.02]'
                          : 'bg-transparent hover:bg-white/[0.02]'
                      )}
                      onClick={() => router.push(`/contacts/${contact.id}`)}
                    >
                      {/* Checkbox */}
                      <td
                        className="px-3 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(contact.id)}
                          className="h-4 w-4 rounded border-[#3A3D4E] bg-[#0F1117] accent-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* Avatar + Name + Email */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                              getAvatarColor(contact.name)
                            )}
                          >
                            {generateInitials(contact.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#F1F5F9]">
                              {contact.name}
                            </p>
                            <p className="truncate text-xs text-[#64748B]">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-3 py-3">
                        <span className="text-sm text-[#94A3B8]">{contact.company}</span>
                      </td>

                      {/* Stage */}
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                            getStageColor(contact.stage)
                          )}
                        >
                          {getStageLabel(contact.stage)}
                        </span>
                      </td>

                      {/* Health Score */}
                      <td className="px-3 py-3">
                        <HealthBar score={contact.healthScore} />
                      </td>

                      {/* Engagement */}
                      <td className="px-3 py-3">
                        <EngagementScore score={contact.engagementScore} showLabel={false} />
                      </td>

                      {/* Source */}
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                            getSourceColor(contact.source)
                          )}
                        >
                          {contact.source}
                        </span>
                      </td>

                      {/* Last Contact */}
                      <td className="px-3 py-3">
                        <span className="text-xs text-[#64748B]">
                          {formatDate(contact.lastContactedAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="relative px-3 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {stageContact?.id === contact.id ? (
                          <div className="relative">
                            <ChangeStagePanel
                              contact={contact}
                              onClose={() => setStageContact(null)}
                            />
                            <ActionMenu
                              contact={contact}
                              onEdit={(c) => { setStageContact(null); setEditContact(c); }}
                              onDelete={handleDelete}
                              onChangeStage={(c) => setStageContact(stageContact?.id === c.id ? null : c)}
                            />
                          </div>
                        ) : (
                          <ActionMenu
                            contact={contact}
                            onEdit={setEditContact}
                            onDelete={handleDelete}
                            onChangeStage={(c) => setStageContact(c)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <AddContactModal
        open={!!editContact}
        onClose={() => setEditContact(null)}
        contact={editContact ?? undefined}
      />
    </>
  );
}
