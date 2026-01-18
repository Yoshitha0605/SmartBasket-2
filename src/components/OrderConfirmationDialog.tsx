import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePendingOrder } from '@/context/PendingOrderContext';
import { useCart } from '@/context/CartContext';
import { useDbOrders } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export function OrderConfirmationDialog() {
  const navigate = useNavigate();
  const { pendingOrder, setPendingOrder, showConfirmation, setShowConfirmation } = usePendingOrder();
  const { clearCart } = useCart();
  const { createOrder } = useDbOrders();

  const handleConfirmOrder = async () => {
    if (!pendingOrder) return;

    const { error, orderId } = await createOrder({
      totalPrice: pendingOrder.totalPrice,
      deliveryFee: pendingOrder.deliveryFee,
      grandTotal: pendingOrder.grandTotal,
      paymentMethod: pendingOrder.paymentMethod,
      deliveryCity: pendingOrder.deliveryCity,
      deliveryPinCode: pendingOrder.deliveryPinCode,
      deliveryAddress: pendingOrder.deliveryAddress,
      deliveryEstimate: `${pendingOrder.deliveryMinutes} minutes`,
      deliveryMinutes: pendingOrder.deliveryMinutes,
      items: pendingOrder.items.map(item => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        platformName: item.platformName,
        platformPrice: item.platformPrice,
        platformDeliveryFee: item.platformDeliveryFee,
        quantity: item.quantity,
      })),
    });

    if (error) {
      toast({
        title: 'Failed to save order',
        description: 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    clearCart();
    setPendingOrder(null);
    setShowConfirmation(false);

    toast({
      title: 'Order Confirmed!',
      description: 'Your order has been placed successfully. Tracking started.',
    });

    navigate(`/orders/${orderId}`);
  };

  const handleCancelOrder = () => {
    setPendingOrder(null);
    setShowConfirmation(false);
    
    toast({
      title: 'Order Cancelled',
      description: 'Your order was not placed.',
    });
  };

  if (!pendingOrder) return null;

  return (
    <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl flex items-center gap-2">
            Did you complete the order?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            You were redirected to <span className="font-semibold text-primary">{pendingOrder.platformName}</span> to complete your purchase.
            <br /><br />
            If you completed the order on their website, click <strong>Yes</strong> to start tracking.
            <br /><br />
            If you didn't complete it, click <strong>No</strong> to cancel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={handleCancelOrder}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            No, Cancel Order
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmOrder}
            className="bg-primary text-primary-foreground flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Yes, Start Tracking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
