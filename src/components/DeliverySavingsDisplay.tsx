import { Truck, Gift, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliverySavingsDisplayProps {
  cartTotal: number;
  freeDeliveryThreshold?: number;
  baseDeliveryFee?: number;
  className?: string;
}

export function DeliverySavingsDisplay({
  cartTotal,
  freeDeliveryThreshold = 200,
  baseDeliveryFee = 25,
  className,
}: DeliverySavingsDisplayProps) {
  const qualifiesForFreeDelivery = cartTotal >= freeDeliveryThreshold;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartTotal);
  const progressPercentage = Math.min(100, (cartTotal / freeDeliveryThreshold) * 100);

  if (qualifiesForFreeDelivery) {
    return (
      <div className={cn(
        "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-700 dark:text-green-400">
              You saved ₹{baseDeliveryFee} on delivery! 🎉
            </p>
            <p className="text-sm text-green-600 dark:text-green-500">
              Free delivery on orders above ₹{freeDeliveryThreshold}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4",
      className
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center">
          <Truck className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            Add ₹{amountNeededForFreeDelivery} more for FREE delivery
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-500">
            Free delivery on orders above ₹{freeDeliveryThreshold}
          </p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-amber-600 dark:text-amber-500">
        <span>₹{cartTotal}</span>
        <span>₹{freeDeliveryThreshold}</span>
      </div>
    </div>
  );
}
