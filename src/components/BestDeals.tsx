import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, TrendingDown } from 'lucide-react';
import { products, Product } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductWithSavings extends Product {
  savings: number;
  savingsPercent: number;
  lowestPrice: number;
  highestPrice: number;
}

export function BestDeals() {
  const navigate = useNavigate();

  const bestDeals = useMemo(() => {
    const productsWithSavings: ProductWithSavings[] = products.map((product) => {
      const prices = [
        product.platforms.blinkit,
        product.platforms.zepto,
        product.platforms.instamart,
      ].filter((p): p is number => p !== undefined);

      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);
      const savings = highestPrice - lowestPrice;
      const savingsPercent = Math.round((savings / highestPrice) * 100);

      return {
        ...product,
        savings,
        savingsPercent,
        lowestPrice,
        highestPrice,
      };
    });

    return productsWithSavings
      .filter((p) => p.savings > 0)
      .sort((a, b) => b.savingsPercent - a.savingsPercent)
      .slice(0, 6);
  }, []);

  const handleProductClick = (product: Product) => {
    navigate(`/item/${product.id}`);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center">
          <Flame className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Best Deals</h2>
          <p className="text-xs text-muted-foreground">Products with biggest savings across platforms</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {bestDeals.map((product, index) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="relative bg-card rounded-2xl p-4 border border-border cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Savings Badge */}
            <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <TrendingDown className="h-3 w-3" />
              {product.savingsPercent}% off
            </div>

            {/* Veg/Non-Veg Indicator */}
            <div
              className={cn(
                'absolute top-3 left-3 w-4 h-4 rounded border-2 flex items-center justify-center',
                product.categoryType === 'Veg'
                  ? 'border-category-veg'
                  : 'border-category-nonveg'
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  product.categoryType === 'Veg'
                    ? 'bg-category-veg'
                    : 'bg-category-nonveg'
                )}
              />
            </div>

            <div className="text-4xl mb-2 text-center pt-2">{product.image}</div>
            
            <h3 className="font-semibold text-foreground text-sm line-clamp-1 text-center">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-xs font-medium text-primary text-center line-clamp-1">{product.brand}</p>
            )}
            <p className="text-xs text-muted-foreground text-center mb-2">{product.unit}</p>

            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground line-through">₹{product.highestPrice}</span>
              <span className="text-sm font-bold text-primary">₹{product.lowestPrice}</span>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-1">
              Save ₹{product.savings}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}