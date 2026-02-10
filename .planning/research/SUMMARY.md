# Project Research Summary

**Project:** Tony's Shoe Store - Multi-Brand E-Commerce
**Domain:** E-commerce shoe store (multi-brand retail)
**Researched:** 2026-02-10
**Confidence:** HIGH (stack, architecture), MEDIUM (features, pitfalls)

## Executive Summary

Tony's Shoe Store is a multi-brand shoe e-commerce platform requiring product catalog management, variant handling (size/color combinations), shopping cart, and checkout. Research shows the existing tech stack (React 18 + Vite, NestJS 10, PostgreSQL 17, TypeORM) is production-ready for 2026 and requires refinement rather than replacement. The recommended approach is to strengthen the foundation (database schema, validation, image handling) before adding advanced features like AR try-on or 360° product spins.

The critical success factors are: (1) proper image-to-variant mapping to prevent wrong-color delivery issues, (2) variant-level stock tracking to avoid overselling specific sizes, and (3) migration-based database changes to prevent data loss. The existing database schema is well-designed with proper relationships, but needs verification of indexes on foreign keys and consistent seed data that mirrors production edge cases (missing images, out-of-stock variants, null fields).

Key risks include the N+1 query problem in product listings (load brands, categories, and images eagerly with joins), inconsistent mock data hiding production bugs (seed realistic data with edge cases), and missing international size support (decide early whether to support EU/UK sizing or US-only). These can be mitigated by following established e-commerce patterns: TanStack Query for server state, Zustand for client state, modular NestJS architecture, and CDN-based image delivery.

## Key Findings

### Recommended Stack

The current stack is solid for 2026 and requires targeted upgrades rather than replacement. Focus on image optimization (add CDN), UI components (adopt Radix UI for accessibility), and validation patterns (strengthen global ValidationPipe). Avoid major migrations like Prisma or ESLint 9 until core features are stable.

**Core technologies:**
- **React 18.3.1 + Vite 5.4.10+**: Industry standard for e-commerce SPAs. No need for Next.js at current scale.
- **NestJS 10.x + TypeORM 0.3.17+**: Enterprise-grade backend. Keep TypeORM despite Prisma hype (migration is high-risk, defer to Phase 2+).
- **PostgreSQL 17**: Production-standard with proper schema (BIGINT IDENTITY for PKs, NUMERIC for prices, TEXT over VARCHAR).
- **Zustand 4.4.0+ + TanStack Query 5.17.0+**: Modern state management pattern. Zustand for client state (cart, UI), TanStack Query for server state (products, brands).
- **Radix UI (add) + Tailwind CSS**: Headless accessible components styled with utility classes. 28+ components, more complete than Headless UI.
- **ImageKit.io (add)**: CDN for image optimization with free tier (20GB storage, 20GB bandwidth, unlimited transformations).

**Deferred upgrades:**
- Prisma migration (requires full entity/query rewrite, defer to Phase 2+)
- ESLint 9 upgrade (breaking changes, defer to separate phase)

### Expected Features

**Must have (table stakes):**
- Multi-angle product images (4-8 per product, 2000x2000px) — industry standard, users expect multiple views
- Image zoom on hover/click — essential for inspecting materials and stitching
- Product filtering (brand, size, color, price) with multi-select — shoes are always filtered by size and brand
- Size selection with availability indicators — 75% of returns due to poor fit, must show what's in stock
- Size guide with measurements — builds confidence for online-only purchases
- Product reviews with star ratings — 90% of shoppers rely on reviews, target 4.75-4.99 star average
- Search with autocomplete — expected on all modern e-commerce sites
- Wishlist/favorites (heart icon) — standard feature for consideration phase
- Guest checkout — 63% abandon if forced to create account, CRITICAL for launch
- Persistent shopping cart — users expect cart to be there days/weeks later
- Mobile-responsive design — 30%+ of footwear sales online, significant mobile traffic

**Should have (competitive):**
- User-generated product images in reviews — 71% of consumers seek UGC, 103.9% more likely to convert
- Fit-focused review filters (runs small/true/large) — reduces returns due to sizing issues
- Stock availability indicators ("Only 2 left!") — creates urgency, informs decisions
- Product recommendations ("You may also like") — increases average order value
- Quick view modal — browse faster without full page loads
- "Notify me when back in stock" — captures lost sales from out-of-stock items

