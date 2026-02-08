# Project: Tony's Shoe Store

## Core Principle

You operate as the decision-maker in a modular system. Your job is NOT to do everything yourself. Your job is to read instructions, pick the right tools, handle errors intelligently, and improve the system over time.

Why? 90% accuracy across 5 steps = 59% total success. Move repeatable work into tested scripts. You focus on decisions.

## System Architecture

**Blueprints (/blueprints)** - Step-by-step instructions in markdown. Goal, inputs, scripts to use, output, edge cases. Check here FIRST.

**Scripts (/scripts)** - Tested, deterministic code. Call these instead of writing from scratch.

**Workspace (/.workspace)** - Temp files. Safe to delete anytime.

## How You Operate

1. Check blueprints first - If one exists, follow it exactly
2. Use existing scripts - Only create new if nothing exists
3. Fail forward - Error → Fix → Test → Update blueprint → Add to LEARNINGS.md → System smarter
4. Ask before creating - Don't overwrite blueprints without asking

## Git Workflow

ONlY create branches for tasks.
committing, and pushing are coordinated by the human collaborator. Focus on delivering the requested changes; they will decide how and when to sync with the remote repository.

## Tech Stack

- Frontend: React + Vite
- Backend: NestJS
- Database: PostgreSQL (local, for now)
- Monorepo: Turborepo

## Project Structure (Monorepo)

```
/apps
├── frontend/     - React frontend application
└── backend/      - NestJS backend API
/packages/        - Shared packages (future)
/scripts/         - Automation scripts
/blueprints/      - Task SOPs
/.workspace/      - Temp files (gitignored)
```

## Code Standards

- TypeScript strict, explicit return types
- Functional components only
- Props: ComponentNameProps
- No any - use unknown
- Async/await over .then()

## Testing & Verification

After making changes:

1. Run `npm run build` from root - both apps must build successfully
2. For backend changes: Run `npm run test` in apps/backend
3. For frontend changes: Run `npm run dev` and verify in browser
4. ALWAYS verify your changes before marking tasks complete

## ⚠️ Critical Areas (Ask Before Modifying)

- **Database migrations** - Can't be rolled back easily
- **Authentication logic** - Security implications (apps/backend/src/auth/)
- **Order processing** - Financial transactions (apps/backend/src/orders/)
- **User data handling** - Privacy/GDPR concerns

For these areas: Propose changes first, don't implement directly.

## Error Protocol

1. Stop and read the full error
2. Isolate - which component/script failed
3. Fix and test
4. Document in LEARNINGS.md
5. Update relevant blueprint

## What NOT To Do

- Don't skip blueprint check
- Don't ignore errors and retry blindly
- Don't create files outside structure
- Don't write from scratch when blueprint exists

## Database Architecture

### ERD Overview (PostgreSQL 17)

```
users (1) ─────< (N) addresses
  │                     │
  │                     │ (shipping/billing)
  │                     │
  (1)                   │
  │                     │
  └──< cart_items >─────┘
  │         │
  │         │ (N)
  │         │
  │         ▼
  │    product_variants (M)
  │         │
  │         │ (N)
  │         │
  │         ▼
  └──< orders ────< order_items >──┐
            │                      │
            │                      │
            │                      │
            │                      │
            ▼                      ▼
     (shipping_address)    product_variants (M)
                                   │
                                   │ (N)
                                   │
                                   ▼
                              products (1)
                                   │
                                   ├──< product_images (N)
                                   │
                                   ├──> brands (1)
                                   │
                                   └──> categories (1)
```

**Key Tables:**

- **users**: Customer accounts (BIGINT IDENTITY PK)
- **products**: Shoe inventory with product images
- **product_variants**: Size/color combinations with stock
- **cart_items**: Shopping cart line items
- **orders**: Order history with status tracking
- **brands**: Nike, Adidas, Jordan, etc.
- **categories**: Running, Basketball, Lifestyle, etc.

**PostgreSQL Best Practices Applied:**

- ✅ BIGINT GENERATED ALWAYS AS IDENTITY for PKs
- ✅ TEXT instead of VARCHAR(n)
- ✅ NUMERIC(10,2) for prices (never float)
- ✅ TIMESTAMPTZ for all timestamps
- ✅ Indexes on ALL FK columns (PostgreSQL doesn't auto-create)
- ✅ Partial indexes for hot queries (is_featured, in_stock)
- ✅ UNIQUE constraints with proper NULLs handling
- ✅ CHECK constraints for data validation

**Migration Location:** [database/migrations/001_initial_schema.sql](database/migrations/001_initial_schema.sql)

## Product Images

Products use regular images stored in the database through the `product_images` table. Each product can have multiple images for different angles/views. No 3D viewers — standard product photography only.

**Image Component:**

- **ProductImageViewer** ([apps/frontend/src/components/product/ProductImageViewer.tsx](apps/frontend/src/components/product/ProductImageViewer.tsx))
- Displays product images with thumbnail navigation
- Color selector for different variants
- Image counter overlay
- Responsive grid layout

**Best Practices:**

- Use optimized image formats (WebP preferred)
- Multiple images per product (different angles)
- Consistent aspect ratios (square format)
- Lazy loading for performance

## Homepage Sections (Landing Page)

The homepage is a single-page layout with anchor navigation. Sections in order:

1. **Header** — Nike swoosh logo, nav links (Home, About, Product, Testimonial, Shop), search icon, cart icon, "Contact Us" CTA button
2. **Hero** — "Summer Collections 2022" headline, subtitle text, "Shop Now" button, 4.9 star rating (120k reviews), large hero shoe image (orange), "Get up to 30% off" promo card
3. **Popular Products** — Product card carousel (4 visible), each card has: star rating, product name, price, heart/wishlist icon, "Add to Cart" button, left/right carousel arrows
4. **Promo + About Us** — Split layout: "Get up to 30% off" promo card on left, "We Provide High Quality Shoes" about section on right with description text and "Explore More" button
5. **Feature Product** — "Get to Know Our Feature Product" section with feature list (Best Quality Shoes, Best Giving Pricing) and highlighted product card (e.g., Nike Watch Series 7i, $150.20)
6. **Customer Testimonials** — "What Our Customer Says" with customer avatars, review text, and names (e.g., Remington, Thomson Zarki)
7. **Newsletter** — "Sign Up for Updates & Newsletter" with email input and submit button
8. **Footer** — Nike logo, columns: Find Product, Get Help, About Us, social media icons, copyright

**Navigation:** All nav links (About, Product, Testimonial) are anchor links scrolling to homepage sections, not separate pages.

## Design System

See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for complete details on:

- Color palette (primary, accent, surface colors)
- Typography scale and style guidelines
- Component classes (buttons, cards, badges)
- Animation classes and layout patterns
- Mock data location and key frontend file references

**Quick Reference:**

- Philosophy: Nike/Adidas-inspired, bold, high-contrast, dark mode first
- Primary accent: #FF3B30 (electric red)
- Component styles: See [apps/frontend/src/index.css](apps/frontend/src/index.css)
- Mock data: [apps/frontend/src/data/mockData.ts](apps/frontend/src/data/mockData.ts)
