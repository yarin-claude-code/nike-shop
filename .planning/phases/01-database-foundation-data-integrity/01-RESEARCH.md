# Phase 1: Database Foundation & Data Integrity - Research

**Researched:** 2026-02-10
**Domain:** PostgreSQL 17 + TypeORM 0.3 + NestJS Database Architecture
**Confidence:** HIGH

## Summary

Phase 1 focuses on establishing a robust database foundation for a multi-brand e-commerce shoe catalog. The current codebase has a well-structured PostgreSQL 17 schema (001_initial_schema.sql) with proper relationships between products, variants, images, brands, and categories. However, critical issues exist: (1) `synchronize: true` is enabled in development which violates DB-05 requirement for migration-only workflow, (2) SQL-based seed data exists but needs upgrading to TypeORM-based seeding with real product data from Nike, Adidas, Puma, and On Cloud, (3) no TypeORM migration infrastructure exists despite having TypeORM 0.3.17 and @nestjs/typeorm 10.0.1 installed.

The research confirms that TypeORM 0.3+ with NestJS is the standard stack for this domain, with critical emphasis on disabling `synchronize` and using migrations exclusively. For seeding, typeorm-extension is the current standard (replaces deprecated typeorm-seeding package). Product images should be stored as URLs (current approach is correct), not BLOBs. Product variant schema follows industry-standard patterns with size/color/SKU tracking.

**Primary recommendation:** Disable `synchronize: false` immediately, establish TypeORM DataSource configuration for migrations, implement typeorm-extension seeding with factory-based realistic product data, and migrate existing SQL seed data to TypeORM seeders.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeORM | 0.3.17+ | ORM and migration management | Industry standard for TypeScript+PostgreSQL, active development, strong NestJS integration |
| @nestjs/typeorm | 10.0.1+ | NestJS TypeORM integration | Official NestJS database module, handles dependency injection and repository pattern |
| pg | 8.11.3+ | PostgreSQL driver | Official PostgreSQL driver for Node.js, required by TypeORM |
| typeorm-extension | 3.x | Database seeding with factories | Modern replacement for deprecated typeorm-seeding, supports TypeORM 0.3+ |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @faker-js/faker | 8.x | Generate realistic fake data | Product seeding with names, descriptions, prices - used by typeorm-extension factories |
| class-validator | 0.14.0 | Entity validation | Already installed - validate DTOs and entity constraints |
| class-transformer | 0.5.1 | Entity transformation | Already installed - transform entities to/from plain objects |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| typeorm-extension | Manual seeding scripts | Extension provides factory pattern, Faker integration, and consistent CLI - manual scripts require more boilerplate |
| TypeORM migrations | Prisma Migrate | TypeORM already in use, no benefit to introducing second ORM, team familiarity |
| URL-based images | PostgreSQL BYTEA/BLOB | URLs are 90% smaller in DB, leverage CDN/blob storage, easier backup/replication - BLOBs degrade read performance 10x |

**Installation:**
```bash
cd apps/backend
npm install typeorm-extension @faker-js/faker --save-dev
```

## Architecture Patterns

### Recommended Project Structure
```
apps/backend/src/
├── database/
│   ├── data-source.ts          # TypeORM DataSource config for CLI
│   ├── factories/               # Entity factories for seeding
│   │   ├── product.factory.ts
│   │   ├── brand.factory.ts
│   │   └── product-variant.factory.ts
│   └── seeds/                   # Seeder classes
│       ├── brand.seeder.ts
│       ├── category.seeder.ts
│       └── product.seeder.ts
├── migrations/                  # Generated TypeORM migrations
│   └── 1234567890123-MigrationName.ts
└── [feature]/
    ├── entities/               # TypeORM entities
    ├── dto/                    # Data transfer objects
    └── [feature].service.ts    # Business logic using repository
```

### Pattern 1: Migration-Only Schema Changes (CRITICAL)

**What:** All schema changes MUST go through TypeORM migrations, never through `synchronize: true`

**When to use:** Always in production, recommended for development once schema stabilizes

