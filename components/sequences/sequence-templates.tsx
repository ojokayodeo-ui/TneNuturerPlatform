import { SequenceType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Zap, Heart, Star, RefreshCw, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  type: SequenceType;
  name: string;
  description: string;
  stepCount: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const templates: Template[] = [
  {
    type: 'cold_outreach',
    name: 'Cold Outreach',
    description: '7-step cold-to-call sequence designed to book discovery calls with cold prospects.',
    stepCount: 7,
    icon: <Zap className="w-5 h-5" />,
    color: 'text-indigo-300',
    bgColor: 'bg-indigo-500/15',
    borderColor: 'border-indigo-500/30',
  },
  {
    type: 'warm_nurture',
    name: 'Warm Nurture',
    description: '5-step warm lead nurture sequence to convert engaged prospects into sales conversations.',
    stepCount: 5,
    icon: <Heart className="w-5 h-5" />,
    color: 'text-rose-300',
    bgColor: 'bg-rose-500/15',
    borderColor: 'border-rose-500/30',
  },
  {
    type: 'client_onboarding',
    name: 'Client Onboarding',
    description: '6-step onboarding flow to ensure new clients get up and running smoothly.',
    stepCount: 6,
    icon: <Star className="w-5 h-5" />,
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/30',
  },
  {
    type: 'retention',
    name: 'Retention',
    description: '4-step client retention sequence to maintain relationships and prevent churn.',
    stepCount: 4,
    icon: <RefreshCw className="w-5 h-5" />,
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/30',
  },
  {
    type: 'upsell',
    name: 'Upsell',
    description: '3-step upsell campaign to move existing clients to higher-value plans.',
    stepCount: 3,
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-purple-300',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/30',
  },
];

interface SequenceTemplatesProps {
  onSelect: (type: SequenceType) => void;
  onClose: () => void;
}

export default function SequenceTemplates({ onSelect, onClose }: SequenceTemplatesProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl mx-4 bg-[#13151F] border border-[#2A2D3E] rounded-2xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2D3E]">
          <div>
            <h2 className="text-[#F1F5F9] text-lg font-semibold">Choose a Template</h2>
            <p className="text-[#64748B] text-sm mt-0.5">
              Start with a proven sequence or build from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.type}
              className={cn(
                'group flex flex-col bg-[#1A1D27] border rounded-xl p-5 transition-all duration-150',
                'hover:border-[#3A3D4E] hover:bg-[#1E2133]',
                template.borderColor
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center border mb-4 flex-shrink-0',
                  template.bgColor,
                  template.borderColor,
                  template.color
                )}
              >
                {template.icon}
              </div>

              {/* Info */}
              <h3 className="text-[#F1F5F9] font-semibold text-sm mb-1">{template.name}</h3>
              <p className="text-[#64748B] text-xs leading-relaxed flex-1 mb-4">
                {template.description}
              </p>

              {/* Step count badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#2A2D3E] text-[#94A3B8] text-xs">
                  {template.stepCount} steps
                </span>
              </div>

              {/* CTA */}
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => onSelect(template.type)}
              >
                Use Template
              </Button>
            </div>
          ))}

          {/* Blank option */}
          <div
            className="flex flex-col bg-[#1A1D27] border border-dashed border-[#2A2D3E] rounded-xl p-5 cursor-pointer transition-all duration-150 hover:border-[#3A3D4E] hover:bg-[#1E2133] items-center justify-center gap-3 min-h-[200px]"
            onClick={onClose}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#2A2D3E] border border-[#3A3D4E] text-[#64748B]">
              <span className="text-xl font-light">+</span>
            </div>
            <div className="text-center">
              <p className="text-[#94A3B8] text-sm font-medium">Start Blank</p>
              <p className="text-[#475569] text-xs mt-0.5">Build your own sequence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
