-- Insert platforms data
INSERT INTO platforms (name, base_delivery_fee, free_delivery_threshold, avg_delivery_minutes, website_url, created_at) VALUES
('Blinkit', 25.00, 200.00, 10, 'https://blinkit.com', CURRENT_TIMESTAMP()),
('Zepto', 29.00, 200.00, 8, 'https://www.zeptonow.com', CURRENT_TIMESTAMP()),
('Instamart', 30.00, 200.00, 15, 'https://www.swiggy.com/instamart', CURRENT_TIMESTAMP()),
('BigBasket', 20.00, 200.00, 30, 'https://www.bigbasket.com', CURRENT_TIMESTAMP()),
('JioMart', 25.00, 200.00, 45, 'https://www.jiomart.com', CURRENT_TIMESTAMP());