**Defer (v2+):**
- 360-degree product spin — HIGH impact but HIGH effort (requires 18-36 photos on turntable)
- Virtual try-on (AR) — 71% conversion increase but very complex, major competitive advantage
- AI-powered personalized recommendations — requires ML infrastructure
- Social login (OAuth) — adds complexity, not critical for MVP
- Loyalty program — different business model, defer until traction

### Architecture Approach

Standard three-tier architecture: React frontend with TanStack Query for server state, REST API built with modular NestJS (each domain is self-contained module), PostgreSQL database with separate tables for product variants and images. The key pattern is separating server state (managed by TanStack Query with automatic caching) from client state (Zustand for cart/auth). Products table stores shared attributes while product_variants table handles size/color combinations with independent stock tracking.

**Major components:**
1. **Frontend Pages** — Route containers that orchestrate data fetching (ProductsPage, ProductPage, CartPage)
2. **Business Components** — Domain-specific UI (ProductCard, ProductImageViewer, CartItem)
3. **NestJS Modules** — Bounded contexts (ProductsModule, BrandsModule, CartModule, OrdersModule)
4. **TypeORM Repository Pattern** — Services inject repositories for data access, business logic stays in service layer
5. **Product Variants Schema** — Separate table for size/color combinations with foreign keys, enables efficient inventory queries

**Key patterns:**
- **Server vs Client State**: TanStack Query for API data, Zustand for cart/UI preferences
- **Eager Loading**: Use `relations: ['brand', 'category', 'images']` to prevent N+1 queries
- **Component Composition**: Pages → Business Components → UI Primitives (avoid prop drilling)
- **Image Collection**: One-to-many product_images table with is_primary flag and sort_order
- **Modular Backend**: Each domain is self-contained module that exports services for other modules

### Critical Pitfalls

1. **Product Image-to-Variant Mapping Failures** — Images show wrong color variant. User orders red shoes, receives blue. Prevention: Add optional color column to product_images, implement image filtering by selected color, automated tests to verify each color has images.

2. **TypeORM synchronize: true in Production** — Auto-generates schema changes on deployment, can silently drop columns with inventory data. Prevention: Disable synchronize in all environments, use migrations for all entity changes, review generated migrations before running.

3. **N+1 Query Problem in Product Listings** — 20 products trigger 100+ database queries (1 for products, 20 for brands, 20 for categories, etc.). Page takes 3+ seconds to load. Prevention: Use eager loading with `relations` option or QueryBuilder with `leftJoinAndSelect`, enable query logging in development.

4. **Missing Variant-Level Stock Tracking** — Stock stored at product level instead of variant level. Users add to cart only to find specific size is out of stock at checkout. Prevention: Store stock in product_variants table (already correct in schema), require variantId for add-to-cart, disable "Add to Cart" if selected variant has zero stock.

5. **Inconsistent Seed Data vs Real Data** — Mock data is perfect (all products have 4 images, all variants in stock), production has missing images and null descriptions. Frontend crashes with "Cannot read property of undefined". Prevention: Seed realistic data with edge cases, add null checks in frontend, use TypeScript strict mode, enforce database constraints.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Database Foundation & Data Integrity
**Rationale:** All layers depend on correct database schema. Must establish proper image-variant relationships, variant-level stock tracking, and migration workflow before building UI. Database mistakes are expensive to fix later.

**Delivers:**
- Finalized schema with all tables (products, product_variants, product_images, brands, categories, users, cart_items, orders)
- Migration workflow (disable synchronize, establish migration patterns)
- Indexes on all foreign keys and common query patterns
- Realistic seed data with edge cases (missing images, zero stock, null fields)
- Validation that image-variant relationships are correct

