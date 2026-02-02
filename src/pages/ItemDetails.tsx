import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Clock, Truck, CheckCircle, Award, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { getQuantityOptions, QuantityOption } from '@/data/quantityOptions';
import { MobileHeader } from '@/components/MobileHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { SmartSuggestions } from '@/components/SmartSuggestions';
import { getPriceInsight } from '@/data/priceHistory';
import { PlatformLogo, getPlatformColor } from '@/components/PlatformLogo';
import { getBackendUrl } from '@/lib/api';

interface PlatformData {
  id: number;
  name: string;
  price: number;
  deliveryTime: number;
  deliveryFee: number;
  color: string;
}

interface DbPlatform {
  id: number;
  name: string;
  logoUrl?: string;
  baseDeliveryFee: string;
  freeDeliveryThreshold: string;
  avgDeliveryMinutes: number;
  websiteUrl: string;
  createdAt: string;
}

interface DbProduct {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  category_type: string;
  main_category: string;
  brand: string | null;
}

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity } = useCart();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedQuantityOption, setSelectedQuantityOption] = useState<QuantityOption | null>(null);
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);

  const product = products.find((p) => p.id === Number(itemId));
  const cartItem = items.find((item) => item.id === product?.id);
  const quantity = cartItem?.quantity || 0;

  // Fetch product data from database (for brand info)
  useEffect(() => {
    const fetchProductData = async () => {
      if (!product) return;
      
      try {
        // Try to find product in database by name match
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('name', product.name)
          .limit(1)
          .maybeSingle();
        
        if (!error && data) {
          setDbProduct(data as DbProduct);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching product:', error);
        }
      }
    };
    
    fetchProductData();
  }, [product]);

  // Get quantity options for this product
  const quantityOptions = useMemo(() => {
    if (!product) return [];
    return getQuantityOptions(product.mainCategory, product.name);
  }, [product]);

  // Set default quantity option
  useMemo(() => {
    if (quantityOptions.length > 0 && !selectedQuantityOption) {
      const defaultOption = quantityOptions.find(opt => opt.multiplier === 1) || quantityOptions[0];
      setSelectedQuantityOption(defaultOption);
    }
  }, [quantityOptions, selectedQuantityOption]);

  // Fetch platforms from backend API with retry logic
  useEffect(() => {
    const fetchPlatforms = async (retries = 3) => {
      if (!product) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${getBackendUrl()}/api/platforms`);
        if (!response.ok) {
          throw new Error('Failed to fetch platforms');
        }
        const dbPlatforms = await response.json();
        
        const multiplier = selectedQuantityOption?.multiplier || 1;

        const platformData: PlatformData[] = dbPlatforms.map((p: DbPlatform) => {
          // Generate realistic prices based on product price with some variance
          const basePrice = product.price;
          const variance = 0.85 + Math.random() * 0.25; // 0.85 to 1.10 range
          const adjustedPrice = Math.round(basePrice * variance * multiplier);
          
          return {
            id: p.id,
            name: p.name,
            price: adjustedPrice,
            deliveryTime: p.avgDeliveryMinutes,
            deliveryFee: parseFloat(p.baseDeliveryFee),
            color: getPlatformColor(p.name)
          };
        });

        setPlatforms(platformData);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching platforms:', error);
        }
        // Retry logic
        if (retries > 0) {
          console.log(`Retrying platforms fetch, ${retries} attempts left`);
          setTimeout(() => fetchPlatforms(retries - 1), 1000);
          return;
        }
        // Set empty platforms array on error after retries
        setPlatforms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlatforms();
  }, [product, selectedQuantityOption]);

  // Calculate total prices and find best option
  const platformsWithTotal = platforms.map((p) => ({
    ...p,
    totalPrice: p.price + p.deliveryFee,
  }));

  const lowestTotal = platformsWithTotal.length > 0 
    ? Math.min(...platformsWithTotal.map((p) => p.totalPrice))
    : 0;
  const bestPlatforms = platformsWithTotal.filter((p) => p.totalPrice === lowestTotal);
  const bestPlatform = bestPlatforms.length > 0 
    ? bestPlatforms.reduce((a, b) => a.deliveryTime < b.deliveryTime ? a : b)
    : null;

  // Find fastest delivery platform
  const fastestDeliveryTime = platformsWithTotal.length > 0
    ? Math.min(...platformsWithTotal.map((p) => p.deliveryTime))
    : 0;
  const fastestPlatform = platformsWithTotal.find(p => p.deliveryTime === fastestDeliveryTime);

  // Helper to calculate arrival time
  const getArrivalTime = (deliveryMinutes: number) => {
    const arrivalDate = addMinutes(new Date(), deliveryMinutes);
    return format(arrivalDate, 'h:mm a');
  };

  const selectedPlatformData = platformsWithTotal.find(p => p.name === selectedPlatform);

  const handleSelectPlatform = (platformName: string) => {
    setSelectedPlatform(platformName);
  };

  const handleAddToCart = () => {
    if (!selectedPlatformData) {
      toast({
        title: "Please select a platform",
        description: "Choose a platform to add this item to your cart.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedQuantityOption) {
      toast({
        title: "Please select a quantity",
        description: "Choose a quantity option first.",
        variant: "destructive"
      });
      return;
    }

    addToCart(
      product, 
      selectedPlatformData.name, 
      selectedPlatformData.price, 
      selectedPlatformData.deliveryFee,
      selectedQuantityOption.label
    );
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedQuantityOption.label}) from ${selectedPlatformData.name} added to cart.`
    });
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      
      <main className="px-4 py-4 pb-nav">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground active:text-foreground mb-4 transition-colors touch-target"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Product Info - Compact for mobile */}
        <div className="bg-card rounded-2xl p-4 mb-4 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="text-6xl flex-shrink-0">{product.image}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <h1 className="text-xl font-bold text-foreground leading-tight">{product.name}</h1>
                <div
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
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
              {/* Brand Display - use local product data first, fallback to DB */}
              {(product.brand || dbProduct?.brand) && (
                <p className="text-sm font-medium text-primary mb-1">
                  {product.brand || dbProduct?.brand}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                {selectedQuantityOption ? selectedQuantityOption.label : product.unit}
              </p>
            </div>
          </div>
        </div>

        {/* Quantity Options - Horizontal scroll */}
        {quantityOptions.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground mb-3">Select Quantity</h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
              {quantityOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedQuantityOption(option)}
                  className={cn(
                    'px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap touch-target active:scale-95',
                    selectedQuantityOption?.label === option.label
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary shadow-glow'
                      : 'bg-card text-foreground border border-border'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Platform Comparison */}
        <h2 className="text-xl font-bold text-foreground mb-4">Select a Platform</h2>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-5 shadow-soft animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-muted" />
                  <div className="h-6 w-24 bg-muted rounded" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {platformsWithTotal.map((platform) => {
            const isBest = bestPlatform && platform.name === bestPlatform.name;
            const isFastest = fastestPlatform && platform.name === fastestPlatform.name && !isBest;
            const isSelected = selectedPlatform === platform.name;
            
            // Get price insight for this platform
            const allPrices = platformsWithTotal.map(p => ({ name: p.name, price: p.totalPrice }));
            const insight = getPriceInsight(
              product.id,
              platform.price,
              platform.name,
              allPrices
            );

            const arrivalTime = getArrivalTime(platform.deliveryTime);
            
            return (
              <button
                key={platform.name}
                onClick={() => handleSelectPlatform(platform.name)}
                className={cn(
                  'relative bg-card rounded-2xl p-5 shadow-soft transition-all text-left',
                  isSelected && 'ring-2 ring-primary shadow-glow',
                  !isSelected && 'hover:ring-2 hover:ring-primary/50'
                )}
              >
                {/* Best Choice Today Badge */}
                {isBest && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    Best Choice Today
                  </Badge>
                )}

                {/* Fastest Delivery Badge */}
                {isFastest && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Zap className="h-3 w-3 mr-1" />
                    Fastest Delivery
                  </Badge>
                )}

                {isSelected && (
                  <div className="absolute top-3 left-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <PlatformLogo platformName={platform.name} size="md" />
                  <h3 className="text-lg font-bold text-foreground">{platform.name}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-foreground">₹{platform.price}</span>
                    </div>
                  </div>
                  
                  {/* Price Insight Badges */}
                  {(insight.isCheaperThanYesterday || insight.isMoreExpensiveThanYesterday) && (
                    <div className="flex flex-wrap gap-1">
                      {insight.isCheaperThanYesterday && insight.changeFromYesterday > 0 && (
                        <Badge 
                          variant="outline"
                          className="bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 text-xs"
                        >
                          <TrendingDown className="h-3 w-3 mr-1" />
                          ₹{insight.changeFromYesterday} cheaper
                        </Badge>
                      )}
                      {insight.isMoreExpensiveThanYesterday && insight.changeFromYesterday < 0 && (
                        <Badge 
                          variant="outline"
                          className="bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 text-xs"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          ₹{Math.abs(insight.changeFromYesterday)} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Delivery</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-foreground">{platform.deliveryTime} min</span>
                      <p className="text-xs text-muted-foreground">Arrives by {arrivalTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Delivery Fee</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {platform.deliveryFee === 0 ? 'Free' : `₹${platform.deliveryFee}`}
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className={cn(
                        'text-xl font-bold',
                        isSelected ? 'text-primary' : isBest ? 'text-primary' : 'text-foreground'
                      )}>
                        ₹{platform.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        )}

        {/* Smart Suggestions */}
        <SmartSuggestions 
          cartProductNames={[product.name]} 
          className="mb-24"
        />

        {/* Add to Cart Section - Fixed bottom for mobile */}
        <div className="fixed bottom-16 left-0 right-0 bg-card/95 backdrop-blur-lg p-4 shadow-lg border-t border-border safe-area-bottom z-40">
          {quantity === 0 ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                {selectedPlatformData ? (
                  <div>
                    <p className="text-xs text-muted-foreground truncate">{selectedPlatformData.name}</p>
                    <p className="text-xl font-bold text-primary">₹{selectedPlatformData.price}</p>
                  </div>
                ) : (
                  <p className="text-amber-600 dark:text-amber-400 font-medium text-sm">
                    Select a platform
                  </p>
                )}
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!selectedPlatform}
                className={cn(
                  "font-semibold rounded-xl px-6 h-12 text-base touch-target active:scale-95",
                  selectedPlatform 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Plus className="h-5 w-5 mr-1.5" />
                Add to Cart
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{cartItem?.platformName}</p>
                <p className="text-xl font-bold text-primary">₹{(cartItem?.platformPrice || 0) * quantity}</p>
              </div>
              <div className="flex items-center bg-primary rounded-xl px-1 h-12">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  className="h-10 w-10 text-primary-foreground active:bg-primary-foreground/20"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-primary-foreground font-bold w-8 text-center text-lg">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  className="h-10 w-10 text-primary-foreground active:bg-primary-foreground/20"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ItemDetails;
