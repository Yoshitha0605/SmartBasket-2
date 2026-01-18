import { Home, Search, ShoppingCart, Package, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

export function BottomNavigation() {
  const location = useLocation();
  const { totalItems } = useCart();

  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Search', path: '/home?search=true' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: totalItems },
    { icon: Package, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/home?search=true') {
      return location.pathname === '/home' && location.search.includes('search=true');
    }
    return location.pathname === path;
  };

  // Don't show on splash, auth, or checkout
  const hiddenRoutes = ['/', '/auth', '/checkout'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full relative transition-colors touch-manipulation',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-6 w-6', active && 'scale-110')} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground h-5 w-5 flex items-center justify-center rounded-full text-xs font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn('text-xs mt-1 font-medium', active && 'font-semibold')}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
