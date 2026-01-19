import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface DbOrder {
  id: string;
  user_id: string;
  total_price: number;
  delivery_fee: number;
  grand_total: number;
  payment_method: string;
  delivery_city: string | null;
  delivery_pin_code: string | null;
  delivery_address: string | null;
  status: string;
  delivery_estimate: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  product_image: string | null;
  platform_name: string;
  platform_price: number;
  platform_delivery_fee: number;
  quantity: number;
  created_at: string;
}

export interface OrderWithItems extends DbOrder {
  items: DbOrderItem[];
}

export function useDbOrders() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      if (import.meta.env.DEV) {
        console.error('Error fetching orders:', ordersError);
      }
      setLoading(false);
      return;
    }

    // Fetch items for all orders
    const ordersWithItems: OrderWithItems[] = [];

    for (const order of ordersData || []) {
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      ordersWithItems.push({
        ...order,
        items: itemsData || [],
      });
    }

    setOrders(ordersWithItems);
    setLoading(false);
  };

  const createOrder = async (orderData: {
    totalPrice: number;
    deliveryFee: number;
    grandTotal: number;
    paymentMethod: string;
    deliveryCity?: string;
    deliveryPinCode?: string;
    deliveryAddress?: string;
    deliveryEstimate?: string;
    deliveryMinutes?: number;
    items: Array<{
      productId: number;
      productName: string;
      productImage?: string;
      platformName: string;
      platformPrice: number;
      platformDeliveryFee: number;
      quantity: number;
    }>;
  }) => {
    if (!user) {
      return { error: new Error('Not authenticated'), orderId: null };
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_price: orderData.totalPrice,
        delivery_fee: orderData.deliveryFee,
        grand_total: orderData.grandTotal,
        payment_method: orderData.paymentMethod,
        delivery_city: orderData.deliveryCity,
        delivery_pin_code: orderData.deliveryPinCode,
        delivery_address: orderData.deliveryAddress,
        delivery_estimate: orderData.deliveryEstimate,
        delivery_minutes: orderData.deliveryMinutes || 30,
        status: 'Placed',
      })
      .select()
      .single();

    if (orderError || !order) {
      if (import.meta.env.DEV) {
        console.error('Error creating order:', orderError);
      }
      return { error: orderError, orderId: null };
    }

    // Create order items with user_id for direct RLS checks
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      user_id: user.id,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      platform_name: item.platformName,
      platform_price: item.platformPrice,
      platform_delivery_fee: item.platformDeliveryFee,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      if (import.meta.env.DEV) {
        console.error('Error creating order items:', itemsError);
      }
    }

    // Send confirmation notification (fire and forget)
    try {
      await supabase.functions.invoke('send-order-confirmation-email', {
        body: {
          orderId: order.id,
          userPhone: profile?.phone || user.user_metadata?.phone,
          userName: profile?.name || user.user_metadata?.name || profile?.phone || user.user_metadata?.phone,
          totalPrice: orderData.totalPrice,
          deliveryFee: orderData.deliveryFee,
          grandTotal: orderData.grandTotal,
          paymentMethod: orderData.paymentMethod,
          deliveryAddress: orderData.deliveryAddress,
          deliveryCity: orderData.deliveryCity,
          deliveryEstimate: orderData.deliveryEstimate,
          items: orderData.items.map(item => ({
            productName: item.productName,
            platformName: item.platformName,
            platformPrice: item.platformPrice,
            quantity: item.quantity,
          })),
          createdAt: order.created_at,
        },
      });
    } catch (emailError) {
      // Don't fail the order if email fails
      if (import.meta.env.DEV) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    // Refresh orders list
    await fetchOrders();

    return { error: null, orderId: order.id };
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) {
      return { error: new Error('Not authenticated'), success: false };
    }

    // First check if order can be cancelled (within 5 minute window)
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('created_at, status, grand_total, payment_method')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError || !order) {
      return { error: fetchError || new Error('Order not found'), success: false };
    }

    // Check if order is already delivered or cancelled
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return { error: new Error(`Cannot cancel ${order.status.toLowerCase()} order`), success: false };
    }

    // Check time window (5 minutes)
    const orderTime = new Date(order.created_at);
    const now = new Date();
    const minutesSinceOrder = (now.getTime() - orderTime.getTime()) / (60 * 1000);
    
    if (minutesSinceOrder > 5) {
      return { error: new Error('Cancellation window expired (5 minutes)'), success: false };
    }

    // Update order status to Cancelled
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'Cancelled', updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .eq('user_id', user.id);

    if (updateError) {
      if (import.meta.env.DEV) {
        console.error('Error cancelling order:', updateError);
      }
      return { error: updateError, success: false };
    }

    // Send cancellation notification (fire and forget)
    try {
      await supabase.functions.invoke('send-order-cancellation-email', {
        body: {
          orderId,
          userPhone: profile?.phone || user.user_metadata?.phone,
          userName: profile?.name || user.user_metadata?.name || profile?.phone || user.user_metadata?.phone,
          grandTotal: order.grand_total,
          paymentMethod: order.payment_method,
          cancelledAt: new Date().toISOString(),
        },
      });
    } catch (emailError) {
      // Don't fail the cancellation if email fails
      if (import.meta.env.DEV) {
        console.error('Error sending cancellation email:', emailError);
      }
    }

    // Refresh orders list
    await fetchOrders();

    return { error: null, success: true };
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    createOrder,
    cancelOrder,
    refreshOrders: fetchOrders,
  };
}
