
-- Create platforms table
CREATE TABLE public.platforms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  base_delivery_fee NUMERIC NOT NULL DEFAULT 25,
  free_delivery_threshold NUMERIC NOT NULL DEFAULT 200,
  avg_delivery_minutes INTEGER NOT NULL DEFAULT 15,
  website_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_type TEXT NOT NULL CHECK (category_type IN ('Veg', 'Non-Veg')),
  main_category TEXT NOT NULL CHECK (main_category IN ('Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Non-Veg', 'Grocery', 'Chocolates', 'Cakes')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product_variants table (quantity options)
CREATE TABLE public.product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_label TEXT NOT NULL,
  quantity_multiplier NUMERIC NOT NULL DEFAULT 1,
  base_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, quantity_label)
);

-- Create platform_prices table (prices per variant per platform)
CREATE TABLE public.platform_prices (
  id SERIAL PRIMARY KEY,
  variant_id INTEGER NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  platform_id INTEGER NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  delivery_minutes INTEGER NOT NULL DEFAULT 15,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(variant_id, platform_id)
);

-- Create cart_items table (for authenticated users)
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  variant_id INTEGER NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  platform_id INTEGER NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, variant_id, platform_id)
);

-- Enable RLS on all tables
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Public read access for products, variants, platforms, prices
CREATE POLICY "Anyone can view platforms" ON public.platforms FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Anyone can view prices" ON public.platform_prices FOR SELECT USING (true);

-- Cart policies (user-specific)
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Trigger for cart_items updated_at
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed platforms data
INSERT INTO public.platforms (name, base_delivery_fee, free_delivery_threshold, avg_delivery_minutes, website_url) VALUES
  ('Blinkit', 25, 200, 10, 'https://blinkit.com'),
  ('Zepto', 29, 200, 8, 'https://www.zeptonow.com'),
  ('Instamart', 30, 200, 15, 'https://www.swiggy.com/instamart'),
  ('BigBasket', 20, 200, 30, 'https://www.bigbasket.com'),
  ('JioMart', 25, 200, 45, 'https://www.jiomart.com');

-- Seed products data
INSERT INTO public.products (name, category_type, main_category, image_url) VALUES
  ('Tomato', 'Veg', 'Vegetables', 'https://images.unsplash.com/photo-1546470427-227c7369a9b8?w=200'),
  ('Onion', 'Veg', 'Vegetables', 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=200'),
  ('Potato', 'Veg', 'Vegetables', 'https://images.unsplash.com/photo-1518977676601-b9f8c3e3ace3?w=200'),
  ('Apple', 'Veg', 'Fruits', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200'),
  ('Banana', 'Veg', 'Fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200'),
  ('Mango', 'Veg', 'Fruits', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200'),
  ('Toned Milk', 'Veg', 'Dairy', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200'),
  ('Full Cream Milk', 'Veg', 'Dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200'),
  ('Curd', 'Veg', 'Dairy', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200'),
  ('Paneer', 'Veg', 'Dairy', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200'),
  ('Lays Classic', 'Veg', 'Snacks', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200'),
  ('Kurkure', 'Veg', 'Snacks', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200'),
  ('Chicken Breast', 'Non-Veg', 'Non-Veg', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200'),
  ('Eggs', 'Non-Veg', 'Non-Veg', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200'),
  ('Rice', 'Veg', 'Grocery', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200'),
  ('Atta', 'Veg', 'Grocery', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200'),
  ('Dairy Milk', 'Veg', 'Chocolates', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200'),
  ('KitKat', 'Veg', 'Chocolates', 'https://images.unsplash.com/photo-1527904324834-3bda86da6771?w=200'),
  ('Black Forest Cake', 'Veg', 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200'),
  ('Chocolate Truffle', 'Veg', 'Cakes', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=200');

-- Seed product variants
INSERT INTO public.product_variants (product_id, quantity_label, quantity_multiplier, base_price) VALUES
  (1, '250g', 0.25, 10), (1, '500g', 0.5, 18), (1, '1kg', 1, 35),
  (2, '500g', 0.5, 20), (2, '1kg', 1, 38), (2, '2kg', 2, 72),
  (3, '500g', 0.5, 15), (3, '1kg', 1, 28), (3, '2kg', 2, 52),
  (4, '500g', 0.5, 80), (4, '1kg', 1, 150),
  (5, '6pc', 1, 40), (5, '12pc', 2, 75),
  (6, '500g', 0.5, 120), (6, '1kg', 1, 220),
  (7, '500ml', 0.5, 28), (7, '1L', 1, 54),
  (8, '500ml', 0.5, 32), (8, '1L', 1, 60),
  (9, '200g', 0.2, 25), (9, '400g', 0.4, 48),
  (10, '200g', 0.2, 80), (10, '500g', 0.5, 180),
  (11, '52g', 1, 20), (11, '115g', 2.2, 40),
  (12, '75g', 1, 20), (12, '155g', 2, 40),
  (13, '500g', 0.5, 180), (13, '1kg', 1, 340),
  (14, '6pc', 1, 48), (14, '12pc', 2, 90), (14, '30pc', 5, 210),
  (15, '1kg', 1, 65), (15, '5kg', 5, 300),
  (16, '1kg', 1, 45), (16, '5kg', 5, 210),
  (17, '50g', 1, 45), (17, '110g', 2.2, 95),
  (18, '37.3g', 1, 30), (18, '4pc Pack', 4, 100),
  (19, '500g', 0.5, 350), (19, '1kg', 1, 650),
  (20, '500g', 0.5, 400), (20, '1kg', 1, 750);

-- Seed platform prices (varying prices per platform)
INSERT INTO public.platform_prices (variant_id, platform_id, price, delivery_minutes, in_stock)
SELECT 
  v.id as variant_id,
  p.id as platform_id,
  ROUND(v.base_price * (0.9 + (random() * 0.3))::numeric, 0) as price,
  p.avg_delivery_minutes + FLOOR(random() * 10)::integer as delivery_minutes,
  (random() > 0.1) as in_stock
FROM public.product_variants v
CROSS JOIN public.platforms p;

-- Create index for faster queries
CREATE INDEX idx_platform_prices_variant ON public.platform_prices(variant_id);
CREATE INDEX idx_platform_prices_platform ON public.platform_prices(platform_id);
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_products_category ON public.products(main_category);
CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);
