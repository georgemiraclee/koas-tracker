import { cn } from '@/lib/utils';
import { Department } from '@/types/koas';
import { ProgressRing } from './ProgressRing';
import { useProgress } from '@/hooks/useProgress';
import { ChevronRight } from 'lucide-react';
import { CSSProperties } from 'react';

interface DepartmentCardProps {
  department: Department;
  departments: Department[];
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
}

export const DepartmentCard = ({ department, departments, onClick, className, style }: DepartmentCardProps) => {
  const { getDepartmentProgress } = useProgress(departments);
  const progress = getDepartmentProgress(department.id);

  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        'group w-full p-4 bg-card rounded-xl border border-border',
        'hover:shadow-card hover:border-primary/30 transition-all duration-300',
        'flex items-center gap-4 text-left',
        'animate-fade-in',
        className
      )}
    >
      <div className="flex-shrink-0">
        <ProgressRing
          progress={progress.percentage.completed}
          size={56}
          strokeWidth={6}
          showPercentage={false}
          segments={{
            notStarted: progress.notStarted,
            ongoing: progress.ongoing,
            done: progress.done,
            nilai: progress.nilai,
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{department.icon}</span>
          <h3 className="font-semibold text-foreground truncate">{department.name}</h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{progress.total} requirement</span>
          {progress.ongoing > 0 && (
            <span className="text-status-ongoing">
              {progress.ongoing} ongoing
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  );
};
