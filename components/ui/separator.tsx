import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('h-px w-full bg-[#2A2D3E]', className)} {...props} />;
}

export { Separator };