**Addresses:**
- Product variant schema pattern (ARCHITECTURE)
- International shoe sizing decision (PITFALLS #2) — decide US-only vs multi-region
- Image collection structure (ARCHITECTURE)

**Avoids:**
- TypeORM synchronize: true pitfall (PITFALLS #3)
- Missing FK indexes pitfall (PITFALLS #8)
- Inconsistent seed data pitfall (PITFALLS #5)
- Image-to-variant mapping failures (PITFALLS #1)

**Research Flag:** SKIP RESEARCH — well-documented patterns, schema already exists in migrations/001_initial_schema.sql

---

### Phase 2: Backend API & Core Modules
**Rationale:** API endpoints must exist before frontend can query them. Modular NestJS architecture allows building each domain (products, brands, categories) independently. Focus on query optimization and validation from start.

**Delivers:**
- ProductsModule with eager loading to prevent N+1 queries
- BrandsModule and CategoriesModule (no dependencies)
- Global ValidationPipe with security options (whitelist, forbidNonWhitelisted)
- DTOs with class-validator for all endpoints
- CartModule with variant validation
- Server-side pagination from day one

**Uses:**
- NestJS modular architecture (STACK)
- TypeORM repository pattern (ARCHITECTURE)
- class-validator for DTOs (STACK)

**Implements:**
- Repository pattern with services (ARCHITECTURE)
- Proper eager loading to prevent N+1 (PITFALLS #4)
- DTO validation at API boundaries (PITFALLS #11)

**Avoids:**
- N+1 query problems (PITFALLS #4)
- Missing DTO validation (PITFALLS #11)
- Tightly coupled modules (ARCHITECTURE anti-pattern #3)
- Client-side pagination only (ARCHITECTURE anti-pattern #4)

**Research Flag:** SKIP RESEARCH — NestJS patterns are standard, official docs comprehensive

---

### Phase 3: Frontend Catalog Display
**Rationale:** Users must browse products before buying. Product listing and detail pages are foundation for shopping experience. Establish component patterns and state management before adding complex features like cart or checkout.

**Delivers:**
- TanStack Query setup for server state management
- Product types (TypeScript interfaces matching backend)
- ProductCard component (reusable for listings)
- ProductsPage with filtering (brand, size, color, price)
- ProductPage with variant selection and image gallery
- ProductImageViewer with zoom and color-based image filtering
- Skeleton loaders for images
- Graceful fallbacks for missing images

**Uses:**
- TanStack Query for server state (STACK)
- Radix UI components (STACK)
- Component-driven development pattern (ARCHITECTURE)

**Implements:**
- Server vs client state separation (ARCHITECTURE pattern #1)
- Component composition (pages → business components → UI primitives)
- Image loading states (PITFALLS #14)
- Fallback images (PITFALLS #10)

**Addresses Features:**
- Multi-angle product images (FEATURES table stakes)
- Image zoom on hover/click (FEATURES table stakes)
- Product filtering (FEATURES table stakes)
- Size selection with availability (FEATURES table stakes)

**Avoids:**
- Frontend prop drilling (PITFALLS #7)
- Storing server data in Zustand (ARCHITECTURE anti-pattern #1)
- No loading states (PITFALLS #14)
- No image fallbacks (PITFALLS #10)
- Sold-out variants not disabled (PITFALLS #15)

**Research Flag:** SKIP RESEARCH — React patterns are standard, TanStack Query well-documented

---

### Phase 4: Cart & User Management
**Rationale:** Once users can browse products, they need to add to cart and create accounts. Cart must persist across sessions. Separate user authentication (backend JWT) from cart state (Zustand with localStorage).

**Delivers:**
- CartStore (Zustand with persistence to localStorage)
- AuthModule (backend JWT authentication)
- AuthStore (frontend auth state)
- CartPage (display items, update quantities, remove items)
- Guest cart experience (no login required to add items)
- Cart-to-backend sync for logged-in users (optional for v1)

**Uses:**
- Zustand for client state (STACK)
- NestJS AuthModule patterns (STACK)

**Implements:**
- Client state management with Zustand (ARCHITECTURE)
- Persistent cart across sessions (FEATURES table stakes)

**Addresses Features:**
- Persistent shopping cart (FEATURES table stakes)
- Guest checkout foundation (FEATURES table stakes - CRITICAL)
- Wishlist/favorites can build on same patterns (FEATURES competitive)

**Avoids:**
- Forcing account creation to browse (FEATURES anti-pattern)
- Cart stored at product level instead of variant level (PITFALLS #6)

**Research Flag:** SKIP RESEARCH — Cart and auth are standard e-commerce patterns

---

### Phase 5: Search, Filters & Enhanced Discovery
**Rationale:** Once core shopping flow works, enhance discovery to help users find products. Search with autocomplete is table stakes. Size guide, recommendations, and wishlist improve conversion.

**Delivers:**
- Search with autocomplete (include product names, brands, categories)
- Size guide modal with measurement instructions and US/EU/UK conversion table
- Wishlist/favorites with heart icon (persist for logged-in users)
- Recently viewed products (localStorage-based)
- Basic product recommendations ("You may also like")
- Brand pages/collections

**Addresses Features:**
- Search with autocomplete (FEATURES table stakes)
- Size guide (FEATURES table stakes)
- Wishlist/favorites (FEATURES table stakes)
- Recently viewed (FEATURES competitive)
- Product recommendations (FEATURES competitive)
- Brand pages (FEATURES table stakes)

**Research Flag:** MEDIUM RESEARCH — Search autocomplete implementation patterns, recommendations algorithm (can start simple with same-category products)

---

### Phase 6: Reviews & Social Proof
**Rationale:** Product reviews are table stakes (90% of shoppers rely on them). Start with display-only reviews (manually seeded), add submission form in later iteration. UGC images are powerful differentiators.

**Delivers:**
- Product reviews display with star ratings
- Average rating and review count on product cards
- Review submission form (authenticated users only)
- User-generated images in reviews (allow image uploads)
- Fit-focused review filters (runs small/true to size/runs large)

**Addresses Features:**
- Product reviews with star ratings (FEATURES table stakes)
- User-generated product images (FEATURES competitive)
- Fit-focused review filters (FEATURES competitive)

**Research Flag:** LOW RESEARCH — May need review moderation patterns, UGC image storage strategy

---

### Phase 7: Checkout & Order Management
**Rationale:** Final step to complete purchase flow. Must validate stock at checkout time to prevent overselling. Orders module creates permanent records from cart data.

**Delivers:**
- OrdersModule (backend order creation with stock validation)
- CheckoutPage (address collection, order summary)
- Guest checkout flow (offer account creation after, not before)
- Order confirmation page
- Order history for logged-in users
- Stock validation with database transactions (prevent overselling)

**Uses:**
- NestJS OrdersModule patterns
- Database transactions for stock reservation

**Addresses Features:**
- Guest checkout (FEATURES table stakes - CRITICAL)
- Order history (FEATURES table stakes)

**Avoids:**
- Price calculated on frontend only (PITFALLS security)
- No stock validation at checkout (PITFALLS security)

**Research Flag:** MEDIUM RESEARCH — Stock reservation patterns, checkout optimization (may need Stripe integration research for payment)

---

### Phase 8: Image Optimization & Performance
**Rationale:** Once core features work, optimize for production load. Image CDN, lazy loading, and query caching improve performance at scale.

**Delivers:**
- ImageKit.io CDN integration for product images
- URL-based image transformations (resize, WebP conversion, quality adjustment)
- Native lazy loading on below-fold images
- Redis caching for frequently accessed data (featured products, categories)
- Database query optimization review

**Uses:**
- ImageKit.io for CDN (STACK)
- Native lazy loading (STACK)

**Implements:**
- Image optimization pattern (STACK)
- Query result caching for hot paths

**Avoids:**
- Slow image delivery (ARCHITECTURE scaling consideration)
- Performance traps as catalog grows

**Research Flag:** LOW RESEARCH — ImageKit documentation comprehensive, standard CDN patterns

---

### Phase Ordering Rationale

- **Database first** — All layers depend on correct schema. Image-variant relationships must be established before UI is built.
- **Backend before frontend** — API endpoints must exist to query. Allows frontend to develop against real data, not mock data.
- **Brands/Categories before Products** — Products reference them via foreign keys.
- **Browse before buy** — Users must see products (Phase 3) before they can add to cart (Phase 4).
- **Cart before checkout** — Cart converts to orders at checkout (Phase 7 depends on Phase 4).
- **Core features before optimization** — Premature optimization is anti-pattern. Get features working, then optimize (Phase 8 is last).

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 5 (Search & Discovery):** Search autocomplete implementation patterns, recommendation algorithms (can start simple)
- **Phase 6 (Reviews):** Review moderation patterns if enabling user submissions, UGC image storage strategy
- **Phase 7 (Checkout):** Stock reservation with database transactions, payment gateway integration (Stripe)

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Database):** Well-documented PostgreSQL + TypeORM patterns, schema already exists
- **Phase 2 (Backend API):** NestJS official docs comprehensive, repository pattern is standard
- **Phase 3 (Frontend Catalog):** React + TanStack Query patterns well-established
- **Phase 4 (Cart & Auth):** Standard e-commerce patterns, plenty of examples
- **Phase 8 (Optimization):** ImageKit docs comprehensive, lazy loading is native browser feature

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official docs for React, NestJS, PostgreSQL, TypeORM, TanStack Query. Recommended libraries (Radix UI, ImageKit) have clear documentation. Version compatibility verified. |
| Features | MEDIUM | Multiple e-commerce sources agree on table stakes (reviews, filtering, guest checkout). Some features (360 spin, AR try-on) have varying adoption rates. No direct access to competitor analytics. |
| Architecture | HIGH | Standard three-tier architecture. Modular NestJS and component-driven React are well-documented patterns. Product variant schema is industry standard. |
| Pitfalls | MEDIUM | Common mistakes verified across multiple sources. Image-variant mapping and synchronize:true are well-known issues. International sizing is complex but deferred. |

**Overall confidence:** HIGH

The core technical stack and architecture patterns are well-established with official documentation. The main uncertainties are in feature prioritization (which competitive features have highest ROI) and domain-specific details (international shoe sizing, fit review filters). These can be validated during implementation through user feedback.

### Gaps to Address

- **International shoe sizing:** Research assumes US-only sizing. If international expansion is planned, need to design size_standards table with conversion tables. Decision needed in Phase 1 (Database).

- **Payment gateway choice:** Research doesn't cover Stripe vs PayPal vs other payment processors. Decision needed in Phase 7 (Checkout). Recommendation: Stripe for US market (best developer experience, comprehensive docs).

- **Review moderation strategy:** If enabling user-submitted reviews, need content moderation plan (manual review vs automated filtering). Decision needed in Phase 6 (Reviews).

- **Image storage strategy:** Current schema stores image URLs in database. Need to decide: self-hosted S3 bucket vs ImageKit.io vs Cloudinary. Recommendation: ImageKit.io free tier for MVP (20GB storage sufficient for 500-1000 products with 4-8 images each).

- **Mobile navigation pattern:** Research covers responsive design but not specific mobile nav (bottom bar vs hamburger menu). Decision needed in Phase 3 (Frontend). Current design uses bottom nav bar (Home, Search, Cart, Account) which is mobile e-commerce standard.

## Sources

### Primary (HIGH confidence)
- [NestJS Official Docs](https://docs.nestjs.com/) — Validation, modules, repository pattern
- [TanStack Query Official Docs](https://tanstack.com/query/latest/docs/framework/react/overview) — Server state management
- [Vite Performance Guide](https://vite.dev/guide/performance) — Production build optimization
- [TypeORM Official Docs](https://typeorm.io/) — Migration patterns, repository pattern
- [React Image Optimization: ImageKit Guide](https://imagekit.io/blog/react-image-optimization/) — CDN integration patterns

### Secondary (MEDIUM confidence)
- [E-commerce Product Image Size Guide 2026](https://www.squareshot.com/post/e-commerce-product-image-size-guide) — Image sizing standards (85% coverage, 2000x2000px)
- [Ratings & Reviews Best Practices for Footwear Brands](https://www.powerreviews.com/ratings-reviews-best-practices-footwear-brands/) — Review benchmarks (194 avg reviews, 4.75-4.99 star target)
- [26 Ecommerce Trends For 2026](https://www.yotpo.com/blog/ecommerce-trends-2026/) — UGC trends (71% seek UGC, 103.9% conversion increase)
- [15 Ecommerce Checkout & Cart UX Best Practices 2026](https://www.designstudiouiux.com/blog/ecommerce-checkout-ux-best-practices/) — Guest checkout importance (63% abandonment if forced to register)
- [Mastering NestJS: Clean Architecture and DDD in E-commerce](https://medium.com/nestjs-ninja/mastering-nestjs-unleashing-the-power-of-clean-architecture-and-ddd-in-e-commerce-development-97850131fd87) — Modular architecture patterns
- [E-Commerce Database Design: Managing Product Variants Using the EAV Model](https://np4652.medium.com/e-commerce-database-design-managing-product-variants-for-multi-vendor-platforms-using-the-eav-01307e63b920) — Variant schema patterns
- [Zustand vs Redux 2026 Comparison](https://medium.com/@sangramkumarp530/zustand-vs-redux-toolkit-which-should-you-use-in-2026-903304495e84) — State management trends
- [Radix UI vs Headless UI Comparison](https://www.subframe.com/tips/headless-ui-vs-radix-6cb34) — Component library features

### Tertiary (LOW confidence - needs validation)
- [AR and 3D Experiences for Footwear Brands](https://www.brandxr.io/virtually-try-on-shoes-ar-and-3d-experiences-for-footwear-brands) — AR try-on impact (71% conversion increase) — market research, not verified with A/B tests
- [Everything About 360 Degree Product Spin](https://resources.imagine.io/blog/everything-about-360-degree-product-spin-for-ecommerce-ultimate-guide) — 360 spin impact (30% conversion increase) — specific to Zappos case study

---
*Research completed: 2026-02-10*
*Ready for roadmap: yes*
