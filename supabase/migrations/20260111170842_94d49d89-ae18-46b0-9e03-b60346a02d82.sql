-- Step 1: Add brand column
ALTER TABLE public.products ADD COLUMN brand text;

-- Step 2: Update the main_category constraint to include 'Masala & Spices'
ALTER TABLE public.products DROP CONSTRAINT products_main_category_check;
ALTER TABLE public.products ADD CONSTRAINT products_main_category_check 
  CHECK (main_category = ANY (ARRAY['Vegetables'::text, 'Fruits'::text, 'Dairy'::text, 'Snacks'::text, 'Non-Veg'::text, 'Grocery'::text, 'Chocolates'::text, 'Cakes'::text, 'Masala & Spices'::text]));