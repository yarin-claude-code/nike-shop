# Coding Conventions

**Analysis Date:** 2026-02-10

## Naming Patterns

**Files:**
- Frontend components: PascalCase (`PopularProducts.tsx`, `ProductCard.tsx`, `HeroSection.tsx`)
- Frontend pages: PascalCase with `Page` suffix (`ProductsPage.tsx`)
- Frontend stores: camelCase with `Store` suffix (`cartStore.ts`, `authStore.ts`)
- Frontend lib/utils: camelCase (`api.ts`)
- Frontend types: camelCase (`product.ts`)
- Backend modules: kebab-case for directories, camelCase for files (`products/products.service.ts`, `products/products.module.ts`)
- Backend entities: kebab-case with `.entity.ts` suffix (`product.entity.ts`, `product-image.entity.ts`)

**Functions:**
- camelCase for all functions and methods (`findAll`, `findBySlug`, `handleAddToCart`, `clearFilters`)
- Event handlers prefixed with `handle` (`handleAddToCart`)
- Boolean getters/computed: descriptive (`hasDiscount`, `isLoading`)
- Void return type explicitly annotated on frontend functions: `(): void =>`

**Variables:**
- camelCase (`scrollRef`, `primaryImage`, `filteredProducts`)
- Boolean variables prefixed with `is`/`has` (`isWishlisted`, `isLoading`, `hasDiscount`)
- Destructured query results use `data: alias` pattern (`data: products = []`)

**Types/Interfaces:**
- PascalCase for all interfaces and types (`Product`, `CartItem`, `PopularProductCardProps`)
- Props interfaces: `ComponentNameProps` (`PopularProductCardProps`)
- Store interfaces: `StoreName` (`CartStore`)
- Export all shared types from dedicated type files

**Backend Classes:**
- NestJS conventions: `ProductsService`, `ProductsController`, `ProductsModule`
- Entity classes match table name in singular (`Product` for `products` table)
- Use `@Entity('table_name')` decorator with explicit table name

## Code Style

**Formatting:**
- Prettier configured at root and backend levels
- Root command: `npm run format` runs `prettier --write "**/*.{ts,tsx,js,jsx,json,md}"`
- Backend command: `npm run format` runs `prettier --write "src/**/*.ts" "test/**/*.ts"`
- Single quotes for strings
- 2-space indentation
- Trailing commas in multiline

**Linting:**
- Frontend: ESLint 9 flat config (`apps/frontend/eslint.config.js`)
  - `typescript-eslint` recommended rules
  - `react-hooks` recommended rules
  - `react-refresh/only-export-components` warning with `allowConstantExport: true`
- Backend: ESLint 8 with `@typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-prettier`
- Root orchestration via Turborepo: `npm run lint`

## TypeScript Configuration

**Frontend** (`apps/frontend/tsconfig.json`):
- `strict: true` (full strict mode)
- `noUnusedLocals: true`, `noUnusedParameters: true`
- Target: ES2020, module: ESNext, jsx: react-jsx
- Path alias: `@/*` maps to `src/*`

**Backend** (`apps/backend/tsconfig.json`):
- `strictNullChecks: true`, `noImplicitAny: true`, `strictBindCallApply: true`
- NOT full `strict: true` (missing `strictFunctionTypes`, `strictPropertyInitialization`, etc.)
- `emitDecoratorMetadata: true`, `experimentalDecorators: true` (required for NestJS)
- Target: ES2021, module: CommonJS

## Import Organization

**Order (Frontend):**
1. React/library imports (`import { useState } from 'react'`)
2. Third-party packages (`import { useQuery } from '@tanstack/react-query'`)
3. Local types/interfaces (`import { Product } from '../../types/product'`)
4. Local modules (`import { api } from '../../lib/api'`)
5. Local stores (`import { useCartStore } from '../../stores/cartStore'`)

**Order (Backend):**
1. NestJS framework imports (`import { Injectable } from '@nestjs/common'`)
2. Third-party packages (`import { Repository } from 'typeorm'`)
3. Local entities/modules (relative paths)

**Path Aliases:**
- Frontend: `@/*` for `src/*` (defined but relative paths used in practice)
- Backend: No path aliases configured

## Error Handling

**Frontend Patterns:**
- React Query handles API error states automatically
- Axios response interceptor catches 401 and redirects to `/login` (`apps/frontend/src/lib/api.ts`)
- Null/undefined checks with optional chaining (`product.salePrice?.toFixed(2)`)
- Fallback values with nullish coalescing (`product.salePrice ?? product.price`)
- Default empty arrays for query results (`data: products = []`)

**Backend Patterns:**
- NestJS built-in exceptions (`throw new NotFoundException(...)`)
- Guard clauses for not-found entities in service methods
- Explicit error messages with context (`Product with slug "${slug}" not found`)

## Logging

**Framework:** No dedicated logging framework detected
- Backend relies on NestJS default logger
- Frontend uses no explicit logging

## Comments

**When to Comment:**
- Section dividers in JSX (`{/* Image */}`, `{/* Section Header */}`, `{/* Carousel arrows */}`)
- Inline explanations for non-obvious logic (`// Helper function to convert string numbers`)
- Fields purpose in API client (`// Fields that should be converted from string to number`)

**JSDoc/TSDoc:**
- Not used anywhere in the codebase

## Function Design

**Size:** Components range from small (17 lines for `ProductsModule`) to medium (~100 lines for page components). No excessively large files.

**Parameters:**
- Frontend: Destructured props (`{ product }: PopularProductCardProps`)
- Backend: Standard NestJS dependency injection via constructor

**Return Values:**
- Frontend: Explicit `JSX.Element` return type on all components
- Backend: Explicit `Promise<T>` return types on all service methods

## Module Design

**Exports (Frontend):**
- Components: `export default function ComponentName()` (default exports)
- Stores: Named export (`export const useCartStore`)
- Types: Named exports (`export interface Product`)
- API client: Named export (`export const api`)

**Exports (Backend):**
- NestJS standard: Classes exported by name, registered in modules
- Module `exports` array exposes services to other modules

**Barrel Files:** Not used

## Component Patterns

**Frontend Components:**
- Functional components only (no class components)
- Default exports for page and section components
- Sub-components co-located in same file when tightly coupled (e.g., `ProductCardSkeleton` in `PopularProducts.tsx`)
- Skeleton loading components defined alongside their real counterparts
- Tailwind CSS classes inline (no CSS modules or styled-components)

**State Management:**
- Zustand for global client state (`apps/frontend/src/stores/cartStore.ts`)
- Zustand `persist` middleware for localStorage persistence
- React Query for server state (`useQuery` with queryKey/queryFn pattern)
- Local state with `useState` for component-specific UI state

**Data Fetching Pattern:**
```typescript
const { data: items = [], isLoading } = useQuery<Type[]>({
  queryKey: ['resource'],
  queryFn: async () => {
    const res = await api.get('/endpoint');
    return res.data;
  },
});
```

## Backend Entity Patterns

**TypeORM Entities:**
- Use explicit column names mapping camelCase to snake_case (`name: 'sale_price'`)
- `@PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })` for PKs
- `@CreateDateColumn` and `@UpdateDateColumn` with `timestamptz` type
- Relations defined with decorators and explicit `@JoinColumn`
- Both relation property and foreign key column defined (e.g., `brandId` + `brand`)

---

*Convention analysis: 2026-02-10*
