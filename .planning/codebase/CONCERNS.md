# Codebase Concerns

**Analysis Date:** 2026-02-10

## Tech Debt

**No DTOs in dedicated files:**
- Issue: DTOs are defined inline in controller files instead of separate DTO classes
- Files: `apps/backend/src/auth/auth.controller.ts`, `apps/backend/src/cart/cart.controller.ts`, `apps/backend/src/orders/orders.controller.ts`
- Impact: DTOs cannot be shared across services; duplicated interface definitions exist in both controllers and services (e.g., `RegisterDto` in both `auth.controller.ts` and `auth.service.ts`)
- Fix approach: Extract DTOs into `dto/` subdirectories per module, use class-validator decorators consistently

**Numeric string conversion hack in frontend:**
- Issue: Response interceptor manually converts price strings to numbers because PostgreSQL NUMERIC columns return strings via TypeORM
- Files: `apps/frontend/src/lib/api.ts` (lines 11-34)
- Impact: Fragile — only converts hardcoded field names (`price`, `salePrice`, `priceAdjustment`). Any new numeric field will silently remain a string
- Fix approach: Use TypeORM column transformers on the entity level, or use `decimal.js` consistently

**Deleted mock data file still referenced in CLAUDE.md:**
- Issue: `apps/frontend/src/data/mockData.ts` is deleted (git status shows `D`) but still referenced in project docs
- Files: `CLAUDE.md` (references mock data location)
- Impact: Misleading documentation for future development
- Fix approach: Update CLAUDE.md to remove mockData references

**No test files exist:**
- Issue: Zero test files found across the entire codebase
- Files: All of `apps/backend/src/` and `apps/frontend/src/`
- Impact: No regression safety net; any change could break functionality silently
- Fix approach: Add unit tests for services starting with `orders.service.ts` (financial logic) and `auth.service.ts` (security logic)

## Security Considerations

**Insecure JWT secret default:**
- Risk: JWT secret falls back to hardcoded `'your-secret-key'` if `JWT_SECRET` env var is missing
- Files: `apps/backend/src/auth/jwt.strategy.ts` (line 21)
- Current mitigation: None
- Recommendations: Throw an error on startup if `JWT_SECRET` is not set in production. Never use a default.

**No rate limiting:**
- Risk: Auth endpoints (`/api/auth/login`, `/api/auth/register`) are vulnerable to brute force and credential stuffing
- Files: `apps/backend/src/main.ts`, `apps/backend/src/auth/auth.controller.ts`
- Current mitigation: None
- Recommendations: Add `@nestjs/throttler` with strict limits on auth endpoints

**No helmet or security headers:**
- Risk: Missing HTTP security headers (X-Frame-Options, CSP, etc.)
- Files: `apps/backend/src/main.ts`
- Current mitigation: None
- Recommendations: Add `helmet` middleware in `main.ts`

**Token stored in localStorage:**
- Risk: JWT stored in localStorage is vulnerable to XSS attacks
- Files: `apps/frontend/src/stores/authStore.ts` (lines 46, 68), `apps/frontend/src/lib/api.ts` (line 39)
- Current mitigation: None
- Recommendations: Use httpOnly cookies for token storage, or ensure robust XSS protection

**TypeORM synchronize enabled in development:**
- Risk: `synchronize: true` can silently drop columns/data when entities change
- Files: `apps/backend/src/app.module.ts` (line 29)
- Current mitigation: Only enabled when `NODE_ENV === 'development'`
- Recommendations: Use migrations exclusively, even in development

## Performance Bottlenecks

**Products always load all relations:**
- Problem: Every product query eagerly loads `brand`, `category`, `images`, and `variants`
- Files: `apps/backend/src/products/products.service.ts` (all methods)
- Cause: Relations array is identical across all queries, even when listing products where only name/price/image are needed
- Improvement path: Use query builder with select for list endpoints; load full relations only on detail pages

**No pagination on product listing:**
- Problem: `findAll()` returns all active products with no limit
- Files: `apps/backend/src/products/products.service.ts` (line 13)
- Cause: No pagination parameters accepted
- Improvement path: Add `skip`/`take` parameters with default page size

## Fragile Areas

**Order creation — no transaction, no stock check:**
- Files: `apps/backend/src/orders/orders.service.ts` (lines 43-97)
- Why fragile: Order creation reads cart, calculates totals, creates order, creates order items, and clears cart — all without a database transaction. Also does not check `stockQuantity` on variants before ordering.
- Safe modification: Wrap in `queryRunner.startTransaction()` with proper rollback. Add stock validation and decrement atomically.
- Test coverage: Zero tests

**Cart service — no stock validation:**
- Files: `apps/backend/src/cart/cart.service.ts` (lines 20-40)
- Why fragile: `addItem` does not check if the variant exists or has sufficient stock
- Safe modification: Add variant existence check and stock validation before adding
- Test coverage: Zero tests

**Auth error message extraction:**
- Files: `apps/frontend/src/stores/authStore.ts` (lines 54-58, 76-80)
- Why fragile: Catches `error instanceof Error` but axios errors have message nested in `error.response.data.message`. Users see generic "Login failed" instead of actual validation errors.
- Safe modification: Extract axios error response message properly

## Missing Critical Features

**No payment integration:**
- Problem: Orders are created with no payment processing
- Blocks: Cannot accept real orders; `OrderStatus.PENDING` is set but never transitions

**No admin panel:**
- Problem: No way to manage products, view orders, or update order statuses
- Blocks: Product catalog management requires direct database manipulation

**No search functionality:**
- Problem: No product search endpoint or full-text search
- Blocks: Users cannot find products except by browsing categories/brands

**No password reset flow:**
- Problem: No forgot-password or email verification endpoints
- Blocks: Users locked out if they forget credentials

## Test Coverage Gaps

**Entire codebase is untested:**
- What's not tested: Every service, controller, and frontend component
- Files: All files under `apps/backend/src/` and `apps/frontend/src/`
- Risk: Financial calculations in `orders.service.ts` (tax, shipping, totals) could silently produce wrong values. Auth logic could have bypass vulnerabilities.
- Priority: High — start with `apps/backend/src/orders/orders.service.ts` and `apps/backend/src/auth/auth.service.ts`

## Dependencies at Risk

**Default database credentials:**
- Risk: `app.module.ts` defaults to `postgres`/`postgres` for DB credentials
- Files: `apps/backend/src/app.module.ts` (lines 23-27)
- Impact: If deployed without proper env config, connects with default creds
- Migration plan: Remove defaults; fail fast if credentials are not explicitly configured

---

*Concerns audit: 2026-02-10*
