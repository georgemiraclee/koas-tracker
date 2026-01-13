import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  segments?: {
    notStarted: number;
    ongoing: number;
    done: number;
    nilai: number;
  };
}

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 10,
  className,
  showPercentage = true,
  segments,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  if (segments) {
    const total = segments.notStarted + segments.ongoing + segments.done + segments.nilai;
    if (total === 0) {
      return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={strokeWidth}
            />
          </svg>
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">0%</span>
            </div>
          )}
        </div>
      );
    }

    const completedPercentage = ((segments.done + segments.nilai) / total) * 100;
    
    // Calculate segment angles
    const notStartedAngle = (segments.notStarted / total) * circumference;
    const ongoingAngle = (segments.ongoing / total) * circumference;
    const doneAngle = (segments.done / total) * circumference;
    const nilaiAngle = (segments.nilai / total) * circumference;

    let offset = 0;
    const segmentData = [
      { length: nilaiAngle, color: 'hsl(var(--status-nilai))', offset: 0 },
      { length: doneAngle, color: 'hsl(var(--status-done))', offset: nilaiAngle },
      { length: ongoingAngle, color: 'hsl(var(--status-ongoing))', offset: nilaiAngle + doneAngle },
      { length: notStartedAngle, color: 'hsl(var(--status-not-started))', offset: nilaiAngle + doneAngle + ongoingAngle },
    ].filter(s => s.length > 0);

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {segmentData.map((segment, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.length} ${circumference - segment.length}`}
              strokeDashoffset={-segment.offset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          ))}
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{Math.round(completedPercentage)}%</span>
            <span className="text-xs text-muted-foreground">Selesai</span>
          </div>
        )}
      </div>
    );
  }

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};
