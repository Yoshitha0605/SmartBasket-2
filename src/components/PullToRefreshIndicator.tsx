import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  isReady: boolean;
  progress: number;
}

export const PullToRefreshIndicator = ({
  pullDistance,
  isRefreshing,
  isReady,
  progress,
}: PullToRefreshIndicatorProps) => {
  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-all duration-200"
      style={{ height: pullDistance }}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 transition-all',
          isRefreshing && 'animate-pulse'
        )}
      >
        <div
          className={cn(
            'h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all',
            isReady && 'bg-primary/20',
            isRefreshing && 'bg-primary/30'
          )}
        >
          <RefreshCw
            className={cn(
              'h-5 w-5 text-primary transition-transform',
              isRefreshing && 'animate-spin'
            )}
            style={{
              transform: isRefreshing
                ? undefined
                : `rotate(${progress * 360}deg)`,
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {isRefreshing
            ? 'Refreshing...'
            : isReady
            ? 'Release to refresh'
            : 'Pull to refresh'}
        </span>
      </div>
    </div>
  );
};
