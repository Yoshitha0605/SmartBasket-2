import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShoppingBag, CheckCircle, CreditCard, Smartphone, Banknote, Building2, Clock, ExternalLink } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { usePendingOrder, PendingOrder } from '@/context/PendingOrderContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { PLATFORM_REDIRECT_URLS } from '@/data/quantityOptions';
import { DeliverySavingsDisplay } from '@/components/DeliverySavingsDisplay';

const BASE_DELIVERY_FEE = 25;
const FREE_DELIVERY_THRESHOLD = 200;

type PaymentMethod = 'upi' | 'card' | 'cod' | 'netbanking';

const paymentMethods = [
  { id: 'upi' as PaymentMethod, name: 'UPI', description: 'Pay using any UPI app', icon: Smartphone },
  { id: 'card' as PaymentMethod, name: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'cod' as PaymentMethod, name: 'Cash on Delivery', description: 'Pay when you receive', icon: Banknote },
  { id: 'netbanking' as PaymentMethod, name: 'Net Banking', description: 'All major banks supported', icon: Building2 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice } = useCart();
  const { selectedCity } = useLocation();
  const { user, profile, loading: authLoading } = useAuth();
  const { setPendingOrder } = usePendingOrder();
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setAddress(profile.address || '');
      setPinCode(profile.pin_code || '');
      setCity(profile.city || selectedCity);
    } else {
      setCity(selectedCity);
    }
  }, [profile, selectedCity]);

  const qualifiesForFreeDelivery = totalPrice >= FREE_DELIVERY_THRESHOLD;
  const effectiveDeliveryFee = qualifiesForFreeDelivery ? 0 : BASE_DELIVERY_FEE;
  const grandTotal = totalPrice + effectiveDeliveryFee;

  // Check if all items have a platform selected
  const allItemsHavePlatform = items.every(item => item.platformName && PLATFORM_REDIRECT_URLS[item.platformName]);

  // Get the primary platform (most items from)
  const getPrimaryPlatform = () => {
    const platformCounts: Record<string, number> = {};
    items.forEach(item => {
      platformCounts[item.platformName] = (platformCounts[item.platformName] || 0) + item.quantity;
    });
    return Object.entries(platformCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  const openPlatformWebsite = () => {
    const primaryPlatform = getPrimaryPlatform();
    const url = PLATFORM_REDIRECT_URLS[primaryPlatform];
    
    if (url) {
      const newWindow = window.open(url, '_blank');
      return newWindow !== null;
    }
    return false;
  };

  // Get estimated delivery time based on platform
  const getDeliveryMinutes = () => {
    const primaryPlatform = getPrimaryPlatform();
    const deliveryTimes: Record<string, number> = {
      'Blinkit': 10,
      'Zepto': 8,
      'Instamart': 15,
      'BigBasket': 30,
      'JioMart': 45,
    };
    return deliveryTimes[primaryPlatform] || 30;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!allItemsHavePlatform) {
      toast({
        title: "Platform Required",
        description: "Please select a platform for all items.",
        variant: "destructive",
      });
      return;
    }

    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);

    const paymentMethodName = paymentMethods.find(p => p.id === selectedPayment)?.name || 'UPI';
    const primaryPlatform = getPrimaryPlatform();
    const deliveryMinutes = getDeliveryMinutes();

    // Create pending order (will be confirmed when user returns)
    const pendingOrder: PendingOrder = {
      id: crypto.randomUUID(),
      items: [...items],
      totalPrice,
      deliveryFee: effectiveDeliveryFee,
      grandTotal,
      paymentMethod: paymentMethodName,
      deliveryCity: city,
      deliveryPinCode: pinCode,
      deliveryAddress: address,
      platformName: primaryPlatform,
      createdAt: new Date(),
      deliveryMinutes,
    };

    // Store pending order
    setPendingOrder(pendingOrder);

    // Open platform website
    const opened = openPlatformWebsite();
    
    setIsPlacingOrder(false);

    if (!opened) {
      toast({
        title: "Unable to open website",
        description: "Please try again or check your popup blocker settings.",
        variant: "destructive",
      });
      setPendingOrder(null);
      return;
    }

    toast({
      title: "Redirecting to " + primaryPlatform,
      description: "Complete your purchase there. When you return, confirm if you placed the order.",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ShoppingBag className="h-20 w-20 mb-6 opacity-50" />
            <p className="text-xl font-medium mb-2 text-foreground">You don't have any items in your cart yet.</p>
            <p className="text-sm mb-6">Add some items to proceed to checkout</p>
            <Button onClick={() => navigate('/home')} className="rounded-xl">
              Start Shopping
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const primaryPlatform = getPrimaryPlatform();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <CheckCircle className="h-7 w-7 text-primary" />
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address */}
            <div className="bg-card rounded-2xl p-5 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">City</label>
                    <Input
                      type="text"
                      placeholder="Enter city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-12 bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">PIN Code</label>
                    <Input
                      type="text"
                      placeholder="Enter PIN code"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="h-12 bg-background border-border"
                      maxLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Address *</label>
                  <Input
                    type="text"
                    placeholder="Enter your complete delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 bg-background border-border"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="bg-card rounded-2xl p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {getDeliveryMinutes()} minutes via {primaryPlatform}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div className="bg-card rounded-2xl p-5 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Order Items ({totalItems})
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedQuantityOption}`}
                    className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                  >
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.selectedQuantityOption || item.unit}</p>
                      <p className="text-xs text-primary">from {item.platformName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                      <p className="font-semibold text-foreground">₹{item.platformPrice * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-card rounded-2xl p-5 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {method.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary' : 'border-muted-foreground'
                      }`}>
                        {isSelected && <div className="h-3 w-3 rounded-full bg-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
              
              {/* Delivery Savings Display */}
              <DeliverySavingsDisplay
                cartTotal={totalPrice}
                freeDeliveryThreshold={FREE_DELIVERY_THRESHOLD}
                baseDeliveryFee={BASE_DELIVERY_FEE}
                className="mb-4"
              />
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  {qualifiesForFreeDelivery ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">FREE</span>
                  ) : (
                    <span>₹{BASE_DELIVERY_FEE}</span>
                  )}
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Grand Total</span>
                    <span className="text-2xl font-bold text-primary">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Delivering to</p>
                    <p className="text-sm text-muted-foreground">
                      {address || city || 'Enter your address'}
                    </p>
                  </div>
                </div>
              </div>

              {!allItemsHavePlatform && (
                <p className="text-sm text-destructive text-center mb-3 font-medium">
                  Please select a platform for all items.
                </p>
              )}

              <Button 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !address.trim() || !allItemsHavePlatform}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold"
              >
                {isPlacingOrder ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Place Order via {primaryPlatform}
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-3">
                You'll be redirected to {primaryPlatform}. Confirm your order when you return.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
