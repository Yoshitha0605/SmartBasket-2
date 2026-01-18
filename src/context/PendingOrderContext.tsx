import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CartItem } from './CartContext';

export interface PendingOrder {
  id: string;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: string;
  deliveryCity: string;
  deliveryPinCode: string;
  deliveryAddress: string;
  platformName: string;
  createdAt: Date;
  deliveryMinutes: number;
}

interface PendingOrderContextType {
  pendingOrder: PendingOrder | null;
  setPendingOrder: (order: PendingOrder | null) => void;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
}

const PendingOrderContext = createContext<PendingOrderContextType | undefined>(undefined);

export function PendingOrderProvider({ children }: { children: ReactNode }) {
  const [pendingOrder, setPendingOrderState] = useState<PendingOrder | null>(() => {
    const stored = localStorage.getItem('pendingOrder');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...parsed, createdAt: new Date(parsed.createdAt) };
      } catch {
        return null;
      }
    }
    return null;
  });
  
  const [showConfirmation, setShowConfirmation] = useState(false);

  const setPendingOrder = useCallback((order: PendingOrder | null) => {
    setPendingOrderState(order);
    if (order) {
      localStorage.setItem('pendingOrder', JSON.stringify(order));
    } else {
      localStorage.removeItem('pendingOrder');
    }
  }, []);

  // Check for pending order when user returns
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pendingOrder) {
        setShowConfirmation(true);
      }
    };

    const handleFocus = () => {
      if (pendingOrder) {
        setShowConfirmation(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Check on mount if there's a pending order
    if (pendingOrder) {
      // Small delay to ensure proper rendering
      const timer = setTimeout(() => setShowConfirmation(true), 500);
      return () => clearTimeout(timer);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [pendingOrder]);

  return (
    <PendingOrderContext.Provider
      value={{
        pendingOrder,
        setPendingOrder,
        showConfirmation,
        setShowConfirmation,
      }}
    >
      {children}
    </PendingOrderContext.Provider>
  );
}

export function usePendingOrder() {
  const context = useContext(PendingOrderContext);
  if (!context) {
    throw new Error('usePendingOrder must be used within a PendingOrderProvider');
  }
  return context;
}
