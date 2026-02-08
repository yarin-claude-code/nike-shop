# Tony's Shoe Store - Entity Relationship Diagram

## Database: tonys_shoes (PostgreSQL 17)

### Tables Overview

| Table | Rows (Est) | Description |
|-------|-----------|-------------|
| users | 10K-100K | Customer accounts |
| addresses | 20K-200K | Shipping/billing addresses |
| brands | 10-50 | Shoe brands (Nike, Adidas, etc.) |
| categories | 5-20 | Product categories |
| products | 1K-10K | Shoe products |
| product_images | 5K-50K | Product image gallery |
| product_variants | 10K-100K | Size/color combinations |
| cart_items | 5K-50K | Active cart items |
| orders | 50K-500K | Order history |
| order_items | 100K-1M | Order line items |

## Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                          TONY'S SHOE STORE                          │
│                         Database Schema (ERD)                       │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│      USERS           │
│──────────────────────│
│ • id (PK)            │──┐
│   email              │  │
│   password_hash      │  │
│   first_name         │  │
│   last_name          │  │
│   phone              │  │
│   created_at         │  │
│   updated_at         │  │
└──────────────────────┘  │
         │                │
         │ 1              │ 1
         │                │
         ▼ N              ▼ N
┌──────────────────────┐ ┌──────────────────────┐
│    ADDRESSES         │ │    CART_ITEMS        │
│──────────────────────│ │──────────────────────│
│ • id (PK)            │ │ • id (PK)            │
│   user_id (FK) ──────┘ │   user_id (FK) ──────┘
│   address_type       │ │   variant_id (FK)    │───┐
│   street_address     │ │   quantity           │   │
│   apt_suite          │ │   created_at         │   │
│   city               │ │   updated_at         │   │
│   state              │ └──────────────────────┘   │
│   postal_code        │                            │
│   country            │                            │
│   is_default         │                            │
│   created_at         │                            │
└──────────────────────┘                            │
                                                    │
┌──────────────────────┐                            │
│      ORDERS          │                            │
│──────────────────────│                            │
│ • id (PK)            │                            │
│   user_id (FK) ──────┘                            │
│   status             │                            │
│   subtotal_amount    │                            │
│   shipping_amount    │                            │
│   tax_amount         │                            │
│   total_amount       │                            │
│   shipping_address   │                            │
│   tracking_number    │                            │
│   created_at         │                            │
│   updated_at         │                            │
└──────────────────────┘                            │
         │                                          │
         │ 1                                        │
         │                                          │
         ▼ N                                        │
┌──────────────────────┐                            │
│    ORDER_ITEMS       │                            │
│──────────────────────│                            │
│ • id (PK)            │                            │
│   order_id (FK) ─────┘                            │
│   variant_id (FK)    │────────────────────────────┤
│   product_name       │                            │
│   size               │                            │
│   color              │                            │
│   quantity           │                            │
│   unit_price         │                            │
└──────────────────────┘                            │
                                                    │
                                                    │
                                                    ▼
                                          ┌──────────────────────┐
                                          │  PRODUCT_VARIANTS    │
                                          │──────────────────────│
                                          │ • id (PK)            │
                                          │   product_id (FK)    │──┐
                                          │   size               │  │
                                          │   color              │  │
                                          │   sku                │  │
                                          │   stock_quantity     │  │
                                          │   price_adjustment   │  │
                                          │   created_at         │  │
                                          │   updated_at         │  │
                                          └──────────────────────┘  │
                                                                    │
                                                                    │ N
                                                                    │
                                                                    ▼ 1
                                                          ┌──────────────────────┐
                                                          │     PRODUCTS         │
                                                          │──────────────────────│
                                                          │ • id (PK)            │
                                                          │   brand_id (FK) ─────┼──┐
                                                          │   category_id (FK) ──┼──┼──┐
                                                          │   name               │  │  │
                                                          │   slug               │  │  │
                                                          │   description        │  │  │
                                                          │   price              │  │  │
                                                          │   sale_price         │  │  │
                                                          │   model_3d_url       │  │  │
                                                          │   is_featured        │  │  │
                                                          │   is_active          │  │  │
                                                          │   created_at         │  │  │
                                                          │   updated_at         │  │  │
                                                          └──────────────────────┘  │  │
                                                                    │                │  │
                                                                    │ 1              │  │
                                                                    │                │  │
                                                                    ▼ N              │  │
                                                          ┌──────────────────────┐  │  │
                                                          │  PRODUCT_IMAGES      │  │  │
                                                          │──────────────────────│  │  │
                                                          │ • id (PK)            │  │  │
                                                          │   product_id (FK) ───┘  │  │
                                                          │   url                │  │  │
                                                          │   alt_text           │  │  │
                                                          │   is_primary         │  │  │
                                                          │   sort_order         │  │  │
                                                          │   created_at         │  │  │
                                                          └──────────────────────┘  │  │
                                                                                    │  │
