import { cn, getAvatarColor } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: AvatarSize;
  src?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ name, size = 'md', src, className, ...props }: AvatarProps) {
  const initials = getInitials(name);
  const color = getAvatarColor(name);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0 select-none',
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: src ? undefined : color }}
      title={name}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-white leading-none">{initials}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  names: string[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

function AvatarGroup({ names, max = 3, size = 'sm', className }: AvatarGroupProps) {
  const visible = names.slice(0, max);
  const overflow = names.length - max;

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((name, index) => (
        <div
          key={`${name}-${index}`}
          className="ring-2 ring-[#1A1D27] rounded-full"
          style={{ marginLeft: index === 0 ? 0 : '-8px', zIndex: visible.length - index }}
        >
          <Avatar name={name} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-full font-semibold text-xs text-[#94A3B8] bg-[#2A2D3E] border-2 border-[#1A1D27] flex-shrink-0',
            sizeMap[size]
          )}
          style={{ marginLeft: '-8px', zIndex: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup };
