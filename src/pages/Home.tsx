import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowUpDown } from 'lucide-react';
import { products, FilterCategory, Product } from '@/data/products';
import { MobileHeader } from '@/components/MobileHeader';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { BestDeals } from '@/components/BestDeals';
import { PullToRefreshIndicator } from '@/components/PullToRefreshIndicator';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'savings' | 'name';

const getLowestPrice = (product: Product) => {
  const prices = [
    product.platforms.blinkit,
    product.platforms.zepto,
    product.platforms.instamart,
  ].filter((p): p is number => p !== undefined);
  return Math.min(...prices);
};

const getSavings = (product: Product) => {
  const prices = [
    product.platforms.blinkit,
    product.platforms.zepto,
    product.platforms.instamart,
  ].filter((p): p is number => p !== undefined);
  return Math.max(...prices) - Math.min(...prices);
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    // Simulate a refresh delay (in a real app, this would refetch data)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshKey((prev) => prev + 1);
    toast.success('Prices updated!', {
      description: 'Latest prices fetched from all platforms',
      duration: 2000,
    });
  }, []);

  const {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    progress,
    isReady,
  } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    maxPull: 120,
  });

  // Auto-focus search when coming from bottom nav search tab
  useEffect(() => {
    if (searchParams.get('search') === 'true') {
      setHasSearched(true);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!hasSearched || !searchQuery.trim()) return [];
    
    let filtered = [...products];

    // Apply search filter first - search by name and brand
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      (p.brand && p.brand.toLowerCase().includes(query))
    );

    // Apply category filter
    switch (selectedCategory) {
      case 'Veg':
        filtered = filtered.filter((p) => p.categoryType === 'Veg');
        break;
      case 'Non-Veg':
        filtered = filtered.filter((p) => p.categoryType === 'Non-Veg');
        break;
      case 'Vegetables':
        filtered = filtered.filter((p) => p.mainCategory === 'Vegetables');
        break;
      case 'Fruits':
        filtered = filtered.filter((p) => p.mainCategory === 'Fruits');
        break;
      case 'Dairy':
        filtered = filtered.filter((p) => p.mainCategory === 'Dairy');
        break;
      case 'Snacks':
        filtered = filtered.filter((p) => p.mainCategory === 'Snacks');
        break;
      case 'Chocolates':
        filtered = filtered.filter((p) => p.mainCategory === 'Chocolates');
        break;
      case 'Cakes':
        filtered = filtered.filter((p) => p.mainCategory === 'Cakes');
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case 'price-high':
        filtered.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
      case 'savings':
        filtered.sort((a, b) => getSavings(b) - getSavings(a));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, hasSearched, sortBy, refreshKey]);

  const handleProductClick = (product: Product) => {
    navigate(`/item/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      
      <div
        ref={containerRef}
        className="h-[calc(100vh-56px)] overflow-y-auto overscroll-contain"
      >
        {/* Pull to Refresh Indicator */}
        <PullToRefreshIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
          isReady={isReady}
          progress={progress}
        />

        <main className="px-4 py-4 pb-nav">
          {/* Search Bar */}
          <section className="mb-4">
            <SearchBar value={searchQuery} onChange={handleSearch} autoFocus={searchParams.get('search') === 'true'} />
          </section>

          {/* Show filters only after search */}
          {hasSearched && searchQuery.trim() && (
            <section className="mb-4 animate-fade-in">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </section>
          )}

          {/* Content */}
          {!hasSearched || !searchQuery.trim() ? (
            <div className="space-y-5">
              {/* Best Deals Section */}
              <BestDeals key={refreshKey} />

              {/* Search Prompt */}
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">Search for any item</p>
                <p className="text-sm text-center max-w-xs px-4">
                  Compare prices across Blinkit, Zepto, Instamart, BigBasket, and JioMart
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header with Count and Sort */}
              <div className="flex items-center justify-between mb-4 gap-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredProducts.length}</span> items
                </p>
                
                <div className="flex items-center gap-2">
                  {selectedCategory !== 'All' && (
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="text-sm text-primary font-medium px-3 py-1.5 bg-primary/10 rounded-full active:scale-95"
                    >
                      Clear
                    </button>
                  )}
                  
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-[130px] h-10 bg-card border-border rounded-xl touch-target">
                      <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      <SelectItem value="relevance" className="min-h-[44px]">Relevance</SelectItem>
                      <SelectItem value="price-low" className="min-h-[44px]">Price: Low→High</SelectItem>
                      <SelectItem value="price-high" className="min-h-[44px]">Price: High→Low</SelectItem>
                      <SelectItem value="savings" className="min-h-[44px]">Best Savings</SelectItem>
                      <SelectItem value="name" className="min-h-[44px]">Name: A→Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid - Mobile single column, tablets 2 cols */}
              {filteredProducts.length > 0 ? (
                <section className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="product-card animate-scale-in touch-manipulation"
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-4xl">{product.image}</div>
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

                      <h3 className="font-semibold text-foreground mb-0.5 line-clamp-2 text-sm leading-tight">
                        {product.name}
                      </h3>
                      {product.brand && (
                        <p className="text-xs font-medium text-primary mb-0.5 line-clamp-1">{product.brand}</p>
                      )}
                      <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>

                      <div className="mt-auto">
                        <p className="text-lg font-bold text-foreground">₹{product.price}</p>
                        <p className="text-xs text-primary font-medium mt-0.5">Compare →</p>
                      </div>
                    </div>
                  ))}
                </section>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-lg font-semibold text-foreground">No products found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
