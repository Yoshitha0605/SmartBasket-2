import { Product } from '@/data/products';
import { Badge } from '@/components/ui/badge';

interface PlatformComparisonProps {
  product: Product;
}

export function PlatformComparison({ product }: PlatformComparisonProps) {
  const platforms = [
    { name: 'Blinkit', price: product.platforms.blinkit, color: 'bg-yellow-500' },
    { name: 'Zepto', price: product.platforms.zepto, color: 'bg-purple-500' },
    { name: 'Instamart', price: product.platforms.instamart, color: 'bg-orange-500' },
  ];

  const lowestPrice = Math.min(
    ...platforms.map((p) => p.price || Infinity)
  );

  return (
    <div className="flex gap-2 flex-wrap">
      {platforms.map((platform) => (
        platform.price && (
          <Badge
            key={platform.name}
            variant={platform.price === lowestPrice ? 'default' : 'secondary'}
            className={platform.price === lowestPrice ? 'bg-primary' : ''}
          >
            {platform.name}: ₹{platform.price}
          </Badge>
        )
      ))}
    </div>
  );
}
