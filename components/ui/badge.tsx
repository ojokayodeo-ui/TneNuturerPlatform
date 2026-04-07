import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        secondary: 'bg-[#2A2D3E] text-[#94A3B8] border-[#3A3D4E]',
        success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        danger: 'bg-red-500/15 text-red-300 border-red-500/30',
        purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        outline: 'border-[#2A2D3E] text-[#94A3B8]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
