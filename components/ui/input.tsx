import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-9 w-full rounded-lg border border-[#2A2D3E] bg-[#0F1117] px-3 py-1 text-sm text-[#F1F5F9] placeholder:text-[#64748B] transition-colors',
      'focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
