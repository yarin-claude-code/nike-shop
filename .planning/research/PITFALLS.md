# Domain Pitfalls: Multi-Brand Shoe E-Commerce Refactoring

**Domain:** Multi-brand shoe e-commerce store refactoring
**Researched:** 2026-02-10
**Confidence:** MEDIUM

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Product Image-to-Variant Mapping Failures

**What goes wrong:** Images show the wrong product variant (e.g., listing shows red shoes, detail page shows blue shoes; or worse, shows cakes instead of shoes). User clicks on a red sneaker, sees blue sneakers in the cart, and returns the product when the wrong color arrives.

**Why it happens:**
- Database stores images at product level but doesn't map specific images to specific variants (size/color combinations)
- Frontend components fetch images by product ID without considering the selected variant
- Image URLs are hardcoded in seed data or mock data instead of properly stored in product_images table
- Color variant change triggers don't reload corresponding images

**Consequences:**
- High return rates when customers receive wrong color/style
- Destroyed trust and negative reviews
- Lost revenue from abandoned carts when users notice mismatched images
- Hours of manual data cleanup to fix image-variant relationships

**Prevention:**
1. Store images in dedicated `product_images` table with proper foreign keys to products
2. Add optional `variant_id` or `color` column to `product_images` to map specific images to specific color variants
3. For color variants, implement image filtering: `productImages.filter(img => img.color === selectedColor || img.color === null)`
4. Implement automated tests that verify each color variant has at least one corresponding image
5. Never rely on array index matching between variants and images — use explicit relationships

**Detection:**
- User reports: "The shoe I received doesn't match the photo"
- QA checklist item: Click through every color variant and verify images change appropriately
- Automated test: Loop through all products with variants and verify image URLs are unique per color
- Database integrity check: `SELECT product_id, color FROM product_variants WHERE NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = product_variants.product_id AND (product_images.color = product_variants.color OR product_images.color IS NULL))`

**Phase to address:** Phase 1 (Database Schema & Data Integrity) — must establish proper image-variant relationships before building UI

---

### Pitfall 2: International Shoe Size Database Modeling

**What goes wrong:** Storing sizes as simple strings like "8", "8.5", "9" works fine until you need to support international customers. Users can't find their size, conversion is manual and error-prone, and returns spike because "EU 42" doesn't always equal "US 8.5" across brands.

**Why it happens:**
- Developer assumes all customers use one sizing system (usually US)
- Size stored as TEXT without any normalization or conversion logic
- No distinction between men's and women's sizing (US Men's 8 ≠ US Women's 8)
- Brand-specific sizing variations not accounted for (Nike runs narrow, New Balance runs wide, etc.)

**Consequences:**
- International customers can't shop effectively
- Customer service overwhelmed with size conversion questions
- High return rates due to wrong size orders
- Inability to implement "find my size" features
- SEO problems — can't match searches for "EU 42" when database only has "US 8.5"

**Prevention:**
1. Store sizes in normalized format with metadata:
   ```sql
   CREATE TABLE size_standards (
     id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     size_system TEXT NOT NULL CHECK (size_system IN ('US', 'UK', 'EU', 'CM')),
     gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'youth', 'unisex')),
     size_value TEXT NOT NULL,
     size_numeric NUMERIC(4,1), -- for sorting/filtering
     foot_length_cm NUMERIC(5,2) -- actual measurement for conversions
   );
   ```
2. Product variants should reference size_standards instead of storing raw strings
3. Display layer converts based on user preferences or location
4. Add brand-specific conversion tables for brands that run small/large
5. Document: "Conversion formulas like 'add 31 to US size' are unreliable — use lookup tables"

**Detection:**
- No international size options in product filters
- Size filter shows mix of "8", "EU 42", "UK 7.5" (inconsistent formatting)
- Database has `size TEXT` with no normalization
- Customer service tickets asking "What's my size in US?"

**Phase to address:** Phase 1 (Database Schema) — must decide on size modeling before seeding product data

---

### Pitfall 3: TypeORM synchronize: true in Production

**What goes wrong:** Using `synchronize: true` instead of proper migrations means TypeORM auto-generates schema changes on every deployment. In e-commerce, this can silently drop columns with inventory data, reset foreign key constraints, or lose customer order history without any rollback path.

**Why it happens:**
- Developer uses `synchronize: true` during initial development for convenience
- Forgets to switch to migrations before production
- Doesn't understand difference between development convenience and production safety
- Migration learning curve seems steep compared to "auto-sync"

**Consequences:**
- **Data loss**: TypeORM drops and recreates tables when entity relationships change
- **Zero-downtime deployments impossible**: Schema changes happen during startup
- **No audit trail**: Can't see what schema changes were applied when
- **Rollback impossible**: Can't revert bad schema changes
- **Race conditions**: Multiple pods/instances can create conflicting schema changes
- **Inventory corruption**: Stock counts lost during column renames

