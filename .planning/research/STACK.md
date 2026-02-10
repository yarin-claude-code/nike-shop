# Technology Stack Research

**Project:** Tony's Shoe Store (Multi-brand E-commerce)
**Researched:** 2026-02-10
**Confidence:** HIGH

## Executive Summary

For a learning-focused, production-quality multi-brand shoe store, stick with your existing core stack (React 18 + Vite 5, NestJS 10, PostgreSQL 17) but upgrade supporting libraries and adopt modern patterns. The current stack is industry-standard for 2026. Focus upgrades on: image optimization (add CDN), UI components (adopt headless components), validation patterns (strengthen pipes), and query optimization (leverage React Query better).

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **React** | 18.3.1 (current) | Frontend UI framework | Standard for e-commerce in 2026. Concurrent rendering, Suspense, and hooks ecosystem fully mature. Server Components not needed for your use case. |
| **Vite** | 5.4.10+ | Build tool & dev server | Industry standard for React SPAs. Rollup-based production builds are highly optimized with tree-shaking. Faster than Webpack, simpler than Next.js for your scale. |
| **NestJS** | 10.x (current) | Backend API framework | Enterprise-grade Node.js framework. Dependency injection, modular architecture, and strong TypeScript support ideal for learning production patterns. |
| **PostgreSQL** | 17 (current) | Database | Production-standard for e-commerce. ACID compliance, powerful indexing, and excellent JSON support. Your schema design (BIGINT IDENTITY, NUMERIC for prices) follows 2026 best practices. |
| **TypeORM** | 0.3.17+ | ORM | **Keep for now** despite Prisma hype. Your decorators and entities are already set up. Migration to Prisma is optional for future phases. TypeORM works well for learning SQL patterns. |
| **Turborepo** | 2.3.0+ | Monorepo orchestration | Standard for frontend + backend monorepos. Task caching and parallel execution reduce build times. |

### State Management

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Zustand** | 4.4.0+ | Client-side state (UI state, cart) | Keep for lightweight local/UI state. Cart, filters, modals, user preferences. No boilerplate, great for learning. |
| **TanStack Query** | 5.17.0+ (current) | Server state (API data) | **Primary state management** for all API data. Automatic caching, background refetching, optimistic updates. Replaces need for Redux in 90% of cases. |

**Pattern:** Use Zustand for UI state, TanStack Query for server state. Don't mix concerns.

### UI & Styling

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Tailwind CSS** | 3.4.0+ | Utility-first CSS | Keep as primary styling. Industry standard for 2026. Fast, maintainable, great DX. |
| **Radix UI** | Latest | Headless UI primitives | **Add for accessible components**. Dropdown menus, modals, tooltips, accordions. Unstyled, accessible by default, style with Tailwind. More complete than Headless UI. |
| **Lucide React** | Latest | Icon library | **Add for consistent icons**. Modern, tree-shakeable, Tailwind-friendly. Replace inline SVGs. |

**Alternative considered:** Headless UI (smaller component set), React Aria (Adobe-backed, more verbose). **Why Radix:** 28+ components, Tailwind-friendly, widely adopted, best balance of features and simplicity.

### Image Handling

| Technology | Purpose | Why Recommended |
|------------|---------|-----------------|
| **ImageKit.io** (Free tier) | Image CDN & optimization | **Add for image delivery**. 20GB storage + 20GB bandwidth free. Unlimited transformations. Clearer pricing than Cloudinary. Real-time resizing via URL params. AWS CloudFront backbone (700+ nodes). |
| **Native lazy loading** | Browser-native image lazy load | Use `loading="lazy"` on `<img>` tags. No library needed. Supported in all modern browsers. |

**Pattern:** Store original images in PostgreSQL (product_images table). Serve via ImageKit CDN with URL-based transformations (resize, WebP conversion, quality adjustment).

**Alternative considered:** Cloudinary (complex credit-based pricing, overkill for learning project), self-hosted (no CDN, poor performance).

