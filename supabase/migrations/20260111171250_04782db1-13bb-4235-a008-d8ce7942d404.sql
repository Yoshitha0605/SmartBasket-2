-- Add product variants for new products (IDs 72-131)
-- Vegetables variants (typically sold by weight)
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '250g', 15, 0.5 FROM public.products WHERE id IN (72,73,74,75,76,77,78,79,80,81,82,83,84,85,86);
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '500g', 30, 1 FROM public.products WHERE id IN (72,73,74,75,76,77,78,79,80,81,82,83,84,85,86);
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '1kg', 55, 2 FROM public.products WHERE id IN (72,73,74,75,76,77,78,79,80,81,82,83,84,85,86);

-- Fruits variants
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '500g', 60, 1 FROM public.products WHERE id IN (87,88,89,90,91,92,93,94,95,96,97,98);
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '1kg', 110, 2 FROM public.products WHERE id IN (87,88,89,90,91,92,93,94,95,96,97,98);

-- Dairy variants (milk by liter, others by weight)
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '500ml', 30, 0.5 FROM public.products WHERE id IN (99,100,106); -- Milk, Buttermilk
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '1L', 55, 1 FROM public.products WHERE id IN (99,100,106);

INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '200g', 40, 0.5 FROM public.products WHERE id IN (101,102,104,105); -- Curd, Butter, Paneer, Cheese
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '500g', 90, 1 FROM public.products WHERE id IN (101,102,104,105);

INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '500ml', 280, 0.5 FROM public.products WHERE id = 103; -- Ghee
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '1L', 520, 1 FROM public.products WHERE id = 103;

-- Grocery variants
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '1kg', 80, 1 FROM public.products WHERE id IN (107,108,109,110,111,112); -- Rice, Atta, Dals, Sugar, Salt
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '5kg', 380, 5 FROM public.products WHERE id IN (107,108,109,110,111,112);

INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '250g', 85, 0.5 FROM public.products WHERE id IN (113,114); -- Tea, Coffee
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '500g', 160, 1 FROM public.products WHERE id IN (113,114);

INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '1L', 150, 1 FROM public.products WHERE id = 115; -- Sunflower Oil
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '5L', 700, 5 FROM public.products WHERE id = 115;

-- Masala & Spices variants
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '50g', 35, 0.5 FROM public.products WHERE id IN (116,117,118,119,120,121,122,123);
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '100g', 65, 1 FROM public.products WHERE id IN (116,117,118,119,120,121,122,123);
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '200g', 120, 2 FROM public.products WHERE id IN (116,117,118,119,120,121,122,123);

-- Snacks variants
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '50g', 20, 0.5 FROM public.products WHERE id IN (124,125);
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '100g', 40, 1 FROM public.products WHERE id IN (124,125);

INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '100g', 30, 0.5 FROM public.products WHERE id = 126; -- Good Day Biscuits
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '200g', 55, 1 FROM public.products WHERE id = 126;

-- Non-Veg variants
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '500g', 180, 0.5 FROM public.products WHERE id IN (127,129); -- Chicken, Mutton
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '1kg', 340, 1 FROM public.products WHERE id IN (127,129);

INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '6pc', 45, 0.5 FROM public.products WHERE id = 128; -- Eggs
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '12pc', 85, 1 FROM public.products WHERE id = 128;
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '30pc', 200, 2.5 FROM public.products WHERE id = 128;

-- Chocolates variants
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '50g', 45, 0.5 FROM public.products WHERE id IN (130,131); -- Dairy Milk, KitKat
INSERT INTO public.product_variants (product_id, quantity_label, base_price, quantity_multiplier) 
SELECT id, '100g', 85, 1 FROM public.products WHERE id IN (130,131);