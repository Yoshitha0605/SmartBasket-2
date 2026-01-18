import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { DeliverySavingsDisplay } from '@/components/DeliverySavingsDisplay';
import { SmartSuggestions } from '@/components/SmartSuggestions';

const FREE_DELIVERY_THRESHOLD = 200;
const BASE_DELIVERY_FEE = 25;

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  
  const qualifiesForFreeDelivery = totalPrice >= FREE_DELIVERY_THRESHOLD;
  const effectiveDeliveryFee = qualifiesForFreeDelivery ? 0 : BASE_DELIVERY_FEE;
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <ShoppingCart className="h-7 w-7" />
          Your Cart ({totalItems} items)
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ShoppingCart className="h-20 w-20 mb-6 opacity-50" />
            <p className="text-xl font-medium mb-2">Your cart is empty</p>
            <p className="text-sm mb-6">Search for items to add to your cart</p>
            <Button onClick={() => navigate('/home')} className="rounded-xl">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft"
                >
                  <div className="text-5xl">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.unit}</p>
                    <p className="text-sm text-primary mt-1">
                      ₹{item.platformPrice} from {item.platformName}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-xl font-bold text-primary">₹{item.platformPrice * item.quantity}</p>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-9 w-9 rounded-lg"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold text-foreground text-lg">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-9 w-9 rounded-lg"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-9 w-9 text-destructive hover:bg-destructive/10 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              {/* Smart Suggestions */}
              {items.length > 0 && (
                <SmartSuggestions
                  cartProductNames={items.map(item => item.name)}
                  className="mb-6"
                />
              )}
              
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
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-foreground">₹{totalPrice + effectiveDeliveryFee}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {!user && (
                    <div className="bg-muted/50 rounded-xl p-4 mb-2">
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        Please login to proceed with checkout
                      </p>
                      <Button 
                        onClick={() => navigate('/auth')}
                        variant="outline"
                        className="w-full rounded-xl h-10"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login to Continue
                      </Button>
                    </div>
                  )}
                  <Button 
                    onClick={() => navigate('/checkout')}
                    disabled={!user}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold disabled:opacity-50"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full rounded-xl h-12"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
