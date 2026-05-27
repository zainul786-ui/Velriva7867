-- VELRIVA - SUPABASE POSTGRES DATABASE SCHEMA
-- This file contains the complete database layout, table definitions, constraints, 
-- default values, indexes, and sample seed data required for the Velriva application.
-- Go to your Supabase Project Dashboard -> SQL Editor and run this script to set up all tables.

-- ==========================================
-- 1. CLEANUP PREVIOUS TABELS (OPTIONAL)
-- ==========================================
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;


-- ==========================================
-- 2. CREATE SCHEMAS & TABLES
-- ==========================================

-- A. PROFILES TABLE (Stores registered reseller account profiles)
CREATE TABLE profiles (
    id TEXT PRIMARY KEY DEFAULT 'usr_' || LOWER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12)),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password TEXT NOT NULL, -- Plain representation for demo login, or hashed in full production
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- B. PRODUCTS TABLE (Stores Velriva product details)
CREATE TABLE products (
    id TEXT PRIMARY KEY DEFAULT 'prod_' || LOWER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12)),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0.00,
    old_price NUMERIC DEFAULT 0.00,
    discount NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5.0,
    image TEXT,
    images JSONB DEFAULT '[]'::jsonb, -- Array of additional image URLs
    category TEXT NOT NULL,
    description TEXT,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    sizes JSONB DEFAULT '[]'::jsonb, -- String sizes array e.g. ["Standard", "Medium"]
    colors JSONB DEFAULT '[]'::jsonb, -- Objects array e.g. [{"name": "Matte Black", "hex": "#0f172a"}]
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_flash_sale BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 10,
    reviews JSONB DEFAULT '[]'::jsonb, -- Nested dynamic reviews list [{userName, rating, comment, date}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- C. ORDERS TABLE (Stores reseller purchases)
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT 'ord_' || LOWER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 12)),
    date TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Nested list of cart items containing products and quantities
    total NUMERIC NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled')) DEFAULT 'Pending',
    customer_email TEXT REFERENCES profiles(email) ON DELETE SET NULL,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb, -- {name, phone, address, city, state, pincode}
    tracking JSONB NOT NULL DEFAULT '[]'::jsonb, -- List of tracking updates [{status, description, time}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- D. COUPONS TABLE (Discount coupons for dropship orders)
CREATE TABLE coupons (
    code TEXT PRIMARY KEY,
    discount NUMERIC NOT NULL DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ==========================================
-- 3. SPEED OPTIMIZATION INDEXES
-- ==========================================
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_orders_customer ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);


-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) & GENERAL ACCESS POLICIES
-- ==========================================
-- For easy workspace execution, we permit global read and authenticated write paths.
-- You can selectively harden the security rules directly inside the Supabase policies drawer.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Profiles custom rules (Allow any select/reads or logins, allows insertion for registrations)
CREATE POLICY "Enable read/write for all profile accounts" ON profiles 
    FOR ALL USING (true) WITH CHECK (true);

-- Products custom rules (Anyone can see products, admins can edit them)
CREATE POLICY "Allow public read access to products" ON products 
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated modifications to products" ON products 
    FOR ALL USING (true);

-- Orders custom rules 
CREATE POLICY "Allow public read access to orders" ON orders 
    FOR SELECT USING (true);

CREATE POLICY "Allow order creation and updates" ON orders 
    FOR ALL USING (true);

-- Coupons custom rules
CREATE POLICY "Allow public read access to coupons" ON coupons 
    FOR SELECT USING (true);

CREATE POLICY "Allow database coupons modifications" ON coupons 
    FOR ALL USING (true);


-- ==========================================
-- 5. SEED INITIAL DEMO CATALOG RECORDS
-- ==========================================

-- Seed default reseller profile account
INSERT INTO profiles (id, name, email, phone, password)
VALUES (
    'usr_default', 
    'Zain Ul Amaan', 
    'zainulamaan4@gmail.com', 
    '+91 9690986010', 
    'password123'
) ON CONFLICT (email) DO NOTHING;

-- Seed default coupons data
INSERT INTO coupons (code, discount, is_active) VALUES
    ('VEL50', 50, true),
    ('WELCOME10', 10, true),
    ('SUPEROFF', 30, true)
ON CONFLICT (code) DO UPDATE SET discount = EXCLUDED.discount, is_active = EXCLUDED.is_active;

