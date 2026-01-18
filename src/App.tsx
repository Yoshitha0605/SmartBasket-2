import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import { PendingOrderProvider } from "@/context/PendingOrderContext";
import { OrderConfirmationDialog } from "@/components/OrderConfirmationDialog";
import { BottomNavigation } from "@/components/BottomNavigation";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import ItemDetails from "./pages/ItemDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderTracking from "./pages/OrderTracking";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// App component with all providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <PendingOrderProvider>
            <LocationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Splash />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/item/:itemId" element={<ItemDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/orders/:orderId" element={<OrderTracking />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BottomNavigation />
                  <OrderConfirmationDialog />
                </BrowserRouter>
              </TooltipProvider>
            </LocationProvider>
          </PendingOrderProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
