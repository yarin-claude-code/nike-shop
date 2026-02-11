---
phase: 02-backend-api-core
plan: 01
subsystem: products-api
tags: [api, filtering, search, pagination, typeorm, querybuilder]
dependency_graph:
  requires: [phase-01-complete, product-entity, brand-entity, category-entity]
  provides: [products-api-filtering, products-api-search, products-api-pagination]
  affects: [products-controller, products-service]
tech_stack:
  added: [typeorm-querybuilder, class-validator-transforms]
  patterns: [repository-pattern, dto-validation, pagination-metadata]
key_files:
  created:
    - apps/backend/src/products/dto/query-products.dto.ts
    - apps/backend/src/products/dto/product-response.dto.ts
  modified:
    - apps/backend/src/products/products.service.ts
    - apps/backend/src/products/products.controller.ts
decisions:
  - use-subquery-for-variant-filters
  - explicit-joins-to-prevent-n-plus-1
  - offset-based-pagination
metrics:
  duration: 117s
  completed: 2026-02-11
---

# Phase 02 Plan 01: Products API with Filtering, Search, and Pagination Summary

**One-liner:** Enhanced products API with QueryBuilder-based filtering (brand/size/color/price), ILIKE search, and offset pagination with metadata.

## Objective

Build a production-ready products API supporting dynamic filtering by brand, size, color, and price range; full-text search across product name, description, and brand; and offset-based pagination with metadata — all implemented using TypeORM QueryBuilder with explicit joins to prevent N+1 queries.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create product DTOs for query validation and paginated response | e054adf | query-products.dto.ts, product-response.dto.ts |
| 2 | Implement QueryBuilder service with filtering, search, and pagination | d209e9c | products.service.ts, products.controller.ts |

## Implementation Details

### Task 1: DTOs for Query Validation and Pagination

Created two DTO files to handle API query validation and response structure:

**QueryProductsDto** - Validates and transforms incoming query parameters:
- `search` (string) - Search term for ILIKE matching
- `brands`, `sizes`, `colors` (string[]) - Array filters with Transform decorator for single-to-array normalization
- `minPrice`, `maxPrice` (number) - Price range filters with Type() transformation
- `page`, `limit` (number) - Pagination parameters with defaults (page=1, limit=20, max=100)

**PaginatedResponse<T>** - Generic interface for paginated API responses:
- `data: T[]` - Array of results
- `meta` - Pagination metadata (total, page, lastPage, perPage)

### Task 2: QueryBuilder Implementation

Replaced simple Repository.find() with TypeORM QueryBuilder for advanced filtering:

**Service Changes (products.service.ts):**
- New `findAllWithFilters(query)` method replaces `findAll()`
- Explicit leftJoinAndSelect for brand, category, images, variants (prevents N+1)
- Conditional filters applied only when params provided:
  - Search: ILIKE across product name, description, brand name
  - Brands: IN clause on brand.slug
  - Price: >= minPrice, <= maxPrice
  - Sizes/Colors: Subquery pattern to avoid row duplication from variant joins
- Offset-based pagination with skip/take
- Returns PaginatedResponse with calculated metadata

**Controller Changes (products.controller.ts):**
- Enhanced GET /products endpoint with @Query() decorator
- Returns PaginatedResponse<Product> instead of Product[]
- Kept findFeatured() and findBySlug() unchanged

**Key Pattern - Variant Filter Subquery:**
To avoid duplicate products when filtering by size/color (due to one-to-many variant relationship), a subquery selects distinct product IDs matching variant criteria, then the main query filters by those IDs:

```typescript
const subQuery = this.productRepository
  .createQueryBuilder('pv_product')
  .select('pv_product.id')
  .innerJoin('pv_product.variants', 'pv')
  .andWhere('pv.size IN (:...sizes)', { sizes });

qb.andWhere(`product.id IN (${subQuery.getQuery()})`);
```

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

All verification steps passed:

1. ✅ `npx tsc --noEmit` - No type errors
2. ✅ `npm run build` (backend) - Builds successfully
3. ✅ `npm run build` (root) - Both apps build successfully
4. ✅ QueryProductsDto validation decorators in place
5. ✅ PaginatedResponse interface with metadata
6. ✅ findAllWithFilters uses QueryBuilder with explicit joins
7. ✅ Subquery pattern prevents variant filter duplicates
8. ✅ Controller accepts query params and returns paginated response

## Key Decisions

