import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CartSheet() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 w-12 shadow-glow"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold border-2 border-background">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-background border-border">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({totalItems} items)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Add items to get started</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-280px)] mt-4">
              <div className="space-y-4 pr-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-card rounded-xl shadow-soft"
                  >
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.unit}</p>
                      <p className="text-sm font-bold text-primary">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-lg"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-lg"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">₹{totalPrice}</span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1 rounded-xl h-12"
                >
                  Clear Cart
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold">
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
