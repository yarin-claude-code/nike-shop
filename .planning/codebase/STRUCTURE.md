# Codebase Structure

**Analysis Date:** 2026-02-10

## Directory Layout

```
nike-shop/
├── apps/
│   ├── backend/              # NestJS REST API
│   │   ├── src/
│   │   │   ├── auth/         # Authentication module (JWT/Passport)
│   │   │   ├── brands/       # Brands CRUD module
│   │   │   ├── cart/         # Shopping cart module
│   │   │   ├── categories/   # Product categories module
│   │   │   ├── orders/       # Order management module
│   │   │   ├── products/     # Products module (core)
│   │   │   ├── users/        # User accounts module
│   │   │   ├── app.module.ts # Root module
│   │   │   └── main.ts       # App bootstrap
│   │   ├── dist/             # Compiled output
│   │   └── package.json
│   └── frontend/             # React + Vite SPA
│       ├── src/
│       │   ├── components/   # Reusable UI components
│       │   │   ├── auth/     # Auth guards (ProtectedRoute)
│       │   │   ├── cart/     # Cart UI (CartItem, CartSummary, EmptyCart)
│       │   │   ├── home/     # Homepage sections (Hero, About, etc.)
│       │   │   ├── layout/   # Shell (Layout, Header, Footer)
│       │   │   ├── product/  # Product display (Card, ImageViewer, Info, Tabs)
│       │   │   └── ui/       # Generic UI (Breadcrumb, Skeleton, ErrorFallback)
│       │   ├── data/         # Static/mock data
│       │   ├── lib/          # Utilities (api.ts axios client)
│       │   ├── pages/        # Route-level page components
│       │   ├── stores/       # Zustand state stores
│       │   ├── types/        # TypeScript type definitions
│       │   ├── App.tsx       # Route definitions
│       │   ├── main.tsx      # App entry point
│       │   └── index.css     # Global styles + Tailwind
│       ├── dist/             # Vite build output
│       └── package.json
├── database/
│   └── migrations/           # SQL migration files
├── blueprints/               # Task SOPs/instructions
├── docs/                     # Documentation (DESIGN_SYSTEM.md)
├── scripts/                  # Automation scripts
├── packages/                 # Shared packages (empty, future use)
├── .planning/                # GSD planning documents
├── .workspace/               # Temp files (gitignored)
├── turbo.json                # Turborepo task config
└── package.json              # Root workspace config
```

## Directory Purposes

**`apps/backend/src/`:**
- Purpose: NestJS API server source code
- Contains: Domain modules, each with controller, service, entities, and optional DTOs
- Key files: `main.ts` (bootstrap), `app.module.ts` (root module registering all domain modules + TypeORM)

**`apps/frontend/src/components/`:**
- Purpose: All React components organized by domain
- Contains: TSX files grouped into `auth/`, `cart/`, `home/`, `layout/`, `product/`, `ui/`
- Key files: `layout/Layout.tsx` (app shell with Header/Footer + Outlet), `layout/Header.tsx` (navigation)

**`apps/frontend/src/pages/`:**
- Purpose: Route-level page components (one per route)
- Contains: `HomePage.tsx`, `ProductsPage.tsx`, `ProductPage.tsx`, `CartPage.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`, `CheckoutPage.tsx`

**`apps/frontend/src/stores/`:**
- Purpose: Client-side state management with Zustand
- Contains: `cartStore.ts` (cart items, persisted to localStorage), `authStore.ts` (auth token/user state)

**`apps/frontend/src/lib/`:**
- Purpose: Shared utilities and API client
- Contains: `api.ts` (axios instance with auth interceptor, numeric string conversion, 401 handling)

**`apps/frontend/src/types/`:**
- Purpose: Shared TypeScript type definitions
- Contains: `product.ts` (Product, CartItem, etc.)

