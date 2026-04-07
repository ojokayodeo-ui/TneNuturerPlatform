import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <div className="relative w-full">
    <select
      ref={ref}
      className={cn(
        'flex h-9 w-full appearance-none rounded-lg border border-[#2A2D3E] bg-[#0F1117] px-3 py-1 pr-8 text-sm text-[#F1F5F9] transition-colors cursor-pointer',
        'focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&>option]:bg-[#1A1D27] [&>option]:text-[#F1F5F9]',
        className
      )}
      {...props}
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
      <svg
        className="h-4 w-4 text-[#64748B]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
));
Select.displayName = 'Select';

export { Select };
