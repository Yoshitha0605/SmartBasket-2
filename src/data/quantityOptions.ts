// Quantity options based on product category
export interface QuantityOption {
  label: string;
  multiplier: number;
}

export const getQuantityOptions = (mainCategory: string, name: string): QuantityOption[] => {
  const lowerName = name.toLowerCase();
  
  // Milk
  if (lowerName.includes('milk') && !lowerName.includes('buttermilk')) {
    return [
      { label: '500ml', multiplier: 0.5 },
      { label: '1L', multiplier: 1 },
      { label: '2L', multiplier: 2 },
    ];
  }
  
  // Eggs
  if (lowerName.includes('egg') && !lowerName.includes('white')) {
    return [
      { label: '6 pack', multiplier: 0.5 },
      { label: '12 pack', multiplier: 1 },
    ];
  }
  
  // Chicken
  if (lowerName.includes('chicken')) {
    return [
      { label: '500g', multiplier: 0.5 },
      { label: '1kg', multiplier: 1 },
    ];
  }
  
  // Rice, Dal, Wheat Flour, Sugar, Salt
  if (['rice', 'dal', 'wheat flour', 'sugar', 'salt'].some(item => lowerName.includes(item))) {
    return [
      { label: '500g', multiplier: 0.5 },
      { label: '1kg', multiplier: 1 },
      { label: '2kg', multiplier: 2 },
      { label: '5kg', multiplier: 5 },
    ];
  }
  
  // Vegetables & Fruits
  if (mainCategory === 'Vegetables' || mainCategory === 'Fruits') {
    return [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.5 },
      { label: '1kg', multiplier: 1 },
      { label: '2kg', multiplier: 2 },
    ];
  }
  
  // Snacks
  if (mainCategory === 'Snacks') {
    return [
      { label: '100g', multiplier: 0.5 },
      { label: '200g', multiplier: 1 },
      { label: '500g', multiplier: 2.5 },
    ];
  }
  
  // Default - single option (product's default unit)
  return [
    { label: 'Default', multiplier: 1 },
  ];
};

export const PLATFORM_REDIRECT_URLS: Record<string, string> = {
  'Blinkit': 'https://blinkit.com',
  'Zepto': 'https://www.zeptonow.com',
  'Instamart': 'https://www.swiggy.com/instamart',
  'BigBasket': 'https://www.bigbasket.com',
  'JioMart': 'https://www.jiomart.com',
};
