// Rule-based product suggestions
// Maps product names/categories to frequently bought together items

interface SuggestionRule {
  triggers: string[]; // Product names or categories that trigger these suggestions
  suggestions: string[]; // Suggested product names
}

const suggestionRules: SuggestionRule[] = [
  // Vegetables combinations
  { triggers: ['Tomato'], suggestions: ['Onion', 'Green Chilli', 'Coriander', 'Ginger'] },
  { triggers: ['Onion'], suggestions: ['Tomato', 'Potato', 'Garlic', 'Ginger'] },
  { triggers: ['Potato'], suggestions: ['Onion', 'Tomato', 'Green Chilli'] },
  { triggers: ['Capsicum'], suggestions: ['Onion', 'Tomato', 'Paneer'] },
  { triggers: ['Spinach'], suggestions: ['Paneer', 'Garlic', 'Cream'] },
  
  // Dairy combinations
  { triggers: ['Milk'], suggestions: ['Bread', 'Eggs', 'Butter', 'Cornflakes'] },
  { triggers: ['Curd'], suggestions: ['Rice', 'Onion', 'Green Chilli'] },
  { triggers: ['Paneer'], suggestions: ['Capsicum', 'Onion', 'Cream', 'Tomato'] },
  { triggers: ['Butter'], suggestions: ['Bread', 'Eggs', 'Cheese'] },
  { triggers: ['Cheese'], suggestions: ['Bread', 'Butter', 'Tomato'] },
  
  // Fruits combinations
  { triggers: ['Apple'], suggestions: ['Banana', 'Orange', 'Grapes'] },
  { triggers: ['Banana'], suggestions: ['Apple', 'Milk', 'Curd'] },
  { triggers: ['Mango'], suggestions: ['Cream', 'Milk', 'Banana'] },
  
  // Snacks combinations
  { triggers: ['Lays Chips'], suggestions: ['Kurkure', 'Pringles', 'Doritos'] },
  { triggers: ['Maggi Noodles'], suggestions: ['Eggs', 'Onion', 'Green Chilli'] },
  { triggers: ['Oreo'], suggestions: ['Milk', 'Bourbon', 'Hide & Seek'] },
  
  // Grocery combinations
  { triggers: ['Rice'], suggestions: ['Curd', 'Ghee', 'Onion', 'Tomato'] },
  { triggers: ['Wheat Flour'], suggestions: ['Ghee', 'Sugar', 'Milk'] },
  { triggers: ['Eggs'], suggestions: ['Bread', 'Butter', 'Milk', 'Onion'] },
  
  // Chocolates combinations
  { triggers: ['Dairy Milk', 'Dairy Milk Silk', 'Dairy Milk Oreo'], suggestions: ['KitKat', '5 Star', 'Snickers'] },
  { triggers: ['KitKat'], suggestions: ['Dairy Milk', 'Snickers', '5 Star'] },
  
  // Cakes combinations
  { triggers: ['Chocolate Cake', 'Black Forest Cake'], suggestions: ['Vanilla Cake', 'Cupcakes Pack', 'Brownie Box'] },
  { triggers: ['Cupcakes Pack'], suggestions: ['Brownie Box', 'Milk', 'Cream'] },
  
  // Non-veg combinations
  { triggers: ['Chicken Breast', 'Chicken Wings', 'Chicken Drumsticks'], suggestions: ['Onion', 'Tomato', 'Ginger', 'Garlic'] },
  { triggers: ['Whole Chicken'], suggestions: ['Onion', 'Ginger', 'Garlic', 'Tomato'] },
];

export interface ProductSuggestion {
  name: string;
  reason: string;
}

export const getSuggestionsForProduct = (productName: string): string[] => {
  const normalizedName = productName.toLowerCase();
  
  for (const rule of suggestionRules) {
    for (const trigger of rule.triggers) {
      if (normalizedName.includes(trigger.toLowerCase()) || trigger.toLowerCase().includes(normalizedName)) {
        return rule.suggestions;
      }
    }
  }
  
  // Default suggestions based on common items
  return ['Milk', 'Bread', 'Eggs', 'Onion'];
};

export const getSuggestionsForCart = (cartProductNames: string[]): string[] => {
  const allSuggestions: string[] = [];
  
  for (const productName of cartProductNames) {
    const suggestions = getSuggestionsForProduct(productName);
    allSuggestions.push(...suggestions);
  }
  
  // Remove duplicates and items already in cart
  const cartNamesLower = cartProductNames.map(n => n.toLowerCase());
  const uniqueSuggestions = [...new Set(allSuggestions)]
    .filter(s => !cartNamesLower.includes(s.toLowerCase()));
  
  // Return top 4 suggestions
  return uniqueSuggestions.slice(0, 4);
};