**Prevention:**
1. Disable `synchronize` in all non-local environments:
   ```typescript
   // apps/backend/src/app.module.ts
   TypeOrmModule.forRoot({
     synchronize: process.env.NODE_ENV === 'development' ? false : false, // ALWAYS false
     migrations: ['dist/database/migrations/*.js'],
     migrationsRun: true, // Run migrations on startup
   })
   ```
2. Generate migrations for all entity changes: `npm run typeorm migration:generate -- -n DescriptiveName`
3. Review generated migrations before running — TypeORM sometimes generates incorrect SQL
4. Test migrations on production-like data in staging environment
5. Keep migrations idempotent where possible
6. Document migration rollback procedures for each migration

**Detection:**
- `typeorm.config.ts` or `app.module.ts` has `synchronize: true`
- No `migrations/` directory in project
- No migration-related npm scripts in package.json
- Deployment process doesn't include migration step

**Phase to address:** Phase 1 (Database Setup & Migrations) — must establish migration workflow before making any schema changes

---

### Pitfall 4: N+1 Query Problem in Product Listings

**What goes wrong:** Product listing page loads 20 products, but triggers 100+ database queries (1 for products, 20 for brands, 20 for categories, 20 for primary images, 20 for variant counts, 20 for stock status). Page takes 3+ seconds to load, killing conversions.

**Why it happens:**
- TypeORM relationships not eagerly loaded
- Looping through products in code and making individual queries for each
- Not using TypeORM's `relations` option or QueryBuilder with `leftJoinAndSelect`
- Lazy loading seems convenient during development with small datasets

**Consequences:**
- Slow page loads → users abandon site
- High database load → infrastructure costs spike
- Poor mobile experience (3G connections timeout)
- Can't handle traffic spikes (Black Friday crashes)
- SEO penalty from Google for slow load times

**Prevention:**
1. Use eager loading for product listings:
   ```typescript
   // Bad - causes N+1
   const products = await this.productRepository.find();
   for (const product of products) {
     product.brand = await this.brandRepository.findOne(product.brandId); // N queries
   }

   // Good - single query with joins
   const products = await this.productRepository.find({
     relations: ['brand', 'category', 'images'],
     where: { isActive: true },
   });
   ```
2. For complex queries, use QueryBuilder:
   ```typescript
   const products = await this.productRepository
     .createQueryBuilder('product')
     .leftJoinAndSelect('product.brand', 'brand')
     .leftJoinAndSelect('product.category', 'category')
     .leftJoinAndSelect('product.images', 'images', 'images.isPrimary = true')
     .leftJoinAndSelect('product.variants', 'variants')
     .where('product.isActive = true')
     .andWhere('variants.stockQuantity > 0')
     .getMany();
   ```
3. Add database query logging in development to catch N+1 problems early
4. Use query result caching for hot paths (featured products, popular categories)
5. Paginate listings — don't load all products at once

**Detection:**
- Enable TypeORM query logging: `logging: ['query']` — if you see repeated similar queries, you have N+1
- Use database profiling tools to count queries per request
- Lighthouse or WebPageTest shows slow Time to First Byte (TTFB)
- Database monitoring shows query count spikes correlating with product page loads

**Phase to address:** Phase 2 (API Implementation) — while building product endpoints, verify query efficiency before moving to frontend

---

### Pitfall 5: Inconsistent Product Data Seeding vs. Real Data Structure

**What goes wrong:** Development uses mockData.ts with perfectly structured hardcoded data (all products have exactly 4 images, all variants in stock, all prices valid). Production has incomplete data (missing images, zero stock, null descriptions). Frontend crashes with "Cannot read property of undefined" because it assumes perfect data.

**Why it happens:**
- Mock data created as idealized examples, not realistic edge cases
- Database constraints not enforced (nullable fields allowed but code assumes non-null)
- Seeding scripts don't validate data before inserting
- Frontend doesn't handle missing/null data gracefully

**Consequences:**
- Site works perfectly in development, crashes in production
- "It works on my machine" syndrome
- Production bugs discovered by customers, not QA
- Emergency hotfixes required after deployment
- Lost sales during downtime

**Prevention:**
1. **Mirror production data in development**: Seed realistic data including edge cases
   ```typescript
   // Seed data should include:
   // - Products with 1 image (not always 4)
   // - Products with zero stock in all variants
   // - Products with null descriptions
   // - Products with very long names (test truncation)
   // - Products with missing sale prices
   // - Variants with price_adjustment = 0 and > 0
   ```
