import { Package, CheckCircle2, Truck, Home, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStatusTimelineProps {
  currentStatus: string;
  className?: string;
}

const ORDER_STATUSES = [
  { key: 'Placed', label: 'Order Placed', icon: Package },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Home },
];

export function OrderStatusTimeline({ currentStatus, className }: OrderStatusTimelineProps) {
  const isDelayed = currentStatus === 'Delayed';
  const isCancelled = currentStatus === 'Cancelled';
  
  // Handle cancelled orders
  if (isCancelled) {
    return (
      <div className={cn("relative", className)}>
        <div className="flex flex-col items-center py-4">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <span className="text-lg font-semibold text-red-600 dark:text-red-400">Order Cancelled</span>
          <p className="text-sm text-muted-foreground mt-1">This order has been cancelled</p>
        </div>
      </div>
    );
  }
  
  // Map delayed to Out for Delivery position
  const effectiveStatus = isDelayed ? 'Out for Delivery' : currentStatus;
  const currentIndex = ORDER_STATUSES.findIndex(s => s.key === effectiveStatus);

  return (
    <div className={cn("relative", className)}>
      {/* Timeline container */}
      <div className="flex items-start justify-between">
        {ORDER_STATUSES.map((status, index) => {
          const Icon = status.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isDelayedCurrent = isDelayed && isCurrent;
          
          return (
            <div key={status.key} className="flex flex-col items-center flex-1 relative">
              {/* Connector line (before icon) */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-5 right-1/2 w-full h-1 -translate-y-1/2",
                    index <= currentIndex
                      ? isDelayed && index === currentIndex
                        ? 'bg-amber-500'
                        : 'bg-primary'
                      : 'bg-muted'
                  )}
                  style={{ zIndex: 0 }}
                />
              )}
              
              {/* Icon circle */}
              <div
                className={cn(
                  "relative z-10 h-10 w-10 rounded-full flex items-center justify-center transition-all",
                  isCompleted
                    ? isDelayedCurrent
                      ? 'bg-amber-500 text-white'
                      : 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                  isCurrent && !isDelayed && 'ring-4 ring-primary/30',
                  isDelayedCurrent && 'ring-4 ring-amber-500/30'
                )}
              >
                {isDelayedCurrent ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                
                {/* Pulse animation for current status */}
                {isCurrent && !isDelayed && (
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
                )}
              </div>
              
              {/* Status label */}
              <span
                className={cn(
                  "text-xs text-center mt-2 font-medium max-w-[70px]",
                  isCompleted ? 'text-foreground' : 'text-muted-foreground',
                  isCurrent && 'text-primary',
                  isDelayedCurrent && 'text-amber-600 dark:text-amber-400'
                )}
              >
                {isDelayedCurrent ? 'Delayed' : status.label}
              </span>
              
              {/* Checkmark for completed statuses */}
              {isCompleted && index < currentIndex && (
                <div className="absolute -top-1 -right-1 z-20">
                  <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Delayed warning message */}
      {isDelayed && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Your delivery is taking longer than expected. We're on it!
          </p>
        </div>
      )}
    </div>
  );
}
