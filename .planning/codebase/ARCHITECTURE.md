# Architecture

**Analysis Date:** 2026-02-10

## Pattern Overview

**Overall:** Turborepo monorepo with separate frontend SPA and backend REST API communicating over HTTP/JSON.

**Key Characteristics:**
- Two independent apps (`apps/frontend`, `apps/backend`) managed by Turborepo
- Backend follows NestJS modular architecture (controller → service → TypeORM entity)
- Frontend follows React SPA pattern with client-side routing, Zustand stores, and React Query for server state
- PostgreSQL database accessed exclusively through TypeORM from the backend
- No shared packages yet (`packages/` directory exists but is empty)

## Layers

**Frontend Presentation Layer:**
- Purpose: Renders UI, handles user interactions, manages client-side routing
- Location: `apps/frontend/src/`
- Contains: React components, pages, stores, API client
- Depends on: Backend REST API via axios (`apps/frontend/src/lib/api.ts`)
- Used by: End users via browser

**Backend API Layer:**
- Purpose: REST API endpoints, request validation, business logic
- Location: `apps/backend/src/`
- Contains: NestJS modules (controller + service + entity per domain)
- Depends on: PostgreSQL via TypeORM
- Used by: Frontend via HTTP

**Database Layer:**
- Purpose: Persistent data storage
- Location: `database/migrations/` (SQL migration files)
- Contains: Schema definitions, seed data
- Depends on: Nothing
- Used by: Backend via TypeORM

## Data Flow

**Product Browse Flow:**

1. Frontend page component mounts, triggers React Query fetch via `api.get('/products')`
2. Axios interceptor in `apps/frontend/src/lib/api.ts` adds auth token, proxied to backend (baseURL: `/api`)
3. `ProductsController.findAll()` at `apps/backend/src/products/products.controller.ts` delegates to `ProductsService`
4. `ProductsService` queries PostgreSQL via TypeORM repository, returns entities with relations
5. Response interceptor converts numeric string fields (price) to numbers
6. React Query caches result (5-minute staleTime), component renders

**Authentication Flow:**

1. User submits credentials on `LoginPage` (`apps/frontend/src/pages/LoginPage.tsx`)
2. Backend `AuthController` (`apps/backend/src/auth/auth.controller.ts`) validates via Passport + JWT strategy
3. JWT token returned, stored in `localStorage` by `authStore` (`apps/frontend/src/stores/authStore.ts`)
4. Axios request interceptor attaches `Bearer` token to all subsequent requests
5. 401 responses trigger auto-redirect to `/login` and token removal

**Cart Flow:**

1. Cart state managed client-side in Zustand with localStorage persistence (`apps/frontend/src/stores/cartStore.ts`)
2. Cart items stored by `variantId` with quantity tracking
3. No server-side cart sync currently visible in the cart store (client-only)

**State Management:**
- **Server state:** React Query (`@tanstack/react-query`) with 5-min stale time, 1 retry
- **Client state:** Zustand stores with `persist` middleware for cart (`apps/frontend/src/stores/cartStore.ts`) and auth (`apps/frontend/src/stores/authStore.ts`)
- **URL state:** React Router DOM v6 for routing

## Key Abstractions

**NestJS Domain Modules:**
- Purpose: Encapsulate a business domain (controller + service + entities)
- Examples: `apps/backend/src/products/`, `apps/backend/src/orders/`, `apps/backend/src/auth/`, `apps/backend/src/cart/`, `apps/backend/src/brands/`, `apps/backend/src/categories/`, `apps/backend/src/users/`
- Pattern: Each module registers entities via `TypeOrmModule.forFeature()`, exposes a service and controller

**TypeORM Entities:**
- Purpose: Map database tables to TypeScript classes
- Examples: `apps/backend/src/products/entities/product.entity.ts`, `apps/backend/src/orders/entities/order.entity.ts`, `apps/backend/src/users/entities/user.entity.ts`
- Pattern: Decorated classes with `@Entity()`, `@Column()`, `@OneToMany()`, etc.

**Frontend Pages:**
- Purpose: Route-level components that compose smaller components
- Examples: `apps/frontend/src/pages/HomePage.tsx`, `apps/frontend/src/pages/ProductsPage.tsx`, `apps/frontend/src/pages/CartPage.tsx`
- Pattern: Each page maps to a route in `apps/frontend/src/App.tsx`

## Entry Points

**Frontend:**
- Location: `apps/frontend/src/main.tsx`
- Triggers: Browser loads the SPA
- Responsibilities: Mounts React app with BrowserRouter, QueryClientProvider, StrictMode

**Backend:**
- Location: `apps/backend/src/main.ts`
- Triggers: `nest start` or `node dist/main`
- Responsibilities: Creates NestJS app, sets global prefix `/api`, enables CORS (origin: `localhost:5173`), applies global ValidationPipe (whitelist + transform), listens on port 3000

**Database Migrations:**
- Location: `database/migrations/001_initial_schema.sql`, `database/migrations/002_drop_model_3d_url.sql`, `database/migrations/003_update_product_images.sql`
- Triggers: Manual execution against PostgreSQL
- Responsibilities: Schema creation and evolution

## Error Handling

**Strategy:** Layer-specific error handling with automatic auth recovery

**Patterns:**
- Backend uses NestJS global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` for input validation (`apps/backend/src/main.ts`)
- Backend uses `class-validator` decorators on DTOs for request validation
- Frontend axios interceptor catches 401 errors, clears token, redirects to login (`apps/frontend/src/lib/api.ts`)
- Frontend has an `ErrorFallback` component (`apps/frontend/src/components/ui/ErrorFallback.tsx`)
- React Query provides retry (1 attempt) on failed queries

## Cross-Cutting Concerns

**Logging:** Console-based. NestJS default logger. TypeORM SQL logging enabled in development mode (`apps/backend/src/app.module.ts` line 30).

**Validation:** Backend uses `class-validator` + `class-transformer` with global `ValidationPipe`. Frontend relies on form-level validation in page components.

**Authentication:** JWT-based via `@nestjs/passport` + `passport-jwt`. Token stored in `localStorage`. Protected routes on frontend via `ProtectedRoute` component (`apps/frontend/src/components/auth/ProtectedRoute.tsx`). Backend guards via Passport strategies in `apps/backend/src/auth/`.

**API Prefix:** All backend routes prefixed with `/api`. Frontend axios baseURL set to `/api` (proxied in dev via Vite).

---

*Architecture analysis: 2026-02-10*
