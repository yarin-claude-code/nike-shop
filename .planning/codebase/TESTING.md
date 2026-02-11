# Testing Patterns

**Analysis Date:** 2026-02-10

## Test Framework

**Runner (Backend):**
- Jest 29.5.0
- Config: Inline in `apps/backend/package.json` under `"jest"` key
- Transform: `ts-jest` for TypeScript support
- Test environment: `node`

**Runner (Frontend):**
- No test framework configured
- No test runner, no test config, no test scripts

**Assertion Library:**
- Jest built-in assertions (backend only)

**Run Commands:**
```bash
npm run test                    # Root: runs turbo test across workspaces
cd apps/backend && npm run test # Backend: jest --passWithNoTests
cd apps/backend && npm run test:watch  # Watch mode
cd apps/backend && npm run test:cov    # Coverage report
cd apps/backend && npm run test:e2e    # E2E with ./test/jest-e2e.json config
```

## Test File Organization

**Location:**
- Backend: Co-located with source (rootDir is `src/`)
- Frontend: No test files exist

**Naming:**
- Backend pattern: `*.spec.ts` (configured via `testRegex: ".*\\.spec\\.ts$"`)

**Current State:**
- Zero test files exist in the project source code
- Backend uses `--passWithNoTests` flag to avoid CI failures
- No E2E test directory or config file (`./test/jest-e2e.json`) found

## Test Structure

**No tests exist.** The following is the expected pattern based on NestJS conventions and the Jest config:

```typescript
// Expected: apps/backend/src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: { find: jest.fn(), findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## Mocking

**Framework:** Jest built-in (`jest.fn()`, `jest.mock()`)

**Available Testing Packages:**
- `@nestjs/testing` ^10.0.0 - NestJS test utilities (installed)
- `supertest` ^6.3.3 - HTTP assertion library for E2E tests (installed)
- `source-map-support` ^0.5.21 - Stack trace support (installed)

**Expected Mocking Pattern (NestJS):**
```typescript
// Mock TypeORM repositories
{
  provide: getRepositoryToken(Entity),
  useValue: {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn(),
  },
}
```

**What to Mock:**
- TypeORM repositories
- External services (ConfigService, JWT)
- Database connections

**What NOT to Mock:**
- Service business logic
- class-validator/class-transformer behavior

## Fixtures and Factories

**Test Data:** None exist. No fixtures, factories, or seed data for tests.

**Recommendation:** Create test fixtures at `apps/backend/src/__tests__/fixtures/` or co-located with modules.

## Coverage

**Requirements:** None enforced. No coverage thresholds configured.

**View Coverage:**
```bash
cd apps/backend && npm run test:cov
# Output: apps/backend/coverage/
```

**Configuration:**
```json
{
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage"
}
```

## Test Types

**Unit Tests:**
- Backend: Jest + `@nestjs/testing` available but no tests written
- Frontend: No test framework installed

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Backend: Script exists (`npm run test:e2e`) pointing to `./test/jest-e2e.json`
- Config file and test directory do not exist
- `supertest` is installed as a dev dependency

## Critical Gaps

**No tests exist anywhere in the codebase.** Key areas needing tests:

1. **`apps/backend/src/products/products.service.ts`** - Core product queries (findAll, findFeatured, findBySlug)
2. **`apps/backend/src/auth/`** - Authentication logic (security-critical)
3. **`apps/backend/src/orders/`** - Order processing (financial-critical)
4. **`apps/backend/src/cart/`** - Cart operations
5. **`apps/frontend/src/stores/cartStore.ts`** - Cart state management logic
6. **`apps/frontend/src/lib/api.ts`** - Axios interceptors and numeric conversion helper

**Frontend Testing Setup Needed:**
- Install Vitest (natural fit with Vite) or Jest
- Install `@testing-library/react` and `@testing-library/jest-dom`
- Add test script to `apps/frontend/package.json`

---

*Testing analysis: 2026-02-10*
