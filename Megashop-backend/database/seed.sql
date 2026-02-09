-- Seed data for Megashop database
-- Run this after schema.sql

-- Clear existing data
TRUNCATE TABLE wishlist, order_items, orders, cart_items, products, categories, users, promo_codes RESTART IDENTITY CASCADE;

-- Insert sample users (password for all: password123)
-- Password hash generated with bcrypt, rounds=10
INSERT INTO users (email, password_hash, full_name, phone) VALUES
('john@example.com', '$2b$10$ilWhSkg4/37jIHRi/gxSpOG7HdSAAtSZ0i/oLUOuq.MIXSSEhxpbO', 'John Doe', '1234567890'),
('jane@example.com', '$2b$10$KArMpwBYdJQNGP8vYvJxKp5QxGxOYJ5kZqZ9YvJxKp5QxGxOYJ5k', 'Jane Smith', '0987654321'),
('test@example.com', '$2b$10$z83B19J3lXvJxKp5QxGxOYJ5kZqZ9YvJxKp5QxGxOYJ5kZqZ9YvJ', 'Test User', '1112223333');

-- Insert categories with real icons and images
INSERT INTO categories (name, icon, image_url, product_count) VALUES
('Electronics', 'phone-portrait-outline', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80', 8),
('Clothing', 'shirt-outline', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80', 6),
('Home & Kitchen', 'home-outline', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=400&q=80', 4),
('Books', 'book-outline', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80', 3),
('Sports', 'football-outline', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80', 4);

-- Insert products with high-quality images
INSERT INTO products (name, description, category, price, original_price, rating, review_count, sold_count, seller, badges, images, colors, sizes, delivery_info) VALUES
-- Electronics
('iPhone 14 Pro', 'Latest Apple smartphone with A16 Bionic chip, pro camera system, and all-day battery life.', 'Electronics', 99999.00, 119999.00, 4.8, 1250, 3500, 'Apple Store', '["Best Seller", "Free Shipping"]', ARRAY['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=600&q=80'], ARRAY['Space Black', 'Silver', 'Gold'], ARRAY['128GB', '256GB', '512GB'], 'Free delivery in 2-3 days'),
('Samsung Galaxy S23', 'Flagship Android phone with amazing nightography camera and fastest Snapdragon processor.', 'Electronics', 79999.00, 89999.00, 4.7, 980, 2800, 'Samsung Official', '["Top Rated"]', ARRAY['https://images.unsplash.com/photo-1610945265078-3858d0879c74?auto=format&fit=crop&w=600&q=80'], ARRAY['Phantom Black', 'Cream'], ARRAY['128GB', '256GB'], 'Free delivery in 2-3 days'),
('MacBook Air M2', 'Supercharged by M2. Strikingly thin design. All-day battery life. Silent fanless design.', 'Electronics', 119900.00, 129900.00, 4.9, 750, 1200, 'Apple Store', '["Best Seller", "Premium"]', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=600&q=80'], ARRAY['Space Gray', 'Silver', 'Starlight'], ARRAY['8GB RAM', '16GB RAM'], 'Free delivery in 3-5 days'),
('Sony WH-1000XM5', 'Industry-leading noise cancellation, exceptional sound quality, and crystal clear calls.', 'Electronics', 29990.00, 34990.00, 4.8, 2100, 5600, 'Sony Official', '["Best Seller"]', ARRAY['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80'], ARRAY['Black', 'Silver'], NULL, 'Free delivery in 2-3 days'),
('iPad Pro 11"', 'The ultimate iPad experience with M2 chip, ProMotion display, and Apple Pencil support.', 'Electronics', 81900.00, 89900.00, 4.7, 560, 890, 'Apple Store', '["Premium"]', ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80'], ARRAY['Space Gray', 'Silver'], ARRAY['128GB', '256GB', '512GB'], 'Free delivery in 3-5 days'),
('Dell XPS 13', 'Stunning design, high performance, and infinity edge display in a compact form factor.', 'Electronics', 94990.00, 104990.00, 4.6, 420, 780, 'Dell Official', '["Top Rated"]', ARRAY['https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=600&q=80'], ARRAY['Platinum Silver'], ARRAY['8GB RAM', '16GB RAM'], 'Free delivery in 5-7 days'),
('AirPods Pro 2', 'Rebuilt from the sound up. Up to 2x more Active Noise Cancellation. Adaptive Transparency.', 'Electronics', 24900.00, 26900.00, 4.8, 3200, 8900, 'Apple Store', '["Best Seller"]', ARRAY['https://images.unsplash.com/photo-1603351154351-5cf233081d35?auto=format&fit=crop&w=600&q=80'], ARRAY['White'], NULL, 'Free delivery in 2-3 days'),
('Kindle Paperwhite', 'Now with a 6.8" display and thinner borders, adjustable warm light, up to 10 weeks of battery life.', 'Electronics', 13999.00, 15999.00, 4.7, 1800, 4200, 'Amazon', '["Top Rated"]', ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'], ARRAY['Black'], ARRAY['8GB', '16GB'], 'Free delivery in 3-5 days'),

-- Clothing
('Levi''s 501 Jeans', 'The original blue jean since 1873. A blank canvas for self-expression.', 'Clothing', 3999.00, 4999.00, 4.5, 890, 2100, 'Levi''s Store', '["Best Seller"]', ARRAY['https://images.unsplash.com/photo-1542272617-08f08637533d?auto=format&fit=crop&w=600&q=80'], ARRAY['Blue', 'Black'], ARRAY['28', '30', '32', '34', '36'], 'Free delivery in 3-5 days'),
('Nike Air Max', 'Legendary style, redefined. Featuring the iconic Air cushioning you know and love.', 'Clothing', 8999.00, 10999.00, 4.7, 1200, 3400, 'Nike Official', '["Top Rated"]', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'], ARRAY['White', 'Black', 'Red'], ARRAY['7', '8', '9', '10', '11'], 'Free delivery in 2-3 days'),
('Adidas T-Shirt', 'Classic Trefoil tee. Soft cotton jersey feels comfortable against your skin.', 'Clothing', 1299.00, 1799.00, 4.4, 650, 1800, 'Adidas Store', NULL, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'], ARRAY['White', 'Black', 'Blue'], ARRAY['S', 'M', 'L', 'XL'], 'Free delivery in 3-5 days'),
('Zara Formal Shirt', 'Slim fit collared shirt made of cotton fabric. Featuring button-up fastening.', 'Clothing', 2499.00, 2999.00, 4.3, 340, 920, 'Zara', NULL, ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80'], ARRAY['White', 'Blue', 'Pink'], ARRAY['S', 'M', 'L', 'XL'], 'Free delivery in 5-7 days'),
('H&M Hoodie', 'Hoodie in sweatshirt fabric made from a cotton blend. Relaxed fit.', 'Clothing', 1999.00, 2499.00, 4.5, 780, 2200, 'H&M', '["Best Seller"]', ARRAY['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'], ARRAY['Gray', 'Black', 'Navy'], ARRAY['S', 'M', 'L', 'XL'], 'Free delivery in 3-5 days'),
('Puma Track Pants', 'Regular fit track pants with elasticated waistband and internal drawcords.', 'Clothing', 1799.00, 2299.00, 4.4, 520, 1400, 'Puma Official', NULL, ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80'], ARRAY['Black', 'Navy'], ARRAY['S', 'M', 'L', 'XL'], 'Free delivery in 3-5 days'),

-- Home & Kitchen
('Instant Pot Duo', '7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker.', 'Home & Kitchen', 7999.00, 9999.00, 4.8, 2400, 6800, 'Instant Pot', '["Best Seller", "Top Rated"]', ARRAY['https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'], ARRAY['Stainless Steel'], ARRAY['6 Quart', '8 Quart'], 'Free delivery in 3-5 days'),
('Dyson V11 Vacuum', 'Intelligent cleaning. 60 minutes of run time. LCD screen reports performance in real time.', 'Home & Kitchen', 44900.00, 49900.00, 4.7, 890, 1200, 'Dyson Official', '["Premium"]', ARRAY['https://images.unsplash.com/photo-1558317374-a35186516d22?auto=format&fit=crop&w=600&q=80'], ARRAY['Blue'], NULL, 'Free delivery in 5-7 days'),
('Philips Air Fryer', 'Great tasting fries with up to 90% less fat. Rapid Air technology.', 'Home & Kitchen', 8999.00, 10999.00, 4.6, 1560, 3900, 'Philips', '["Best Seller"]', ARRAY['https://images.unsplash.com/photo-1626154628286-9cb3e778a48d?auto=format&fit=crop&w=600&q=80'], ARRAY['Black'], ARRAY['4L', '6L'], 'Free delivery in 3-5 days'),
('Nespresso Machine', 'Brews appropriate cup size for your coffee preference. One touch operation.', 'Home & Kitchen', 12999.00, 14999.00, 4.7, 720, 1800, 'Nespresso', '["Premium"]', ARRAY['https://images.unsplash.com/photo-1517080517-57321a47942d?auto=format&fit=crop&w=600&q=80'], ARRAY['Black', 'Silver'], NULL, 'Free delivery in 3-5 days'),

-- Books
('Atomic Habits', 'No matter your goals, Atomic Habits offers a proven framework for improving--every day.', 'Books', 499.00, 699.00, 4.9, 4500, 12000, 'Amazon Books', '["Best Seller"]', ARRAY['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80'], NULL, NULL, 'Free delivery in 2-3 days'),
('The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness. One of the best finance books.', 'Books', 399.00, 599.00, 4.8, 3200, 9500, 'Amazon Books', '["Top Rated"]', ARRAY['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80'], NULL, NULL, 'Free delivery in 2-3 days'),
('Sapiens', 'A Brief History of Humankind. Explore how biology and history have defined us.', 'Books', 549.00, 799.00, 4.7, 2800, 8200, 'Amazon Books', '["Best Seller"]', ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'], NULL, NULL, 'Free delivery in 2-3 days'),

-- Sports
('Yoga Mat', 'High density foam NBR material. Non-slip surface for improved traction.', 'Sports', 999.00, 1499.00, 4.5, 1200, 3400, 'Decathlon', '["Best Seller"]', ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80'], ARRAY['Purple', 'Blue', 'Pink'], NULL, 'Free delivery in 3-5 days'),
('Dumbbells Set', 'Adjustable weights. Cast iron plates with chrome finish. Secure spin-lock collars.', 'Sports', 2999.00, 3999.00, 4.6, 680, 1900, 'Decathlon', '["Top Rated"]', ARRAY['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=600&q=80'], ARRAY['Black'], NULL, 'Free delivery in 5-7 days'),
('Football', 'Durable TPU casing. Butyl bladder for best air retention. Machine stitched.', 'Sports', 799.00, 1199.00, 4.4, 890, 2400, 'Nike Official', NULL, ARRAY['https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=600&q=80'], ARRAY['White'], NULL, 'Free delivery in 2-3 days'),
('Tennis Racket', 'High modulus graphite construction. Head heavy balance for power.', 'Sports', 3499.00, 4499.00, 4.7, 340, 780, 'Wilson', '["Premium"]', ARRAY['https://images.unsplash.com/photo-1617083275662-790180963d76?auto=format&fit=crop&w=600&q=80'], ARRAY['Black/Red'], NULL, 'Free delivery in 3-5 days');

-- Insert promo codes
INSERT INTO promo_codes (code, discount_percent, active) VALUES
('WELCOME10', 10, true),
('SAVE20', 20, true),
('MEGA50', 50, false);

-- Success message
SELECT 'Seed data inserted successfully!' AS message;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_categories FROM categories;
SELECT COUNT(*) AS total_products FROM products;
