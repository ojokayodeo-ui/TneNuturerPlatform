'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Contact } from '@/lib/types';
import {
  formatDate,
  getSourceColor,
  getHealthScoreBarColor,
  generateInitials,
  getAvatarColor,
} from '@/lib/utils';

interface KanbanCardProps {
  contact: Contact;
}

export default function KanbanCard({ contact }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const initials = generateInitials(contact.name);
  const avatarColor = getAvatarColor(contact.name);
  const sourceColorClass = getSourceColor(contact.source);
  const healthBarColor = getHealthScoreBarColor(contact.healthScore);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={[
        'bg-[#1A1D27] border rounded-xl p-4 cursor-grab active:cursor-grabbing select-none',
        'transition-all duration-150',
        isDragging
          ? 'opacity-50 border-indigo-500/50'
          : 'border-[#2A2D3E] hover:border-[#3A3D4E] hover:bg-[#1E2130]',
      ].join(' ')}
    >
      {/* Top row: avatar + name + source badge */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate leading-tight">
            {contact.name}
          </p>
        </div>
        <span
          className={`text-[10px] font-medium border rounded-full px-1.5 py-0.5 flex-shrink-0 ${sourceColorClass}`}
        >
          {contact.source}
        </span>
      </div>

      {/* Company */}
      <p className="text-xs text-[#64748B] mb-2 truncate">{contact.company}</p>

      {/* Health score mini bar */}
      <div className="w-full h-1 rounded-full bg-[#2A2D3E] mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full ${healthBarColor}`}
          style={{ width: `${Math.min(100, Math.max(0, contact.healthScore))}%` }}
        />
      </div>

      {/* Bottom row: last contact date + engagement score */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#64748B]">
          {formatDate(contact.lastContactedAt)}
        </span>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            contact.engagementScore >= 70
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : contact.engagementScore >= 40
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
        >
          {contact.engagementScore}
        </span>
      </div>
    </div>
  );
}
