# Phase 2: Backend API Core - Research

**Researched:** 2026-02-11
**Domain:** NestJS REST API development with TypeORM and PostgreSQL
**Confidence:** HIGH

## Summary

Phase 2 focuses on building production-ready REST API endpoints for product catalog functionality using NestJS with TypeORM. The codebase already has solid foundations: entities are properly defined, ValidationPipe is globally configured, and TypeORM is set up with proper patterns (synchronize:false, explicit FK assignments).

The key technical challenges are: (1) avoiding N+1 queries when loading product relations, (2) implementing flexible filtering with query parameters while maintaining type safety, (3) building performant search with PostgreSQL text search patterns, and (4) following clean NestJS patterns with DTOs, error handling, and response serialization.

The existing code uses Repository pattern with `.find()` and eager relation loading, which works but creates N+1 query risks at scale. For Phase 2, we should adopt QueryBuilder for complex queries (filtering, search, pagination) while keeping Repository pattern for simple CRUD operations.

**Primary recommendation:** Use QueryBuilder with explicit joins for all filtered/search endpoints, implement query DTOs with class-validator for type-safe filtering, use PostgreSQL ILIKE for basic search (can upgrade to full-text search later), and follow NestJS serialization patterns to control API responses.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @nestjs/common | ^10.0.0 | Core NestJS framework | Official NestJS package, provides decorators, pipes, guards, interceptors |
| @nestjs/typeorm | ^10.0.1 | TypeORM integration | Official NestJS integration for TypeORM |
| typeorm | ^0.3.17 | ORM and query builder | Industry standard for TypeScript ORMs, mature API |
| class-validator | ^0.14.0 | DTO validation decorators | NestJS official validation library, declarative validation |
| class-transformer | ^0.5.1 | DTO transformation | Works with class-validator, handles type coercion and serialization |
| pg | ^8.11.3 | PostgreSQL driver | TypeORM dependency, official PostgreSQL driver |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @nestjs/swagger | ^10.x | OpenAPI documentation | Optional but recommended for API documentation |
| nestjs-typeorm-paginate | ^4.x | Pagination helper | Optional, if need standardized pagination responses |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TypeORM | Prisma | Prisma has better DX but less PostgreSQL-specific features, migration story more opinionated |
| class-validator | Zod | Zod is more modern/type-safe but class-validator is NestJS standard and better documented |
| Repository pattern | DataLoader | DataLoader solves N+1 elegantly but adds complexity, better for GraphQL than REST |

**Installation:**
```bash
# Already installed in existing codebase
npm install @nestjs/common @nestjs/typeorm typeorm class-validator class-transformer

# Optional additions for Phase 2:
npm install @nestjs/swagger swagger-ui-express
```

## Architecture Patterns

### Recommended Project Structure
```
apps/backend/src/
├── products/
│   ├── entities/          # TypeORM entities (already exists)
│   ├── dto/               # Request/response DTOs (CREATE THIS)
│   │   ├── query-products.dto.ts      # Query params for filtering/search
│   │   ├── product-response.dto.ts    # Serialized response
│   │   └── product-filter.dto.ts      # Filter options
│   ├── products.service.ts            # Business logic (enhance)
│   ├── products.controller.ts         # HTTP endpoints (enhance)
│   └── products.module.ts             # Module definition (exists)
├── brands/
│   ├── dto/               # Brand DTOs (CREATE THIS)
│   ├── brands.service.ts  # Enhance with products relation
│   └── brands.controller.ts
└── common/                # Shared utilities (CREATE THIS)
    ├── interceptors/      # Response serialization
    ├── filters/           # Exception filters
    └── decorators/        # Custom decorators
```

### Pattern 1: Query DTO with class-validator

