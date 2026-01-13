import { cn } from '@/lib/utils';
import { Requirement, getRequirementStatus } from '@/types/koas';
import { StatusBadge } from './StatusBadge';
import { ChevronRight, FileText, User } from 'lucide-react';
import { CSSProperties } from 'react';

interface RequirementCardProps {
  requirement: Requirement;
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
}

export const RequirementCard = ({ requirement, onClick, className, style }: RequirementCardProps) => {
  const status = getRequirementStatus(requirement);
  const completedCount = requirement.checklist.filter(c => c.done).length;
  const totalCount = requirement.checklist.length;

  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        'group w-full p-4 bg-card rounded-xl border border-border',
        'hover:shadow-card hover:border-primary/30 transition-all duration-300',
        'text-left animate-fade-in',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {requirement.type === 'PASIEN' ? (
            <User className="w-4 h-4 text-primary" />
          ) : (
            <FileText className="w-4 h-4 text-accent-foreground" />
          )}
          <h3 className="font-semibold text-foreground">{requirement.name}</h3>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={status} size="sm" />
        
        {totalCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
        )}
      </div>

      {requirement.notes && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
          {requirement.notes}
        </p>
      )}
    </button>
  );
};
