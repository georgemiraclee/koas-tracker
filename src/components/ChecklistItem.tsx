import { cn } from '@/lib/utils';
import { ChecklistItem as ChecklistItemType } from '@/types/koas';
import { Check, Trash2 } from 'lucide-react';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: () => void;
  onDelete: () => void;
}

export const ChecklistItem = ({ item, onToggle, onDelete }: ChecklistItemProps) => {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
        item.done
          ? 'bg-status-done-light border-status-done/30'
          : 'bg-card border-border hover:border-primary/30'
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
          item.done
            ? 'bg-status-done border-status-done text-white'
            : 'border-muted-foreground/30 hover:border-primary'
        )}
      >
        {item.done && <Check className="w-4 h-4 animate-scale-in" />}
      </button>
      
      <span
        className={cn(
          'flex-1 text-sm transition-all',
          item.done && 'line-through text-muted-foreground'
        )}
      >
        {item.text}
      </span>

      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