**What:** Type-safe query parameter validation using DTOs with decorators
**When to use:** All endpoints accepting query parameters (filtering, pagination, search)
**Example:**
```typescript
// Source: NestJS official docs + class-validator best practices
// apps/backend/src/products/dto/query-products.dto.ts
import { IsOptional, IsString, IsNumber, Min, Max, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryProductsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  brands?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  sizes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  colors?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

### Pattern 2: QueryBuilder with Dynamic Filtering

**What:** Build TypeORM queries dynamically based on provided filters, avoiding N+1 queries
**When to use:** Products listing with filters, search, or complex joins
**Example:**
```typescript
// Source: TypeORM QueryBuilder + NestJS best practices
// apps/backend/src/products/products.service.ts
async findAllWithFilters(query: QueryProductsDto): Promise<[Product[], number]> {
  const qb = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.brand', 'brand')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.images', 'images')
    .leftJoinAndSelect('product.variants', 'variants')
    .where('product.isActive = :isActive', { isActive: true });

  // Search across multiple fields (PostgreSQL ILIKE)
  if (query.search) {
    qb.andWhere(
      '(product.name ILIKE :search OR product.description ILIKE :search OR brand.name ILIKE :search)',
      { search: `%${query.search}%` }
    );
  }

  // Filter by brands (IN clause)
  if (query.brands && query.brands.length > 0) {
    qb.andWhere('brand.slug IN (:...brands)', { brands: query.brands });
  }

  // Filter by sizes (requires join to variants)
  if (query.sizes && query.sizes.length > 0) {
    qb.andWhere('variants.size IN (:...sizes)', { sizes: query.sizes });
  }

  // Filter by colors (requires join to variants)
  if (query.colors && query.colors.length > 0) {
    qb.andWhere('variants.color IN (:...colors)', { colors: query.colors });
  }

  // Price range filter
  if (query.minPrice !== undefined) {
    qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
  }
  if (query.maxPrice !== undefined) {
    qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
  }

  // Pagination
  const skip = (query.page - 1) * query.limit;
  qb.skip(skip).take(query.limit);

  // Order by (default: newest first)
  qb.orderBy('product.createdAt', 'DESC');

  return qb.getManyAndCount(); // Returns [results, total]
}
```

### Pattern 3: Response Serialization with Interceptors

**What:** Transform entity responses to control what data is exposed to clients
**When to use:** All API responses to hide internal fields, format data consistently
**Example:**
```typescript
// Source: NestJS serialization docs
// apps/backend/src/common/interceptors/serialize.interceptor.ts
import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // Only @Expose() decorated fields
        });
      })
    );
  }
}

// Usage in controller:
@Get()
@Serialize(ProductResponseDto)
async findAll(@Query() query: QueryProductsDto) {
  return this.productsService.findAllWithFilters(query);
}
```

### Pattern 4: Brand Page with Associated Products

**What:** Fetch brand details with its products in a single optimized query
**When to use:** Brand landing pages showing brand info + product grid
**Example:**
```typescript
// Source: TypeORM relations best practices
// apps/backend/src/brands/brands.service.ts
async findBySlugWithProducts(slug: string): Promise<Brand> {
  const brand = await this.brandRepository
    .createQueryBuilder('brand')
    .leftJoinAndSelect('brand.products', 'product', 'product.isActive = :isActive', {
      isActive: true,
    })
    .leftJoinAndSelect('product.images', 'images')
    .leftJoinAndSelect('product.category', 'category')
    .where('brand.slug = :slug', { slug })
    .getOne();

  if (!brand) {
    throw new NotFoundException(`Brand with slug "${slug}" not found`);
  }

  return brand;
}
```

### Pattern 5: Exception Filters for Clean Error Responses

**What:** Global exception filter to standardize error responses
**When to use:** Set up once globally in main.ts, handles all unhandled exceptions
**Example:**
```typescript
// Source: NestJS exception filters docs
// apps/backend/src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message,
    });
  }
}

