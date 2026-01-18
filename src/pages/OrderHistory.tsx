import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useDbOrders } from '@/hooks/useOrders';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-500 text-white';
    case 'Out for Delivery':
      return 'bg-blue-500 text-white';
    case 'Confirmed':
      return 'bg-yellow-500 text-white';
    case 'Cancelled':
      return 'bg-red-500 text-white';
    default:
      return 'bg-primary/10 text-primary';
  }
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders, loading } = useDbOrders();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Package className="h-7 w-7 text-primary" />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Package className="h-20 w-20 mb-6 opacity-50" />
            <p className="text-xl font-medium mb-2 text-foreground">No orders yet</p>
            <p className="text-sm mb-6">Your order history will appear here</p>
            <Button onClick={() => navigate('/home')} className="rounded-xl">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-card rounded-2xl p-5 shadow-soft cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-foreground text-lg">
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(order.created_at), 'MMM dd, yyyy • hh:mm a')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{order.grand_total}</p>
                      <Badge className={cn('mt-1', getStatusColor(order.status))}>
                        {order.status}
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex flex-wrap gap-3">
                    {order.items.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                        <span className="text-2xl">{item.product_image || '📦'}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <div className="flex items-center justify-center bg-muted/50 rounded-lg px-4 py-2">
                        <p className="text-sm text-muted-foreground">+{order.items.length - 5} more</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {order.delivery_city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{order.delivery_city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>{order.payment_method}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
