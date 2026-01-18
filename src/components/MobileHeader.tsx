import { MapPin, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MobileHeader() {
  const { selectedCity, setSelectedCity, cities } = useLocation();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const displayLocation = profile?.city || selectedCity;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - simplified for mobile */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">SmartBasket</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Compare & Save</p>
            </div>
          </Link>

          {/* Location Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-1.5 h-9 px-2 text-foreground"
              >
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium max-w-[100px] truncate">
                  {displayLocation}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-card border-border">
              {cities.map((city) => (
                <DropdownMenuItem
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`cursor-pointer min-h-[44px] ${selectedCity === city ? 'bg-primary/10 text-primary' : ''}`}
                >
                  {city}
                </DropdownMenuItem>
              ))}
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer text-primary min-h-[44px]"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Edit saved address
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
