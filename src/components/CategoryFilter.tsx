import { filterCategories, FilterCategory } from '@/data/products';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 min-w-max py-1">
        {filterCategories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'category-chip touch-target',
                isActive
                  ? cn(category.color, 'category-chip-active shadow-glow')
                  : 'bg-muted text-muted-foreground active:bg-accent active:text-accent-foreground'
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
