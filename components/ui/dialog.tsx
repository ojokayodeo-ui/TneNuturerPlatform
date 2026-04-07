import { cn } from '@/lib/utils';
import { ReactNode, useEffect } from 'react';

type DialogSize = 'sm' | 'md' | 'lg';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: DialogSize;
  className?: string;
}

const sizeMap: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

function Dialog({ open, onClose, title, description, children, size = 'md', className }: DialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative w-full bg-[#1A1D27] border border-[#2A2D3E] rounded-2xl shadow-2xl flex flex-col',
          sizeMap[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex-1 min-w-0">
            <h2
              id="dialog-title"
              className="text-base font-semibold text-[#F1F5F9] leading-tight"
            >
              {title}
            </h2>
            {description && (
              <p className="text-sm text-[#64748B] mt-1">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 pt-0">{children}</div>
      </div>
    </div>
  );
}

export { Dialog };
