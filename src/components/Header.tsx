import { ShoppingCart, MapPin, ChevronDown, Package, User, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { totalItems } = useCart();
  const { selectedCity, setSelectedCity, cities } = useLocation();
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.name || user?.user_metadata?.name || 'User';
  const displayLocation = profile?.city || selectedCity;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SmartBasket</h1>
              <p className="text-xs text-muted-foreground">Compare & Save</p>
            </div>
          </Link>

          {/* Location Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-xl h-10 px-3 bg-card border-border">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                  {displayLocation}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-40 bg-card border-border">
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`cursor-pointer ${selectedCity === city ? 'bg-primary/10 text-primary' : ''}`}
                >
                  {city}
                </DropdownMenuItem>
              ))}
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer text-primary"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Edit saved address
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Orders Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/orders')}
              className="rounded-xl h-12 w-12 border-border bg-card"
            >
              <Package className="h-5 w-5 text-foreground" />
            </Button>

            {/* Auth/Profile Button */}
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-xl h-12 px-3 border-border bg-card flex items-center gap-2"
                    >
                      <div className="h-7 w-7 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground max-w-[80px] truncate hidden sm:inline">
                        {displayName}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:inline" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                    <DropdownMenuItem
                      onClick={() => navigate('/profile')}
                      className="cursor-pointer"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate('/orders')}
                      className="cursor-pointer"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer text-destructive"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="rounded-xl h-12 px-4 border-border bg-card flex items-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              )
            )}

            {/* Cart Button */}
            <Button
              size="icon"
              onClick={() => navigate('/cart')}
              className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 w-12 shadow-glow"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold border-2 border-background">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
