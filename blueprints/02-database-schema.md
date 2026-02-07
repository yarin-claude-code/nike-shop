# Blueprint: Database Schema Design

## Goal

Create the PostgreSQL database schema for Tony's Shoe Store with all required tables, indexes, and constraints.

## Inputs Required

- database_name: string (tonys_shoe_store)
- postgres_connection: active PostgreSQL connection

## Skills Reference

- `postgres-database-skill.md` - Data types, indexing, constraints

## Database Design Principles (from skill)

- Use `BIGINT GENERATED ALWAYS AS IDENTITY` for primary keys
- Use `TEXT` instead of `VARCHAR(n)`
- Use `NUMERIC(10,2)` for prices (never float)
- Use `TIMESTAMPTZ` for all timestamps
- Add indexes on FK columns (PostgreSQL doesn't auto-create these)
- Add `NOT NULL` wherever semantically required

## Steps

### 1. Create Database

```sql
CREATE DATABASE tonys_shoe_store;
\c tonys_shoe_store
```

### 2. Create Users Table

```sql
CREATE TABLE users (
  user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_lower_idx ON users (LOWER(email));
CREATE INDEX users_created_at_idx ON users (created_at);
```

### 3. Create Brands Table

```sql
CREATE TABLE brands (
  brand_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4. Create Categories Table

```sql
CREATE TABLE categories (
  category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_category_id BIGINT REFERENCES categories(category_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX categories_parent_idx ON categories (parent_category_id);
```

### 5. Create Products (Shoes) Table

```sql
CREATE TABLE products (
  product_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  brand_id BIGINT NOT NULL REFERENCES brands(brand_id),
  category_id BIGINT NOT NULL REFERENCES categories(category_id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  sale_price NUMERIC(10,2) CHECK (sale_price IS NULL OR sale_price > 0),
  model_3d_url TEXT,  -- URL to .glb file for Three.js
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX products_brand_idx ON products (brand_id);
CREATE INDEX products_category_idx ON products (category_id);
CREATE INDEX products_featured_idx ON products (is_featured) WHERE is_featured = true;
CREATE INDEX products_active_idx ON products (is_active) WHERE is_active = true;
```

### 6. Create Product Images Table

```sql
CREATE TABLE product_images (
  image_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX product_images_product_idx ON product_images (product_id);
```

### 7. Create Product Variants (Sizes/Colors) Table

```sql
CREATE TABLE product_variants (
  variant_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, size, color)
);

CREATE INDEX product_variants_product_idx ON product_variants (product_id);
CREATE INDEX product_variants_stock_idx ON product_variants (stock_quantity) WHERE stock_quantity > 0;
```

### 8. Create Shopping Cart Table

```sql
CREATE TABLE cart_items (
  cart_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES product_variants(variant_id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, variant_id)
);

CREATE INDEX cart_items_user_idx ON cart_items (user_id);
```

### 9. Create Orders Table

```sql
CREATE TABLE orders (
  order_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED')),
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  tax NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total > 0),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX orders_user_idx ON orders (user_id);
CREATE INDEX orders_status_idx ON orders (status);
CREATE INDEX orders_created_at_idx ON orders (created_at);
```

### 10. Create Order Items Table

```sql
CREATE TABLE order_items (
  order_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL REFERENCES product_variants(variant_id),
  product_name TEXT NOT NULL,  -- Snapshot at order time
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX order_items_order_idx ON order_items (order_id);
```

### 11. Create Addresses Table

```sql
CREATE TABLE addresses (
  address_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  label TEXT,  -- "Home", "Work", etc.
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX addresses_user_idx ON addresses (user_id);
```

## Expected Output

- 11 tables with proper relationships
- All indexes created for FK columns and common queries
- Constraints enforcing data integrity

## Edge Cases

- **Existing database**: Drop and recreate or use migrations
- **UUID vs BIGINT**: Use BIGINT for better performance; UUID only if needed for external APIs

## Known Issues

- **sale_price > price**: Add CHECK constraint if business requires `sale_price < price`
- **Stock race conditions**: Use `SELECT FOR UPDATE` in transactions when decrementing stock
