'use client';

import { SequenceStep as SequenceStepType } from '@/lib/types';
import { getStepTypeColor, getStepTypeIcon, cn } from '@/lib/utils';
import {
  Mail,
  Linkedin,
  MessageSquare,
  CheckSquare,
  Clock,
  GripVertical,
  Trash2,
  ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Mail: <Mail className="w-3.5 h-3.5" />,
  Linkedin: <Linkedin className="w-3.5 h-3.5" />,
  MessageSquare: <MessageSquare className="w-3.5 h-3.5" />,
  CheckSquare: <CheckSquare className="w-3.5 h-3.5" />,
  Clock: <Clock className="w-3.5 h-3.5" />,
};

const stepTypeLabel: Record<string, string> = {
  email: 'Email',
  linkedin: 'LinkedIn',
  sms: 'SMS',
  task: 'Task',
  wait: 'Wait',
};

interface SequenceStepProps {
  step: SequenceStepType;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function SequenceStep({
  step,
  index,
  isSelected,
  onClick,
  onDelete,
}: SequenceStepProps) {
  const iconName = getStepTypeIcon(step.type);
  const colorClasses = getStepTypeColor(step.type);

  const getContentPreview = () => {
    if (step.type === 'wait') {
      return (
        <span className="text-[#64748B] text-sm">
          Wait {step.delayDays} {step.delayDays === 1 ? 'day' : 'days'}
        </span>
      );
    }
    if (step.type === 'task') {
      return (
        <span className="text-[#94A3B8] text-sm truncate max-w-[220px]">
          {step.body
            ? step.body.substring(0, 40) + (step.body.length > 40 ? '…' : '')
            : 'No description'}
        </span>
      );
    }
    if (step.type === 'email' && step.subject) {
      return (
        <span className="text-[#94A3B8] text-sm truncate max-w-[220px]">
          {step.subject.substring(0, 40) + (step.subject.length > 40 ? '…' : '')}
        </span>
      );
    }
    if (step.body) {
      return (
        <span className="text-[#94A3B8] text-sm truncate max-w-[220px]">
          {step.body.substring(0, 40) + (step.body.length > 40 ? '…' : '')}
        </span>
      );
    }
    return <span className="text-[#475569] text-sm italic">No content yet</span>;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-4 cursor-pointer transition-all duration-150',
        'hover:border-[#3A3D4E]',
        isSelected && 'border-indigo-500/50 bg-indigo-500/5'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <div className="text-[#3A3D4E] group-hover:text-[#64748B] transition-colors cursor-grab active:cursor-grabbing flex-shrink-0">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Step number circle */}
        <div className="bg-[#2A2D3E] text-[#64748B] w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
          {index + 1}
        </div>

        {/* Type icon in colored circle */}
        <div
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border',
            colorClasses
          )}
        >
          {iconMap[iconName]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[#F1F5F9] text-sm font-medium">
              {stepTypeLabel[step.type]}
            </span>
            {step.delayDays > 0 && step.type !== 'wait' && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#2A2D3E] text-[#64748B] text-xs">
                Day {step.delayDays}
              </span>
            )}
          </div>
          {getContentPreview()}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <ChevronRight
            className={cn(
              'w-4 h-4 text-[#475569] transition-colors',
              isSelected && 'text-indigo-400'
            )}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/10 text-[#475569] hover:text-red-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
