import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle2, Truck, Home, Clock, MapPin, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { OrderStatusTimeline } from '@/components/OrderStatusTimeline';
import { useDbOrders } from '@/hooks/useOrders';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface OrderItem {
  id: string;
  product_id: number;
  product_name: string;
  product_image: string | null;
  platform_name: string;
  platform_price: number;
  platform_delivery_fee: number;
  quantity: number;
}

interface Order {
  id: string;
  total_price: number;
  delivery_fee: number;
  grand_total: number;
  payment_method: string;
  delivery_city: string | null;
  delivery_pin_code: string | null;
  delivery_address: string | null;
  status: string;
  delivery_estimate: string | null;
  delivery_minutes: number | null;
  created_at: string;
}

const ORDER_STATUSES = ['Placed', 'Confirmed', 'Out for Delivery', 'Delivered'];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Placed':
      return Package;
    case 'Confirmed':
      return CheckCircle2;
    case 'Out for Delivery':
      return Truck;
    case 'Delivered':
      return Home;
    case 'Delayed':
      return AlertTriangle;
    case 'Cancelled':
      return XCircle;
    default:
      return Package;
  }
};

// Simulated driver positions (from store to customer)
const DRIVER_POSITIONS = [
  { lat: 12.9716, lng: 77.5946, label: 'Store' },
  { lat: 12.9750, lng: 77.5980, label: 'Picked Up' },
  { lat: 12.9780, lng: 77.6010, label: 'On Route' },
  { lat: 12.9810, lng: 77.6040, label: 'Nearby' },
  { lat: 12.9840, lng: 77.6070, label: 'Arriving' },
  { lat: 12.9870, lng: 77.6100, label: 'Delivered' },
];

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { cancelOrder } = useDbOrders();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [driverPosition, setDriverPosition] = useState(0);
  const [lastNotifiedStatus, setLastNotifiedStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user, authLoading, navigate]);

  // Update current time every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate driver movement every 10-15 seconds
  useEffect(() => {
    if (!order || order.status === 'Delivered') return;

    const interval = setInterval(() => {
      setDriverPosition(prev => {
        if (prev < DRIVER_POSITIONS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 12000); // 12 seconds

    return () => clearInterval(interval);
  }, [order]);

  const fetchOrder = async () => {
    if (!orderId) return;

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (orderError || !orderData) {
      if (import.meta.env.DEV) {
        console.error('Error fetching order:', orderError);
      }
      navigate('/orders');
      return;
    }

    setOrder(orderData);

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (!itemsError && itemsData) {
      setItems(itemsData);
    }

    setLoading(false);
  };

  // Calculate dynamic status based on time
  const dynamicStatus = useMemo(() => {
    if (!order) return 'Placed';
    
    // If order is cancelled, show cancelled status
    if (order.status === 'Cancelled') return 'Cancelled';

    const orderTime = new Date(order.created_at);
    const deliveryMinutes = order.delivery_minutes || 30;
    const expectedDeliveryTime = new Date(orderTime.getTime() + deliveryMinutes * 60 * 1000);
    const elapsedMinutes = (currentTime.getTime() - orderTime.getTime()) / (60 * 1000);
    const remainingMinutes = (expectedDeliveryTime.getTime() - currentTime.getTime()) / (60 * 1000);

    if (currentTime >= expectedDeliveryTime) {
      // Check if delayed (more than 5 minutes past expected)
      if (remainingMinutes < -5) {
        return 'Delayed';
      }
      return 'Delivered';
    }

    if (remainingMinutes <= 20 && remainingMinutes > 0) {
      return 'Out for Delivery';
    }

    if (elapsedMinutes >= 2) {
      return 'Confirmed';
    }

    return 'Placed';
  }, [order, currentTime]);

  // Calculate remaining cancellation time (5 minute window)
  const cancellationTimeRemaining = useMemo(() => {
    if (!order) return { canCancel: false, minutes: 0, seconds: 0 };
    
    if (order.status === 'Cancelled' || order.status === 'Delivered') {
      return { canCancel: false, minutes: 0, seconds: 0 };
    }

    const orderTime = new Date(order.created_at);
    const cancellationDeadline = new Date(orderTime.getTime() + 5 * 60 * 1000); // 5 minutes
    const remainingMs = Math.max(0, cancellationDeadline.getTime() - currentTime.getTime());
    
    return {
      canCancel: remainingMs > 0,
      minutes: Math.floor(remainingMs / (60 * 1000)),
      seconds: Math.floor((remainingMs % (60 * 1000)) / 1000),
    };
  }, [order, currentTime]);

  const handleCancelOrder = async () => {
    if (!orderId) return;
    
    setCancelling(true);
    const { error, success } = await cancelOrder(orderId);
    setCancelling(false);

    if (success) {
      toast({
        title: 'Order Cancelled',
        description: 'Your order has been cancelled successfully.',
      });
      // Refetch order to update UI
      fetchOrder();
    } else {
      toast({
        title: 'Cancellation Failed',
        description: error?.message || 'Unable to cancel order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Calculate remaining time
  const remainingTime = useMemo(() => {
    if (!order) return { minutes: 0, seconds: 0 };

    const orderTime = new Date(order.created_at);
    const deliveryMinutes = order.delivery_minutes || 30;
    const expectedDeliveryTime = new Date(orderTime.getTime() + deliveryMinutes * 60 * 1000);
    const remainingMs = Math.max(0, expectedDeliveryTime.getTime() - currentTime.getTime());
    
    return {
      minutes: Math.floor(remainingMs / (60 * 1000)),
      seconds: Math.floor((remainingMs % (60 * 1000)) / 1000),
    };
  }, [order, currentTime]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!order) return 0;

    const orderTime = new Date(order.created_at);
    const deliveryMinutes = order.delivery_minutes || 30;
    const totalDuration = deliveryMinutes * 60 * 1000;
    const elapsed = currentTime.getTime() - orderTime.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }, [order, currentTime]);

  // Show notifications for status changes and send email for 'Out for Delivery'
  useEffect(() => {
    if (dynamicStatus && dynamicStatus !== lastNotifiedStatus) {
      const messages: Record<string, { title: string; description: string }> = {
        'Confirmed': { title: 'Order Confirmed', description: 'Your order has been confirmed and is being prepared!' },
        'Out for Delivery': { title: 'Out for Delivery', description: 'Your order is on the way!' },
        'Delivered': { title: 'Delivered!', description: 'Enjoy your order!' },
        'Delayed': { title: 'Delivery Delayed', description: 'Your delivery is taking longer than expected. Please wait.' },
      };

      if (messages[dynamicStatus] && lastNotifiedStatus !== null) {
        toast(messages[dynamicStatus]);
      }

      // Send email notification for 'Out for Delivery' status
      if (dynamicStatus === 'Out for Delivery' && lastNotifiedStatus !== null && user && order) {
        const sendStatusNotification = async () => {
          try {
            await supabase.functions.invoke('send-order-status-email', {
              body: {
                orderId: order.id,
                userPhone: profile?.phone || user.user_metadata?.phone,
                userName: profile?.name || user.user_metadata?.name || profile?.phone || user.user_metadata?.phone,
                status: 'Out for Delivery',
                grandTotal: order.grand_total,
                deliveryAddress: order.delivery_address,
                deliveryCity: order.delivery_city,
                deliveryEstimate: order.delivery_estimate,
                items: items.map(item => ({
                  productName: item.product_name,
                  platformName: item.platform_name,
                  quantity: item.quantity,
                })),
              },
            });
          } catch (emailError) {
            if (import.meta.env.DEV) {
              console.error('Error sending status email:', emailError);
            }
          }
        };
        sendStatusNotification();
      }

      setLastNotifiedStatus(dynamicStatus);
    }
  }, [dynamicStatus, lastNotifiedStatus, user, order, items]);

  const currentStatusIndex = dynamicStatus === 'Delayed' 
    ? ORDER_STATUSES.indexOf('Out for Delivery') 
    : ORDER_STATUSES.indexOf(dynamicStatus);

  const getProgressColor = () => {
    if (dynamicStatus === 'Delayed') return 'bg-amber-500';
    if (progressPercentage > 80) return 'bg-green-500';
    if (progressPercentage > 50) return 'bg-primary';
    return 'bg-primary';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/orders')}
              className="rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Order Tracking</h1>
              <p className="text-sm text-muted-foreground">
                {order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Cancelled Order Banner */}
        {dynamicStatus === 'Cancelled' && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="py-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Order Cancelled</h3>
                <p className="text-sm text-red-600 dark:text-red-300">This order has been cancelled.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Countdown */}
        {dynamicStatus !== 'Delivered' && dynamicStatus !== 'Cancelled' && (
          <Card className="mb-6 border-border bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Delivery in</p>
                <div className="text-5xl font-bold text-primary mb-4 font-mono">
                  {String(remainingTime.minutes).padStart(2, '0')}:
                  {String(remainingTime.seconds).padStart(2, '0')}
                </div>
                <p className="text-sm text-muted-foreground">minutes remaining</p>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="mt-6">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-1000 rounded-full',
                      getProgressColor()
                    )}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Order Placed</span>
                  <span>{Math.round(progressPercentage)}%</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* Cancel Order Button */}
              {cancellationTimeRemaining.canCancel && (
                <div className="mt-6 pt-4 border-t border-border">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        disabled={cancelling}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Order ({cancellationTimeRemaining.minutes}:{String(cancellationTimeRemaining.seconds).padStart(2, '0')} left)
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this order? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Order</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleCancelOrder}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Status Timeline */}
        <Card className="mb-6 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Status</span>
              <Badge
                variant={dynamicStatus === 'Delivered' ? 'default' : 'secondary'}
                className={cn(
                  dynamicStatus === 'Delivered' && 'bg-green-500 text-white',
                  dynamicStatus === 'Delayed' && 'bg-amber-500 text-white',
                  dynamicStatus === 'Cancelled' && 'bg-red-500 text-white',
                  dynamicStatus !== 'Delivered' && dynamicStatus !== 'Delayed' && dynamicStatus !== 'Cancelled' && 'bg-primary/10 text-primary'
                )}
              >
                {dynamicStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusTimeline currentStatus={dynamicStatus} />
          </CardContent>
        </Card>

        {/* Driver Location Map (Simulated) */}
        {dynamicStatus !== 'Delivered' && dynamicStatus !== 'Placed' && (
          <Card className="mb-6 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Driver Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simulated Map */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl overflow-hidden">
                {/* Road lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-1 bg-muted-foreground/30 relative">
                    {/* Driver marker */}
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000"
                      style={{ left: `${(driverPosition / (DRIVER_POSITIONS.length - 1)) * 100}%` }}
                    >
                      <div className="relative">
                        <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <Truck className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <span className="text-xs font-medium bg-background px-2 py-1 rounded shadow">
                            {DRIVER_POSITIONS[driverPosition].label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Start marker */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <div className="h-4 w-4 bg-muted-foreground rounded-full" />
                    </div>
                    
                    {/* End marker (destination) */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                      <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Home className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Driver is at: {DRIVER_POSITIONS[driverPosition].label}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Items */}
        <Card className="mb-6 border-border bg-card">
          <CardHeader>
            <CardTitle>Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-background"
              >
                <div className="text-3xl">{item.product_image || '📦'}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{item.product_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    via {item.platform_name} • Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">
                    ₹{(item.platform_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delivery Address */}
        {(order.delivery_city || order.delivery_address) && (
          <Card className="mb-6 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                {order.delivery_address}
                {order.delivery_city && `, ${order.delivery_city}`}
                {order.delivery_pin_code && ` - ${order.delivery_pin_code}`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{order.total_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>₹{order.delivery_fee.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span>₹{order.grand_total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Paid via {order.payment_method}
            </div>
            <div className="text-sm text-muted-foreground">
              Ordered on {new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderTracking;
