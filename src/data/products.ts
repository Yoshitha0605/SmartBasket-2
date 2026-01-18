export type CategoryType = 'Veg' | 'Non-Veg';
export type MainCategory = 'Vegetables' | 'Fruits' | 'Dairy' | 'Snacks' | 'Grocery' | 'Chocolates' | 'Cakes' | 'Masala & Spices' | 'Non-Veg';

export interface Product {
  id: number;
  name: string;
  brand?: string | null;
  price: number;
  unit: string;
  image: string;
  categoryType: CategoryType;
  mainCategory: MainCategory;
  platforms: {
    blinkit?: number;
    zepto?: number;
    instamart?: number;
  };
}

export const products: Product[] = [
  // Vegetables (15 items) - No brand for fresh produce
  { id: 1, name: "Tomato", price: 30, unit: "1 kg", image: "🍅", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 28, zepto: 32, instamart: 30 } },
  { id: 2, name: "Onion", price: 35, unit: "1 kg", image: "🧅", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 33, zepto: 36, instamart: 35 } },
  { id: 3, name: "Potato", price: 25, unit: "1 kg", image: "🥔", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 24, zepto: 26, instamart: 25 } },
  { id: 4, name: "Carrot", price: 40, unit: "500 g", image: "🥕", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },
  { id: 5, name: "Capsicum", price: 60, unit: "500 g", image: "🫑", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 58, zepto: 62, instamart: 60 } },
  { id: 6, name: "Brinjal", price: 35, unit: "500 g", image: "🍆", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 33, zepto: 37, instamart: 35 } },
  { id: 7, name: "Cabbage", price: 30, unit: "1 pc", image: "🥬", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 28, zepto: 32, instamart: 30 } },
  { id: 8, name: "Cauliflower", price: 45, unit: "1 pc", image: "🥦", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 43, zepto: 47, instamart: 45 } },
  { id: 9, name: "Green Chilli", price: 20, unit: "100 g", image: "🌶️", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 18, zepto: 22, instamart: 20 } },
  { id: 10, name: "Cucumber", price: 25, unit: "500 g", image: "🥒", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 23, zepto: 27, instamart: 25 } },
  { id: 11, name: "Spinach", price: 20, unit: "1 bunch", image: "🥬", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 18, zepto: 22, instamart: 20 } },
  { id: 12, name: "Coriander", price: 15, unit: "1 bunch", image: "🌿", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 14, zepto: 16, instamart: 15 } },
  { id: 13, name: "Ginger", price: 80, unit: "250 g", image: "🫚", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 78, zepto: 82, instamart: 80 } },
  { id: 14, name: "Garlic", price: 60, unit: "250 g", image: "🧄", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 58, zepto: 62, instamart: 60 } },
  { id: 15, name: "Beetroot", price: 35, unit: "500 g", image: "🍠", categoryType: "Veg", mainCategory: "Vegetables", platforms: { blinkit: 33, zepto: 37, instamart: 35 } },

  // Fruits (20 items) - No brand for fresh produce
  { id: 16, name: "Apple", price: 150, unit: "1 kg", image: "🍎", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 145, zepto: 155, instamart: 150 } },
  { id: 17, name: "Banana", price: 50, unit: "1 dozen", image: "🍌", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 48, zepto: 52, instamart: 50 } },
  { id: 18, name: "Orange", price: 80, unit: "1 kg", image: "🍊", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 78, zepto: 82, instamart: 80 } },
  { id: 19, name: "Grapes", price: 100, unit: "500 g", image: "🍇", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 95, zepto: 105, instamart: 100 } },
  { id: 20, name: "Mango", price: 200, unit: "1 kg", image: "🥭", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 190, zepto: 210, instamart: 200 } },
  { id: 21, name: "Papaya", price: 60, unit: "1 pc", image: "🍈", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 58, zepto: 62, instamart: 60 } },
  { id: 22, name: "Watermelon", price: 40, unit: "1 kg", image: "🍉", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },
  { id: 23, name: "Pomegranate", price: 180, unit: "1 kg", image: "🫐", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 175, zepto: 185, instamart: 180 } },
  { id: 24, name: "Pineapple", price: 70, unit: "1 pc", image: "🍍", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 68, zepto: 72, instamart: 70 } },
  { id: 25, name: "Guava", price: 60, unit: "500 g", image: "🍐", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 58, zepto: 62, instamart: 60 } },
  { id: 26, name: "Kiwi", price: 120, unit: "3 pc", image: "🥝", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 115, zepto: 125, instamart: 120 } },
  { id: 27, name: "Strawberry", price: 150, unit: "200 g", image: "🍓", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 145, zepto: 155, instamart: 150 } },
  { id: 28, name: "Green Apple", price: 180, unit: "1 kg", image: "🍏", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 175, zepto: 185, instamart: 180 } },
  { id: 29, name: "Dragon Fruit", price: 250, unit: "1 pc", image: "🍒", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 240, zepto: 260, instamart: 250 } },
  { id: 30, name: "Avocado", price: 180, unit: "2 pc", image: "🥑", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 170, zepto: 190, instamart: 180 } },
  { id: 31, name: "Lemon", price: 30, unit: "250 g", image: "🍋", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 28, zepto: 32, instamart: 30 } },
  { id: 32, name: "Coconut", price: 45, unit: "1 pc", image: "🥥", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 42, zepto: 48, instamart: 45 } },
  { id: 33, name: "Peach", price: 200, unit: "500 g", image: "🍑", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 190, zepto: 210, instamart: 200 } },
  { id: 34, name: "Blueberry", price: 350, unit: "125 g", image: "🫐", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 340, zepto: 360, instamart: 350 } },
  { id: 35, name: "Custard Apple", price: 120, unit: "500 g", image: "🍈", categoryType: "Veg", mainCategory: "Fruits", platforms: { blinkit: 115, zepto: 125, instamart: 120 } },

  // Dairy - Multi-brand products
  // Toned Milk - 3 brands
  { id: 36, name: "Toned Milk", brand: "Nandini", price: 58, unit: "1 L", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 56, zepto: 60, instamart: 58 } },
  { id: 37, name: "Toned Milk", brand: "Amul", price: 62, unit: "1 L", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 60, zepto: 64, instamart: 62 } },
  { id: 38, name: "Toned Milk", brand: "Heritage", price: 60, unit: "1 L", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 58, zepto: 62, instamart: 60 } },
  
  // Full Cream Milk - 2 brands
  { id: 39, name: "Full Cream Milk", brand: "Nandini", price: 68, unit: "1 L", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 66, zepto: 70, instamart: 68 } },
  { id: 40, name: "Full Cream Milk", brand: "Amul", price: 72, unit: "1 L", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 70, zepto: 74, instamart: 72 } },
  
  // Cow Milk - 2 brands
  { id: 41, name: "Cow Milk", brand: "Nandini", price: 64, unit: "1 L", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 62, zepto: 66, instamart: 64 } },
  { id: 42, name: "Cow Milk", brand: "Amul", price: 66, unit: "1 L", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 64, zepto: 68, instamart: 66 } },
  
  // Curd - 2 brands
  { id: 43, name: "Curd", brand: "Nandini", price: 45, unit: "400 g", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 43, zepto: 47, instamart: 45 } },
  { id: 44, name: "Curd", brand: "Amul", price: 48, unit: "400 g", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 46, zepto: 50, instamart: 48 } },
  
  // Butter - 2 brands
  { id: 45, name: "Butter", brand: "Amul", price: 55, unit: "100 g", image: "🧈", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 53, zepto: 57, instamart: 55 } },
  { id: 46, name: "Butter", brand: "Nandini", price: 52, unit: "100 g", image: "🧈", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 50, zepto: 54, instamart: 52 } },
  
  // Ghee - 3 brands
  { id: 47, name: "Ghee", brand: "GRB", price: 520, unit: "500 ml", image: "🫙", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 510, zepto: 530, instamart: 520 } },
  { id: 48, name: "Ghee", brand: "Amul", price: 550, unit: "500 ml", image: "🫙", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 540, zepto: 560, instamart: 550 } },
  { id: 49, name: "Ghee", brand: "Nandini", price: 500, unit: "500 ml", image: "🫙", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 490, zepto: 510, instamart: 500 } },
  
  // Paneer - 3 brands
  { id: 50, name: "Paneer", brand: "Nandini", price: 85, unit: "200 g", image: "🧀", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 83, zepto: 87, instamart: 85 } },
  { id: 51, name: "Paneer", brand: "Amul", price: 90, unit: "200 g", image: "🧀", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 88, zepto: 92, instamart: 90 } },
  { id: 52, name: "Paneer", brand: "Milky Mist", price: 95, unit: "200 g", image: "🧀", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 93, zepto: 97, instamart: 95 } },
  
  // Other Dairy
  { id: 53, name: "Cheese Slices", brand: "Amul", price: 120, unit: "200 g", image: "🧀", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 115, zepto: 125, instamart: 120 } },
  { id: 54, name: "Fresh Cream", brand: "Amul", price: 80, unit: "200 ml", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 78, zepto: 82, instamart: 80 } },
  { id: 55, name: "Buttermilk", brand: "Amul", price: 25, unit: "200 ml", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 23, zepto: 27, instamart: 25 } },
  { id: 56, name: "Greek Yogurt", brand: "Epigamia", price: 35, unit: "100 g", image: "🥛", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 33, zepto: 37, instamart: 35 } },
  { id: 57, name: "Lassi", brand: "Amul", price: 40, unit: "200 ml", image: "🥤", categoryType: "Veg", mainCategory: "Dairy", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },

  // Masala & Spices - Multi-brand products
  // Red Chilli Powder - 5 brands
  { id: 58, name: "Red Chilli Powder", brand: "GRB", price: 45, unit: "100 g", image: "🌶️", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 43, zepto: 47, instamart: 45 } },
  { id: 59, name: "Red Chilli Powder", brand: "MTR", price: 50, unit: "100 g", image: "🌶️", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 48, zepto: 52, instamart: 50 } },
  { id: 60, name: "Red Chilli Powder", brand: "Everest", price: 55, unit: "100 g", image: "🌶️", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 53, zepto: 57, instamart: 55 } },
  { id: 61, name: "Red Chilli Powder", brand: "Aachi", price: 42, unit: "100 g", image: "🌶️", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 40, zepto: 44, instamart: 42 } },
  { id: 62, name: "Red Chilli Powder", brand: "Sakthi", price: 40, unit: "100 g", image: "🌶️", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },
  
  // Turmeric Powder - 5 brands
  { id: 63, name: "Turmeric Powder", brand: "GRB", price: 35, unit: "100 g", image: "🟡", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 33, zepto: 37, instamart: 35 } },
  { id: 64, name: "Turmeric Powder", brand: "MTR", price: 40, unit: "100 g", image: "🟡", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },
  { id: 65, name: "Turmeric Powder", brand: "Everest", price: 45, unit: "100 g", image: "🟡", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 43, zepto: 47, instamart: 45 } },
  { id: 66, name: "Turmeric Powder", brand: "Aachi", price: 32, unit: "100 g", image: "🟡", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 30, zepto: 34, instamart: 32 } },
  { id: 67, name: "Turmeric Powder", brand: "Sakthi", price: 30, unit: "100 g", image: "🟡", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 28, zepto: 32, instamart: 30 } },
  
  // Coriander Powder - 5 brands
  { id: 68, name: "Coriander Powder", brand: "GRB", price: 40, unit: "100 g", image: "🟤", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },
  { id: 69, name: "Coriander Powder", brand: "MTR", price: 45, unit: "100 g", image: "🟤", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 43, zepto: 47, instamart: 45 } },
  { id: 70, name: "Coriander Powder", brand: "Everest", price: 50, unit: "100 g", image: "🟤", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 48, zepto: 52, instamart: 50 } },
  { id: 71, name: "Coriander Powder", brand: "Aachi", price: 38, unit: "100 g", image: "🟤", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 36, zepto: 40, instamart: 38 } },
  { id: 72, name: "Coriander Powder", brand: "Sakthi", price: 35, unit: "100 g", image: "🟤", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 33, zepto: 37, instamart: 35 } },
  
  // Pepper Powder - 5 brands
  { id: 73, name: "Pepper Powder", brand: "GRB", price: 80, unit: "100 g", image: "⚫", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 78, zepto: 82, instamart: 80 } },
  { id: 74, name: "Pepper Powder", brand: "MTR", price: 85, unit: "100 g", image: "⚫", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 83, zepto: 87, instamart: 85 } },
  { id: 75, name: "Pepper Powder", brand: "Everest", price: 90, unit: "100 g", image: "⚫", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 88, zepto: 92, instamart: 90 } },
  { id: 76, name: "Pepper Powder", brand: "Aachi", price: 75, unit: "100 g", image: "⚫", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 73, zepto: 77, instamart: 75 } },
  { id: 77, name: "Pepper Powder", brand: "Sakthi", price: 70, unit: "100 g", image: "⚫", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 68, zepto: 72, instamart: 70 } },
  
  // Garam Masala - 5 brands
  { id: 78, name: "Garam Masala", brand: "GRB", price: 60, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 58, zepto: 62, instamart: 60 } },
  { id: 79, name: "Garam Masala", brand: "MTR", price: 65, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 63, zepto: 67, instamart: 65 } },
  { id: 80, name: "Garam Masala", brand: "Everest", price: 70, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 68, zepto: 72, instamart: 70 } },
  { id: 81, name: "Garam Masala", brand: "Aachi", price: 55, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 53, zepto: 57, instamart: 55 } },
  { id: 82, name: "Garam Masala", brand: "Sakthi", price: 50, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 48, zepto: 52, instamart: 50 } },
  
  // Chicken Masala - 5 brands
  { id: 83, name: "Chicken Masala", brand: "GRB", price: 55, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 53, zepto: 57, instamart: 55 } },
  { id: 84, name: "Chicken Masala", brand: "MTR", price: 60, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 58, zepto: 62, instamart: 60 } },
  { id: 85, name: "Chicken Masala", brand: "Everest", price: 65, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 63, zepto: 67, instamart: 65 } },
  { id: 86, name: "Chicken Masala", brand: "Aachi", price: 50, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 48, zepto: 52, instamart: 50 } },
  { id: 87, name: "Chicken Masala", brand: "Sakthi", price: 48, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 46, zepto: 50, instamart: 48 } },
  
  // Meat Masala - 5 brands
  { id: 88, name: "Meat Masala", brand: "GRB", price: 58, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 56, zepto: 60, instamart: 58 } },
  { id: 89, name: "Meat Masala", brand: "MTR", price: 62, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 60, zepto: 64, instamart: 62 } },
  { id: 90, name: "Meat Masala", brand: "Everest", price: 68, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 66, zepto: 70, instamart: 68 } },
  { id: 91, name: "Meat Masala", brand: "Aachi", price: 52, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 50, zepto: 54, instamart: 52 } },
  { id: 92, name: "Meat Masala", brand: "Sakthi", price: 50, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 48, zepto: 52, instamart: 50 } },
  
  // Sambar Powder - 5 brands
  { id: 93, name: "Sambar Powder", brand: "GRB", price: 48, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 46, zepto: 50, instamart: 48 } },
  { id: 94, name: "Sambar Powder", brand: "MTR", price: 55, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 53, zepto: 57, instamart: 55 } },
  { id: 95, name: "Sambar Powder", brand: "Everest", price: 58, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 56, zepto: 60, instamart: 58 } },
  { id: 96, name: "Sambar Powder", brand: "Aachi", price: 45, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 43, zepto: 47, instamart: 45 } },
  { id: 97, name: "Sambar Powder", brand: "Sakthi", price: 42, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 40, zepto: 44, instamart: 42 } },
  
  // Rasam Powder - 5 brands
  { id: 98, name: "Rasam Powder", brand: "GRB", price: 45, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 43, zepto: 47, instamart: 45 } },
  { id: 99, name: "Rasam Powder", brand: "MTR", price: 50, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 48, zepto: 52, instamart: 50 } },
  { id: 100, name: "Rasam Powder", brand: "Everest", price: 55, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 53, zepto: 57, instamart: 55 } },
  { id: 101, name: "Rasam Powder", brand: "Aachi", price: 42, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 40, zepto: 44, instamart: 42 } },
  { id: 102, name: "Rasam Powder", brand: "Sakthi", price: 40, unit: "100 g", image: "🫙", categoryType: "Veg", mainCategory: "Masala & Spices", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },

  // Snacks (12 items) - With brand names
  { id: 103, name: "Classic Salted Chips", brand: "Lays", price: 20, unit: "52 g", image: "🍟", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 20, zepto: 20, instamart: 20 } },
  { id: 104, name: "Masala Munch", brand: "Kurkure", price: 20, unit: "90 g", image: "🌮", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 20, zepto: 20, instamart: 20 } },
  { id: 105, name: "Glucose Biscuits", brand: "Parle-G", price: 10, unit: "80 g", image: "🍪", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 10, zepto: 10, instamart: 10 } },
  { id: 106, name: "Cream Biscuits", brand: "Oreo", price: 30, unit: "120 g", image: "🍪", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 30, zepto: 30, instamart: 30 } },
  { id: 107, name: "Sour Cream & Onion", brand: "Pringles", price: 150, unit: "110 g", image: "🥫", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 145, zepto: 155, instamart: 150 } },
  { id: 108, name: "Nacho Cheese", brand: "Doritos", price: 60, unit: "72 g", image: "🌮", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 58, zepto: 62, instamart: 60 } },
  { id: 109, name: "Aloo Bhujia", brand: "Haldiram's", price: 40, unit: "200 g", image: "🥜", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },
  { id: 110, name: "Bourbon Biscuits", brand: "Britannia", price: 25, unit: "150 g", image: "🍪", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 24, zepto: 26, instamart: 25 } },
  { id: 111, name: "Salted Crackers", brand: "Monaco", price: 35, unit: "200 g", image: "🍘", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 33, zepto: 37, instamart: 35 } },
  { id: 112, name: "Butter Cookies", brand: "Britannia Good Day", price: 40, unit: "200 g", image: "🍪", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },
  { id: 113, name: "Choco Chip Cookies", brand: "Hide & Seek", price: 35, unit: "120 g", image: "🍪", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 33, zepto: 37, instamart: 35 } },
  { id: 114, name: "Instant Noodles", brand: "Maggi", price: 14, unit: "70 g", image: "🍜", categoryType: "Veg", mainCategory: "Snacks", platforms: { blinkit: 14, zepto: 14, instamart: 14 } },

  // Non-Veg (6 items) - With brand names
  { id: 115, name: "Chicken Breast", brand: "Licious", price: 350, unit: "500 g", image: "🍗", categoryType: "Non-Veg", mainCategory: "Non-Veg", platforms: { blinkit: 340, zepto: 360, instamart: 350 } },
  { id: 116, name: "Chicken Wings", brand: "FreshToHome", price: 280, unit: "500 g", image: "🍗", categoryType: "Non-Veg", mainCategory: "Non-Veg", platforms: { blinkit: 270, zepto: 290, instamart: 280 } },
  { id: 117, name: "Chicken Drumsticks", brand: "Licious", price: 300, unit: "500 g", image: "🍗", categoryType: "Non-Veg", mainCategory: "Non-Veg", platforms: { blinkit: 290, zepto: 310, instamart: 300 } },
  { id: 118, name: "Farm Fresh Eggs", brand: "Happy Hens", price: 80, unit: "12 pc", image: "🥚", categoryType: "Non-Veg", mainCategory: "Non-Veg", platforms: { blinkit: 78, zepto: 82, instamart: 80 } },
  { id: 119, name: "Egg White", brand: "Keggs", price: 120, unit: "500 ml", image: "🥚", categoryType: "Non-Veg", mainCategory: "Non-Veg", platforms: { blinkit: 115, zepto: 125, instamart: 120 } },
  { id: 120, name: "Whole Chicken", brand: "FreshToHome", price: 450, unit: "1 kg", image: "🍗", categoryType: "Non-Veg", mainCategory: "Non-Veg", platforms: { blinkit: 440, zepto: 460, instamart: 450 } },

  // Grocery (5 items) - With brand names
  { id: 121, name: "Basmati Rice", brand: "India Gate", price: 80, unit: "1 kg", image: "🍚", categoryType: "Veg", mainCategory: "Grocery", platforms: { blinkit: 78, zepto: 82, instamart: 80 } },
  { id: 122, name: "Whole Wheat Atta", brand: "Aashirvaad", price: 50, unit: "1 kg", image: "🌾", categoryType: "Veg", mainCategory: "Grocery", platforms: { blinkit: 48, zepto: 52, instamart: 50 } },
  { id: 123, name: "Sugar", brand: "Madhur", price: 45, unit: "1 kg", image: "🧂", categoryType: "Veg", mainCategory: "Grocery", platforms: { blinkit: 43, zepto: 47, instamart: 45 } },
  { id: 124, name: "Iodized Salt", brand: "Tata", price: 25, unit: "1 kg", image: "🧂", categoryType: "Veg", mainCategory: "Grocery", platforms: { blinkit: 24, zepto: 26, instamart: 25 } },
  { id: 125, name: "Refined Sunflower Oil", brand: "Fortune", price: 180, unit: "1 L", image: "🫒", categoryType: "Veg", mainCategory: "Grocery", platforms: { blinkit: 175, zepto: 185, instamart: 180 } },

  // Chocolates - Correct manufacturer brands (Cadbury / Nestlé only)
  { id: 126, name: "Dairy Milk", brand: "Cadbury", price: 40, unit: "50 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 40, zepto: 40, instamart: 40 } },
  { id: 127, name: "Silk", brand: "Cadbury", price: 90, unit: "60 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 88, zepto: 92, instamart: 90 } },
  { id: 128, name: "Dairy Milk Oreo", brand: "Cadbury", price: 80, unit: "60 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 78, zepto: 82, instamart: 80 } },
  { id: 129, name: "Fruit & Nut", brand: "Cadbury", price: 100, unit: "80 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 95, zepto: 105, instamart: 100 } },
  { id: 130, name: "Roast Almond", brand: "Cadbury", price: 110, unit: "80 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 105, zepto: 115, instamart: 110 } },
  { id: 131, name: "5 Star", brand: "Cadbury", price: 20, unit: "40 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 20, zepto: 20, instamart: 20 } },
  { id: 132, name: "Perk", brand: "Cadbury", price: 10, unit: "22 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 10, zepto: 10, instamart: 10 } },
  { id: 133, name: "KitKat", brand: "Nestlé", price: 40, unit: "37 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 38, zepto: 42, instamart: 40 } },
  { id: 134, name: "Munch", brand: "Nestlé", price: 10, unit: "23 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 10, zepto: 10, instamart: 10 } },
  { id: 135, name: "Milkybar", brand: "Nestlé", price: 20, unit: "25 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 18, zepto: 22, instamart: 20 } },
  { id: 136, name: "Bar One", brand: "Nestlé", price: 30, unit: "45 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 28, zepto: 32, instamart: 30 } },
  { id: 137, name: "Gems", brand: "Cadbury", price: 20, unit: "18 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 20, zepto: 20, instamart: 20 } },
  { id: 138, name: "Bournville", brand: "Cadbury", price: 150, unit: "80 g", image: "🍫", categoryType: "Veg", mainCategory: "Chocolates", platforms: { blinkit: 145, zepto: 155, instamart: 150 } },

  // Cakes - ONLY from Just Cakes
  { id: 139, name: "Black Forest Cake", brand: "Just Cakes", price: 500, unit: "500 g", image: "🎂", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 490, zepto: 510, instamart: 500 } },
  { id: 140, name: "Chocolate Truffle Cake", brand: "Just Cakes", price: 550, unit: "500 g", image: "🎂", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 540, zepto: 560, instamart: 550 } },
  { id: 141, name: "Red Velvet Cake", brand: "Just Cakes", price: 580, unit: "500 g", image: "🎂", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 570, zepto: 590, instamart: 580 } },
  { id: 142, name: "Butterscotch Cake", brand: "Just Cakes", price: 480, unit: "500 g", image: "🎂", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 470, zepto: 490, instamart: 480 } },
  { id: 143, name: "Pineapple Cake", brand: "Just Cakes", price: 450, unit: "500 g", image: "🎂", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 440, zepto: 460, instamart: 450 } },
  { id: 144, name: "Vanilla Cake", brand: "Just Cakes", price: 420, unit: "500 g", image: "🎂", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 410, zepto: 430, instamart: 420 } },
  { id: 145, name: "Strawberry Cake", brand: "Just Cakes", price: 520, unit: "500 g", image: "🎂", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 510, zepto: 530, instamart: 520 } },
  { id: 146, name: "Mango Cake", brand: "Just Cakes", price: 530, unit: "500 g", image: "🎂", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 520, zepto: 540, instamart: 530 } },
  { id: 147, name: "Cheesecake", brand: "Just Cakes", price: 600, unit: "500 g", image: "🧁", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 590, zepto: 610, instamart: 600 } },
  { id: 148, name: "Brownie Box", brand: "Just Cakes", price: 300, unit: "4 pc", image: "🍫", categoryType: "Veg", mainCategory: "Cakes", platforms: { blinkit: 290, zepto: 310, instamart: 300 } },
];

export type FilterCategory = 'All' | 'Veg' | 'Non-Veg' | 'Vegetables' | 'Fruits' | 'Dairy' | 'Snacks' | 'Chocolates' | 'Cakes' | 'Masala & Spices' | 'Grocery';

export const filterCategories: { id: FilterCategory; label: string; color: string }[] = [
  { id: 'All', label: 'All', color: 'bg-foreground text-background' },
  { id: 'Veg', label: 'Veg', color: 'bg-category-veg text-primary-foreground' },
  { id: 'Non-Veg', label: 'Non-Veg', color: 'bg-category-nonveg text-primary-foreground' },
  { id: 'Vegetables', label: 'Vegetables', color: 'bg-category-vegetables text-primary-foreground' },
  { id: 'Fruits', label: 'Fruits', color: 'bg-category-fruits text-primary-foreground' },
  { id: 'Dairy', label: 'Dairy', color: 'bg-category-dairy text-primary-foreground' },
  { id: 'Grocery', label: 'Grocery', color: 'bg-amber-700 text-primary-foreground' },
  { id: 'Masala & Spices', label: 'Masala & Spices', color: 'bg-red-600 text-primary-foreground' },
  { id: 'Snacks', label: 'Snacks', color: 'bg-category-snacks text-primary-foreground' },
  { id: 'Chocolates', label: 'Chocolates', color: 'bg-amber-600 text-primary-foreground' },
  { id: 'Cakes', label: 'Cakes', color: 'bg-pink-500 text-primary-foreground' },
];
