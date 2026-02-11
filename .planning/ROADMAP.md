# Roadmap: Tony's Shoe Store — Full Refactor

## Overview

This roadmap transforms Tony's Shoe Store from a single-brand demo with broken images into a production-quality multi-brand e-commerce platform. The journey starts with database foundation (proper image-variant relationships, multi-brand support), builds clean backend APIs with query optimization, establishes a design system and reusable UI components, implements the product catalog with filtering and search, and finishes with reviews and social proof. Each phase delivers a coherent, verifiable capability that unblocks the next.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Database Foundation & Data Integrity** - Establish schema, migrations, and seed data for multi-brand catalog
- [ ] **Phase 2: Backend API Core** - Build NestJS modules for products, brands, filtering, and search
- [ ] **Phase 3: Design System & UI Foundation** - Create reusable components and consistent design patterns
- [ ] **Phase 4: Product Catalog Frontend** - Implement product listing, detail pages, and image galleries
- [ ] **Phase 5: Search & Enhanced Discovery** - Add search autocomplete and size guide
- [ ] **Phase 6: Reviews & Social Proof** - Enable review display and submission with ratings

## Phase Details

### Phase 1: Database Foundation & Data Integrity
**Goal**: Database schema correctly supports multi-brand shoe catalog with proper image-to-variant mapping and realistic seed data
**Depends on**: Nothing (first phase)
**Requirements**: DB-01, DB-02, DB-03, DB-04, DB-05
**Success Criteria** (what must be TRUE):
  1. Database schema includes all tables (products, product_variants, product_images, brands, categories, users, cart_items, orders) with correct relationships
  2. Product images are correctly associated with specific products via foreign keys (no mismatches between listing and detail views)
  3. Product variants track size, color, stock level, and price independently per variant
  4. Seed data contains real shoe products from Nike, Adidas, Puma, and On Cloud with authentic product images
  5. Migration workflow is established (synchronize:false, all schema changes via migrations)
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Migration infrastructure (DataSource config, disable synchronize, CLI scripts)
- [ ] 01-02-PLAN.md — Seeding infrastructure (factories, seeders, real multi-brand product data)

### Phase 2: Backend API Core
**Goal**: Backend API endpoints return products with correct data relationships and support filtering and search
**Depends on**: Phase 1 (database schema)
**Requirements**: API-01, API-02, API-03, API-04, API-06
**Success Criteria** (what must be TRUE):
  1. Products endpoint returns products with correctly mapped images, variants, brand, and category (no N+1 queries)
  2. Products endpoint supports filtering by brand, size, color, and price range with proper query parameters
  3. Products endpoint supports search with partial text matching on product name, brand, and description
  4. Brand pages endpoint returns brand information and associated products
  5. Backend code follows clean NestJS patterns (DTOs with validation, proper error handling, repository pattern)
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Products API with filtering, search, and pagination via QueryBuilder
- [ ] 02-02-PLAN.md — Brand pages endpoint and global exception filter

### Phase 3: Design System & UI Foundation
**Goal**: Design system and reusable UI components are established across the application
**Depends on**: Nothing (runs parallel to Phase 2)
**Requirements**: UX-01, UX-02, UX-04, UX-05, FE-01, FE-03, FE-04
**Success Criteria** (what must be TRUE):
  1. Research-driven visual design is implemented based on Dribbble, 21st.dev, and top shoe retailer references
  2. Consistent design system (colors, typography, spacing, component classes) is applied across all pages
  3. Component hierarchy follows clean patterns (pages > business components > UI components)
  4. Reusable UI components exist (ProductCard, Button, Input, Modal, Skeleton) and are used consistently
  5. Mobile-responsive layout works across all breakpoints
  6. Smooth page transitions and skeleton loading states (no spinners) are implemented
  7. TypeScript strict mode is enabled with no any types
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 4: Product Catalog Frontend
**Goal**: Users can browse products in grid view, view product details with multi-angle images, filter by attributes, and select sizes
**Depends on**: Phase 2 (API endpoints), Phase 3 (design system)
**Requirements**: CAT-01, CAT-02, CAT-03, CAT-04, CAT-05, CAT-07, CAT-08, CAT-09, IMG-01, IMG-02, IMG-03, IMG-04, FE-02, UX-03, UX-06
**Success Criteria** (what must be TRUE):
  1. Product listing page displays products in grid with correct images, price, brand, and average rating
  2. Product detail page shows 4-8 multi-angle images with thumbnail navigation
  3. Product images are consistent — same product shown in listing, detail, and cart views (no mismatches)
  4. Image zoom on hover/click works for product detail images
  5. Filter panel with multi-select for brand, size, color, and price range updates product grid
  6. Brand pages show brand logo, description, and product collection
  7. Size selector shows availability indicators (disabled for out-of-stock sizes)
  8. Size guide modal displays measurement instructions and US/EU/UK conversion table
  9. All product images are real shoe photographs (no placeholders, no cakes, no mismatched items)
  10. Images are optimized (WebP format preferred, lazy loading below fold)
  11. React Query is used consistently for all server state management
  12. Navigation between pages feels natural and intuitive (header, breadcrumbs, back navigation)
  13. Homepage is redesigned with featured products, brand showcase, and hero section
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 5: Search & Enhanced Discovery
**Goal**: Users can search for products with autocomplete and access size guide information
**Depends on**: Phase 4 (product catalog)
**Requirements**: CAT-06
**Success Criteria** (what must be TRUE):
  1. Search bar with autocomplete shows product names, brands, and thumbnails as user types
  2. Search autocomplete is performant (debounced, shows results within 200ms)
  3. Search results link directly to product detail pages
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 6: Reviews & Social Proof
**Goal**: Users can view product reviews with ratings and submit their own reviews with optional images
**Depends on**: Phase 4 (product detail pages)
**Requirements**: API-05, REV-01, REV-02, REV-03, REV-04
**Success Criteria** (what must be TRUE):
  1. Product detail page displays reviews with star ratings, review text, and review images
  2. Average rating and review count are shown on product listing cards
  3. Authenticated users can submit a review with star rating (1-5), text, and optional image upload
  4. Review images (user-generated content) are displayed in the review section
  5. Reviews endpoint supports creating and listing reviews with proper validation
**Plans**: TBD

Plans:
- [ ] TBD during planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Database Foundation & Data Integrity | 0/TBD | Not started | - |
| 2. Backend API Core | 0/TBD | Not started | - |
| 3. Design System & UI Foundation | 0/TBD | Not started | - |
| 4. Product Catalog Frontend | 0/TBD | Not started | - |
| 5. Search & Enhanced Discovery | 0/TBD | Not started | - |
| 6. Reviews & Social Proof | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-10*
*Last updated: 2026-02-10*
