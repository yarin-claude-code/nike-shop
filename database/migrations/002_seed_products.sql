-- Tony's Shoe Store - Seed Products Data
-- Run this AFTER 001_initial_schema.sql

-- High-quality shoe images from Unsplash (free to use)
-- Image references:
-- img1: https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80 (Red Nike)
-- img2: https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80 (White sneaker)
-- img3: https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80 (Nike Air Max)
-- img4: https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80 (Colorful Nike)
-- img5: https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80 (White Nike)
-- img6: https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80 (Jordan)
-- img7: https://images.unsplash.com/photo-1584735175315-9d5df23be6c0?w=800&q=80 (Adidas)
-- img8: https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80 (Black sneaker)

-- ============================================
-- INSERT PRODUCTS
-- ============================================

-- Product 1: Air Max 90 (Nike - Lifestyle)
INSERT INTO products (brand_id, category_id, name, slug, description, price, sale_price, model_3d_url, is_featured, is_active)
VALUES (
  (SELECT id FROM brands WHERE slug = 'nike'),
  (SELECT id FROM categories WHERE slug = 'lifestyle'),
  'Air Max 90',
  'air-max-90',
  'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU accents. Fresh colors give a modern look while Max Air cushioning adds comfort to your journey.',
  130.00,
  NULL,
  '/models/shoe.glb',
  true,
  true
);

-- Product 2: Ultraboost 22 (Adidas - Running)
INSERT INTO products (brand_id, category_id, name, slug, description, price, sale_price, model_3d_url, is_featured, is_active)
VALUES (
  (SELECT id FROM brands WHERE slug = 'adidas'),
  (SELECT id FROM categories WHERE slug = 'running'),
  'Ultraboost 22',
  'ultraboost-22',
  'These running shoes deliver incredible energy return with every stride. The BOOST midsole and Linear Energy Push system work together to propel you forward.',
  190.00,
  159.99,
  '/models/shoe.glb',
  true,
  true
);

-- Product 3: Air Jordan 1 Retro High OG (Jordan - Lifestyle)
INSERT INTO products (brand_id, category_id, name, slug, description, price, sale_price, model_3d_url, is_featured, is_active)
VALUES (
  (SELECT id FROM brands WHERE slug = 'jordan'),
  (SELECT id FROM categories WHERE slug = 'lifestyle'),
  'Air Jordan 1 Retro High OG',
  'air-jordan-1-retro-high',
  'The Air Jordan 1 Retro High remakes the classic sneaker with premium materials and crisp details. Full-length Nike Air unit and padded collar deliver all-day comfort.',
  180.00,
  NULL,
  '/models/shoe.glb',
  true,
  true
);

-- Product 4: Fresh Foam 1080v12 (New Balance - Running)
INSERT INTO products (brand_id, category_id, name, slug, description, price, sale_price, model_3d_url, is_featured, is_active)
VALUES (
  (SELECT id FROM brands WHERE slug = 'new-balance'),
  (SELECT id FROM categories WHERE slug = 'running'),
  'Fresh Foam 1080v12',
  'fresh-foam-1080v12',
  'The most cushioned shoe in the Fresh Foam collection. Designed to deliver ultra-plush comfort for long runs and daily training.',
  165.00,
  139.99,
  '/models/shoe.glb',
  true,
  true
);

-- Product 5: RS-X3 Puzzle (Puma - Lifestyle)
INSERT INTO products (brand_id, category_id, name, slug, description, price, sale_price, model_3d_url, is_featured, is_active)
VALUES (
  (SELECT id FROM brands WHERE slug = 'puma'),
  (SELECT id FROM categories WHERE slug = 'lifestyle'),
  'RS-X3 Puzzle',
  'rs-x3-puzzle',
  'Bold and chunky, the RS-X3 Puzzle takes the classic RS design and amplifies it with exaggerated proportions and vibrant color blocking.',
  110.00,
  NULL,
  '/models/shoe.glb',
  true,
  true
);

