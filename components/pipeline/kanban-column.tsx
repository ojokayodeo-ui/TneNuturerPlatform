'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Contact, ContactStage } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import KanbanCard from './kanban-card';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  stage: ContactStage;
  contacts: Contact[];
  stageLabel: string;
  stageColor: string;
}

export default function KanbanColumn({
  stage,
  contacts,
  stageLabel,
  stageColor,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  const totalValue = contacts.reduce((sum, c) => sum + (c.contractValue ?? 0), 0);
  const hasValue = contacts.some((c) => c.contractValue && c.contractValue > 0);

  return (
    <div className="flex flex-col min-w-[260px] max-w-[260px] h-full">
      {/* Column header */}
      <div className="mb-2 px-1">
        <div className="flex items-center gap-2 mb-1">
          {/* Colored dot indicator */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: stageColor }}
          />
          <span className="text-sm font-semibold text-white flex-1 truncate">
            {stageLabel}
          </span>
          {/* Count badge */}
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: `${stageColor}33` }}
          >
            {contacts.length}
          </span>
        </div>
        {hasValue && (
          <p className="text-xs text-[#64748B] pl-4">
            {formatCurrency(totalValue)}
          </p>
        )}
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={[
          'flex-1 overflow-y-auto space-y-3 py-2 px-1 min-h-[200px] rounded-xl transition-colors duration-150',
          isOver
            ? 'bg-indigo-500/5 border border-dashed border-indigo-500/20'
            : 'bg-transparent',
        ].join(' ')}
      >
        <SortableContext
          items={contacts.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {contacts.map((contact) => (
            <KanbanCard key={contact.id} contact={contact} />
          ))}
        </SortableContext>

        {contacts.length === 0 && (
          <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-[#2A2D3E]">
            <p className="text-xs text-[#3A3D4E]">Drop here</p>
          </div>
        )}
      </div>

      {/* Add lead button */}
      <button
        className="mt-2 mx-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-[#2A2D3E] text-[#64748B] text-xs hover:border-indigo-500/40 hover:text-indigo-400 transition-colors duration-150 group"
        onClick={() => {}}
      >
        <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        Add lead
      </button>
    </div>
  );
}