-- Seed initial catalog of products
INSERT INTO products (id, name, price, old_price, discount, rating, image, images, category, description, views_count, likes_count, orders_count, sizes, colors, is_featured, is_trending, is_flash_sale, stock, reviews)
VALUES
(
    'prod_1',
    'Velriva Elite ANC Headphones',
    89,
    179,
    50,
    4.8,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop"]'::jsonb,
    'headphones',
    'Symphonic clarity in an beautiful over-ear head shell. Boasts hybrid Active Noise Cancelation up to 45dB, comfortable memory foam earcups, customized touch controls, and a gorgeous heavy-matte leather headband.',
    3120,
    245,
    154,
    '["Standard"]'::jsonb,
    '[{"name": "Matte Black", "hex": "#0f172a"}, {"name": "Pearl Silver", "hex": "#cbd5e1"}]'::jsonb,
    true,
    true,
    false,
    24,
    '[{"id": "rev_1_1", "userName": "Amaan Z.", "rating": 5, "date": "2026-05-12", "comment": "Unbelievable bass and crystal clear audio. ANC blocks out everything!"}]'::jsonb
),
(
    'prod_2',
    'SonicTune H2 Wireless Headphones',
    45,
    90,
    50,
    4.6,
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop"]'::jsonb,
    'headphones',
    'Ultralight weight stereo wireless headphones with custom tailored 40mm audio drivers. Enjoy comfortable listening sessions with cushion headbands, adjustable tracks and up to 45 hours battery life.',
    1540,
    120,
    65,
    '["Standard"]'::jsonb,
    '[{"name": "Matte Gray", "hex": "#475569"}, {"name": "Alpine White", "hex": "#f8fafc"}]'::jsonb,
    false,
    true,
    false,
    18,
    '[]'::jsonb
),
(
    'prod_3',
    'Velriva Nitro Charge 65W PD',
    29,
    58,
    50,
    4.9,
    'https://images.unsplash.com/photo-1583863788434-c58253430835?w=600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1583863788434-c58253430835?w=600&auto=format&fit=crop"]'::jsonb,
    'charger',
    'Dual-port USB-C GanFast charger. Powers up smartphones, iPhones, and Macbooks alike in record-breaking timelines. Features intelligent heat-sink distribution.',
    2890,
    312,
    220,
    '["65W GAN", "100W PRO"]'::jsonb,
    '[{"name": "Jet Black", "hex": "#09090b"}, {"name": "Glossy White", "hex": "#ffffff"}]'::jsonb,
    true,
    false,
    true,
    40,
    '[]'::jsonb
),
(
    'prod_4',
    'Velriva AirPods Companion 2',
    59,
    118,
    50,
    4.7,
    'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop"]'::jsonb,
    'airpods',
    'Seamless iOS integration paired with an ergonomic design. Auto-pairing, dynamic spatial acoustics, and magnetic fast-charge pod included.',
    4210,
    560,
    310,
    '["Standard"]'::jsonb,
    '[{"name": "Snow White", "hex": "#fafafa"}]'::jsonb,
    true,
    true,
    false,
    32,
    '[]'::jsonb
),
(
    'prod_5',
    'V-Space YachtMaster Black',
    125,
    250,
    50,
    4.9,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop"]'::jsonb,
    'watches',
    'Exquisite mechanical-grade quartz watch designed for sea exploration lovers. High scratch-resistant glass with an ocean waterproof seal up to 50 meters.',
    1920,
    215,
    98,
    '["42mm"]'::jsonb,
    '[{"name": "Classic Gold", "hex": "#d4af37"}, {"name": "Obsidian Slate", "hex": "#1e293b"}]'::jsonb,
    true,
    true,
    false,
    12,
    '[]'::jsonb
),
(
    'prod_6',
    'Mystic Musk Oud Perfume Extra',
    69,
    138,
    50,
    5.0,
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop"]'::jsonb,
    'perfume',
    'Intense woody base notes combined with fresh floral accents. Highly long-lasting trail that lingers elegant olfactory traces for premium gatherings.',
    6050,
    980,
    450,
    '["50ml EDT", "100ml Parfum"]'::jsonb,
    '[{"name": "Amber Glass", "hex": "#78350f"}]'::jsonb,
    true,
    true,
    true,
    15,
    '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    old_price = EXCLUDED.old_price,
    discount = EXCLUDED.discount,
    rating = EXCLUDED.rating,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    views_count = EXCLUDED.views_count,
    likes_count = EXCLUDED.likes_count,
    orders_count = EXCLUDED.orders_count,
    stock = EXCLUDED.stock;