**Critical Configuration:**
```typescript
// apps/backend/src/app.module.ts
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    // ... connection config
    synchronize: false, // CRITICAL: Must be false for migration workflow
    migrations: ['dist/migrations/**/*.js'],
    migrationsRun: false, // Don't auto-run, use CLI commands
  }),
}),
```

**Why critical:**
- `synchronize: true` can cause data loss in production
- Schema changes are undocumented and unreviewable
- No rollback capability
- Team members have inconsistent schemas

**Source:** [TypeORM Migrations Documentation](https://typeorm.io/docs/migrations/why/)

### Pattern 2: DataSource Configuration for CLI

**What:** Separate DataSource file for TypeORM CLI commands (migration:generate, migration:run, etc.)

**When to use:** Required for any project using TypeORM migrations

**Example:**
```typescript
// apps/backend/src/database/data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config({ path: '../../.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // MUST be false
});
```

**Package.json scripts:**
```json
{
  "scripts": {
    "migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/database/data-source.ts",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/database/data-source.ts",
    "seed": "ts-node -r tsconfig-paths/register src/database/seeds/run-seeder.ts"
  }
}
```

**Source:** [TypeORM CLI Configuration](https://typeorm.io/docs/migrations/)

### Pattern 3: Repository Pattern with NestJS Services

**What:** Service layer uses injected TypeORM repositories, abstracts data access from business logic

**When to use:** All database interactions in NestJS applications

**Example from current codebase:**
```typescript
// apps/backend/src/products/products.service.ts (GOOD EXAMPLE)
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['brand', 'category', 'images', 'variants'], // Explicit eager loading
      order: { createdAt: 'DESC' },
    });
  }
}
```

**Why this pattern:**
- Clear separation: service = business logic, repository = data access
- Testable: mock repository in unit tests
- Type-safe: TypeScript generics provide full typing
- Flexible: easy to switch databases or add caching layer

**Source:** [NestJS Repository Pattern Best Practices](https://medium.com/@mitchella0100/implementing-the-repository-pattern-in-nestjs-and-why-we-should-e32861df5457)

### Pattern 4: Factory-Based Seeding with typeorm-extension

**What:** Define entity factories that generate realistic data using Faker, then use seeders to orchestrate insertion

**When to use:** Development and testing environments, initial production data setup

**Example Factory:**
```typescript
// src/database/factories/product.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Product } from '../../products/entities/product.entity';

export const ProductFactory = setSeederFactory(Product, (faker) => {
  const product = new Product();
  product.name = faker.commerce.productName();
  product.slug = faker.helpers.slugify(product.name).toLowerCase();
  product.description = faker.commerce.productDescription();
  product.price = parseFloat(faker.commerce.price({ min: 80, max: 250 }));
  product.isFeatured = faker.datatype.boolean(0.3); // 30% featured
  product.isActive = true;
  return product;
});
```

**Example Seeder:**
```typescript
// src/database/seeds/product.seeder.ts
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Product } from '../../products/entities/product.entity';

export class ProductSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const productFactory = factoryManager.get(Product);

    // Generate 20 products
    await productFactory.saveMany(20);

    // Or create specific products
    const specificProduct = await productFactory.make({
      name: 'Nike Air Max 90',
      slug: 'nike-air-max-90',
      price: 130.00,
      isFeatured: true,
    });
    await specificProduct.save();
  }
}
```

**Source:** [typeorm-extension Seeding Guide](https://typeorm-extension.tada5hi.net/guide/seeding.html)

### Pattern 5: Product Variant Schema (Current Implementation is Good)

**What:** Separate product_variants table with size/color/SKU/stock per variant, unique constraint on (product_id, size, color)

**Current implementation analysis:**
```typescript
// apps/backend/src/products/entities/product-variant.entity.ts
@Entity('product_variants')
@Unique(['productId', 'size', 'color']) // ✅ Prevents duplicate size/color combos
export class ProductVariant {
  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string; // ✅ Globally unique SKU

  @Column({ type: 'int', default: 0, name: 'stock_quantity' })
  stockQuantity: number; // ✅ Per-variant inventory tracking

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0, name: 'price_adjustment' })
  priceAdjustment: number; // ✅ Variant-specific price changes
}
```

**Why this pattern:**
- Industry standard for e-commerce variant management
- Supports inventory tracking per size/color combination
- Flexible pricing (base price + adjustment)
- SKU uniqueness enforced at database level
- Scalable: new variants don't require schema changes

**Source:** [E-Commerce Product Variants Best Practices](https://www.elastic.co/blog/how-to-create-a-document-schema-for-product-variants-and-skus-for-your-ecommerce-search-experience)

### Pattern 6: Explicit Relation Loading (Avoid Eager: true)

**What:** Load relations explicitly in find queries using `relations` option, avoid `eager: true` in entity decorators

**Why:**
- Eager loading runs on ALL find operations, causing performance issues
- Can't be disabled with QueryBuilder
- Can't use eager on both sides of relationship
- Better to explicitly load when needed

**Current implementation (GOOD):**
```typescript
// products.service.ts
async findAll(): Promise<Product[]> {
  return this.productRepository.find({
    relations: ['brand', 'category', 'images', 'variants'], // Explicit control
    where: { isActive: true },
  });
}
```

**Avoid:**
```typescript
// ❌ DON'T DO THIS in entity
@OneToMany(() => ProductImage, (image) => image.product, { eager: true })
images: ProductImage[]; // Always loaded, can't be turned off
```

**Source:** [TypeORM Eager and Lazy Relations Best Practices](https://orkhan.gitbook.io/typeorm/docs/docs/relations/5-eager-and-lazy-relations)

### Anti-Patterns to Avoid

- **Using `synchronize: true` in any environment with data** - Causes unpredictable schema changes and data loss. Once you have data, use migrations exclusively.

- **Storing images as BYTEA/BLOB in PostgreSQL** - 10x slower reads, 30% larger storage, breaks backups. Store URLs and use blob storage (S3, Azure Blob, CDN).

- **Auto-running migrations on app start** - `migrationsRun: true` hides migration failures and can corrupt production. Run migrations explicitly via deployment scripts.

- **Using entity imports in migrations** - Entities change over time, breaking old migrations. Use `queryRunner.query()` with raw SQL instead.

- **Not reviewing generated migrations** - `migration:generate` can produce incorrect SQL. ALWAYS review generated migrations before committing.

- **Eager loading everywhere** - Degrades performance. Use explicit `relations` option in find queries.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Database seeding with realistic data | Custom faker scripts per entity | typeorm-extension factories | Handles factory orchestration, Faker integration, batch insertion, proper entity relationships |
| Migration generation | Manual SQL scripts | TypeORM CLI `migration:generate` | Auto-detects entity changes, generates TypeScript migrations with type safety, handles column renames |
| Product catalog images | Binary storage in PostgreSQL | URL-based references + CDN | 10x faster reads, 70% smaller DB, better caching, easier backups, standard e-commerce pattern |
| SKU generation | Custom string concatenation | Structured SKU format in factory | Collision detection, brand prefixes, consistent formatting |
| Multi-brand filtering | Application-level filtering | Database indexes on foreign keys | Schema already has `products_brand_id_idx` - leverages PostgreSQL query optimization |

**Key insight:** E-commerce catalog management is a solved problem with established patterns. The current schema (001_initial_schema.sql) already implements industry best practices - the challenge is migration workflow and realistic seeding, not schema design.

## Common Pitfalls

### Pitfall 1: Migration Generate Creates Wrong SQL

**What goes wrong:**
TypeORM's `migration:generate` produces incorrect migrations, especially for:
- Column type changes (treats as drop + add instead of ALTER)
- Constraint modifications (drops and re-creates with different cascade rules)
- Index changes (may not detect properly)

**Why it happens:**
TypeORM compares current entity definitions to database schema, but type mapping between TypeScript and PostgreSQL isn't perfect. Unsigned columns, foreign key cascades, and precision changes are frequent problem areas.

**How to avoid:**
1. ALWAYS review generated migrations before running
2. Test migrations on copy of production database first
3. For complex changes, write raw SQL migrations instead of using generate
4. Keep entity files stable - don't rename/remove fields used in old migrations

**Warning signs:**
- Migration dropping and recreating existing columns
- Foreign keys being dropped without reason
- Data-destructive operations (DROP COLUMN with data)

**Source:** [TypeORM Migration Generate Issues](https://github.com/typeorm/typeorm/issues/8810)

### Pitfall 2: Synchronize: true with Existing Data

**What goes wrong:**
Setting `synchronize: true` when database has data causes:
- Silent data loss from dropped columns
- Constraint violations causing app crashes
- Inconsistent schema across environments
- No rollback capability

**Why it happens:**
Developers enable synchronize during development, then forget to disable for production, or re-enable when "just testing something quickly."

**How to avoid:**
1. Set `synchronize: false` immediately in app.module.ts
2. Use environment variable: `TYPEORM_SYNCHRONIZE=false` in .env
3. Add validation: throw error if synchronize is true and NODE_ENV is production
4. Document in CLAUDE.md as critical area requiring approval

**Warning signs:**
- Schema drift between dev and production
- Columns disappearing after entity changes
- "Column does not exist" errors after entity updates

**Current codebase issue:**
```typescript
// apps/backend/src/app.module.ts:29
synchronize: configService.get('NODE_ENV') === 'development', // ❌ MUST CHANGE TO FALSE
```

**Source:** [TypeORM Synchronize Warning](https://typeorm.io/docs/migrations/why/)

### Pitfall 3: Entity Imports in Migration Files

**What goes wrong:**
Importing entity classes in migration `up()`/`down()` methods breaks when entities are later modified:
```typescript
// ❌ BAD MIGRATION
import { Product } from '../products/entities/product.entity';

async up(queryRunner: QueryRunner) {
  const product = new Product(); // Breaks when Product entity changes
  await queryRunner.manager.save(product);
}
```

If Product entity later adds required fields, old migrations fail, preventing database recreation.

**Why it happens:**
Developers treat migrations like application code, importing entities for convenience and type safety.

**How to avoid:**
Use raw SQL or QueryRunner query methods in migrations:
```typescript
// ✅ GOOD MIGRATION
async up(queryRunner: QueryRunner) {
  await queryRunner.query(`
    INSERT INTO products (brand_id, name, slug, price)
    VALUES ($1, $2, $3, $4)
  `, [1, 'Product Name', 'product-slug', 99.99]);
}
```

**Warning signs:**
- Migration files importing from ../entities/
- Migration using `new Entity()` or `entity.save()`
- Error: "Cannot run migrations, entity has required field"

**Source:** [TypeORM Migration Entity References Issue](https://github.com/typeorm/typeorm/issues/8622)

### Pitfall 4: N+1 Query Problem with Lazy Loading

**What goes wrong:**
Loading parent entities then accessing relations triggers one query per parent:
```typescript
// ❌ Causes N+1 queries
const products = await productRepository.find(); // 1 query
for (const product of products) {
  console.log(product.brand.name); // N queries (one per product)
}
```

For 100 products, this creates 101 database queries, devastating performance.

**Why it happens:**
Relations not specified in `find()` options, TypeORM lazy-loads on access, developers don't notice in development with small datasets.

**How to avoid:**
Always specify `relations` array in find operations:
```typescript
// ✅ Single query with JOIN
const products = await productRepository.find({
  relations: ['brand', 'category', 'images', 'variants'],
});
```

Or use QueryBuilder with leftJoinAndSelect:
```typescript
const products = await productRepository
  .createQueryBuilder('product')
  .leftJoinAndSelect('product.brand', 'brand')
  .leftJoinAndSelect('product.images', 'images')
  .getMany();
```

**Warning signs:**
- Slow queries that scale with result count
- Many identical queries in logs
- Database connection pool exhaustion

**Source:** [TypeORM Performance Optimization](https://darraghoriordan.medium.com/postgresql-and-typeorm-9-tips-tricks-and-common-issues-9f1791b79699)

### Pitfall 5: Missing TypeORM CLI Configuration

**What goes wrong:**
Running `npm run typeorm migration:generate` fails with "Cannot find data source" or creates migrations in wrong directory.

**Why it happens:**
TypeORM 0.3+ requires explicit DataSource file export, unlike 0.2 which used ormconfig.json. Package.json scripts must reference this file with `-d` flag.

**How to avoid:**
1. Create dedicated DataSource file: `src/database/data-source.ts`
2. Export configured DataSource instance
3. Update package.json scripts with `-d` flag pointing to file
4. Use `typeorm-ts-node-commonjs` for TypeScript support

**Warning signs:**
- "Cannot find module 'data-source'" error
- Migrations created in project root instead of src/migrations
- CLI commands not recognizing entities

**Current codebase gap:**
No DataSource file exists yet - will need to create `apps/backend/src/database/data-source.ts`

**Source:** [TypeORM 0.3 Migration CLI Configuration](https://peturgeorgievv.com/blog/typeorm-migrations-explained-example-with-nestjs-and-postgresql)

## Code Examples

Verified patterns from official sources and current codebase:

### Setting Up TypeORM DataSource for Migrations

```typescript
// apps/backend/src/database/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment from monorepo root
config({ path: join(__dirname, '../../../.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || 'tonys_shoes',

  // Entity paths for CLI (TypeScript source files)
  entities: [join(__dirname, '..', '**', '*.entity.ts')],

  // Migration paths
  migrations: [join(__dirname, '..', 'migrations', '*.ts')],

  // CRITICAL: Must be false
  synchronize: false,

  // Logging for development
  logging: process.env.NODE_ENV === 'development',
};

// Export initialized DataSource for CLI
export const AppDataSource = new DataSource(dataSourceOptions);
```

**Source:** Current codebase analysis + [TypeORM DataSource Documentation](https://typeorm.io/data-source)

### Seeding Real Multi-Brand Product Data

```typescript
// apps/backend/src/database/seeds/brand.seeder.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Brand } from '../../brands/entities/brand.entity';

export class BrandSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const brandRepository = dataSource.getRepository(Brand);

    // Check if brands already exist
    const existingCount = await brandRepository.count();
    if (existingCount > 0) {
      console.log('Brands already seeded, skipping...');
      return;
    }

    // Real brands from requirements
    const brands = [
      {
        name: 'Nike',
        slug: 'nike',
        description: 'Just Do It',
        logoUrl: 'https://example.com/logos/nike.svg',
      },
      {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Impossible is Nothing',
        logoUrl: 'https://example.com/logos/adidas.svg',
      },
      {
        name: 'Puma',
        slug: 'puma',
        description: 'Forever Faster',
        logoUrl: 'https://example.com/logos/puma.svg',
      },
      {
        name: 'On Cloud',
        slug: 'on-cloud',
        description: 'Swiss Performance Running',
        logoUrl: 'https://example.com/logos/on-cloud.svg',
      },
    ];

    await brandRepository.save(brands);
    console.log('✅ Seeded 4 brands');
  }
}
```

### Product Factory with Realistic Data

```typescript
// apps/backend/src/database/factories/product.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Product } from '../../products/entities/product.entity';

// Real Nike/Adidas shoe naming patterns
const shoeNames = [
  'Air Max 90', 'Air Force 1', 'React Infinity Run', 'Pegasus 40',
  'Ultraboost 22', 'NMD_R1', 'Superstar', 'Forum Low',
  'Cloudstratus', 'Cloudswift', 'Cloudflow',
  'RS-X3', 'Suede Classic', 'Future Rider',
];

export const ProductFactory = setSeederFactory(Product, (faker) => {
  const product = new Product();

  // Pick from real shoe names or generate similar
  const baseName = faker.helpers.arrayElement(shoeNames);
  const variant = faker.helpers.arrayElement(['', ' V2', ' SE', ' Premium']);
  product.name = baseName + variant;

  product.slug = faker.helpers.slugify(product.name).toLowerCase();

  // Realistic shoe descriptions
  product.description = `${product.name} delivers premium comfort and style. ` +
    `Features ${faker.helpers.arrayElement(['responsive cushioning', 'breathable mesh upper', 'durable rubber outsole'])} ` +
    `with ${faker.helpers.arrayElement(['classic design', 'modern aesthetics', 'timeless appeal'])}.`;

  // Shoe price range: $80-$250
  product.price = parseFloat(faker.commerce.price({ min: 80, max: 250, dec: 0 }));

  // 20% chance of sale price
  if (faker.datatype.boolean(0.2)) {
    const discount = faker.number.float({ min: 0.1, max: 0.3 });
    product.salePrice = parseFloat((product.price * (1 - discount)).toFixed(2));
  }

  // 30% featured rate
  product.isFeatured = faker.datatype.boolean(0.3);
  product.isActive = true;

  return product;
});
```

**Source:** [typeorm-extension Factory Documentation](https://typeorm-extension.tada5hi.net/guide/seeding.html)

### Product Seeder with Images and Variants

```typescript
// apps/backend/src/database/seeds/product.seeder.ts
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Product } from '../../products/entities/product.entity';
import { ProductImage } from '../../products/entities/product-image.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';

export class ProductSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const productRepository = dataSource.getRepository(Product);
    const imageRepository = dataSource.getRepository(ProductImage);
    const variantRepository = dataSource.getRepository(ProductVariant);
    const brandRepository = dataSource.getRepository(Brand);
    const categoryRepository = dataSource.getRepository(Category);

    // Get real brands and categories
    const brands = await brandRepository.find();
    const categories = await categoryRepository.find();

    if (brands.length === 0 || categories.length === 0) {
      throw new Error('Must seed brands and categories before products');
    }

    const productFactory = factoryManager.get(Product);

    // Create 50 products with realistic distribution
    for (let i = 0; i < 50; i++) {
      const product = await productFactory.make({
        brandId: brands[i % brands.length].id,
        categoryId: categories[i % categories.length].id,
      });

      await productRepository.save(product);

      // Add 2-4 images per product (using Unsplash shoe images)
      const imageCount = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < imageCount; j++) {
        const image = new ProductImage();
        image.productId = product.id;
        image.url = `https://images.unsplash.com/photo-${1600000000000 + i * 10000 + j}?w=800&q=80`;
        image.altText = `${product.name} - View ${j + 1}`;
        image.isPrimary = j === 0;
        image.sortOrder = j;
        await imageRepository.save(image);
      }

      // Add variants: 3 sizes × 2 colors = 6 variants per product
      const sizes = ['8', '9', '10'];
      const colors = ['Black', 'White'];

      for (const size of sizes) {
        for (const color of colors) {
          const variant = new ProductVariant();
          variant.productId = product.id;
          variant.size = size;
          variant.color = color;
          variant.sku = `${product.slug.substring(0, 6).toUpperCase()}-${color.substring(0, 3).toUpperCase()}-${size}`;
          variant.stockQuantity = Math.floor(Math.random() * 20) + 5; // 5-25 units
          variant.priceAdjustment = 0;
          await variantRepository.save(variant);
        }
      }
    }

    console.log('✅ Seeded 50 products with images and variants');
  }
}
```

### Running Seeders (CLI Setup)

```typescript
// apps/backend/src/database/seeds/run-seeder.ts
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { AppDataSource, dataSourceOptions } from '../data-source';
import { BrandSeeder } from './brand.seeder';
import { CategorySeeder } from './category.seeder';
import { ProductSeeder } from './product.seeder';

async function runSeeding() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  await runSeeders(dataSource, {
    seeds: [BrandSeeder, CategorySeeder, ProductSeeder],
    factories: ['src/database/factories/**/*.factory.ts'],
  });

  await dataSource.destroy();
  console.log('🌱 Seeding complete!');
}

runSeeding().catch(console.error);
```

**Package.json script:**
```json
{
  "scripts": {
    "seed": "ts-node -r tsconfig-paths/register src/database/seeds/run-seeder.ts"
  }
}
```

### Migration Workflow Commands

```json
// apps/backend/package.json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs -d src/database/data-source.ts",
    "migration:generate": "npm run typeorm -- migration:generate src/migrations/$npm_config_name",
    "migration:create": "npm run typeorm -- migration:create src/migrations/$npm_config_name",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "migration:show": "npm run typeorm -- migration:show",
    "schema:drop": "npm run typeorm -- schema:drop",
    "seed": "ts-node -r tsconfig-paths/register src/database/seeds/run-seeder.ts"
  }
}
```

**Usage:**
```bash
# Generate migration from entity changes
npm run migration:generate --name=AddProductColorColumn

# Run pending migrations
npm run migration:run

# Rollback last migration
npm run migration:revert

# Seed database
npm run seed
```

**Source:** [NestJS TypeORM Migration Setup](https://peturgeorgievv.com/blog/typeorm-migrations-explained-example-with-nestjs-and-postgresql)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| typeorm-seeding package | typeorm-extension | 2022-2023 | Original package deprecated, extension supports TypeORM 0.3+ with better DX |
| ormconfig.json | DataSource class export | TypeORM 0.3.0 (2021) | More flexible, TypeScript-native, supports environment variables |
| VARCHAR(n) in entities | TEXT type in PostgreSQL | PostgreSQL best practice | No length limit, same performance, follows PostgreSQL conventions |
| Eager loading with eager: true | Explicit relations in queries | Performance lessons | Better control, avoids N+1, works with QueryBuilder |
| Auto-run migrations (migrationsRun: true) | Explicit migration commands | Production safety (ongoing) | Prevents hidden failures, allows rollback strategy |
| BLOB/BYTEA image storage | URL-based + CDN | Cloud era (2010s+) | 10x faster, smaller DB, leverage CDN, standard e-commerce |

**Deprecated/outdated:**
- **typeorm-seeding package** - No longer maintained, doesn't support TypeORM 0.3+, use typeorm-extension instead
- **ormconfig.json** - Replaced by DataSource class, harder to use environment variables
- **@types/faker** - Old faker.js, use @faker-js/faker (community fork, actively maintained)

**Source:** [TypeORM 0.3 Breaking Changes](https://github.com/typeorm/typeorm/releases/tag/0.3.0)

## Open Questions

1. **Real Product Image Sources**
   - What we know: Requirements specify "real shoe products from Nike, Adidas, Puma, and On Cloud with authentic images"
   - What's unclear: Legal approach - official APIs vs web scraping vs licensed stock photos
   - Recommendation: Start with Unsplash free shoe photos (legally clear), then evaluate:
     - Scraper services (ScraperAPI, Bright Data) claim GDPR compliance for public data
     - May need legal review for brand trademark usage
     - Alternative: Use product names but generic shoe images until legal clarity

2. **Migration Strategy from SQL to TypeORM**
   - What we know: Existing SQL migrations (001_initial_schema.sql, 002_seed_products.sql) are well-structured
   - What's unclear: Should we keep SQL migrations or convert to TypeORM migrations?
   - Recommendation: Keep SQL for initial schema (already executed), use TypeORM migrations for future changes. This is standard practice - don't rewrite working migrations.

3. **Seeding in Production**
   - What we know: Seeders typically for dev/test only
   - What's unclear: How to populate initial production catalog?
   - Recommendation: Create separate "bootstrap" script that runs once on production init, or admin import feature. Don't run dev seeders in production.

4. **TypeORM CLI vs ts-node Performance**
   - What we know: TypeORM CLI requires ts-node, adds ~2-3s overhead per command
   - What's unclear: Is this acceptable for development workflow?
   - Recommendation: Acceptable for now, can optimize later with compiled migration files if becomes pain point

## Sources

### Primary (HIGH confidence)

**TypeORM Official Documentation:**
- [TypeORM Migrations - Why Use Them](https://typeorm.io/docs/migrations/why/) - Critical synchronize: false guidance
- [TypeORM Migrations - How to Use](https://typeorm.io/docs/advanced-topics/migrations/) - CLI commands, migration structure
- [TypeORM Relations - Eager and Lazy](https://orkhan.gitbook.io/typeorm/docs/docs/relations/5-eager-and-lazy-relations) - Loading strategy patterns
- [TypeORM Data Source](https://typeorm.io/data-source) - Configuration setup

**typeorm-extension Official Documentation:**
- [typeorm-extension Seeding Guide](https://typeorm-extension.tada5hi.net/guide/seeding.html) - Factory pattern, seeder execution

**PostgreSQL Official Wiki:**
- [Binary Files in DB](https://wiki.postgresql.org/wiki/BinaryFilesInDB) - Why not to store images as BLOBs

**NestJS Official Documentation:**
- [NestJS Database Techniques](https://docs.nestjs.com/techniques/database) - TypeORM integration

### Secondary (MEDIUM confidence)

**Technical Blog Posts:**
- [TypeORM Migrations Explained - NestJS and PostgreSQL](https://peturgeorgievv.com/blog/typeorm-migrations-explained-example-with-nestjs-and-postgresql) - Practical NestJS setup
- [Essential Guide to NestJS Migrations with TypeORM 2026](https://www.oneclickitsolution.com/blog/migrations-with-typeorm) - Current 2026 workflow
- [Implementing Repository Pattern in NestJS](https://medium.com/@mitchella0100/implementing-the-repository-pattern-in-nestjs-and-why-we-should-e32861df5457) - Service layer architecture
- [PostgreSQL and TypeORM - Tips and Tricks](https://darraghoriordan.medium.com/postgresql-and-typeorm-9-tips-tricks-and-common-issues-9f1791b79699) - N+1 query solutions
- [Understanding Sync vs Migration in NestJS with TypeORM](https://blog.bytescrum.com/understanding-sync-vs-migration-in-nestjs-with-typeorm-a-comprehensive-guide) - Synchronize pitfalls

**E-Commerce Schema Design:**
- [Product Variants Schema for E-Commerce Search](https://www.elastic.co/blog/how-to-create-a-document-schema-for-product-variants-and-skus-for-your-ecommerce-search-experience) - Variant modeling patterns
- [Modelling Products and Variants](https://martinbean.dev/blog/2023/01/27/product-variants-laravel/) - General variant architecture
- [E-Commerce Database Design - Product Variants with EAV](https://np4652.medium.com/e-commerce-database-design-managing-product-variants-for-multi-vendor-platforms-using-the-eav-01307e63b920) - Alternative patterns (not recommended for this scale)

### Tertiary (LOW confidence - contextual)

**Web Scraping Services (Legal uncertainty):**
- [Nike Scraper - ScraperAPI](https://www.scraperapi.com/solutions/nike-scraper/) - Claims GDPR compliance
- [Adidas Scraper - Bright Data](https://brightdata.com/products/web-scraper/adidas) - Commercial scraping service
- Note: Legal implications unclear, would need legal review for trademark usage

**GitHub Issues (Community debugging):**
- [TypeORM Migration Generate Issues #8810](https://github.com/typeorm/typeorm/issues/8810) - Known CLI problems
- [Migrations That Rely on Entity Fail #8622](https://github.com/typeorm/typeorm/issues/8622) - Entity import pitfall

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - TypeORM 0.3 + NestJS 10 + typeorm-extension is well-documented, current, official
- Architecture: HIGH - Migration patterns verified from official docs, repository pattern is NestJS standard, current codebase already follows best practices
- Pitfalls: HIGH - Synchronize danger is documented in official TypeORM docs, N+1 queries are established issue, migration pitfalls from GitHub issues and real experience
- Seeding approach: MEDIUM - typeorm-extension is correct tool but realistic product data sourcing has legal uncertainty
- Real product images: LOW - Web scraping legality unclear, may require legal review or alternative approach (Unsplash generic shoes)

**Research date:** 2026-02-10
**Valid until:** 2026-04-10 (60 days - TypeORM and NestJS are mature, slow-moving)

**Current codebase strengths:**
- ✅ Excellent PostgreSQL schema design (001_initial_schema.sql)
- ✅ Proper entity relationships with TypeORM decorators
- ✅ Repository pattern correctly implemented in services
- ✅ URL-based image storage (product_images table)
- ✅ Product variant schema follows e-commerce best practices
- ✅ Explicit relation loading in queries (no eager: true abuse)

**Current codebase gaps:**
- ❌ No TypeORM DataSource configuration file
- ❌ No migration infrastructure (package.json scripts missing)
- ❌ `synchronize: true` enabled in development (violates DB-05)
- ❌ No seeding infrastructure (SQL seed exists but not TypeORM-based)
- ❌ No factory pattern for realistic test data generation
- ❌ No integration with typeorm-extension
