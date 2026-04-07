'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" ref={ref} className="sr-only peer" {...props} />
    <div className={cn(
      'w-9 h-5 rounded-full border border-[#3A3D4E] bg-[#2A2D3E] transition-all',
      'peer-checked:bg-indigo-500 peer-checked:border-indigo-500',
      'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
      'after:w-4 after:h-4 after:rounded-full after:bg-white after:shadow',
      'after:transition-all peer-checked:after:translate-x-4',
      className
    )} />
  </label>
));
Switch.displayName = 'Switch';

export { Switch };