**`database/migrations/`:**
- Purpose: PostgreSQL schema migrations (run manually)
- Contains: `001_initial_schema.sql`, `002_drop_model_3d_url.sql`, `003_update_product_images.sql`

## Key File Locations

**Entry Points:**
- `apps/frontend/src/main.tsx`: Frontend app bootstrap (React, Router, QueryClient)
- `apps/backend/src/main.ts`: Backend app bootstrap (NestJS, CORS, ValidationPipe)

**Configuration:**
- `turbo.json`: Turborepo task definitions (build, dev, lint, test)
- `apps/frontend/vite.config.ts`: Vite build config (if present)
- `apps/backend/tsconfig.json`: Backend TypeScript config
- `.env.example`: Environment variable template

**Core Logic:**
- `apps/backend/src/products/products.service.ts`: Product queries and business logic
- `apps/backend/src/auth/auth.controller.ts`: Login/register endpoints
- `apps/backend/src/orders/orders.service.ts`: Order creation and management
- `apps/frontend/src/lib/api.ts`: Central HTTP client for all API calls

**Routing:**
- `apps/frontend/src/App.tsx`: All frontend routes defined here

**Styling:**
- `apps/frontend/src/index.css`: Global styles, Tailwind directives, component classes

## Naming Conventions

**Files:**
- Backend: `kebab-case` for all files (e.g., `product-variant.entity.ts`, `cart-item.entity.ts`)
- Frontend components: `PascalCase.tsx` (e.g., `ProductCard.tsx`, `HeroSection.tsx`)
- Frontend stores: `camelCase.ts` (e.g., `cartStore.ts`, `authStore.ts`)
- Frontend lib/types: `camelCase.ts` (e.g., `api.ts`, `product.ts`)

**Directories:**
- All lowercase, singular or plural matching NestJS convention (e.g., `products/`, `auth/`, `cart/`)
- Frontend component dirs: lowercase by domain (e.g., `home/`, `product/`, `ui/`)

## Where to Add New Code

**New Backend Domain Module:**
- Create directory: `apps/backend/src/{domain}/`
- Files needed: `{domain}.module.ts`, `{domain}.controller.ts`, `{domain}.service.ts`, `entities/{entity}.entity.ts`
- Register module in `apps/backend/src/app.module.ts` imports array

**New Frontend Page:**
- Create page: `apps/frontend/src/pages/{Name}Page.tsx`
- Add route in `apps/frontend/src/App.tsx`

**New Frontend Component:**
- Place in appropriate domain folder: `apps/frontend/src/components/{domain}/{ComponentName}.tsx`
- Generic/reusable components go in `apps/frontend/src/components/ui/`
- Homepage sections go in `apps/frontend/src/components/home/`

**New Backend Entity:**
- Create: `apps/backend/src/{domain}/entities/{entity-name}.entity.ts`
- Register in domain module's `TypeOrmModule.forFeature([])` array
- Create corresponding SQL migration in `database/migrations/`

**New Zustand Store:**
- Create: `apps/frontend/src/stores/{name}Store.ts`
- Use `persist` middleware if state should survive page refresh

**New TypeScript Types:**
- Add to `apps/frontend/src/types/product.ts` or create new file in `apps/frontend/src/types/`

**New Database Migration:**
- Create: `database/migrations/{NNN}_{description}.sql`
- Number sequentially (next: 004)

## Special Directories

**`dist/` (in both apps):**
- Purpose: Compiled/bundled output
- Generated: Yes (by `nest build` / `vite build`)
- Committed: No (gitignored)

**`.workspace/`:**
- Purpose: Temporary working files
- Generated: Manually
- Committed: No (gitignored)

**`blueprints/`:**
- Purpose: Step-by-step task instructions (SOPs)
- Generated: No
- Committed: Yes

**`node_modules/`:**
- Purpose: Dependencies (hoisted to root by npm workspaces, some in `apps/frontend/node_modules/`)
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-02-10*
