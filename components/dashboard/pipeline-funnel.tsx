'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useNurtureStore } from '@/lib/store';
import { ChevronRight } from 'lucide-react';
import { ContactStage } from '@/lib/types';

const PIPELINE_STAGES: { stage: ContactStage; label: string; shortLabel: string; color: string }[] = [
  { stage: 'new_lead', label: 'New Lead', shortLabel: 'New', color: '#64748B' },
  { stage: 'contacted', label: 'Contacted', shortLabel: 'Contacted', color: '#3B82F6' },
  { stage: 'engaged', label: 'Engaged', shortLabel: 'Engaged', color: '#06B6D4' },
  { stage: 'nurturing', label: 'Nurturing', shortLabel: 'Nurture', color: '#8B5CF6' },
  { stage: 'sales_qualified', label: 'Sales Qualified', shortLabel: 'SQL', color: '#F59E0B' },
  { stage: 'client', label: 'Client', shortLabel: 'Client', color: '#10B981' },
  { stage: 'retained', label: 'Retained', shortLabel: 'Retained', color: '#6366F1' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-lg p-3 shadow-xl">
      <p className="text-xs text-[#64748B] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#F1F5F9]">
        {payload[0].value} contacts
      </p>
    </div>
  );
}

interface LabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}

function CustomBarLabel({ x = 0, y = 0, width = 0, value = 0 }: LabelProps) {
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#94A3B8"
      textAnchor="middle"
      fontSize={11}
      fontWeight={500}
    >
      {value}
    </text>
  );
}

export default function PipelineFunnel() {
  const contacts = useNurtureStore((s) => s.contacts);

  const chartData = PIPELINE_STAGES.map(({ stage, shortLabel }) => ({
    name: shortLabel,
    count: contacts.filter((c) => c.stage === stage).length,
  }));

  return (
    <div className="bg-[#1A1D27] border border-[#2A2D3E] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-semibold text-[#F1F5F9]">Pipeline Overview</h3>
          <ChevronRight className="w-4 h-4 text-[#64748B]" />
        </div>
        <span className="text-xs text-[#64748B]">{contacts.length} total contacts</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 20, right: 8, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} label={<CustomBarLabel />}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIPELINE_STAGES[index].color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