-- Product 6: Club C 85 Vintage (Reebok - Lifestyle)
INSERT INTO products (brand_id, category_id, name, slug, description, price, sale_price, model_3d_url, is_featured, is_active)
VALUES (
  (SELECT id FROM brands WHERE slug = 'reebok'),
  (SELECT id FROM categories WHERE slug = 'lifestyle'),
  'Club C 85 Vintage',
  'club-c-85-vintage',
  'Originally designed for the tennis court, the Club C 85 has become a streetwear icon. Clean lines and vintage styling make it endlessly versatile.',
  85.00,
  69.99,
  '/models/shoe.glb',
  true,
  true
);

-- Product 7: Dunk Low Retro (Nike - Skateboarding)
INSERT INTO products (brand_id, category_id, name, slug, description, price, sale_price, model_3d_url, is_featured, is_active)
VALUES (
  (SELECT id FROM brands WHERE slug = 'nike'),
  (SELECT id FROM categories WHERE slug = 'skateboarding'),
  'Dunk Low Retro',
  'dunk-low-retro',
  'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors.',
  110.00,
  NULL,
  '/models/shoe.glb',
  false,
  true
);

-- Product 8: Forum Low (Adidas - Lifestyle)
INSERT INTO products (brand_id, category_id, name, slug, description, price, sale_price, model_3d_url, is_featured, is_active)
VALUES (
  (SELECT id FROM brands WHERE slug = 'adidas'),
  (SELECT id FROM categories WHERE slug = 'lifestyle'),
  'Forum Low',
  'forum-low',
  'Born on the basketball court in 1984, the adidas Forum became a streetwear legend. This low-cut version delivers the same iconic style.',
  100.00,
  79.99,
  '/models/shoe.glb',
  false,
  true
);

-- ============================================
-- INSERT PRODUCT IMAGES
-- ============================================