// Usage in main.ts:
app.useGlobalFilters(new AllExceptionsFilter());
```

### Anti-Patterns to Avoid

- **Using eager:true on entities:** Makes every query load relations, creates N+1 problems at scale. Use explicit joins in QueryBuilder instead.
- **Repository.find() with deep relations:** Works for simple cases but doesn't scale. Prefer QueryBuilder for filtered/searched endpoints.
- **No DTO validation on query params:** Leads to undefined behavior and runtime errors. Always validate with class-validator.
- **Returning raw entities without serialization:** Exposes internal fields (timestamps, IDs, soft-deleted records). Use response DTOs with @Exclude().
- **Building SQL strings manually:** TypeORM QueryBuilder is type-safe and prevents SQL injection. Never concatenate raw SQL.
- **Not handling NotFoundException:** Returning null/undefined causes 200 OK with empty body. Throw NotFoundException for 404 responses.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Query parameter parsing | Manual string splitting and type casting | class-transformer + class-validator | Handles arrays, numbers, booleans, nested objects, validation in one step |
| Pagination metadata | Custom page/total calculators | QueryBuilder.getManyAndCount() | Returns [results, total] atomically, prevents race conditions |
| SQL injection prevention | String escaping functions | TypeORM parameterized queries | QueryBuilder automatically sanitizes parameters, prevents SQLi |
| Error response formatting | Try-catch in every controller | Global exception filters | Centralizes error handling, ensures consistent API responses |
| Response serialization | Manual field selection with spread/pick | class-transformer + interceptors | Handles nested objects, circular refs, type coercion automatically |
| Search functionality | Custom LIKE query builders | PostgreSQL ILIKE + trigram indexes | PostgreSQL has built-in text search optimized for partial matching |

**Key insight:** NestJS and TypeORM provide battle-tested solutions for 90% of API patterns. Custom implementations miss edge cases (SQL injection, timezone handling, circular refs, NULL handling) that libraries already solve.

## Common Pitfalls

### Pitfall 1: N+1 Queries with Lazy Loading

**What goes wrong:** Using Repository.find() with relations: ['brand', 'category'] loads relations in separate queries. With 20 products, this creates 41 queries (1 products + 20 brands + 20 categories).

**Why it happens:** TypeORM's default behavior with Repository.find() is to query relations separately unless you use QueryBuilder with explicit joins.

**How to avoid:** Use QueryBuilder with leftJoinAndSelect for all endpoints returning lists. Monitor query logs in development (logging: true in TypeORM config).

**Warning signs:**
- Database query count increases linearly with result count
- Slow response times on listing pages
- Multiple SELECT queries in logs for same data

### Pitfall 2: ILIKE Without Indexes

**What goes wrong:** ILIKE queries on product.name, brand.name without indexes cause full table scans. Performance degrades as data grows.

**Why it happens:** PostgreSQL can't use B-tree indexes for ILIKE patterns like '%search%'. Need trigram indexes (pg_trgm extension).

**How to avoid:**
- For basic search (Phase 2): Accept slower performance, optimize later
- For production: Add pg_trgm extension and GIN indexes on searchable text columns
- Migration for later:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX products_name_trgm_idx ON products USING gin (name gin_trgm_ops);
CREATE INDEX brands_name_trgm_idx ON brands USING gin (name gin_trgm_ops);
```

**Warning signs:**
- Search queries taking >500ms with <10k products
- EXPLAIN shows "Seq Scan" instead of "Index Scan"

### Pitfall 3: Query Parameter Array Handling

**What goes wrong:** Query params like ?brands=nike&brands=adidas come as arrays, but ?brands=nike comes as string. Without Transform decorator, filter logic breaks.

**Why it happens:** Express/NestJS parse single values as strings, multiple as arrays.

**How to avoid:** Always use @Transform(({ value }) => Array.isArray(value) ? value : [value]) on array query params. This normalizes input.

**Warning signs:**
- Filters work with multiple selections but fail with single selection
- TypeScript errors about string vs string[] in service methods

### Pitfall 4: ValidationPipe Transform Not Enabling Type Coercion

