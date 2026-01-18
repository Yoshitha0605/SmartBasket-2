-- Add platform prices for all variants that don't have prices yet
-- Using a cross join with platforms to create prices for all 6 platforms

INSERT INTO public.platform_prices (variant_id, platform_id, price, delivery_minutes, in_stock)
SELECT 
  pv.id as variant_id,
  p.id as platform_id,
  ROUND(pv.base_price * (0.90 + (random() * 0.20))::numeric, 0) as price, -- Price varies 90%-110% of base
  p.avg_delivery_minutes + FLOOR(random() * 5)::int as delivery_minutes,
  CASE WHEN random() > 0.05 THEN true ELSE false END as in_stock -- 95% in stock
FROM public.product_variants pv
CROSS JOIN public.platforms p
WHERE pv.id NOT IN (SELECT DISTINCT variant_id FROM platform_prices);