2. **Enforce database constraints that match business rules**:
   ```sql
   -- If products MUST have at least one image:
   ALTER TABLE products ADD CONSTRAINT has_images
     CHECK ((SELECT COUNT(*) FROM product_images WHERE product_id = products.id) > 0);

   -- If active products MUST have stock:
   -- Use triggers or application-level validation
   ```
3. **Add null checks in frontend**:
   ```typescript
   // Bad
   <img src={product.images[0].url} />

   // Good
   <img src={product.images?.[0]?.url ?? '/placeholder.png'} />
   ```
4. **Use TypeScript strict mode** and avoid `any` types
5. **Create seed script that validates before insert**: Check foreign keys exist, required fields populated, URLs valid

**Detection:**
- Compare mockData.ts structure with actual database seed data
- Try running frontend against empty database or database with minimal seed
- Automated tests that loop through products and verify required fields exist
- TypeScript errors about possibly undefined values

**Phase to address:** Phase 1 (Data Seeding) — after schema is finalized, seed realistic data that mirrors production edge cases before building UI

---

### Pitfall 6: Missing Variant-Level Stock Tracking

**What goes wrong:** Stock stored at product level instead of variant level. Backend says "Nike Air Max 90 is in stock" but when user selects Size 10 / Blue, it's actually out of stock. Users add to cart, proceed through checkout, only to be told "Sorry, out of stock" at payment — causing cart abandonment and frustration.

**Why it happens:**
- Simplified schema during prototyping: `products.stock_quantity` instead of `product_variants.stock_quantity`
- Developer doesn't understand that shoes need separate stock for each size/color combination
- Frontend built before backend, uses simplified mock data structure

