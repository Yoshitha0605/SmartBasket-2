-- Dairy (with brands)
INSERT INTO public.products (name, description, image_url, category_type, main_category, brand) VALUES
('Cow Milk', 'Fresh cow milk', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'Veg', 'Dairy', 'Nandini'),
('Buffalo Milk', 'Rich buffalo milk', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 'Veg', 'Dairy', 'Amul'),
('Curd', 'Fresh set curd', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 'Veg', 'Dairy', 'Nandini'),
('Butter', 'Fresh salted butter', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', 'Veg', 'Dairy', 'Amul'),
('Ghee', 'Pure cow ghee', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', 'Veg', 'Dairy', 'Nandini'),
('Paneer', 'Fresh cottage cheese', 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400', 'Veg', 'Dairy', 'Amul'),
('Cheese', 'Processed cheese slices', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', 'Veg', 'Dairy', 'Amul'),
('Buttermilk', 'Fresh spiced buttermilk', 'https://images.unsplash.com/photo-1626078436851-1008c5c8ff59?w=400', 'Veg', 'Dairy', 'Nandini');

-- Grocery (with brands)
INSERT INTO public.products (name, description, image_url, category_type, main_category, brand) VALUES
('Rice', 'Premium basmati rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 'Veg', 'Grocery', 'India Gate'),
('Atta', 'Whole wheat flour', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', 'Veg', 'Grocery', 'Aashirvaad'),
('Toor Dal', 'Yellow lentils', 'https://images.unsplash.com/photo-1613758947307-f3b8f5d80711?w=400', 'Veg', 'Grocery', 'Tata Sampann'),
('Moong Dal', 'Split green gram', 'https://images.unsplash.com/photo-1612257416648-ee7a6c533b4f?w=400', 'Veg', 'Grocery', 'Tata Sampann'),
('Sugar', 'White sugar', 'https://images.unsplash.com/photo-1581268058174-c9f5c7e9d8a8?w=400', 'Veg', 'Grocery', 'Uttam'),
('Salt', 'Iodized salt', 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400', 'Veg', 'Grocery', 'Tata Salt'),
('Tea Powder', 'Premium tea leaves', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', 'Veg', 'Grocery', 'Tata Tea'),
('Coffee Powder', 'Filter coffee powder', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 'Veg', 'Grocery', 'Bru'),
('Sunflower Oil', 'Refined sunflower oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', 'Veg', 'Grocery', 'Fortune');

-- Masala & Spices
INSERT INTO public.products (name, description, image_url, category_type, main_category, brand) VALUES
('Pepper Powder', 'Black pepper powder', 'https://images.unsplash.com/photo-1599909533286-66d37e603a95?w=400', 'Veg', 'Masala & Spices', 'Everest'),
('Red Chilli Powder', 'Hot red chilli powder', 'https://images.unsplash.com/photo-1596547609652-9cf5d8c76921?w=400', 'Veg', 'Masala & Spices', 'MTR'),
('Turmeric Powder', 'Pure turmeric powder', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400', 'Veg', 'Masala & Spices', 'Everest'),
('Garam Masala', 'Blend of aromatic spices', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', 'Veg', 'Masala & Spices', 'MDH'),
('Sambar Powder', 'Traditional sambar masala', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', 'Veg', 'Masala & Spices', 'MTR'),
('Rasam Powder', 'Traditional rasam masala', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', 'Veg', 'Masala & Spices', 'MTR'),
('Chicken Masala', 'Spice mix for chicken', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', 'Non-Veg', 'Masala & Spices', 'Sakthi'),
('Biryani Masala', 'Spice mix for biryani', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', 'Veg', 'Masala & Spices', 'Shan');

-- Snacks & Non-Veg & Chocolates
INSERT INTO public.products (name, description, image_url, category_type, main_category, brand) VALUES
('Classic Salted Chips', 'Crispy salted potato chips', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', 'Veg', 'Snacks', 'Lays'),
('Kurkure Masala Munch', 'Crunchy masala snack', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400', 'Veg', 'Snacks', 'Kurkure'),
('Good Day Biscuits', 'Butter cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', 'Veg', 'Snacks', 'Britannia'),
('Chicken Curry Cut', 'Fresh chicken with bone', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', 'Non-Veg', 'Non-Veg', NULL),
('Eggs', 'Farm fresh eggs', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', 'Non-Veg', 'Non-Veg', NULL),
('Mutton', 'Fresh goat meat', 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', 'Non-Veg', 'Non-Veg', NULL),
('Dairy Milk', 'Classic milk chocolate', 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400', 'Veg', 'Chocolates', 'Cadbury'),
('KitKat', 'Wafer chocolate bar', 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400', 'Veg', 'Chocolates', 'Nestle');