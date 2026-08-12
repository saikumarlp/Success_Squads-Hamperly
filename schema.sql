-- MySQL Database Creation Script for Luxury Gift Hampers
-- Host: localhost | Port: 3309 (as configured in .env)

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS luxury_gift_hampers;
USE luxury_gift_hampers;

-- Disable foreign key checks to drop existing tables safely
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS review_images;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS productimages;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS jwt_tokens;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    blocked TINYINT(1) DEFAULT 0,
    profile_picture_url VARCHAR(500) DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    gender VARCHAR(20) DEFAULT NULL,
    bio VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Create JWT Tokens Table
CREATE TABLE jwt_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2b. Create Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create Categories Table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE
);

-- 4. Create Products Table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- 5. Create Product Images Table
CREATE TABLE productimages (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 6. Create Cart Items Table
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 6b. Create Wishlists Table
CREATE TABLE wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

-- 6c. Create Reviews Table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    title VARCHAR(255),
    comment TEXT NOT NULL,
    verified_purchase TINYINT(1) DEFAULT 1,
    is_hidden TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_product_review UNIQUE (user_id, product_id)
);

-- 6d. Create Review Images Table
CREATE TABLE review_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- 7. Create Orders Table
CREATE TABLE orders (
    order_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    item_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    coupon_discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_address VARCHAR(500) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    postal_code VARCHAR(20) NULL,
    payment_id VARCHAR(255) NULL,
    payment_method VARCHAR(100) NULL,
    payment_status VARCHAR(50) NULL DEFAULT 'PENDING',
    estimated_delivery TIMESTAMP NULL,
    tracking_number VARCHAR(255) NULL,
    confirmed_at TIMESTAMP NULL,
    packed_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    out_for_delivery_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Create Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 8b. Create Invoices Table
CREATE TABLE invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    invoice_number VARCHAR(255) NOT NULL UNIQUE,
    pdf_path VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- 8c. Create Notifications Table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(500) NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Seed Users Sample Data
INSERT INTO users (id, full_name, email, mobile_number, password, role, created_at, updated_at) VALUES
(1, 'John Doe', 'john@example.com', '9876543210', '$2b$10$UxihVNJQs0fwKWsBtz6TAeTa.nRERNJ0M.DYKLygpux88YlPw5DEe', 'ADMIN', '2025-06-20 10:15:30', '2025-06-20 10:20:45'),
(2, 'Alice Smith', 'alice@example.com', '9876543211', '$2b$10$UxihVNJQs0fwKWsBtz6TAeTa.nRERNJ0M.DYKLygpux88YlPw5DEe', 'CUSTOMER', '2025-06-20 11:05:21', '2025-06-20 11:05:21'),
(3, 'Bob Raj', 'bob@example.com', '9876543212', '$2b$10$UxihVNJQs0fwKWsBtz6TAeTa.nRERNJ0M.DYKLygpux88YlPw5DEe', 'CUSTOMER', '2025-06-20 11:20:10', '2025-06-20 11:20:10');

-- 10. Seed JWT Tokens Sample Data
INSERT INTO jwt_tokens (token_id, user_id, token, created_at, expires_at) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTA0MTY5MzAsImV4cCI6MTc1MDQyNDEzMH0.X1s2b3c4d5e6F7G8H9I0J', '2025-06-20 10:16:00', '2025-06-20 12:16:00'),
(2, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NTA0MTk5MjEsImV4cCI6MTc1MDQyNzEyMX0.A1b2c3d4e5f6g7h8i9j0l', '2025-06-20 11:06:00', '2025-06-20 13:06:00'),
(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTA0MjUwMDAsImV4cCI6MTc1MDQzMjIwMH0.z9y8x7w6v5u4t3s2r1q0p', '2025-06-20 12:30:00', '2025-06-20 14:30:00');

-- 11. Seed Categories Sample Data
INSERT INTO categories (category_id, category_name) VALUES
(1, 'wedding_hampers'),
(2, 'corporate_hampers'),
(3, 'birthday_hampers'),
(4, 'anniversary_hampers');

-- 12. Seed Anniversary Hampers Products (Starting from ID 1)
INSERT INTO products (product_id, name, description, price, stock, category_id) VALUES
(1, 'Everlasting Love', 'An exquisite selection of dark chocolates, premium red wine, and scented soy candles to celebrate eternal love. Carefully hand-wrapped and curated for a premium gifting experience.', 4999.00, 25, 4),
(2, 'Golden Milestone', 'Toast to a golden anniversary with fine champagne, gold-wrapped truffles, and a keepsake silver frame. Carefully hand-wrapped and curated for a premium gifting experience.', 7999.00, 15, 4),
(3, 'Silver Jubilee', 'Celebrate 25 years of love with gourmet cheese, artisanal crackers, sparkling white wine, and silver trinkets. Carefully hand-wrapped and curated for a premium gifting experience.', 6499.00, 20, 4),
(4, 'Sweet Devotion', 'A handpicked assortment of international chocolates, gourmet fudge, and chocolate-covered strawberries. Carefully hand-wrapped and curated for a premium gifting experience.', 3499.00, 40, 4),
(5, 'Royal Ruby', 'Pamper your partner with premium rose water, organic bath salts, a plush bathrobe, and aromatic mist. Carefully hand-wrapped and curated for a premium gifting experience.', 5499.00, 30, 4),
(6, 'Classic Romance', 'Perfect pairing of two vintage reserve wines, aged cheddar, gouda, and organic honey. Carefully hand-wrapped and curated for a premium gifting experience.', 8999.00, 12, 4),
(7, 'Midnight Serenade', 'A sleek, black lacquer box filled with artisanal coffee, porcelain mugs, dark chocolate bark, and a silk scarf. Carefully hand-wrapped and curated for a premium gifting experience.', 4299.00, 18, 4),
(8, 'Enchanted Garden', 'Freshly cut roses, luxury lavender soap, chamomile tea, and a beautiful ceramic teapot. Carefully hand-wrapped and curated for a premium gifting experience.', 3899.00, 22, 4),
(9, 'Sweetheart\'s Delight', 'A collection of fresh macarons, red velvet cookies, strawberry-infused honey, and premium fruit preserves. Carefully hand-wrapped and curated for a premium gifting experience.', 2499.00, 35, 4),
(10, 'Elegant Indulgence', 'Bring the spa home with lavender essential oils, body scrubs, bath bombs, and cozy slipper socks. Carefully hand-wrapped and curated for a premium gifting experience.', 4599.00, 28, 4),
(11, 'Gourmet Rendezvous', 'A vintage wicker basket with ceramic plates, luxury olives, smoked salmon, and a sparkling rose wine. Carefully hand-wrapped and curated for a premium gifting experience.', 9500.00, 10, 4),
(12, 'Perfect Pair', 'Single-origin coffee beans, rich drinking cocoa, marshmallow swirls, and two hand-painted ceramic mugs. Carefully hand-wrapped and curated for a premium gifting experience.', 2999.00, 50, 4),
(13, 'Forever & Always', 'Personalized leather journal, elegant metal pen, gourmet tea tins, and a premium box of Belgian biscuits. Carefully hand-wrapped and curated for a premium gifting experience.', 3299.00, 30, 4),
(14, 'Velvet Whisper', 'Infused with the rich scent of Oud and Bulgarian roses. Includes luxury perfume, hand wash, and luxury body lotion.', 5999.00, 15, 4),
(15, 'Signature Gold', 'For the true epicurean: black truffle oil, premium caviar, sourdough crisps, and fine vintage champagne. Carefully hand-wrapped and curated for a premium gifting experience.', 14999.00, 8, 4),
(16, 'Cupid\'s Cocoa', 'Rich dark cocoa powder, gourmet vanilla marshmallows, waffle rolls, and luxury white chocolate drops. Carefully hand-wrapped and curated for a premium gifting experience.', 1899.00, 45, 4),
(17, 'Timeless Elegance', 'A vintage-style chest containing organic white tea, jasmine soaps, a pearl-inlaid jewelry tray, and gourmet almonds. Carefully hand-wrapped and curated for a premium gifting experience.', 4899.00, 20, 4),
(18, 'Whispering Pines', 'A rustic pine crate featuring woolen throws, gingerbread biscuits, mulled wine mix, and aromatic cedar candles. Carefully hand-wrapped and curated for a premium gifting experience.', 5299.00, 14, 4),
(19, 'Sweet Nectar', 'Organic wildflower honey, walnut honey-dripper, dry roasted macadamias, cashews, and glazed figs. Carefully hand-wrapped and curated for a premium gifting experience.', 2799.00, 28, 4),
(20, 'Sapphire Dream', 'Includes mineral-rich dead sea salts, eucalyptus body scrub, aromatherapy diffuser, and a soft waffle towel. Carefully hand-wrapped and curated for a premium gifting experience.', 4699.00, 24, 4);

-- 12b. Seed Corporate Hampers Products (Starting from ID 21)
INSERT INTO products (product_id, name, description, price, stock, category_id) VALUES
(21, 'Charm Leather', 'AICA Personalised Name & Charm Leather Combo Women Gift Set (Wine) | Gifts for Woman | Rakhi Rakshabandhan Gift for Sister. Carefully hand-wrapped and curated for a premium gifting experience.', 1000.00, 52, 2),
(22, 'Wooden Dry', 'Multipurpose Wooden Dry Fruit Box With 3 Glass Jar Set Gift Hamper | Mukhwas Supari Dry Fruit Storage Container Box Empty | Perfect For Corporate, Diwali, Wedding, Housewarming Gifting. Carefully hand-wrapped and curated for a premium gifting experience.', 799.00, 60, 2),
(23, 'Executive Green', 'Gift Combo D Executive Green Gift Box | Premium Sustainable Corporate Gift Set with Bamboo Bottle, Diary Kit, Eco Desk Calendar, Bamboo Pen & Luxury Hamper. Carefully hand-wrapped and curated for a premium gifting experience.', 649.00, 84, 2),
(24, 'Leatherette Gift', 'Gifting Best Wishes Luxury Collapsible Leatherette Gift Hamper Set – Leatherette Basket with Clear Window & 2 Potli Bags | Diwali Corporate Gift | Wedding Return Gift | Dhanteras Dry Fruit Sweet Packaging. Carefully hand-wrapped and curated for a premium gifting experience.', 599.00, 30, 2),
(25, 'Dry Fruits', 'Premium Dry Fruits Gift Hamper with Wooden Crate | Cashews (Kaju), Raisins (Kismis) & Almonds (Badam) in Reusable Glass Jars | Elegant Festive Gift Box for Diwali, Weddings, Corporate Gifting & Special Occasions. Carefully hand-wrapped and curated for a premium gifting experience.', 1199.00, 25, 2),
(26, 'ZEVORA 4', 'ZEVORA 4 in 1 Gift Set for Man – Leather Wallet, Reversible Belt, Crystal Pen & Stainless Steel Keychain | Birthday Gift| Gift Hamper for Husband, Father, Boyfriend, Corporate Gifts (MTBL42BR). Carefully hand-wrapped and curated for a premium gifting experience.', 1200.00, 95, 2),
(27, 'Leather Gift', 'Personalised Leather Gift Set for Men & Women | Brown | Wallet, Passport Cover, Keychain, Pen & Travel Pouch | Premium Customizable Gift Hamper for Birthday & Corporate Gifting. Carefully hand-wrapped and curated for a premium gifting experience.', 1299.00, 65, 2),
(28, 'NCGIFTS Personalized', 'NCGIFTS Personalized Gift Hamper for Men - Custom Engraved Wallet, Metal Pen, Water Bottle & Keychain Set | Premium 4-in-1 Combo for Birthday, Anniversary & Corporate Gifting. Carefully hand-wrapped and curated for a premium gifting experience.', 1549.00, 36, 2),
(29, 'Healthy Treat', 'Healthy Treat Grand Diwali Gift Hamper | Roasted Dry fruits, Healthy Snacks, Diwali-Gift Box with Vastu Turtle, Brass Diya & Greeting Card | Wholesome Corporate Gifting | Deepawali Gift Hamper for Gifting. Carefully hand-wrapped and curated for a premium gifting experience.', 2000.00, 96, 2),
(30, 'Omay Foods', 'Omay Foods 7 pcs_HOLIDAY CHEER Gift Box | Roasted Snacks, Dry Fruits & Chocolate Treats | Corporate New Yars Gift Hamper for Employees & Clients | Motivation Gift Hamper | Gourmet Snack Gift Box. Carefully hand-wrapped and curated for a premium gifting experience.', 1699.00, 63, 2),
(31, 'Tea Ark', 'The Tea Ark Delight Christmas New Year Gift Box | Orthodox Black & High Grown Long Leaf Green Tea | Elevate Your Tea Experience (50g x 2 Dome Tins). Carefully hand-wrapped and curated for a premium gifting experience.', 799.00, 42, 2),
(32, 'Hamper for', 'Rarejoy Gift Hamper for Women Sunflower Themed Mug Handwoven Crochet Greeting Card Journal Combo Pack of 4 Corporate Valentine Womens Birthday Anniversary Day Gift. Carefully hand-wrapped and curated for a premium gifting experience.', 649.00, 57, 2),
(33, 'Omay Foods', 'Omay Foods 10 Pcs Sparkling Delights Gift Hamper | Healthy Snacks, Dry Fruits, Herbal Tea & Chocolate | Corporate Gift, Employee Farewell, Work Anniversary & Wedding Return Gift | Oil-Free, Premium. Carefully hand-wrapped and curated for a premium gifting experience.', 899.00, 96, 2),
(34, 'Premium Dry', 'Premium Dry Fruit Gift Box – Almonds & Cashews in Unbreakable Jars | Elegant Red-Golden Box | Healthy Gifting Hamper for Festivals, Birthdays, Corporate & Family Occasions - 400 gm. Carefully hand-wrapped and curated for a premium gifting experience.', 599.00, 37, 2),
(35, 'Midnight Stash', 'THE GIFT STUDIO.COM | Midnight Stash Premium Snack Gift Hamper | Smoked Almonds, Roasted & Salted Cashews, Cashew Brittle, Chocolate Gift Box | Gourmet Dry Fruit Hamper, Corporate Gifting, Rakhi Gift Hamper, Rakhi Gift for Brother, Rakhi Gift for sister. Carefully hand-wrapped and curated for a premium gifting experience.', 449.00, 85, 2),
(36, 'Jumbo Happy', 'Jumbo Happy Rakhi Gift Hamper - 10-Item Raksha Bandhan Gift for Brother – Dry-Fruit Chocolate Laddoos, Chocolate Cashews, Evil Eye Rakhi with Roli-Chawal, Millet Namkeen & more | Premium Gift Hamper Combo Set. Carefully hand-wrapped and curated for a premium gifting experience.', 2999.00, 54, 2),
(37, 'Festive Celebration', 'Celebrate special moments with our Festive Celebration Premium Gift Hamper, featuring healthy snacks, delicious sweets. Carefully hand-wrapped and curated for a premium gifting experience.', 500.00, 51, 2),
(38, 'Rakhi Gift', 'Bandhan - 10-Item Rakhi Gift Hamper for brother with set of 2 Premium Rakhis, Chocolate Coated Cashews & Almonds, Hazelnut Dry-Fruit Laddoos | Rakhi for Brother with Gift Combo Set by Eat Better Co. Carefully hand-wrapped and curated for a premium gifting experience.', 699.00, 49, 2),
(39, 'Luxury Gourmet', 'A beautifully curated luxury gift hamper featuring premium chocolates, gourmet treats, and elegant packaging. Carefully hand-wrapped and curated for a premium gifting experience.', 300.00, 50, 2),
(40, 'Omay Foods', 'Omay Foods 7 pcs_HOLIDAY CHEER Gift Box | Roasted Snacks, Dry Fruits & Chocolate Treats | Corporate New Yars Gift Hamper for Employees & Clients | Motivation Gift Hamper | Gourmet Snack Gift Box. Carefully hand-wrapped and curated for a premium gifting experience.', 349.00, 53, 2);

-- 12c. Seed Birthday Hampers Products (Starting from ID 41)
INSERT INTO products (product_id, name, description, price, stock, category_id) VALUES
(41, 'Chocolate Birthday', 'A luxurious birthday gift hamper filled with premium chocolates. Carefully hand-wrapped and curated for a premium gifting experience.', 200.00, 89, 3),
(42, 'Cake & Chocolate', 'A birthday gift hamper with a delicious cake and celebration items. Carefully hand-wrapped and curated for a premium gifting experience.', 996.00, 78, 3),
(43, 'Flower Birthday', 'A beautiful gift hamper with fresh flowers and birthday surprises. Carefully hand-wrapped and curated for a premium gifting experience.', 500.00, 68, 3),
(44, 'Teddy Bear', 'A cute birthday hamper with a soft teddy bear and sweet gifts. Carefully hand-wrapped and curated for a premium gifting experience.', 3000.00, 10, 3),
(45, 'Personalized Birthday', 'A customized birthday hamper with personalized gifts and sweet surprises. Carefully hand-wrapped and curated for a premium gifting experience.', 877.00, 33, 3),
(46, 'Luxury Birthday', 'A premium birthday hamper with luxury gifts and elegant packaging. Carefully hand-wrapped and curated for a premium gifting experience.', 1500.00, 27, 3),
(47, 'Spa & Wellness', 'A birthday hamper with relaxing spa products. Carefully hand-wrapped and curated for a premium gifting experience.', 2000.00, 37, 3),
(48, 'Beauty & Skincare', 'A birthday hamper with beauty and skincare products. Carefully hand-wrapped and curated for a premium gifting experience.', 1558.00, 87, 3),
(49, 'Tea & Coffee', 'Premium tea and coffee gifts. Carefully hand-wrapped and curated for a premium gifting experience.', 999.00, 45, 3),
(50, 'Gourmet Food', 'Premium food treats hamper. Carefully hand-wrapped and curated for a premium gifting experience.', 677.00, 11, 3),
(51, 'Dry Fruit', 'Healthy dry fruit gifts. Carefully hand-wrapped and curated for a premium gifting experience.', 1400.00, 56, 3),
(52, 'Fresh Fruit', 'Fresh fruit gift hamper. Carefully hand-wrapped and curated for a premium gifting experience.', 2899.00, 21, 3),
(53, 'Kids Birthday', 'Fun gifts for kids. Carefully hand-wrapped and curated for a premium gifting experience.', 1200.00, 25, 3),
(54, 'Men\'s Birthday', 'Stylish gifts for men. Carefully hand-wrapped and curated for a premium gifting experience.', 2500.00, 34, 3),
(55, 'Women\'s Birthday', 'Elegant gifts for women. Carefully hand-wrapped and curated for a premium gifting experience.', 988.00, 39, 3),
(56, 'Fitness Birthday', 'Healthy gifts for fitness lovers. Carefully hand-wrapped and curated for a premium gifting experience.', 1000.00, 76, 3),
(57, 'Pet Lover', 'Gifts for pet lovers. Carefully hand-wrapped and curated for a premium gifting experience.', 1233.00, 43, 3),
(58, 'Balloon Surprise', 'Fun birthday surprise gifts. Carefully hand-wrapped and curated for a premium gifting experience.', 976.00, 34, 3),
(59, 'Celebration Birthday', 'Complete birthday celebration gifts. Carefully hand-wrapped and curated for a premium gifting experience.', 2455.00, 28, 3),
(60, 'Premium Customized', 'Unique personalized birthday gifts. Carefully hand-wrapped and curated for a premium gifting experience.', 3344.00, 24, 3);

-- 12d. Seed Wedding Hampers Products (Starting from ID 61)
INSERT INTO products (product_id, name, description, price, stock, category_id) VALUES
(61, 'Bridal Hamper', 'Celebrate the union of two hearts with our Bridal Hamper – Personalised Couple Wedding Luxury Gift Hamper. Elegantly curated with premium chocolates, gourmet treats, dry fruits, scented candles, luxury skincare essentials, and personalized keepsakes.', 4999.00, 25, 1),
(62, 'Sahbandh Personalized', 'Sahbandh is a premium personalized wedding gift hamper featuring gourmet chocolates, dry fruits, luxury candles, self-care essentials, and customized keepsakes. Elegantly packed in a reusable gift box with the couple\'s names and a heartfelt greeting card, it is the perfect gift for weddings, engagements, receptions, bridal showers, and anniversaries.', 4999.00, 20, 1),
(63, 'White Rose', 'An elegant gift box featuring fresh white roses, delicate eustoma flowers, and a beautifully crafted bento cake, making it the perfect surprise for weddings, engagements, anniversaries, and romantic celebrations. Carefully hand-wrapped and curated for a premium gifting experience.', 2999.00, 20, 1),
(64, 'Refined Flavours', 'A luxurious wedding hamper filled with premium gourmet treats, artisanal snacks, chocolates, and elegant keepsakes, curated to celebrate love and togetherness. Carefully hand-wrapped and curated for a premium gifting experience.', 4999.00, 15, 1),
(65, 'Wings of', 'A sophisticated collection of premium chocolates, gourmet delights, and handcrafted gifts presented in an elegant gift box for unforgettable celebrations. Carefully hand-wrapped and curated for a premium gifting experience.', 3799.00, 18, 1),
(66, 'The Regal', 'Experience luxury with a curated assortment of premium delicacies, elegant accessories, and exquisite packaging, ideal for weddings and special occasions. Carefully hand-wrapped and curated for a premium gifting experience.', 5499.00, 12, 1),
(67, 'Royal Bloom', 'A magnificent floral arrangement featuring premium blooms designed to add elegance and charm to weddings, anniversaries, and grand celebrations. Carefully hand-wrapped and curated for a premium gifting experience.', 3499.00, 25, 1),
(68, 'Sweet Love', 'Celebrate every love story with a romantic hamper featuring chocolates, scented candles, gourmet treats, and personalized keepsakes beautifully packed in a luxury gift box. Carefully hand-wrapped and curated for a premium gifting experience.', 4299.00, 16, 1),
(69, 'Romantic Rose', 'A charming gift set featuring fresh roses and a pair of beautifully designed couple mugs, perfect for engagements, weddings, anniversaries, and Valentines Day. Carefully hand-wrapped and curated for a premium gifting experience.', 2499.00, 30, 1),
(70, 'Together Forever', 'An elegant decorative table centerpiece symbolizing everlasting love, crafted to enhance wedding receptions, anniversaries, and home décor. Carefully hand-wrapped and curated for a premium gifting experience.', 1999.00, 22, 1),
(71, 'Together Forever', 'An elegant decorative centerpiece symbolizing everlasting love, perfect for weddings, anniversaries, and home décor. Carefully hand-wrapped and curated for a premium gifting experience.', 1999.00, 20, 1),
(72, 'Enchanted Mehndi', 'A stunning balloon arch designed to elevate mehndi ceremonies with vibrant colors and premium decorations. Carefully hand-wrapped and curated for a premium gifting experience.', 3499.00, 15, 1),
(73, 'Timeless Love', 'A beautifully crafted keepsake that celebrates the everlasting bond between couples, making it a memorable wedding gift. Carefully hand-wrapped and curated for a premium gifting experience.', 2499.00, 18, 1),
(74, 'Romantic Glow', 'A personalized LED acrylic lamp featuring custom names or photos, creating a warm and romantic ambiance for couples. Carefully hand-wrapped and curated for a premium gifting experience.', 1799.00, 25, 1),
(75, 'Nuyug 22K', 'An elegant 22K gold-layered pearl necklace designed to complement bridal and festive attire with timeless beauty. Carefully hand-wrapped and curated for a premium gifting experience.', 5999.00, 10, 1),
(76, 'Mr. & Mrs.', 'A premium ceramic mug set designed for newlyweds, featuring elegant Mr. and Mrs.', 1299.00, 30, 1),
(77, 'Elephant Key', 'A handcrafted elephant-themed key holder that combines functionality with traditional home décor aesthetics. Carefully hand-wrapped and curated for a premium gifting experience.', 899.00, 35, 1),
(78, 'Dressed in', 'A rich and creamy eggless truffle cake crafted for weddings, engagements, and romantic celebrations. Carefully hand-wrapped and curated for a premium gifting experience.', 1499.00, 20, 1),
(79, 'Love in', 'A personalized photo frame that beautifully captures precious memories of love, weddings, and anniversaries. Carefully hand-wrapped and curated for a premium gifting experience.', 1599.00, 22, 1),
(80, 'Charming Moments', 'A luxurious wedding return hamper featuring premium chocolates, gourmet treats, beauty essentials, scented candles, and personalized keepsakes in elegant packaging. Carefully hand-wrapped and curated for a premium gifting experience.', 4999.00, 12, 1);

-- 13. Seed Anniversary Hampers Product Images (Reset to match IDs 1 to 20)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(1, 1, '/images/products/anniversary/image1.jpg'),
(2, 2, '/images/products/anniversary/image2.jpg'),
(3, 3, '/images/products/anniversary/image3.jpg'),
(4, 4, '/images/products/anniversary/image4.jpg'),
(5, 5, '/images/products/anniversary/image5.jpg'),
(6, 6, '/images/products/anniversary/image6.jpg'),
(7, 7, '/images/products/anniversary/image7.jpg'),
(8, 8, '/images/products/anniversary/image8.jpg'),
(9, 9, '/images/products/anniversary/image9.jpg'),
(10, 10, '/images/products/anniversary/image10.jpg'),
(11, 11, '/images/products/anniversary/image11.jpg'),
(12, 12, '/images/products/anniversary/image12.jpg'),
(13, 13, '/images/products/anniversary/image13.jpg'),
(14, 14, '/images/products/anniversary/image14.jpg'),
(15, 15, '/images/products/anniversary/image15.jpg'),
(16, 16, '/images/products/anniversary/image16.jpg'),
(17, 17, '/images/products/anniversary/image17.jpg'),
(18, 18, '/images/products/anniversary/image18.png'),
(19, 19, '/images/products/anniversary/image19.webp'),
(20, 20, '/images/products/anniversary/image20.jpg');

-- 13b. Seed Corporate Hampers Product Images (Reset to match IDs 21 to 40)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(21, 21, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-20.webp?updatedAt=1785149479183'),
(22, 22, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-19.webp?updatedAt=1785149462457'),
(23, 23, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-18.webp?updatedAt=1785149442796'),
(24, 24, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-17.webp?updatedAt=1785149422264'),
(25, 25, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-16.webp?updatedAt=1785149292595'),
(26, 26, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-15.webp?updatedAt=1785149268733'),
(27, 27, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-14.webp?updatedAt=1785149244982'),
(28, 28, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-13.webp?updatedAt=1785149224202'),
(29, 29, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-12.webp?updatedAt=1785149198879'),
(30, 30, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-11.webp?updatedAt=1785148563436'),
(31, 31, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-10.webp?updatedAt=1785148543698'),
(32, 32, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-9.webp?updatedAt=1785148519018'),
(33, 33, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-8.webp?updatedAt=1785148497972'),
(34, 34, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-7.webp?updatedAt=1785148459445'),
(35, 35, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-6.webp?updatedAt=1785148442946'),
(36, 36, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-5.webp?updatedAt=1785148133037'),
(37, 37, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-4.webp?updatedAt=1785148112562'),
(38, 38, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-3.webp?updatedAt=1785148093692'),
(39, 39, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-2.webp?updatedAt=1785148075275'),
(40, 40, 'https://ik.imagekit.io/StringStackHarish/project-images/corporate%20hampers-1.webp?updatedAt=1785148047274');

-- 13c. Seed Birthday Hampers Product Images (Reset to match IDs 41 to 60)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(41, 41, 'https://images.unsplash.com/photo-1549007994-cb92ca813bec?auto=format&fit=crop&q=80&w=600'),
(42, 42, 'https://ik.imagekit.io/stringstackmahesh/cake%20hamper.jpg'),
(43, 43, 'https://ik.imagekit.io/stringstackmahesh/flower%20hamper.jpg'),
(44, 44, 'https://ik.imagekit.io/stringstackmahesh/Teddy%20Bear%20Birthday%20Hampers.jpg'),
(45, 45, 'https://ik.imagekit.io/stringstackmahesh/personalized%20birtday%20hampers.jpg'),
(46, 46, 'https://ik.imagekit.io/stringstackmahesh/luxury%20%20birthday%20hamper.jpg'),
(47, 47, 'https://ik.imagekit.io/stringstackmahesh/Spa%20&%20Wellness%20Birthday%20Hampers.jpg'),
(48, 48, 'https://ik.imagekit.io/stringstackmahesh/Spa%20&%20Wellness%20Birthday%20Hampers.jpg'),
(49, 49, 'https://ik.imagekit.io/stringstackmahesh/Tea%20&%20Coffee%20Birthday%20Hampers.jpg'),
(50, 50, 'https://ik.imagekit.io/stringstackmahesh/Gourmet%20Food%20Birthday%20Hampers.jpg'),
(51, 51, 'https://ik.imagekit.io/stringstackmahesh/Dry%20Fruit%20Birthday%20Hampers.jpg'),
(52, 52, 'https://ik.imagekit.io/stringstackmahesh/Dry%20Fruit%20Birthday%20Hampers.jpg'),
(53, 53, 'https://ik.imagekit.io/stringstackmahesh/Kids%20Birthday%20Hampers.jpg'),
(54, 54, 'https://ik.imagekit.io/stringstackmahesh/men%20hamper.jpg'),
(55, 55, 'https://ik.imagekit.io/stringstackmahesh/womens%20birtday.jpg'),
(56, 56, 'https://ik.imagekit.io/stringstackmahesh/fitness%20birthday%20hamper.jpg'),
(57, 57, 'https://ik.imagekit.io/stringstackmahesh/Pet%20Lover%20Birthday%20Hampers.jpg'),
(58, 58, 'https://ik.imagekit.io/stringstackmahesh/ballon%20birtday.jpg'),
(59, 59, 'https://ik.imagekit.io/stringstackmahesh/Celebration%20Birthday%20Hampers.jpg'),
(60, 60, 'https://ik.imagekit.io/stringstackmahesh/premium%20birtday.jpg');

-- 13d. Seed Wedding Hampers Product Images (Reset to match IDs 61 to 80)
INSERT INTO productimages (image_id, product_id, image_url) VALUES
(61, 61, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/bridal_hamper.jfif?updatedAt=1785149567998'),
(62, 62, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/Sahbandh.avif?updatedAt=1785149568918'),
(63, 63, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/white-rose-n-eustoma-luxe-bento-cake-box.webp?updatedAt=1785149568892'),
(64, 64, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/refined-flavours-wedding-hamper_.webp?updatedAt=1785149568859'),
(65, 65, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/wings-of-an-angel-assortment.webp?updatedAt=1785149568745'),
(66, 66, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/the-regal-fusion-box.webp?updatedAt=1785149568785'),
(67, 67, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/royal-bloom-arrangement_.webp?updatedAt=1785149568814'),
(68, 68, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/sweet-love-story-hamper.webp?updatedAt=1785149568713'),
(69, 69, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/romantic-rose-n-couple-mug-duo.webp?updatedAt=1785149568676'),
(70, 70, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/romantic-rose-n-couple-mug-duo.webp?updatedAt=1785149568676'),
(71, 71, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/together-forever-table-decor.webp?updatedAt=1785149568614'),
(72, 72, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/enchanted-mehndi-balloon-arch.webp?updatedAt=1785149568669'),
(73, 73, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/timeless-love-keepsake.webp?updatedAt=1785149568655'),
(74, 74, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/romantic-glow-personalized-square-led-acrylic-lamp.webp?updatedAt=1785149568666'),
(75, 75, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/nuyug-22k-gold-layered-pearl-necklace.webp?updatedAt=1785149568673'),
(76, 76, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/mr-n-mrs-keepsake-mug-set.webp?updatedAt=1785149568414'),
(77, 77, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/elephant-key-holder-wall-hanging.webp?updatedAt=1785149568248'),
(78, 78, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/dressed-in-love-truffle-eggless-cake.webp?updatedAt=1785149568174'),
(79, 79, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/love-in-every-frame.webp?updatedAt=1785149568059'),
(80, 80, 'https://ik.imagekit.io/stringstacksai/Wedding_Hampers/charming-moments-hamper.webp?updatedAt=1785149568078');