**Consequences:**
- Can't track which specific SKUs are in stock
- Overselling — accept orders for out-of-stock variants
- Can't implement "notify me when back in stock" for specific sizes
- Inventory reports useless (can't reorder specific sizes)
- Customer frustration when they "successfully" add item to cart but can't complete purchase

**Prevention:**
1. **Store stock at variant level** (already correct in your schema):
   ```sql
   CREATE TABLE product_variants (
     id BIGINT PRIMARY KEY,
     product_id BIGINT REFERENCES products(id),
     size TEXT NOT NULL,
     color TEXT NOT NULL,
     stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
     -- other fields
   );
   ```
2. **Product-level stock is computed, not stored**:
   ```typescript
   // Service method
   async getProductStock(productId: number): Promise<number> {
     const result = await this.variantRepository
       .createQueryBuilder('variant')
       .select('SUM(variant.stock_quantity)', 'total')
       .where('variant.product_id = :productId', { productId })
       .getRawOne();
     return result.total || 0;
   }
   ```
3. **Add to cart requires variant selection**:
   ```typescript
   // Bad - allows adding product without specifying size/color
   POST /cart { productId: 123, quantity: 1 }

   // Good - requires specific variant
   POST /cart { variantId: 456, quantity: 1 }
   ```
4. **Disable "Add to Cart" button if selected variant is out of stock**
5. **Real-time stock validation before checkout**: Verify stock still available when user clicks "Place Order"

**Detection:**
- Products table has `stock_quantity` column (wrong — delete it)
- Cart items reference `product_id` instead of `variant_id`
- "Add to Cart" button enabled before user selects size and color
- No stock indicator per size option ("Size 10 - Out of Stock")

**Phase to address:** Phase 1 (Database Schema Review) — verify schema uses variant-level stock; Phase 2 (API) — ensure all cart/order operations use variant_id

---

## Moderate Pitfalls

### Pitfall 7: Frontend Component Prop Drilling

**What goes wrong:** Product data passed through 5+ levels of components as individual props (name, price, imageUrl, brand, category, etc.). Adding new field requires updating every intermediate component. Code becomes unmaintainable and bug-prone.

**Prevention:**
1. Pass product as object instead of individual props:
   ```typescript
   // Bad
   <ProductCard
     name={product.name}
     price={product.price}
     imageUrl={product.images[0].url}
     brand={product.brand.name}
   />

   // Good
   <ProductCard product={product} />
   ```
2. Use Context API or state management (Zustand, Redux) for deeply nested data
3. Co-locate data fetching with components that need it (React Query / TanStack Query)
4. Follow atomic design — components should be self-contained

**Detection:**
- Components have 10+ props
- Adding product field requires changing multiple component signatures
- Props named things like `productName`, `productPrice`, `productImage` (instead of destructuring from product object)

**Phase to address:** Phase 2 (Frontend Component Architecture) — establish component patterns before building out full catalog

---

### Pitfall 8: Missing Database Indexes on Foreign Keys

**What goes wrong:** PostgreSQL doesn't auto-create indexes on foreign key columns. Queries like "get all images for this product" or "get all variants for this product" become slow table scans as data grows. Works fine with 10 products, dies at 10,000 products.

**Prevention:**
1. **Manually index ALL foreign key columns in PostgreSQL**:
   ```sql
   -- Already correct in your schema
   CREATE INDEX product_images_product_id_idx ON product_images (product_id);
   CREATE INDEX product_variants_product_id_idx ON product_variants (product_id);
   CREATE INDEX products_brand_id_idx ON products (brand_id);
   CREATE INDEX products_category_id_idx ON products (category_id);
   ```
2. Add indexes for common query patterns:
   ```sql
   -- If you filter by is_featured often
   CREATE INDEX products_featured_idx ON products (is_featured) WHERE is_featured = true;

   -- If you filter by in-stock variants often
   CREATE INDEX variants_in_stock_idx ON product_variants (product_id, stock_quantity)
     WHERE stock_quantity > 0;
   ```
3. Use `EXPLAIN ANALYZE` to verify query plans use indexes
4. Monitor slow query logs in production

**Detection:**
- Run `EXPLAIN ANALYZE` on common queries and see "Seq Scan" instead of "Index Scan"
- Check if foreign key columns have indexes:
  ```sql
  SELECT tablename, indexname FROM pg_indexes WHERE tablename IN ('product_images', 'product_variants');
  ```
- Queries slow down non-linearly as data grows

**Phase to address:** Phase 1 (Database Schema) — verify all indexes exist before seeding large amounts of data

---

### Pitfall 9: Storing Money as FLOAT Instead of NUMERIC

**What goes wrong:** JavaScript floating point math causes penny rounding errors. `19.99 * 3 = 59.969999999` instead of `59.97`. Customers get charged wrong amounts, accounting doesn't balance, legal issues arise.

**Prevention:**
1. **Use NUMERIC/DECIMAL in database** (already correct in your schema):
   ```sql
   price NUMERIC(10,2) NOT NULL CHECK (price > 0)
   ```
2. **Use integer cents in JavaScript for calculations**:
   ```typescript
   // Store as cents internally
   const priceInCents = 1999; // $19.99
   const totalCents = priceInCents * 3; // 5997
   const totalDollars = totalCents / 100; // 59.97
   ```
3. **Use libraries like `dinero.js` or `big.js` for money math**
4. **Never use Number for money in TypeScript** — use string or dedicated Money type

**Detection:**
- Database schema uses FLOAT or REAL for prices
- TypeScript interfaces have `price: number` without documentation that it's in cents
- Calculations done directly on decimal values without rounding libraries

**Phase to address:** Phase 1 (Database Schema Review) — already correct; Phase 2 (Backend) — verify services use correct math

---

### Pitfall 10: No Graceful Degradation for Missing Images

**What goes wrong:** Product image fails to load (broken URL, CDN down, image deleted from storage). Frontend shows broken image icon or crashes with error. Product appears unpurchasable.

**Prevention:**
1. **Implement fallback images**:
   ```typescript
   <img
     src={product.images?.[0]?.url}
     onError={(e) => { e.currentTarget.src = '/images/placeholder-shoe.png' }}
     alt={product.name}
   />
   ```
2. **Validate image URLs during seeding** — try to fetch each URL, warn if unreachable
3. **Use CDN with origin fallback** (Cloudflare, Cloudinary)
4. **Display product even if image missing** — show placeholder, but keep "Add to Cart" functional
5. **Monitor for broken images in production** — alert when 404 rate spikes

**Detection:**
- Visit product pages with deliberately broken image URLs
- Check if products with no images still render
- Browser console shows image 404 errors

**Phase to address:** Phase 2 (Frontend Implementation) — add during ProductCard/ProductImageViewer development

---

### Pitfall 11: Not Validating DTOs for API Endpoints

**What goes wrong:** Frontend sends malformed data to backend (negative quantities, missing required fields, invalid variant IDs). Backend crashes with database errors or worse, inserts bad data. No clear error messages to frontend.

**Prevention:**
1. **Use class-validator with DTOs**:
   ```typescript
   // create-cart-item.dto.ts
   export class CreateCartItemDto {
     @IsInt()
     @Min(1)
     variantId: number;

     @IsInt()
     @Min(1)
     @Max(99)
     quantity: number;
   }
   ```
2. **Enable global validation pipe in NestJS**:
   ```typescript
   app.useGlobalPipes(new ValidationPipe({
     whitelist: true, // Strip unknown properties
     forbidNonWhitelisted: true, // Throw error on unknown properties
     transform: true, // Auto-transform to DTO types
   }));
   ```
3. **Return structured error responses**:
   ```json
   {
     "statusCode": 400,
     "message": ["quantity must be between 1 and 99"],
     "error": "Bad Request"
   }
   ```

**Detection:**
- Try sending invalid data via Postman (negative numbers, missing fields, wrong types)
- Check if backend returns 500 errors instead of 400 validation errors
- DTOs exist but don't have validation decorators

**Phase to address:** Phase 2 (API Implementation) — add validation to each DTO as endpoints are created

---

## Minor Pitfalls

### Pitfall 12: Hardcoded API URLs in Frontend

**What goes wrong:** Frontend has `fetch('http://localhost:3001/api/products')` hardcoded. Works in development, breaks in production because production API is at different domain.

**Prevention:**
1. Use environment variables:
   ```typescript
   // .env.development
   VITE_API_URL=http://localhost:3001

   // .env.production
   VITE_API_URL=https://api.tonysshoestore.com

   // api client
   const API_URL = import.meta.env.VITE_API_URL;
   fetch(`${API_URL}/api/products`);
   ```
2. Create API client wrapper instead of raw fetch calls
3. Document environment variables in .env.example

**Detection:**
- Search codebase for `fetch('http://` or `axios('http://`
- Check if .env.example lists API URL configuration
- Try building production bundle and check if localhost URLs are included

**Phase to address:** Phase 2 (Frontend Setup) — configure environment variables before API integration

---

### Pitfall 13: Missing Alt Text on Product Images

**What goes wrong:** Screen readers can't describe products to visually impaired users. SEO suffers because Google can't understand image content. Accessibility lawsuits possible under ADA.

**Prevention:**
1. **Store alt text in database**:
   ```sql
   CREATE TABLE product_images (
     -- ...
     alt_text TEXT, -- "Nike Air Max 90 in University Red, side view"
   );
   ```
2. **Generate meaningful alt text during seeding**:
   ```typescript
   alt_text: `${product.name} in ${variant.color}, ${viewAngle} view`
   ```
3. **Always provide alt attribute**:
   ```typescript
   <img src={image.url} alt={image.altText || product.name} />
   ```

**Detection:**
- Run axe DevTools or Lighthouse accessibility audit
- Check for `<img>` tags without alt attribute
- Images in database have null/empty alt_text

**Phase to address:** Phase 1 (Database Schema) — include alt_text field; Phase 2 (Frontend) — always use alt attribute

---

### Pitfall 14: No Loading States for Product Images

**What goes wrong:** Large product images take time to load on slow connections. UI shows empty space or jumps/reflows when images load, creating poor UX. Users think page is broken.

**Prevention:**
1. **Use skeleton loaders or placeholders**:
   ```typescript
   const [imageLoaded, setImageLoaded] = useState(false);

   <div className="relative">
     {!imageLoaded && <div className="skeleton" />}
     <img
       src={image.url}
       onLoad={() => setImageLoaded(true)}
       className={imageLoaded ? 'opacity-100' : 'opacity-0'}
     />
   </div>
   ```
2. **Reserve space with aspect ratio** to prevent layout shift:
   ```css
   .product-image {
     aspect-ratio: 1 / 1; /* Square for shoes */
   }
   ```
3. **Use modern image formats** (WebP) with fallbacks
4. **Implement lazy loading** for below-fold images

**Detection:**
- Test on slow 3G connection (Chrome DevTools Network throttling)
- Lighthouse reports Cumulative Layout Shift (CLS) issues
- No loading indicators visible during image load

**Phase to address:** Phase 2 (Frontend Components) — add during ProductImageViewer implementation

---

### Pitfall 15: Not Handling Sold-Out Variants in UI

**What goes wrong:** User can select Size 10 which is out of stock, add to cart, proceed to checkout, only to get error. Frustrating UX leads to abandonment.

**Prevention:**
1. **Disable out-of-stock options**:
   ```typescript
   <select>
     {product.variants.map(variant => (
       <option
         key={variant.id}
         value={variant.id}
         disabled={variant.stockQuantity === 0}
       >
         {variant.size} {variant.stockQuantity === 0 ? '(Out of Stock)' : ''}
       </option>
     ))}
   </select>
   ```
2. **Show clear stock status**: "Only 3 left!" or "Out of Stock"
3. **Offer "Notify Me" button** for out-of-stock variants
4. **Disable "Add to Cart" button** until in-stock variant selected

**Detection:**
- Can you add out-of-stock variant to cart?
- Do size/color options show stock status?
- Try adding last item to cart in one browser, then try adding same item in another browser

**Phase to address:** Phase 2 (Frontend Product Page) — implement during variant selector development

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using mockData.ts instead of seeding real database | Faster initial frontend development | Frontend works with perfect data, breaks on real data; creates false confidence | Never for more than 1-2 days of prototyping |
| Storing images as base64 in database | Don't need separate file storage | Database bloat, slow queries, can't use CDN, breaks backups | Never — always use URLs to external storage |
| Skipping indexes "for now" | Faster initial development (fewer commands to run) | Slow queries in production, emergency performance fixes | Only in local dev with <100 records |
| Using `any` type in TypeScript for product data | Bypass type errors quickly | Runtime errors, no autocomplete, bugs ship to production | Never — use `unknown` and type guards |
| Hardcoding product data in components | Avoid setting up API | Can't share data, testing impossible, hardcoded data diverges from reality | Acceptable for design mockups only, never in main branch |
| Using `synchronize: true` in staging | Skip migration hassle | Data loss, unreliable testing environment, prod divergence | Never — staging must mirror production |
| Single color per product (no variant-level images) | Simpler data model | Can't show different colors, users can't preview what they're buying | Only if selling truly single-color products |
| Storing all prices in USD | Avoid currency conversion | Can't expand internationally, poor UX for international users | Acceptable for MVP targeting US-only |

---

## Integration Gotchas

Common mistakes when connecting to external services (future phases).

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Stripe Payments | Storing payment details in your database | Use Stripe Customer IDs and Payment Methods, never store card numbers |
| Image CDN (Cloudinary, etc.) | Uploading full-size originals only | Upload originals + use CDN transformations for thumbnails, lazy loading |
| Email Service (SendGrid, etc.) | Sending emails synchronously in API request | Use background jobs/queues to avoid blocking API response |
| Search (Algolia, ElasticSearch) | Syncing product data manually | Use database hooks/triggers to auto-sync on product changes |
| Analytics (Google Analytics) | Only tracking page views | Track key events: add to cart, checkout started, purchase completed |
| Shipping APIs (USPS, UPS) | Calculating shipping after user enters payment info | Calculate shipping earlier in checkout flow with address |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all products at once | Homepage slow, browser runs out of memory | Implement pagination (20 items per page), infinite scroll, or "Load More" | >500 products |
| No database connection pooling | API randomly slow, connection errors under load | Use TypeORM connection pool with max connections limit | >100 concurrent users |
| Not lazy-loading images | Page weight 10MB+, slow on mobile | Use `loading="lazy"` attribute, intersection observer | >10 images per page |
| Fetching variant stock individually | Each product card makes 5+ API calls | Include stock summary in product list query with JOIN | >50 products on page |
| No HTTP caching headers | Same images re-downloaded every page load | Set Cache-Control headers, use ETags | Immediately noticeable |
| Searching products with LIKE queries | Search slows down as catalog grows | Use full-text search (PostgreSQL tsvector) or dedicated search service | >1,000 products |
| No API response caching | Same data re-queried every request | Cache frequently accessed data (featured products, categories) with Redis or in-memory cache | >1,000 requests/minute |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing internal product IDs in URLs | Competitors can scrape entire catalog by incrementing IDs | Use UUIDs or slugs in URLs; require authentication for bulk access |
| No rate limiting on search/catalog APIs | Scrapers can download entire inventory | Implement rate limiting (express-rate-limit), require API keys for high-volume access |
| Accepting any quantity in cart | User adds 10,000 items, breaks inventory or causes DoS | Validate quantity: MIN 1, MAX 99 per item; MAX 100 items per cart |
| Price calculated on frontend only | User modifies price in browser, pays less | Always calculate order total on backend; never trust client-side prices |
| No stock validation at checkout | User buys last item that 5 other users also have in cart (overselling) | Use database transactions with SELECT FOR UPDATE to reserve stock atomically |
| Showing competitor pricing data | Helps competitors, no benefit to you | Only show YOUR prices; don't link to competitor sites |

---

## UX Pitfalls

Common user experience mistakes in shoe e-commerce.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No size guide | Users guess size, high return rate | Provide sizing guide with foot measurement instructions, brand-specific sizing notes |
| Requiring account creation to browse | Users leave immediately | Allow browsing without account; require account only at checkout |
| No product zoom | Can't see details (stitching, material texture) | Implement click-to-zoom or 360° view for product images |
| Hidden shipping costs until checkout | Cart abandonment when surprise shipping fee appears | Show estimated shipping on product page or early in checkout |
| No product comparison | Users open 10 tabs to compare shoes manually | Add "Compare" feature to view specs side-by-side |
| Can't filter by multiple criteria | User wants "Nike" + "Basketball" + "Red" + "Size 10" but can only filter one at a time | Implement multi-select filters that combine with AND logic |
| No recently viewed products | Users can't find shoe they looked at 5 minutes ago | Track recently viewed (localStorage), show on homepage/sidebar |
| Out-of-stock products not clearly marked | User clicks through 5 out-of-stock products before finding available one | Mark out-of-stock prominently in listings, provide "hide out-of-stock" filter |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Product images:** Verified images exist for ALL color variants, not just default color — check database query for products with variants missing corresponding images
- [ ] **Size availability:** Tested "Add to Cart" for EVERY size option, not just available ones — out-of-stock sizes should be disabled or hidden
- [ ] **Price calculations:** Verified sale_price displays correctly when present AND when null — test both paths
- [ ] **Product variants:** Confirmed SKU uniqueness constraint exists — try inserting duplicate SKU and verify it's rejected
- [ ] **Foreign key relationships:** Verified ON DELETE CASCADE works correctly — delete brand and verify associated products are handled appropriately
- [ ] **Search functionality:** Tested with misspellings, partial matches, special characters — verify it doesn't break or return zero results incorrectly
- [ ] **Mobile responsive:** Tested on actual mobile device, not just Chrome DevTools — touch targets big enough, images load on 3G
- [ ] **Empty states:** Verified UI when no products match filter, cart is empty, no reviews exist — not just "no data" error
- [ ] **Loading states:** Tested on throttled network (slow 3G) — verified spinners/skeletons appear, no layout shift
- [ ] **Error handling:** Simulated API failures (disconnect backend) — verified friendly error messages, not "Network Error" in console

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong images in production | LOW | Write script to match images to variants by filename pattern; manually review mismatches; update product_images table with correct variant_id/color |
| No image-variant mapping in DB | MEDIUM | Add `color` column to product_images; write migration to infer color from image filename or URL; manually verify and fix mismatches |
| Used synchronize:true and lost data | HIGH | Restore from backup if available; if no backup, data is LOST — apologize to users, offer compensation; implement backup strategy going forward |
| N+1 queries in production | LOW | Add eager loading to problematic endpoints; deploy fix; optionally add database query caching as short-term relief |
| No indexes on foreign keys | LOW | Add indexes via migration; REINDEX in off-peak hours if database large; verify query performance improvement |
| Float pricing caused rounding errors | MEDIUM | Migration to change FLOAT to NUMERIC; write script to recalculate orders and identify affected transactions; issue refunds/credits to affected customers |
| Missing alt text on images | LOW | Write script to generate alt text from product name + color; manually review for quality; update in batch |
| Hardcoded size strings (no internationalization) | HIGH | Create size_standards table; write mapping migration to convert existing strings to standardized format; update all queries to use new structure; risky if lots of existing orders reference old format |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Image-variant mapping failures | Phase 1: Database Schema & Data Integrity | Query for products with variants missing images; test color selector changes images |
| International shoe sizing | Phase 1: Database Schema Design | Check if size_standards table exists; verify conversion logic |
| TypeORM synchronize:true | Phase 1: Database Setup & Migrations | Verify `synchronize: false` in all configs; confirm migrations/ directory exists |
| N+1 query problems | Phase 2: API Implementation | Enable query logging; verify single query for product listings |
| Inconsistent seed data | Phase 1: Data Seeding | Run frontend against seeded data; verify no crashes on null/missing fields |
| Missing variant stock tracking | Phase 1: Database Schema Review | Confirm stock stored in product_variants, not products |
| Frontend prop drilling | Phase 2: Component Architecture | Check component prop counts; verify product passed as object |
| Missing FK indexes | Phase 1: Database Schema | Run EXPLAIN ANALYZE on common queries; verify Index Scan used |
| Money as float | Phase 1: Database Schema | Verify NUMERIC type used for all money columns |
| No image fallbacks | Phase 2: Frontend Components | Test with broken image URLs; verify placeholders appear |
| Missing DTO validation | Phase 2: API Implementation | Send invalid requests via Postman; verify 400 errors with helpful messages |
| Hardcoded API URLs | Phase 2: Frontend Setup | Check .env files exist; verify environment variable usage |
| Missing alt text | Phase 1: Database Schema + Phase 2: Frontend | Verify alt_text field exists and populated; run Lighthouse audit |
| No loading states | Phase 2: Frontend Components | Test on throttled network; verify skeletons/spinners appear |
| Sold-out variants not disabled | Phase 2: Frontend Product Page | Try adding out-of-stock variant to cart; verify it's prevented |

---

## Sources

**Product Image Management:**
- [E-commerce Product Image Size Guide: Optimize For 2026](https://www.squareshot.com/post/e-commerce-product-image-size-guide)
- [Managing eCommerce Images](https://www.mediavalet.com/blog/7-best-practices-for-your-ecommerce-images)
- [E-commerce Product Image Standardization](https://www.musedam.ai/en-US/blog/ecommerce-product-image-standards)

**Product Variants & Database Schema:**
- [Product Variant Structured Data | Google for Developers](https://developers.google.com/search/docs/appearance/structured-data/product-variants)
- [How to create a document schema for product variants and SKUs | Elastic Blog](https://www.elastic.co/blog/how-to-create-a-document-schema-for-product-variants-and-skus-for-your-ecommerce-search-experience)
- [Modelling Products and Variants for E-Commerce](https://martinbean.dev/blog/2023/01/27/product-variants-laravel/)
- [From Complexity to Clarity: Organizing Variant-Wise Product Storage](https://mediusware.com/blog/from-complexity-to-clarity-organizing-variant-wise)

**Refactoring & E-commerce Mistakes:**
- [11 Common Ecommerce Mistakes To Watch Out For (2026) - Shopify](https://www.shopify.com/blog/ecommerce-mistakes)
- [8 Common Mistakes in Shopify Development to Avoid in 2026](https://performantcode.io/blog/8-common-mistakes-in-shopify-development-to-avoid-in-2026/)
- [Top 10 E-commerce Website Mistakes & Fixes for 2026](https://www.f22labs.com/blogs/common-ecommerce-mistakes-2025-guide/)
- [Key Mistakes to Avoid in eCommerce App Development](https://oyelabs.com/mistakes-to-avoid-in-developing-ecommerce-apps-for-startups/)

**TypeORM & API Design:**
- [Is ORM still an 'anti pattern'? - Lago Wiki](https://github.com/getlago/lago/wiki/Is-ORM-still-an-'anti-pattern'%3F)
- [API Design Anti-patterns - Specmatic](https://specmatic.io/appearance/how-to-identify-avoid-api-design-anti-patterns/)
- [Understand typeORM architecture and design patterns](https://app.studyraid.com/en/read/10725/326718/typeorm-architecture-and-design-patterns)

**React Component Organization:**
- [How to Build Dynamic Ecommerce Product Page in React](https://www.dhiwise.com/post/structuring-component-for-a-dynamic-ecommerce-product-page-in-react)
- [Building an ecommerce Product details component](https://debbie.codes/blog/building-an-ecommerce-product-page/)

**NestJS Best Practices:**
- [Creating a Simple E-Commerce API with NestJS](https://arnab-k.medium.com/creating-a-simple-e-commerce-api-with-nestjs-dc0dcaa302b7)
- [How to Build a Progressive Ecommerce App with Nest.js](https://www.topcoder.com/thrive/articles/how-to-build-a-progressive-ecommerce-app-with-nest-js)
- [Mastering NestJS — Building an Effective REST API Backend](https://medium.com/@janishar.ali/mastering-nestjs-building-an-effective-rest-api-backend-8a5add59c2f5)

**International Shoe Sizing:**
- [Shoe Size Conversion Chart: US UK EU Complete Guide 2026](https://wayupsports.com/blogs/all/shoe-size-conversion-us-uk-eu-complete-guide-2026)
- [Shoe Size Matters: Sizes Massively Vary in Big Brands](https://blog.radwell.codes/2023/10/shoe-size-matters-variation-in-big-brands/)
- [International Shoe Size Conversion Chart](http://www.shoesizes.co/)

**Product Image-Variant Mapping:**
- [Winning with Product Variants How to Structure Your E-commerce Feed](https://www.feedance.com/article/winning-with-product-variants-how-to-structure-your-e-commerce-feed)
- [Solving Complex Product Variant Challenges in Your E-commerce Feed](https://www.feedance.com/article/solving-complex-product-variant-challenges-in-your-e-commerce-feed)
- [Ultimate Guide: Ecommerce Product Variations Optimization](https://yoast.com/ecommerce-product-variations-optimization-guide/)
- [Understanding products and variants - Commerce for Devs](https://commercefordevs.org/understanding-products-and-variants/)

**Database Migration & Data Integrity:**
- [9 Data Migration Challenges (+ How to Mitigate Them)](https://www.tredence.com/blog/data-migration-challenges)
- [Data Migration Best Practices: Your Ultimate Guide for 2026](https://medium.com/@kanerika/data-migration-best-practices-your-ultimate-guide-for-2026-7cbd5594d92e)
- [15 Proven Best Practices for a Smooth and Secure Database Migration](https://nanobytetechnologies.com/Blog/15-Proven-Best-Practices-for-a-Smooth-and-Secure-Database-Migration)
- [Database Migrations: Safe, Downtime-Free Strategies](https://vadimkravcenko.com/shorts/database-migrations/)

**TypeORM Migrations:**
- [TypeORM Migrations Explained - Example with NestJS and PostgreSQL](https://peturgeorgievv.com/blog/typeorm-migrations-explained-example-with-nestjs-and-postgresql)
- [How migrations work? | TypeORM](https://typeorm.io/docs/migrations/why/)
- [TypeORM Migrations Documentation](https://orkhan.gitbook.io/typeorm/docs/migrations)

---

*Pitfalls research for: Tony's Shoe Store Multi-Brand E-Commerce Refactoring*
*Researched: 2026-02-10*
*Confidence: MEDIUM (based on web search results verified across multiple sources, specific to current project context)*
