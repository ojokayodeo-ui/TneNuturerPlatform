'use client';

import { useState, useRef, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Sequence, SequenceStep, SequenceStatus, StepType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SequenceStepCard from './sequence-step';
import {
  Mail,
  Linkedin,
  MessageSquare,
  CheckSquare,
  Clock,
  Plus,
} from 'lucide-react';

// --- Sortable wrapper ---
function SortableStepItem({
  step,
  index,
  isSelected,
  onClick,
  onDelete,
}: {
  step: SequenceStep;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SequenceStepCard
        step={step}
        index={index}
        isSelected={isSelected}
        onClick={onClick}
        onDelete={onDelete}
      />
    </div>
  );
}

// --- Step type buttons config ---
const stepTypes: { type: StepType; label: string; icon: React.ReactNode }[] = [
  { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { type: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
  { type: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
  { type: 'task', label: 'Task', icon: <CheckSquare className="w-4 h-4" /> },
  { type: 'wait', label: 'Wait', icon: <Clock className="w-4 h-4" /> },
];

const statusConfig: Record<SequenceStatus, { label: string; classes: string }> = {
  active: {
    label: 'Active',
    classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  paused: {
    label: 'Paused',
    classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  draft: {
    label: 'Draft',
    classes: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  },
};

const statusCycle: SequenceStatus[] = ['draft', 'active', 'paused'];

function createStep(type: StepType, sequenceId: string, order: number): SequenceStep {
  const id = `step-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    sequenceId,
    order,
    type,
    delayDays: order === 1 ? 0 : 3,
    delayHours: 0,
    subject: type === 'email' ? '' : undefined,
    body: '',
    condition: 'always',
  };
}

// --- Main builder ---
interface SequenceBuilderProps {
  sequence: Sequence;
  onSave: (sequence: Sequence) => void;
}

export default function SequenceBuilder({ sequence, onSave }: SequenceBuilderProps) {
  const [steps, setSteps] = useState<SequenceStep[]>(sequence.steps);
  const [selectedStep, setSelectedStep] = useState<SequenceStep | null>(null);
  const [sequenceName, setSequenceName] = useState(sequence.name);
  const [status, setStatus] = useState<SequenceStatus>(sequence.status);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setSteps((prev) => {
          const oldIndex = prev.findIndex((s) => s.id === active.id);
          const newIndex = prev.findIndex((s) => s.id === over.id);
          const reordered = arrayMove(prev, oldIndex, newIndex).map((s, i) => ({
            ...s,
            order: i + 1,
          }));
          if (selectedStep?.id === active.id) {
            setSelectedStep(reordered.find((s) => s.id === active.id) ?? null);
          }
          return reordered;
        });
      }
    },
    [selectedStep]
  );

  const addStep = (type: StepType) => {
    const newStep = createStep(type, sequence.id, steps.length + 1);
    setSteps((prev) => [...prev, newStep]);
    setSelectedStep(newStep);
  };

  const deleteStep = (id: string) => {
    setSteps((prev) => {
      const filtered = prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 }));
      return filtered;
    });
    if (selectedStep?.id === id) setSelectedStep(null);
  };

  const updateSelectedStep = (updates: Partial<SequenceStep>) => {
    if (!selectedStep) return;
    const updated = { ...selectedStep, ...updates };
    setSelectedStep(updated);
    setSteps((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const insertToken = (token: string) => {
    const textarea = bodyRef.current;
    if (!textarea || !selectedStep) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = selectedStep.body ?? '';
    const newBody = current.substring(0, start) + token + current.substring(end);
    updateSelectedStep({ body: newBody });
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + token.length;
      textarea.focus();
    });
  };

  const cycleStatus = () => {
    setStatus((prev) => {
      const idx = statusCycle.indexOf(prev);
      return statusCycle[(idx + 1) % statusCycle.length];
    });
  };

  const handleSave = () => {
    onSave({
      ...sequence,
      name: sequenceName,
      status,
      steps,
      updatedAt: new Date().toISOString(),
    });
  };

  const estimatedDuration =
    steps.length > 0 ? Math.max(...steps.map((s) => s.delayDays)) : 0;

  const currentStatusCfg = statusConfig[status];

  const showSubject = selectedStep?.type === 'email';
  const showBody =
    selectedStep?.type === 'email' ||
    selectedStep?.type === 'linkedin' ||
    selectedStep?.type === 'sms';
  const showCondition =
    selectedStep?.type === 'email' ||
    selectedStep?.type === 'linkedin' ||
    selectedStep?.type === 'sms';
  const isWaitOrTask =
    selectedStep?.type === 'wait' || selectedStep?.type === 'task';

  return (
    <div className="flex h-full overflow-hidden bg-[#0F1117]">
      {/* LEFT PANEL — step type picker */}
      <div className="w-56 flex-shrink-0 border-r border-[#2A2D3E] flex flex-col p-4 gap-2">
        <p className="text-[#64748B] text-xs font-medium uppercase tracking-widest mb-2">
          Add Step
        </p>
        {stepTypes.map(({ type, label, icon }) => (
          <Button
            key={type}
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => addStep(type)}
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>

      {/* CENTER PANEL — sequence canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sequence name + status */}
        <div className="px-6 py-4 border-b border-[#2A2D3E] flex items-center gap-3">
          <input
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            className="flex-1 bg-transparent text-[#F1F5F9] text-xl font-semibold placeholder-[#475569] outline-none border-b border-transparent focus:border-indigo-500/50 transition-colors pb-0.5"
            placeholder="Sequence name…"
          />
          <button
            onClick={cycleStatus}
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer',
              currentStatusCfg.classes
            )}
          >
            {currentStatusCfg.label}
          </button>
        </div>

        {/* Steps list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1A1D27] border border-[#2A2D3E] flex items-center justify-center text-[#475569]">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-[#94A3B8] font-medium">No steps yet</p>
                <p className="text-[#475569] text-sm mt-1">
                  Use the panel on the left to add your first step
                </p>
              </div>
              <Button variant="secondary" onClick={() => addStep('email')}>
                <Mail className="w-4 h-4" />
                Add Email Step
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={steps.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {steps.map((step, index) => (
                    <SortableStepItem
                      key={step.id}
                      step={step}
                      index={index}
                      isSelected={selectedStep?.id === step.id}
                      onClick={() =>
                        setSelectedStep((prev) => (prev?.id === step.id ? null : step))
                      }
                      onDelete={() => deleteStep(step.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Footer stats */}
        {steps.length > 0 && (
          <div className="px-6 py-3 border-t border-[#2A2D3E] flex items-center gap-4 text-xs text-[#64748B]">
            <span>
              {steps.length} {steps.length === 1 ? 'step' : 'steps'}
            </span>
            {estimatedDuration > 0 && (
              <span>~{estimatedDuration} days estimated duration</span>
            )}
            <div className="ml-auto">
              <Button size="sm" onClick={handleSave}>
                Save Sequence
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL — step editor */}
      <div className="w-80 flex-shrink-0 border-l border-[#2A2D3E] flex flex-col">
        <div className="px-5 py-4 border-b border-[#2A2D3E]">
          <h3 className="text-[#F1F5F9] text-sm font-semibold">Step Editor</h3>
        </div>

        {!selectedStep ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#1A1D27] border border-[#2A2D3E] flex items-center justify-center text-[#475569]">
              <Mail className="w-4 h-4" />
            </div>
            <p className="text-[#64748B] text-sm">Select a step to edit its content</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {/* Delay days */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#94A3B8] text-xs font-medium">
                {selectedStep.type === 'wait' ? 'Wait (days)' : 'Send on day'}
              </label>
              <input
                type="number"
                min={0}
                value={selectedStep.delayDays}
                onChange={(e) => updateSelectedStep({ delayDays: Number(e.target.value) })}
                className="bg-[#1A1D27] border border-[#2A2D3E] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            {/* Wait / Task: just description */}
            {isWaitOrTask && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[#94A3B8] text-xs font-medium">
                  {selectedStep.type === 'task' ? 'Task description' : 'Note (optional)'}
                </label>
                <textarea
                  rows={4}
                  value={selectedStep.body ?? ''}
                  onChange={(e) => updateSelectedStep({ body: e.target.value })}
                  placeholder={
                    selectedStep.type === 'task' ? 'Describe the task…' : 'Add a note…'
                  }
                  className="bg-[#1A1D27] border border-[#2A2D3E] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder-[#475569]"
                />
              </div>
            )}

            {/* Email / LinkedIn / SMS fields */}
            {!isWaitOrTask && (
              <>
                {showSubject && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#94A3B8] text-xs font-medium">Subject line</label>
                    <input
                      type="text"
                      value={selectedStep.subject ?? ''}
                      onChange={(e) => updateSelectedStep({ subject: e.target.value })}
                      placeholder="Email subject…"
                      className="bg-[#1A1D27] border border-[#2A2D3E] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm outline-none focus:border-indigo-500/50 transition-colors placeholder-[#475569]"
                    />
                  </div>
                )}

                {showBody && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#94A3B8] text-xs font-medium">Message body</label>
                    <textarea
                      ref={bodyRef}
                      rows={8}
                      value={selectedStep.body ?? ''}
                      onChange={(e) => updateSelectedStep({ body: e.target.value })}
                      placeholder="Write your message…"
                      className="bg-[#1A1D27] border border-[#2A2D3E] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder-[#475569] min-h-[200px]"
                    />
                  </div>
                )}

                {showCondition && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#94A3B8] text-xs font-medium">Send condition</label>
                    <select
                      value={selectedStep.condition ?? 'always'}
                      onChange={(e) => updateSelectedStep({ condition: e.target.value })}
                      className="bg-[#1A1D27] border border-[#2A2D3E] rounded-lg px-3 py-2 text-[#F1F5F9] text-sm outline-none focus:border-indigo-500/50 transition-colors appearance-none"
                    >
                      <option value="always">Always</option>
                      <option value="if_not_replied">If not replied</option>
                      <option value="if_opened">If opened</option>
                    </select>
                  </div>
                )}

                {/* Personalization tokens */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#94A3B8] text-xs font-medium">
                    Personalization tokens
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['{name}', '{company}', '{industry}'].map((token) => (
                      <button
                        key={token}
                        onClick={() => insertToken(token)}
                        className="px-2 py-1 rounded-md bg-[#2A2D3E] hover:bg-indigo-500/20 border border-[#3A3D4E] hover:border-indigo-500/40 text-[#94A3B8] hover:text-indigo-300 text-xs font-mono transition-all"
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                  <p className="text-[#475569] text-xs">
                    Click a token to insert it at cursor position
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
