import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex flex-col items-center justify-center">
      <div className="animate-scale-in">
        <div className="h-28 w-28 bg-background rounded-3xl flex items-center justify-center shadow-2xl mb-8">
          <ShoppingBasket className="h-16 w-16 text-primary" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-primary-foreground mb-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
        SmartBasket
      </h1>
      
      <p className="text-primary-foreground/80 text-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
        Smart Grocery Comparison
      </p>
      
      <div className="mt-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <div className="w-8 h-8 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Splash;
