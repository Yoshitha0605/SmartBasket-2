import { Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const navigate = useNavigate();
  const { items, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const lowestPrice = Math.min(
    product.platforms.blinkit || Infinity,
    product.platforms.zepto || Infinity,
    product.platforms.instamart || Infinity
  );

  const getPlatformWithLowestPrice = () => {
    if (product.platforms.blinkit === lowestPrice) return 'Blinkit';
    if (product.platforms.zepto === lowestPrice) return 'Zepto';
    return 'Instamart';
  };

  const handleAddClick = () => {
    // Navigate to item details for platform selection
    navigate(`/item/${product.id}`);
  };

  return (
    <div
      className="product-card animate-scale-in touch-manipulation"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div 
        className="cursor-pointer"
        onClick={() => navigate(`/item/${product.id}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="text-5xl">{product.image}</div>
          <div
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
              product.categoryType === 'Veg'
                ? 'border-category-veg'
                : 'border-category-nonveg'
            )}
          >
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                product.categoryType === 'Veg'
                  ? 'bg-category-veg'
                  : 'bg-category-nonveg'
              )}
            />
          </div>
        </div>

        <h3 className="font-semibold text-foreground mb-1 line-clamp-2 text-base">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{product.unit}</p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xl font-bold text-foreground">₹{product.price}</p>
            <p className="text-xs text-primary font-medium">
              Best: ₹{lowestPrice} ({getPlatformWithLowestPrice()})
            </p>
          </div>
        </div>
      </div>

      {quantity === 0 ? (
        <Button
          onClick={handleAddClick}
          className="w-full bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-semibold rounded-xl h-12 text-base touch-target"
        >
          <Plus className="h-5 w-5 mr-1.5" />
          Add
        </Button>
      ) : (
        <div className="flex items-center justify-between bg-primary rounded-xl h-12 px-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="h-10 w-10 text-primary-foreground hover:bg-primary-foreground/20 active:scale-95"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <span className="text-primary-foreground font-bold text-lg">{quantity}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="h-10 w-10 text-primary-foreground hover:bg-primary-foreground/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