### Validation & Security

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **class-validator** | 0.14.0 (current) | Backend DTO validation | Keep. Industry standard for NestJS. Decorator-based validation in DTOs. |
| **class-transformer** | 0.5.1 (current) | Object transformation | Keep. Pairs with class-validator. Transforms plain objects to class instances. |
| **ValidationPipe** (NestJS) | Built-in | Global validation | **Configure globally** with `whitelist: true`, `forbidNonWhitelisted: true` to prevent prototype pollution attacks. |

**Best practice:** Define DTOs for ALL controller endpoints. Never use string interpolation in queries (SQL injection risk). Use parameterized queries.

### Development Tools

| Tool | Purpose | Configuration Notes |
|------|---------|---------------------|
| **TypeScript** | 5.9.3 (root), 5.1.3 (backend) | Update backend to 5.9.3 for consistency. Enable `strict: true`. |
| **ESLint** | 9.39.2 (frontend), 8.44.0 (backend/root) | Upgrade backend to ESLint 9 for consistency. Use `@typescript-eslint` for TS rules. |
| **Prettier** | 3.2.5 | Keep. Enforce consistent formatting. |
| **Jest** | 29.5.0 | Keep for backend tests. Isolate business logic from ORM logic in tests. |

## Installation Commands

```bash
# Image optimization (frontend)
cd apps/frontend
npm install @imagekit/imagekit-javascript

# Headless UI components (frontend)
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-accordion @radix-ui/react-tooltip
npm install lucide-react

# Upgrade TypeScript in backend to match root
cd ../backend
npm install -D typescript@^5.9.3

# Update ESLint in backend/root (breaking changes - do in separate phase)
# npm install -D eslint@^9.39.2
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| **ORM** | TypeORM (keep) | Prisma | Prisma has better DX and type safety, but requires full migration (schema rewrite, learning new query syntax). **Defer to Phase 2+** if needed. TypeORM works fine for learning. |
| **State Management** | Zustand + TanStack Query | Redux Toolkit + RTK Query | Redux adds boilerplate (actions, reducers, slices). RTK Query is great but heavy. Zustand is simpler for learning. **Use Redux** only if team size grows or strict architecture needed. |
| **UI Components** | Radix UI | Headless UI, React Aria | Headless UI has fewer components (modals, menus only). React Aria is verbose, requires glue code. Radix is sweet spot. |
| **Build Tool** | Vite | Webpack, Turbopack | Webpack is legacy (slow, complex config). Turbopack is Next.js-only. Vite is standard for React SPAs in 2026. |
| **Image CDN** | ImageKit | Cloudinary, self-hosted | Cloudinary pricing is complex (credits, storage, transformations, bandwidth). ImageKit has clear free tier, simpler pricing. Self-hosting means no CDN (slow). |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Create React App** | Deprecated in 2026. Slow builds, no longer maintained. | Vite (already using) |
| **Redux without RTK** | Massive boilerplate, error-prone. | Zustand + TanStack Query |
| **String interpolation in SQL** | SQL injection risk. TypeORM allows this but DON'T. | Parameterized queries with named parameters |
| **float/double for prices** | Rounding errors. | NUMERIC(10,2) (already using) |
| **VARCHAR(n) in PostgreSQL** | No performance benefit over TEXT. | TEXT (already using) |
| **Manual lazy loading** | Browser supports `loading="lazy"` natively. | Native lazy loading |

## Stack Patterns for E-commerce

### Image Optimization Pattern (2026 Standard)

```typescript
// ❌ Old: Direct image URLs from database
<img src={product.imageUrl} />

// ✅ New: ImageKit CDN with transformations
<img
  src={`https://ik.imagekit.io/your-id/tr:w-400,h-400,q-80,f-webp/${product.imagePath}`}
  loading="lazy"
  alt={product.name}
/>
```

**Why:** Automatic WebP conversion, resizing, quality optimization. Global CDN delivery (fast). No client-side processing.

### State Management Pattern (2026 Standard)

```typescript
// ❌ Old: Everything in Redux/Zustand
const products = useStore(state => state.products); // Server data in client store

// ✅ New: Separate server state (TanStack Query) from UI state (Zustand)
const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts }); // Server state
const cart = useCartStore(state => state.items); // UI state
```

**Why:** Automatic caching, background refetching, loading/error states. Don't reinvent what TanStack Query does.

### Validation Pattern (2026 Standard)

```typescript
// ❌ Old: Manual validation in controllers
if (!email || !isValidEmail(email)) throw new BadRequestException();