**What goes wrong:** Query params ?page=2 arrives as string "2", not number 2. Without transform: true in ValidationPipe, type coercion doesn't happen.

**Why it happens:** HTTP query params are always strings. ValidationPipe needs explicit opt-in to cast types.

**How to avoid:** Ensure main.ts has ValidationPipe with transform: true (already configured in existing codebase). Use @Type(() => Number) on numeric DTO fields.

**Warning signs:**
- Skip/take logic breaks because page is string "2" instead of number 2
- typeof checks reveal unexpected string types

### Pitfall 5: Filtering by Variant Properties (Size/Color) Without Distinct

**What goes wrong:** Filtering products by size or color returns duplicate products if product has multiple variants matching criteria.

**Why it happens:** JOIN to product_variants multiplies rows when multiple variants match.

**How to avoid:** Use .distinctOn(['product.id']) or .groupBy('product.id') in QueryBuilder when filtering by variant properties.

**Warning signs:**
- Product appears multiple times in search results
- Total count is higher than actual number of products

### Pitfall 6: Not Handling Empty Filter Arrays

**What goes wrong:** QueryBuilder with IN (:...brands) where brands = [] throws SQL error: "cannot use IN with empty array".

**Why it happens:** SQL IN clause requires at least one value.

**How to avoid:** Check array length before adding where clause:
```typescript
if (query.brands && query.brands.length > 0) {
  qb.andWhere('brand.slug IN (:...brands)', { brands: query.brands });
}
```

**Warning signs:**
- API returns 500 error when clearing all filter selections
- SQL errors mentioning "empty array" or "IN ()"

## Code Examples

Verified patterns from official sources:

### Building Pagination Response

```typescript
// Source: NestJS + TypeORM pagination patterns
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    perPage: number;
  };
}

async findAllWithFilters(query: QueryProductsDto): Promise<PaginatedResponse<Product>> {
  const [data, total] = await this.buildQueryWithFilters(query).getManyAndCount();

  const lastPage = Math.ceil(total / query.limit);

  return {
    data,
    meta: {
      total,
      page: query.page,
      lastPage,
      perPage: query.limit,
    },
  };
}
```

### Conditional Query Building Pattern

```typescript
// Source: TypeORM QueryBuilder best practices
// Clean pattern for building queries with optional filters
buildQueryWithFilters(query: QueryProductsDto): SelectQueryBuilder<Product> {
  const qb = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.brand', 'brand')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.images', 'images')
    .where('product.isActive = :isActive', { isActive: true });

  // Apply filters conditionally
  this.applySearch(qb, query.search);
  this.applyBrandFilter(qb, query.brands);
  this.applyPriceFilter(qb, query.minPrice, query.maxPrice);
  this.applyPagination(qb, query.page, query.limit);

  return qb;
}

private applySearch(qb: SelectQueryBuilder<Product>, search?: string): void {
  if (!search) return;
  qb.andWhere(
    '(product.name ILIKE :search OR product.description ILIKE :search OR brand.name ILIKE :search)',
    { search: `%${search}%` }
  );
}

private applyBrandFilter(qb: SelectQueryBuilder<Product>, brands?: string[]): void {
  if (!brands || brands.length === 0) return;
  qb.andWhere('brand.slug IN (:...brands)', { brands });
}

// ... more filter methods
```

### Response DTO with Serialization

```typescript
// Source: class-transformer documentation
// apps/backend/src/products/dto/product-response.dto.ts
import { Expose, Type } from 'class-transformer';

class BrandDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;
}

class ImageDto {
  @Expose()
  url: string;

  @Expose()
  altText: string;

  @Expose()
  isPrimary: boolean;
}

class VariantDto {
  @Expose()
  id: number;

  @Expose()
  size: string;

  @Expose()
  color: string;

  @Expose()
  stockQuantity: number;

  @Expose()
  priceAdjustment: number;
}

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  salePrice: number | null;

  @Expose()
  isFeatured: boolean;

  @Expose()
  @Type(() => BrandDto)
  brand: BrandDto;

  @Expose()
  @Type(() => ImageDto)
  images: ImageDto[];

  @Expose()
  @Type(() => VariantDto)
  variants: VariantDto[];

  // Note: createdAt, updatedAt, isActive excluded by default (no @Expose())
}
```

