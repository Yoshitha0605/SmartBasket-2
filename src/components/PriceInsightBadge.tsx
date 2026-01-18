import { TrendingDown, TrendingUp, Award, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getPriceInsight } from '@/data/priceHistory';

interface PriceInsightBadgeProps {
  productId: number;
  currentPrice: number;
  platformName: string;
  allPlatformPrices: { name: string; price: number }[];
  showBestChoice?: boolean;
  className?: string;
}

export function PriceInsightBadge({
  productId,
  currentPrice,
  platformName,
  allPlatformPrices,
  showBestChoice = true,
  className,
}: PriceInsightBadgeProps) {
  const insight = getPriceInsight(productId, currentPrice, platformName, allPlatformPrices);
  
  // Find if this is the cheapest platform
  const lowestPrice = Math.min(...allPlatformPrices.map(p => p.price));
  const isCheapestPlatform = currentPrice === lowestPrice;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {/* Best Choice Today badge */}
      {showBestChoice && isCheapestPlatform && (
        <Badge 
          className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-2 py-0.5"
        >
          <Award className="h-3 w-3 mr-1" />
          Best Choice Today
        </Badge>
      )}
      
      {/* Price change from yesterday */}
      {insight.isCheaperThanYesterday && insight.changeFromYesterday > 0 && (
        <Badge 
          variant="outline"
          className="bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 text-xs px-2 py-0.5"
        >
          <TrendingDown className="h-3 w-3 mr-1" />
          ₹{insight.changeFromYesterday} cheaper
        </Badge>
      )}
      
      {insight.isMoreExpensiveThanYesterday && insight.changeFromYesterday < 0 && (
        <Badge 
          variant="outline"
          className="bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 text-xs px-2 py-0.5"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          ₹{Math.abs(insight.changeFromYesterday)} more
        </Badge>
      )}
    </div>
  );
}

interface CheapestTodayLabelProps {
  platformName: string;
  className?: string;
}

export function CheapestTodayLabel({ platformName, className }: CheapestTodayLabelProps) {
  return (
    <div className={cn(
      "flex items-center gap-1 text-xs text-primary font-medium",
      className
    )}>
      <Flame className="h-3 w-3" />
      <span>Cheapest today on {platformName}</span>
    </div>
  );
}
