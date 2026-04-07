import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type ProgressColor = 'indigo' | 'emerald' | 'amber' | 'red';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  color?: ProgressColor;
}

const colorMap: Record<ProgressColor, string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

function Progress({ value, color = 'indigo', className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('h-1.5 w-full rounded-full bg-[#2A2D3E] overflow-hidden', className)}
      {...props}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-300', colorMap[color])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
