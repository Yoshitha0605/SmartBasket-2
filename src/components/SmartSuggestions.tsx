import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { products } from '@/data/products';
import { getSuggestionsForCart } from '@/data/smartSuggestions';
import { cn } from '@/lib/utils';

interface SmartSuggestionsProps {
  cartProductNames: string[];
  className?: string;
}

export function SmartSuggestions({ cartProductNames, className }: SmartSuggestionsProps) {
  const navigate = useNavigate();
  
  const suggestedNames = getSuggestionsForCart(cartProductNames);
  
  // Find actual products matching the suggestions
  const suggestedProducts = suggestedNames
    .map(name => products.find(p => p.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean)
    .slice(0, 4);

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-card rounded-2xl p-5 shadow-soft", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Frequently Bought Together</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {suggestedProducts.map((product) => {
          if (!product) return null;
          
          // Find lowest price across platforms
          const prices = Object.values(product.platforms).filter(Boolean) as number[];
          const lowestPrice = Math.min(...prices);
          
          return (
            <button
              key={product.id}
              onClick={() => navigate(`/item/${product.id}`)}
              className="flex flex-col items-center p-3 rounded-xl bg-background hover:bg-muted transition-colors border border-border hover:border-primary/50"
            >
              <div className="text-4xl mb-2">{product.image}</div>
              <p className="text-sm font-medium text-foreground text-center line-clamp-1">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">{product.unit}</p>
              <p className="text-sm font-bold text-primary mt-1">₹{lowestPrice}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
