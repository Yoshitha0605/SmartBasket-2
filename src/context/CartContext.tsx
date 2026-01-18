import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface CartItem extends Product {
  quantity: number;
  platformName: string;
  platformPrice: number;
  platformDeliveryFee: number;
  selectedQuantityOption: string;
  basePrice: number; // Price for the selected quantity option
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product, 
    platformName: string, 
    platformPrice: number, 
    platformDeliveryFee: number,
    selectedQuantityOption: string
  ) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product, 
    platformName: string, 
    platformPrice: number, 
    platformDeliveryFee: number,
    selectedQuantityOption: string
  ) => {
    setItems((prev) => {
      // Check if same product with same platform and quantity option exists
      const existing = prev.find(
        (item) => 
          item.id === product.id && 
          item.platformName === platformName && 
          item.selectedQuantityOption === selectedQuantityOption
      );
      
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && 
          item.platformName === platformName && 
          item.selectedQuantityOption === selectedQuantityOption
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { 
        ...product, 
        quantity: 1, 
        platformName, 
        platformPrice, 
        platformDeliveryFee,
        selectedQuantityOption,
        basePrice: platformPrice
      }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.platformPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
