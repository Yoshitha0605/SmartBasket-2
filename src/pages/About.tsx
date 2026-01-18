import { ArrowLeft, ShoppingCart, Search, BarChart3, MapPin, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Smart Search',
      description: 'Search for any grocery item and find it across all major platforms instantly.'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Price Comparison',
      description: 'Compare prices from Blinkit, Zepto, Instamart, BigBasket, and JioMart side by side.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Delivery Time',
      description: 'See estimated delivery times for each platform to make informed decisions.'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Location Based',
      description: 'Get accurate prices and availability based on your city.'
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: 'Smart Cart',
      description: 'Add items to your cart and see the total savings across platforms.'
    },
  ];

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

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-primary rounded-2xl mb-6 shadow-glow">
            <ShoppingCart className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">About SmartBasket</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your one-stop solution for comparing grocery prices across India's top quick commerce platforms.
          </p>
        </div>

        {/* How it Works */}
        <div className="bg-card rounded-2xl p-8 mb-8 shadow-soft">
          <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Search</h3>
              <p className="text-sm text-muted-foreground">
                Type the name of any grocery item you want to buy
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Compare</h3>
              <p className="text-sm text-muted-foreground">
                Click on an item to see prices from all platforms
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Save</h3>
              <p className="text-sm text-muted-foreground">
                Choose the best deal and save money on every order
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Features</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-5 shadow-soft hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Supported Platforms */}
        <div className="bg-card rounded-2xl p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-foreground mb-6">Supported Platforms</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Blinkit', color: 'bg-yellow-500', emoji: '⚡' },
              { name: 'Zepto', color: 'bg-purple-500', emoji: '🚀' },
              { name: 'Instamart', color: 'bg-orange-500', emoji: '🛒' },
              { name: 'BigBasket', color: 'bg-green-600', emoji: '🧺' },
              { name: 'JioMart', color: 'bg-blue-600', emoji: '🛍️' },
            ].map((platform) => (
              <div
                key={platform.name}
                className="flex flex-col items-center p-4 rounded-xl bg-background"
              >
                <div className={`h-14 w-14 ${platform.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                  {platform.emoji}
                </div>
                <span className="font-medium text-foreground">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
