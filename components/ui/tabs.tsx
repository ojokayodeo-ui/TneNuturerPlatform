import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function Tabs({ className, children, activeTab, onTabChange, ...props }: TabsProps) {
  return (
    <div className={cn('w-full', className)} {...props}>
      {children}
    </div>
  );
}

function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 bg-[#0F1117] rounded-lg p-1',
        className
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function TabsTrigger({ value, activeTab, onTabChange, className, children, ...props }: TabsTriggerProps) {
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => onTabChange(value)}
      className={cn(
        'inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150',
        isActive
          ? 'bg-[#1A1D27] text-[#F1F5F9] shadow-sm'
          : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-white/5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  activeTab: string;
}

function TabsContent({ value, activeTab, className, children, ...props }: TabsContentProps) {
  if (activeTab !== value) return null;

  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
