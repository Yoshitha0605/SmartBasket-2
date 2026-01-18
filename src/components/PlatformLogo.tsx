import { Zap, Rocket, ShoppingCart, ShoppingBasket, Store, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformLogoProps {
  platformName: string;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

const platformConfig: Record<string, { icon: React.ElementType; bgColor: string; iconColor: string }> = {
  'Blinkit': {
    icon: Zap,
    bgColor: 'bg-yellow-500',
    iconColor: 'text-white'
  },
  'Zepto': {
    icon: Rocket,
    bgColor: 'bg-purple-500',
    iconColor: 'text-white'
  },
  'Instamart': {
    icon: ShoppingCart,
    bgColor: 'bg-orange-500',
    iconColor: 'text-white'
  },
  'BigBasket': {
    icon: ShoppingBasket,
    bgColor: 'bg-green-600',
    iconColor: 'text-white'
  },
  'JioMart': {
    icon: Store,
    bgColor: 'bg-blue-600',
    iconColor: 'text-white'
  },
  'Flipkart Minutes': {
    icon: Timer,
    bgColor: 'bg-[#2874f0]',
    iconColor: 'text-yellow-400'
  }
};

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
};

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
};

export function PlatformLogo({ platformName, size = 'md', showBackground = true, className }: PlatformLogoProps) {
  const config = platformConfig[platformName] || {
    icon: Store,
    bgColor: 'bg-gray-500',
    iconColor: 'text-white'
  };

  const Icon = config.icon;

  if (!showBackground) {
    return <Icon className={cn(iconSizeClasses[size], config.iconColor, className)} />;
  }

  return (
    <div className={cn(
      'rounded-xl flex items-center justify-center',
      sizeClasses[size],
      config.bgColor,
      className
    )}>
      <Icon className={cn(iconSizeClasses[size], config.iconColor)} />
    </div>
  );
}

export function getPlatformColor(platformName: string): string {
  return platformConfig[platformName]?.bgColor || 'bg-gray-500';
}