### Controller with Swagger Documentation

```typescript
// Source: NestJS OpenAPI documentation
import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for product name/description/brand' })
  @ApiQuery({ name: 'brands', required: false, isArray: true, description: 'Filter by brand slugs' })
  @ApiQuery({ name: 'sizes', required: false, isArray: true, description: 'Filter by sizes' })
  @ApiQuery({ name: 'colors', required: false, isArray: true, description: 'Filter by colors' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price filter' })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 20, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Returns paginated products' })
  async findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAllWithFilters(query);
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Repository.find() for everything | QueryBuilder for complex queries | TypeORM 0.3+ | Better N+1 prevention, more control over joins |
| Eager loading relations | Explicit leftJoinAndSelect | NestJS best practices | Prevents accidental N+1, clearer intent |
| Manual pagination math | Library helpers (nestjs-typeorm-paginate) | 2023+ | Standardized response format, less boilerplate |
| LIKE for search | ILIKE (case-insensitive) | PostgreSQL best practice | Better UX, no case sensitivity issues |
| Custom DTO serialization | class-transformer + interceptors | NestJS 8+ | Declarative, less error-prone, handles circular refs |
| try-catch in controllers | Exception filters | NestJS core pattern | Centralized error handling, consistent responses |

**Deprecated/outdated:**
- **@nestjs/typeorm@8.x forFeature() with entities array:** Still works but TypeORM 0.3 prefers explicit imports
- **TypeORM repository.findOne(id):** Deprecated in 0.3, use findOne({ where: { id } }) or findOneBy({ id })
- **ValidationPipe without transform:** Old examples show no transform option, now best practice is transform: true for automatic type coercion

## Open Questions

1. **PostgreSQL Full-Text Search**
   - What we know: ILIKE works for basic search but doesn't scale well without trigram indexes. PostgreSQL has built-in full-text search with tsvector.
   - What's unclear: Should Phase 2 implement full-text search immediately, or start with ILIKE and upgrade later?
   - Recommendation: Start with ILIKE for Phase 2 (simpler, fewer dependencies). Add migration task for trigram indexes. Full-text search can be Phase 5+ optimization.

2. **Response Caching Strategy**
   - What we know: NestJS supports caching via @nestjs/cache-manager. Product listings could benefit from short-term caching.
   - What's unclear: Is caching in scope for Phase 2, or defer to performance optimization phase?
   - Recommendation: Defer caching to later phase. Focus Phase 2 on correct functionality. Add caching as optimization once baseline performance is measured.

3. **Swagger Documentation Level**
   - What we know: @nestjs/swagger can auto-generate OpenAPI specs from DTOs and decorators.
   - What's unclear: How detailed should API documentation be in Phase 2?
   - Recommendation: Add basic @ApiTags and @ApiOperation decorators during Phase 2 implementation. Full Swagger setup (response schemas, examples) can be separate documentation task.

4. **Variant Filtering Complexity**
   - What we know: Filtering by size/color requires joins to product_variants table, which creates row multiplication.
   - What's unclear: Should "filter by size" mean "product has ANY variant in this size" or "product has IN-STOCK variant in this size"?
   - Recommendation: Start with "ANY variant" interpretation (simpler query). Stock availability should be shown in UI but not block filtering. Can refine based on user feedback.

## Sources

### Primary (HIGH confidence)
- [NestJS Official Documentation - Validation](https://docs.nestjs.com/techniques/validation)
- [NestJS Official Documentation - Exception Filters](https://docs.nestjs.com/exception-filters)
- [NestJS Official Documentation - Serialization](https://docs.nestjs.com/techniques/serialization)
- [NestJS Official Documentation - OpenAPI](https://docs.nestjs.com/openapi/introduction)
- [TypeORM Official Documentation - Select Query Builder](https://typeorm.io/docs/query-builder/select-query-builder/)
- [class-validator GitHub](https://github.com/typestack/class-validator)
- [class-transformer GitHub](https://github.com/typestack/class-transformer)

### Secondary (MEDIUM confidence)
- [How to Add Validation with class-validator in NestJS](https://oneuptime.com/blog/post/2026-02-02-nestjs-class-validator/view) - February 2026, current best practices
- [How to Handle Exceptions with Custom Filters in NestJS](https://oneuptime.com/blog/post/2026-01-25-custom-exception-filters-nestjs/view) - January 2026, current patterns
- [How to Use NestJS Interceptors](https://oneuptime.com/blog/post/2026-02-03-nestjs-interceptors/view) - February 2026, serialization patterns
- [Using TypeORM's QueryBuilder in NestJS - LogRocket Blog](https://blog.logrocket.com/using-typeorms-querybuilder-nestjs/)
- [Avoiding the N+1 Query Problem in NestJS REST APIs with TypeORM and DataLoader | by Avoseh D. Emmanuel | Medium](https://medium.com/@imanueldeyon/avoiding-the-n-1-query-problem-in-nestjs-rest-apis-with-typeorm-and-dataloader-f1bff2035521)
- [Solving N+1 Problem in NestJS with TypeORM | by Bale | Medium](https://medium.com/@bloodturtle/solving-n-1-problem-in-nestjs-with-typeorm-466a7b3c498c)
- [API with NestJS #79. Implementing searching with pattern matching and raw SQL](https://wanago.io/2022/10/17/api-nestjs-pattern-matching-postgresql/)
- [PostgreSQL: More performance for LIKE and ILIKE statements](https://www.cybertec-postgresql.com/en/postgresql-more-performance-for-like-and-ilike-statements/)
- [Implementing Stable Pagination in NestJS Using TypeORM QueryBuilder | by Bale | Medium](https://medium.com/@bloodturtle/implementing-stable-pagination-in-nestjs-using-typeorm-querybuilder-bbb113f121ec)
- [API with NestJS #17. Offset and keyset pagination with PostgreSQL and TypeORM](https://wanago.io/2020/11/09/api-nestjs-offset-keyset-pagination-postgresql-typeorm/)
- [NestJS Error Handling Patterns | Better Stack Community](https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/)
- [Mastering Data Validation in NestJS: A Complete Guide with Class-Validator and Class-Transformer | by Ahurein Ebenezer | Medium](https://medium.com/@ahureinebenezer/mastering-data-validation-in-nestjs-a-complete-guide-with-class-validator-and-class-transformer-02a029db6ecf)

### Tertiary (LOW confidence)
- [Advanced Filtering with Nestjs: The Easy Way | by Ruben O. Alvarado | Medium](https://medium.com/@rubenosmaralvarado/advanced-filtering-with-nestjs-the-easy-way-53f717150b9f) - Generic patterns, not project-specific
- [Pagination and Filtering in NestJS APIs - Dev Centre House Ireland](https://www.devcentrehouse.eu/blogs/pagination-nestjs-api-practices/) - Educational content, not authoritative source

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries are already installed in package.json, versions verified, official NestJS integrations
- Architecture patterns: HIGH - Patterns derived from official NestJS docs + TypeORM docs + verified in existing codebase
- Pitfalls: HIGH - Verified from multiple authoritative sources (Wanago.io, Better Stack, Medium engineers), cross-referenced with official docs
- Code examples: HIGH - Based on official documentation and current 2026 best practices articles
- Performance considerations: MEDIUM - General best practices verified, but specific query performance depends on data volume and indexing strategy

**Research date:** 2026-02-11
**Valid until:** 2026-03-11 (30 days - stable ecosystem, NestJS 10.x and TypeORM 0.3.x are mature)
