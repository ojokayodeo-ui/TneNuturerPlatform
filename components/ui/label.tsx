import { cn } from '@/lib/utils';
import { LabelHTMLAttributes, forwardRef } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-xs font-medium text-[#94A3B8] mb-1 block', className)}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