**1. Use subquery for variant filters (not direct joins)**
- **Context:** Filtering by size/color requires joining variants, which creates row multiplication (one product × many variants)
- **Decision:** Use subquery to select product IDs first, then filter main query by those IDs
- **Rationale:** Avoids duplicate products in results and maintains clean pagination counts
- **Impact:** More complex SQL but correct results without post-query deduplication

**2. Explicit joins instead of lazy loading**
- **Context:** Need brand, category, images, variants for each product
- **Decision:** Use leftJoinAndSelect in QueryBuilder for all relations
- **Rationale:** Prevents N+1 queries (one query per product to fetch relations)
- **Impact:** Single SQL query with joins instead of 1+N queries

**3. Offset-based pagination (not cursor)**
- **Context:** Need pagination for large product catalogs
- **Decision:** Use skip/take with page/limit params
- **Rationale:** Simpler implementation, sufficient for e-commerce use case, allows jumping to arbitrary pages
- **Trade-offs:** Less efficient for very deep pagination, but acceptable for typical browsing patterns

## API Contract

### GET /api/products

**Query Parameters:**
- `search` (string) - Search in name, description, brand
- `brands` (string[]) - Filter by brand slugs
- `sizes` (string[]) - Filter by available sizes
- `colors` (string[]) - Filter by available colors
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page

**Response:**
```typescript
{
  data: Product[],
  meta: {
    total: number,
    page: number,
    lastPage: number,
    perPage: number
  }
}
```

**Examples:**
- `/api/products` - All products, page 1, 20 items
- `/api/products?search=nike` - Search for "nike"
- `/api/products?brands=nike&brands=adidas` - Nike or Adidas products
- `/api/products?minPrice=50&maxPrice=200` - Price range $50-$200
- `/api/products?sizes=10&colors=Black` - Size 10 in Black
- `/api/products?page=2&limit=10` - Page 2, 10 items per page

## Database Performance

**Query Optimization:**
- Single query with joins (not N+1 separate queries)
- Indexes on FK columns (brand_id, category_id) support filtering
- ILIKE search benefits from pg_trgm index (if added in future)
- Subquery pattern prevents row multiplication from variant joins

**Expected Query Pattern:**
```sql
SELECT product.*, brand.*, category.*, images.*, variants.*
FROM products product
LEFT JOIN brands brand ON brand.id = product.brand_id
LEFT JOIN categories category ON category.id = product.category_id
LEFT JOIN product_images images ON images.product_id = product.id
LEFT JOIN product_variants variants ON variants.product_id = product.id
WHERE product.is_active = true
  AND brand.slug IN ('nike', 'adidas')
  AND product.price >= 50 AND product.price <= 200
  AND product.id IN (
    SELECT pv_product.id FROM products pv_product
    INNER JOIN product_variants pv ON pv.product_id = pv_product.id
    WHERE pv.size IN ('10') AND pv.color IN ('Black')
  )
ORDER BY product.created_at DESC
LIMIT 20 OFFSET 0;
```

## Testing Notes

To manually test the API (requires backend running with seeded data):

```bash
# Start backend
cd apps/backend && npm run start:dev

# Test basic pagination
curl "http://localhost:3000/api/products?page=1&limit=5"

# Test search
curl "http://localhost:3000/api/products?search=nike"

# Test brand filter
curl "http://localhost:3000/api/products?brands=nike&brands=jordan"

# Test price range
curl "http://localhost:3000/api/products?minPrice=100&maxPrice=200"

# Test size/color filter
curl "http://localhost:3000/api/products?sizes=10&sizes=10.5&colors=Black"

# Test combined filters
curl "http://localhost:3000/api/products?search=air&brands=nike&minPrice=80&page=1&limit=10"
```

## Self-Check: PASSED

**Files created:**
```bash
FOUND: apps/backend/src/products/dto/query-products.dto.ts
FOUND: apps/backend/src/products/dto/product-response.dto.ts
```

**Files modified:**
```bash
FOUND: apps/backend/src/products/products.service.ts
FOUND: apps/backend/src/products/products.controller.ts
```

**Commits exist:**
```bash
FOUND: e054adf (Task 1 - DTOs)
FOUND: d209e9c (Task 2 - QueryBuilder)
```

**Build verification:**
```bash
✓ Backend type check passed (npx tsc --noEmit)
✓ Backend build passed (npm run build)
✓ Monorepo build passed (turbo run build)
```

All task deliverables verified successfully.
