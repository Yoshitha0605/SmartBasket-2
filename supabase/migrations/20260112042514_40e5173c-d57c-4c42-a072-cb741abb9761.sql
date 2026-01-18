-- Add user_id column to order_items for direct RLS checks
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill existing order_items with user_id from their parent orders
UPDATE public.order_items 
SET user_id = orders.user_id
FROM public.orders 
WHERE order_items.order_id = orders.id 
AND order_items.user_id IS NULL;

-- Make user_id NOT NULL after backfill (for new records)
ALTER TABLE public.order_items 
ALTER COLUMN user_id SET NOT NULL;

-- Drop existing RLS policies on order_items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;

-- Create new direct user_id-based RLS policies
CREATE POLICY "Users can view their own order items"
ON public.order_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own order items"
ON public.order_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);