-- Air Max 90 images
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
VALUES
  ((SELECT id FROM products WHERE slug = 'air-max-90'), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Air Max 90', true, 0),
  ((SELECT id FROM products WHERE slug = 'air-max-90'), 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80', 'Air Max 90 Side', false, 1);

-- Ultraboost 22 image
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
VALUES
  ((SELECT id FROM products WHERE slug = 'ultraboost-22'), 'https://images.unsplash.com/photo-1584735175315-9d5df23be6c0?w=800&q=80', 'Ultraboost 22', true, 0);

-- Air Jordan 1 image
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
VALUES
  ((SELECT id FROM products WHERE slug = 'air-jordan-1-retro-high'), 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80', 'Jordan 1', true, 0);

-- Fresh Foam 1080 image
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
VALUES
  ((SELECT id FROM products WHERE slug = 'fresh-foam-1080v12'), 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', 'Fresh Foam 1080', true, 0);

-- RS-X3 Puzzle image
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
VALUES
  ((SELECT id FROM products WHERE slug = 'rs-x3-puzzle'), 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', 'RS-X3', true, 0);

-- Club C 85 Vintage image
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
VALUES
  ((SELECT id FROM products WHERE slug = 'club-c-85-vintage'), 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', 'Club C 85', true, 0);

-- Dunk Low Retro image
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
VALUES
  ((SELECT id FROM products WHERE slug = 'dunk-low-retro'), 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80', 'Dunk Low', true, 0);

-- Forum Low image
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
VALUES
  ((SELECT id FROM products WHERE slug = 'forum-low'), 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', 'Forum Low', true, 0);

-- ============================================
-- INSERT PRODUCT VARIANTS
-- ============================================

-- Air Max 90 variants
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment)
VALUES
  ((SELECT id FROM products WHERE slug = 'air-max-90'), '8', 'Red', 'AM90-RED-8', 10, 0),
  ((SELECT id FROM products WHERE slug = 'air-max-90'), '9', 'Red', 'AM90-RED-9', 15, 0),
  ((SELECT id FROM products WHERE slug = 'air-max-90'), '10', 'Red', 'AM90-RED-10', 8, 0),
  ((SELECT id FROM products WHERE slug = 'air-max-90'), '8', 'Black', 'AM90-BLK-8', 12, 0),
  ((SELECT id FROM products WHERE slug = 'air-max-90'), '9', 'Black', 'AM90-BLK-9', 20, 0),
  ((SELECT id FROM products WHERE slug = 'air-max-90'), '10', 'Black', 'AM90-BLK-10', 5, 0);

-- Ultraboost 22 variants
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment)
VALUES
  ((SELECT id FROM products WHERE slug = 'ultraboost-22'), '8', 'White', 'UB22-WHT-8', 8, 0),
  ((SELECT id FROM products WHERE slug = 'ultraboost-22'), '9', 'White', 'UB22-WHT-9', 12, 0),
  ((SELECT id FROM products WHERE slug = 'ultraboost-22'), '10', 'White', 'UB22-WHT-10', 6, 0),
  ((SELECT id FROM products WHERE slug = 'ultraboost-22'), '11', 'White', 'UB22-WHT-11', 3, 0);

-- Air Jordan 1 variants
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment)
VALUES
  ((SELECT id FROM products WHERE slug = 'air-jordan-1-retro-high'), '8', 'Red', 'AJ1-RED-8', 5, 0),
  ((SELECT id FROM products WHERE slug = 'air-jordan-1-retro-high'), '9', 'Red', 'AJ1-RED-9', 7, 0),
  ((SELECT id FROM products WHERE slug = 'air-jordan-1-retro-high'), '10', 'Red', 'AJ1-RED-10', 4, 0),
  ((SELECT id FROM products WHERE slug = 'air-jordan-1-retro-high'), '8', 'Blue', 'AJ1-BLU-8', 6, 0),
  ((SELECT id FROM products WHERE slug = 'air-jordan-1-retro-high'), '9', 'Blue', 'AJ1-BLU-9', 8, 0);

-- Fresh Foam 1080v12 variants
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment)
VALUES
  ((SELECT id FROM products WHERE slug = 'fresh-foam-1080v12'), '8', 'White', 'FF1080-WHT-8', 10, 0),
  ((SELECT id FROM products WHERE slug = 'fresh-foam-1080v12'), '9', 'White', 'FF1080-WHT-9', 15, 0),
  ((SELECT id FROM products WHERE slug = 'fresh-foam-1080v12'), '10', 'White', 'FF1080-WHT-10', 8, 0),
  ((SELECT id FROM products WHERE slug = 'fresh-foam-1080v12'), '11', 'White', 'FF1080-WHT-11', 4, 0);

-- RS-X3 Puzzle variants
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment)
VALUES
  ((SELECT id FROM products WHERE slug = 'rs-x3-puzzle'), '8', 'Orange', 'RSX3-ORG-8', 12, 0),
  ((SELECT id FROM products WHERE slug = 'rs-x3-puzzle'), '9', 'Orange', 'RSX3-ORG-9', 18, 0),
  ((SELECT id FROM products WHERE slug = 'rs-x3-puzzle'), '10', 'Orange', 'RSX3-ORG-10', 10, 0);

-- Club C 85 Vintage variants
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment)
VALUES
  ((SELECT id FROM products WHERE slug = 'club-c-85-vintage'), '8', 'White', 'CC85-WHT-8', 20, 0),
  ((SELECT id FROM products WHERE slug = 'club-c-85-vintage'), '9', 'White', 'CC85-WHT-9', 25, 0),
  ((SELECT id FROM products WHERE slug = 'club-c-85-vintage'), '10', 'White', 'CC85-WHT-10', 15, 0),
  ((SELECT id FROM products WHERE slug = 'club-c-85-vintage'), '11', 'White', 'CC85-WHT-11', 8, 0);

-- Dunk Low Retro variants
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment)
VALUES
  ((SELECT id FROM products WHERE slug = 'dunk-low-retro'), '8', 'Black', 'DNK-BLK-8', 8, 0),
  ((SELECT id FROM products WHERE slug = 'dunk-low-retro'), '9', 'Black', 'DNK-BLK-9', 12, 0),
  ((SELECT id FROM products WHERE slug = 'dunk-low-retro'), '10', 'Black', 'DNK-BLK-10', 6, 0);

-- Forum Low variants
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment)
VALUES
  ((SELECT id FROM products WHERE slug = 'forum-low'), '8', 'White', 'FORUM-WHT-8', 14, 0),
  ((SELECT id FROM products WHERE slug = 'forum-low'), '9', 'White', 'FORUM-WHT-9', 20, 0),
  ((SELECT id FROM products WHERE slug = 'forum-low'), '10', 'White', 'FORUM-WHT-10', 10, 0);
