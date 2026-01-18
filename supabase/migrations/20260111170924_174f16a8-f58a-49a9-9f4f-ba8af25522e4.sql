-- Update existing products with brands
UPDATE public.products SET brand = 'Nandini' WHERE name = 'Toned Milk';
UPDATE public.products SET brand = 'Amul' WHERE name = 'Full Cream Milk';

-- Vegetables (more products - fresh produce typically doesn't have brands)
INSERT INTO public.products (name, description, image_url, category_type, main_category, brand) VALUES
('Carrot', 'Fresh orange carrots', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 'Veg', 'Vegetables', NULL),
('Beans', 'Fresh green beans', 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400', 'Veg', 'Vegetables', NULL),
('Cabbage', 'Fresh green cabbage', 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400', 'Veg', 'Vegetables', NULL),
('Cauliflower', 'Fresh white cauliflower', 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400', 'Veg', 'Vegetables', NULL),
('Brinjal', 'Fresh purple brinjal', 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400', 'Veg', 'Vegetables', NULL),
('Capsicum', 'Fresh bell peppers', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', 'Veg', 'Vegetables', NULL),
('Spinach', 'Fresh green spinach leaves', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 'Veg', 'Vegetables', NULL),
('Ginger', 'Fresh ginger root', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400', 'Veg', 'Vegetables', NULL),
('Garlic', 'Fresh garlic bulbs', 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2f4e?w=400', 'Veg', 'Vegetables', NULL),
('Mushroom', 'Fresh button mushrooms', 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400', 'Veg', 'Vegetables', NULL),
('Baby Corn', 'Fresh baby corn', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400', 'Veg', 'Vegetables', NULL),
('Coriander Leaves', 'Fresh coriander bunch', 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400', 'Veg', 'Vegetables', NULL),
('Curry Leaves', 'Fresh curry leaves', 'https://images.unsplash.com/photo-1608750615330-e592fe7dc8c1?w=400', 'Veg', 'Vegetables', NULL),
('Green Chilli', 'Fresh green chillies', 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400', 'Veg', 'Vegetables', NULL),
('Lemon', 'Fresh lemons', 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400', 'Veg', 'Vegetables', NULL);

-- Fruits (expanded)
INSERT INTO public.products (name, description, image_url, category_type, main_category, brand) VALUES
('Orange', 'Fresh juicy oranges', 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', 'Veg', 'Fruits', NULL),
('Grapes', 'Fresh seedless grapes', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400', 'Veg', 'Fruits', NULL),
('Papaya', 'Fresh ripe papaya', 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400', 'Veg', 'Fruits', NULL),
('Pineapple', 'Fresh pineapple', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400', 'Veg', 'Fruits', NULL),
('Watermelon', 'Fresh watermelon', 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400', 'Veg', 'Fruits', NULL),
('Pomegranate', 'Fresh pomegranate', 'https://images.unsplash.com/photo-1541344999736-4f319f4a0577?w=400', 'Veg', 'Fruits', NULL),
('Guava', 'Fresh guava', 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400', 'Veg', 'Fruits', NULL),
('Chikoo', 'Fresh sapota/chikoo', 'https://images.unsplash.com/photo-1605027538666-53e04f4b7c78?w=400', 'Veg', 'Fruits', NULL),
('Custard Apple', 'Fresh sitaphal', 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=400', 'Veg', 'Fruits', NULL),
('Sweet Lime', 'Fresh mosambi', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400', 'Veg', 'Fruits', NULL),
('Kiwi', 'Fresh kiwi fruit', 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400', 'Veg', 'Fruits', NULL),
('Strawberry', 'Fresh strawberries', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', 'Veg', 'Fruits', NULL);