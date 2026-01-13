import { cn } from '@/lib/utils';
import { RequirementStatus, getStatusLabel, getStatusIcon } from '@/types/koas';

interface StatusBadgeProps {
  status: RequirementStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge = ({ status, size = 'md', showIcon = true, className }: StatusBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const statusClasses = {
    NOT_STARTED: 'bg-status-not-started-light text-status-not-started',
    ON_GOING: 'bg-status-ongoing-light text-status-ongoing',
    DONE: 'bg-status-done-light text-status-done',
    NILAI: 'bg-status-nilai-light text-status-nilai',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-all',
        sizeClasses[size],
        statusClasses[status],
        className
      )}
    >
      {showIcon && <span>{getStatusIcon(status)}</span>}
      <span>{getStatusLabel(status)}</span>
    </span>
  );
};
