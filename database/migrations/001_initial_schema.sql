-- Tony's Shoe Store - Initial Database Schema
-- PostgreSQL 17+
-- Following best practices from postgres-database-skill

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX users_email_lower_idx ON users (LOWER(email));
CREATE INDEX users_created_at_idx ON users (created_at);

COMMENT ON TABLE users IS 'Registered users/customers';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';

-- ============================================
-- 2. ADDRESSES TABLE
-- ============================================
CREATE TABLE addresses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL DEFAULT 'shipping' CHECK (address_type IN ('shipping', 'billing', 'both')),
  street_address TEXT NOT NULL,
  apt_suite TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes (FK columns must be indexed manually in PostgreSQL!)
CREATE INDEX addresses_user_id_idx ON addresses (user_id);
CREATE INDEX addresses_default_idx ON addresses (user_id, is_default) WHERE is_default = true;

COMMENT ON TABLE addresses IS 'User shipping and billing addresses';

-- ============================================
-- 3. BRANDS TABLE
-- ============================================
CREATE TABLE brands (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX brands_name_idx ON brands (name);
CREATE UNIQUE INDEX brands_slug_idx ON brands (slug);

COMMENT ON TABLE brands IS 'Shoe brands (Nike, Adidas, Jordan, etc.)';

-- ============================================
-- 4. CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX categories_name_idx ON categories (name);
CREATE UNIQUE INDEX categories_slug_idx ON categories (slug);

COMMENT ON TABLE categories IS 'Product categories (Running, Basketball, Lifestyle, etc.)';

-- ============================================
-- 5. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  brand_id BIGINT NOT NULL REFERENCES brands(id),
  category_id BIGINT NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  sale_price NUMERIC(10,2) CHECK (sale_price IS NULL OR (sale_price > 0 AND sale_price < price)),
  model_3d_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX products_slug_idx ON products (slug);
CREATE INDEX products_brand_id_idx ON products (brand_id);
CREATE INDEX products_category_id_idx ON products (category_id);
CREATE INDEX products_featured_idx ON products (is_featured) WHERE is_featured = true;
CREATE INDEX products_active_idx ON products (is_active, created_at) WHERE is_active = true;

COMMENT ON TABLE products IS 'Shoe products';
COMMENT ON COLUMN products.model_3d_url IS 'URL to .glb 3D model for Three.js viewer';

-- ============================================
-- 6. PRODUCT IMAGES TABLE
-- ============================================
CREATE TABLE product_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX product_images_product_id_idx ON product_images (product_id);
CREATE INDEX product_images_primary_idx ON product_images (product_id, is_primary) WHERE is_primary = true;

COMMENT ON TABLE product_images IS 'Product image gallery';

-- ============================================
-- 7. PRODUCT VARIANTS TABLE
-- ============================================
CREATE TABLE product_variants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  sku TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  price_adjustment NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_unique_combination UNIQUE (product_id, size, color)
);

-- Indexes
CREATE UNIQUE INDEX product_variants_sku_idx ON product_variants (sku);
CREATE INDEX product_variants_product_id_idx ON product_variants (product_id);
CREATE INDEX product_variants_in_stock_idx ON product_variants (product_id, stock_quantity) WHERE stock_quantity > 0;

COMMENT ON TABLE product_variants IS 'Product size/color combinations with inventory';
COMMENT ON COLUMN product_variants.stock_quantity IS 'Current inventory count';

-- ============================================
-- 8. CART ITEMS TABLE
-- ============================================
CREATE TABLE cart_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cart_items_unique_user_variant UNIQUE (user_id, variant_id)
);

-- Indexes
CREATE INDEX cart_items_user_id_idx ON cart_items (user_id);
CREATE INDEX cart_items_variant_id_idx ON cart_items (variant_id);

COMMENT ON TABLE cart_items IS 'Shopping cart line items';

-- ============================================
-- 9. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  subtotal_amount NUMERIC(10,2) NOT NULL CHECK (subtotal_amount >= 0),
  shipping_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount > 0),
  shipping_address TEXT NOT NULL,
  tracking_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX orders_user_id_idx ON orders (user_id);
CREATE INDEX orders_status_idx ON orders (status);
CREATE INDEX orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX orders_user_recent_idx ON orders (user_id, created_at DESC);

COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON COLUMN orders.shipping_address IS 'JSON-serialized address snapshot at order time';

-- ============================================
-- 10. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0)
);

-- Indexes
CREATE INDEX order_items_order_id_idx ON order_items (order_id);
CREATE INDEX order_items_variant_id_idx ON order_items (variant_id);

COMMENT ON TABLE order_items IS 'Order line items with price snapshots';
COMMENT ON COLUMN order_items.product_name IS 'Product name snapshot at order time';

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================

-- Insert sample brands
INSERT INTO brands (name, slug, description) VALUES
  ('Nike', 'nike', 'Just Do It'),
  ('Adidas', 'adidas', 'Impossible is Nothing'),
  ('Jordan', 'jordan', 'Air Jordan Brand'),
  ('New Balance', 'new-balance', 'Made in USA'),
  ('Puma', 'puma', 'Forever Faster'),
  ('Reebok', 'reebok', 'Be More Human');

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Running', 'running', 'Performance running shoes'),
  ('Basketball', 'basketball', 'Basketball sneakers'),
  ('Lifestyle', 'lifestyle', 'Casual everyday wear'),
  ('Training', 'training', 'Cross-training and gym shoes'),
  ('Skateboarding', 'skateboarding', 'Skate shoes'),
  ('Football', 'football', 'Soccer cleats and boots');

-- Grant permissions (adjust role as needed)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
