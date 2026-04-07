'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/app-shell';
import KanbanColumn from '@/components/pipeline/kanban-column';
import StageStats from '@/components/pipeline/stage-stats';
import KanbanCard from '@/components/pipeline/kanban-card';
import { useNurtureStore } from '@/lib/store';
import { ContactStage, Contact } from '@/lib/types';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { LayoutGrid, Filter, SlidersHorizontal } from 'lucide-react';

const STAGES: { id: ContactStage; label: string; color: string }[] = [
  { id: 'new_lead', label: 'New Lead', color: '#64748B' },
  { id: 'contacted', label: 'Contacted', color: '#3B82F6' },
  { id: 'engaged', label: 'Engaged', color: '#06B6D4' },
  { id: 'nurturing', label: 'Nurturing', color: '#8B5CF6' },
  { id: 'sales_qualified', label: 'Sales Qualified', color: '#F59E0B' },
  { id: 'client', label: 'Client', color: '#10B981' },
  { id: 'retained', label: 'Retained', color: '#6366F1' },
];

export default function PipelinePage() {
  const contacts = useNurtureStore((s) => s.contacts);
  const moveContactToStage = useNurtureStore((s) => s.moveContactToStage);

  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    const contactId = event.active.id as string;
    const found = contacts.find((c) => c.id === contactId) ?? null;
    setActiveContact(found);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over) {
      const contactId = active.id as string;
      const overId = over.id as string;

      // Determine which stage the card was dropped into.
      // `over.id` can be a stage id (column droppable) or another contact id (sortable).
      const isStageId = STAGES.some((s) => s.id === overId);

      if (isStageId) {
        moveContactToStage(contactId, overId as ContactStage);
      } else {
        // Dropped onto another card — find that card's stage
        const targetContact = contacts.find((c) => c.id === overId);
        if (targetContact) {
          moveContactToStage(contactId, targetContact.stage);
        }
      }
    }

    setActiveContact(null);
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page header */}
        <div className="flex items-start justify-between mb-5 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">Pipeline</h1>
            <p className="text-sm text-[#64748B] mt-0.5">7 Stages</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2A2D3E] bg-[#1A1D27] text-[#64748B] text-sm hover:border-[#3A3D4E] hover:text-white transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2A2D3E] bg-[#1A1D27] text-[#64748B] text-sm hover:border-[#3A3D4E] hover:text-white transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              View
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-400 text-sm hover:bg-indigo-500/20 transition-colors">
              <LayoutGrid className="w-3.5 h-3.5" />
              Kanban
            </button>
          </div>
        </div>

        {/* Stage summary stats */}
        <StageStats />

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto pb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="flex gap-4 h-full min-h-[500px]" style={{ width: 'max-content' }}>
              {STAGES.map((stage) => {
                const stageContacts = contacts.filter((c) => c.stage === stage.id);
                return (
                  <KanbanColumn
                    key={stage.id}
                    stage={stage.id}
                    contacts={stageContacts}
                    stageLabel={stage.label}
                    stageColor={stage.color}
                  />
                );
              })}
            </div>

            <DragOverlay>
              {activeContact ? (
                <div className="rotate-2 shadow-2xl shadow-black/50">
                  <KanbanCard contact={activeContact} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </AppShell>
  );
}
