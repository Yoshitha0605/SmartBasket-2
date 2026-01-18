-- Fix RLS policies to explicitly require authentication
-- This adds defense-in-depth by explicitly checking auth.uid() IS NOT NULL

-- ==========================================
-- FIX 1: Profiles table - add explicit auth checks
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- ==========================================
-- FIX 2: Orders table - add explicit auth checks
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ==========================================
-- FIX 3: Cart items table - add explicit auth checks
-- ==========================================
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can add to cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete from cart" ON public.cart_items;

CREATE POLICY "Users can view own cart"
ON public.cart_items FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can add to cart"
ON public.cart_items FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
ON public.cart_items FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can delete from cart"
ON public.cart_items FOR DELETE
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ==========================================
-- FIX 4: Order items table - add explicit auth checks
-- ==========================================
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create their own order items" ON public.order_items;

CREATE POLICY "Users can view their own order items"
ON public.order_items FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can create their own order items"
ON public.order_items FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);