// ✅ New: DTO with decorators + Global ValidationPipe
// dto/create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(8, 100)
  password: string;
}

// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

**Why:** Centralized validation, automatic 400 responses, prevents prototype pollution.

### TypeORM Query Pattern (2026 Security)

```typescript
// ❌ NEVER: String interpolation (SQL injection risk)
const user = await userRepo.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ ALWAYS: Parameterized queries
const user = await userRepo.findOne({ where: { email } });
// OR with query builder:
const user = await userRepo
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .getOne();
```

**Why:** Prevents SQL injection. TypeORM allows string interpolation but it's a security risk.

## Version Compatibility Notes

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| React 18.3.1 | TanStack Query 5.x | Requires React 18+ for Suspense support |
| NestJS 10.x | TypeORM 0.3.x | Use `@nestjs/typeorm` 10.0.1+ for NestJS 10 |
| Vite 5.x | React 18.x | Use `@vitejs/plugin-react` 4.3.3+ |
| ESLint 9.x | TypeScript ESLint 8.x | Breaking changes from ESLint 8 → 9. Defer upgrade or do in separate phase. |

## Critical Upgrade Path

**Phase 1 (Immediate - Low Risk):**
1. Add ImageKit CDN for image optimization
2. Add Radix UI components for accessible dropdowns/modals
3. Configure ValidationPipe globally with security options
4. Update TypeScript to 5.9.3 in backend (match root)

**Phase 2 (Later - Medium Risk):**
1. Upgrade ESLint to 9.x across monorepo (breaking changes)
2. Consider Prisma migration (full rewrite of entities/queries)

**Do NOT upgrade together:** ESLint + Prisma in same phase = high risk.

## Sources

### High Confidence (Official Docs + Current 2026 Articles)
- [React Image Optimization: ImageKit Guide](https://imagekit.io/blog/react-image-optimization/) — Image optimization techniques
- [Cloudinary vs ImageKit Feature Comparison](https://imagekit.io/cloudinary-alternative/) — CDN pricing and features
- [TanStack Query Official Docs](https://tanstack.com/query/latest/docs/framework/react/overview) — Current best practices
- [NestJS Official Validation Docs](https://docs.nestjs.com/techniques/validation) — ValidationPipe configuration
- [Vite Performance Guide](https://vite.dev/guide/performance) — Production build optimization
- [TypeORM Best Practices (Medium)](https://darraghoriordan.medium.com/postgresql-and-typeorm-9-tips-tricks-and-common-issues-9f1791b79699) — Security and performance
- [Zustand vs Redux 2026 Comparison](https://medium.com/@sangramkumarp530/zustand-vs-redux-toolkit-which-should-you-use-in-2026-903304495e84) — State management trends
- [Radix UI vs Headless UI Comparison](https://www.subframe.com/tips/headless-ui-vs-radix-6cb34) — Component library features
- [Prisma vs TypeORM 2026](https://medium.com/@Nexumo_/prisma-or-typeorm-in-2026-the-nestjs-data-layer-call-ae47b5cfdd73) — ORM comparison

### Medium Confidence (Community Consensus)
- [PostgreSQL Schema Best Practices](https://www.swiftorial.com/tutorials/databases/postgresql/best_practices/schema_design_best_practices/) — Normalization patterns
- [NestJS E-commerce API Patterns](https://blog.logrocket.com/how-build-ecommerce-app-nestjs/) — Architecture guidance

---

**Confidence Assessment:** HIGH for core stack (React, NestJS, PostgreSQL, TypeORM) — all officially documented and widely adopted in 2026. MEDIUM for image CDN choice (ImageKit vs Cloudinary is preference-based). HIGH for Radix UI (most complete headless component library). HIGH for Zustand + TanStack Query pattern (standard in 2026 per multiple sources).

**Key Insight:** Your existing stack is solid. Don't rebuild. Refine image handling, add accessible components, and strengthen validation. Save major changes (Prisma, ESLint 9) for later phases.