┌──────────────────────┐                                                           │  │
│      BRANDS          │                                                           │  │
│──────────────────────│                                                           │  │
│ • id (PK)            │◄──────────────────────────────────────────────────────────┘  │
│   name               │                                                              │
│   slug               │                                                              │
│   logo_url           │                                                              │
│   description        │                                                              │
│   created_at         │                                                              │
└──────────────────────┘                                                              │
                                                                                      │
┌──────────────────────┐                                                              │
│    CATEGORIES        │                                                              │
│──────────────────────│                                                              │
│ • id (PK)            │◄─────────────────────────────────────────────────────────────┘
│   name               │
│   slug               │
│   description        │
│   image_url          │
│   created_at         │
└──────────────────────┘
```

## Indexes (38 total)

### Performance Indexes on FK Columns
```sql
-- Users
users_email_lower_idx (UNIQUE LOWER(email))
users_created_at_idx

-- Addresses
addresses_user_id_idx
addresses_default_idx (PARTIAL: is_default = true)

-- Products
products_brand_id_idx
products_category_id_idx
products_featured_idx (PARTIAL: is_featured = true)
products_active_idx (PARTIAL: is_active = true)

-- Product Images
product_images_product_id_idx
product_images_primary_idx (PARTIAL: is_primary = true)

-- Product Variants
product_variants_product_id_idx
product_variants_sku_idx (UNIQUE)
product_variants_in_stock_idx (PARTIAL: stock_quantity > 0)

-- Cart Items
cart_items_user_id_idx
cart_items_variant_id_idx

-- Orders
orders_user_id_idx
orders_status_idx
orders_created_at_idx
orders_user_recent_idx (user_id, created_at DESC)

-- Order Items
order_items_order_id_idx
order_items_variant_id_idx
```

## Key Design Decisions

### Why BIGINT IDENTITY?
- Future-proof for high growth
- Faster joins than UUID
- Sequential IDs work well with B-tree indexes

### Why TEXT over VARCHAR(n)?
- PostgreSQL internally stores TEXT efficiently
- No arbitrary length limits
- More flexible for future changes

### Why NUMERIC(10,2) for prices?
- Exact decimal arithmetic (no floating point errors)
- $0.01 to $99,999,999.99 range
- Financial accuracy guaranteed

### Why TIMESTAMPTZ?
- Timezone-aware timestamps
- Correct sorting across regions
- Automatic UTC conversion

### Normalization vs Denormalization

**Normalized (3NF):**
- products → brands (reference by ID)
- products → categories (reference by ID)
- order_items → product_variants (reference by ID)

**Intentional Denormalization:**
- order_items stores `product_name`, `size`, `color` as snapshots
- Reason: Product details may change, but historical orders must remain accurate

## Query Patterns

### Hot Queries (Optimized)
```sql
-- Get active products by category
SELECT * FROM products
WHERE category_id = ? AND is_active = true
ORDER BY created_at DESC;
-- Uses: products_active_idx

-- Get user's cart with product details
SELECT ci.*, pv.*, p.*, pi.url
FROM cart_items ci
JOIN product_variants pv ON ci.variant_id = pv.id
JOIN products p ON pv.product_id = p.id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
WHERE ci.user_id = ?;
-- Uses: cart_items_user_id_idx, product_variants_product_id_idx

-- Get user's recent orders
SELECT * FROM orders
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT 10;
-- Uses: orders_user_recent_idx (covering index)
```

## Data Integrity Constraints

- ✅ All FKs have ON DELETE CASCADE/RESTRICT
- ✅ CHECK constraints on prices (> 0)
- ✅ CHECK constraints on quantities (>= 0)
- ✅ CHECK constraints on order status (enum values)
- ✅ UNIQUE constraints on email (case-insensitive)
- ✅ UNIQUE constraints on SKUs
- ✅ UNIQUE constraints on product_id + size + color

## Maintenance

### Vacuum Schedule
```sql
-- Auto-vacuum should handle most cases
-- Manual vacuum for heavy update tables:
VACUUM ANALYZE product_variants;
VACUUM ANALYZE cart_items;
```

### Index Maintenance
```sql
-- Check index bloat
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';

-- Rebuild if needed (rare)
REINDEX INDEX CONCURRENTLY index_name;
```
