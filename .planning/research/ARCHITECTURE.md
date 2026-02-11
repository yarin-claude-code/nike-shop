# Architecture Research

**Domain:** Multi-Brand E-Commerce Shoe Store
**Researched:** 2026-02-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                               │
│  React + Vite + TailwindCSS + TypeScript                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Pages      │  │  Components  │  │     UI       │              │
│  │ (Routes)     │  │  (Business)  │  │  (Reusable)  │              │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘              │
│         │                 │                                          │
│  ┌──────┴─────────────────┴───────┐  ┌──────────────┐              │
│  │   TanStack Query (Server)     │  │   Zustand     │              │
│  │   Cache & Data Fetching        │  │ (Client State)│              │
│  └────────────┬───────────────────┘  └──────────────┘              │
├───────────────┴──────────────────────────────────────────────────────┤
│                        API LAYER (REST)                              │
│                    Axios + Interceptors                              │
├─────────────────────────────────────────────────────────────────────┤
│                        BACKEND LAYER                                 │
│  NestJS + TypeScript + Modular Architecture                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Products │  │  Brands  │  │Categories│  │   Cart   │           │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
│       │             │              │             │                  │
│  Each Module Contains:                                              │
│  • Controller (HTTP endpoints)                                      │
│  • Service (Business logic)                                         │
│  • Entity (TypeORM model)                                           │
│  • DTOs (Data Transfer Objects)                                     │
├─────────────────────────────────────────────────────────────────────┤
│                        DATA LAYER                                    │
│  TypeORM + Repository Pattern                                       │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐       │
│  │              PostgreSQL 17 Database                       │       │
│  │  products | product_variants | product_images             │       │
│  │  brands | categories | users | orders | cart_items        │       │
│  └──────────────────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────────────┤
│                     ASSET DELIVERY LAYER                             │
│  CDN for Product Images (Future)                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Pages** | Route containers, data orchestration | ProductsPage, CartPage, HomePage - fetch data, handle URL state |
| **Business Components** | Feature-specific UI logic | ProductCard, CartItem, ProductImageViewer - domain-specific presentation |
| **UI Components** | Reusable presentational elements | Breadcrumb, Skeleton, QuantitySelector - generic, stateless |
| **TanStack Query** | Server state management, caching, background sync | useQuery hooks for products, brands, categories - automatic refetching |
| **Zustand Stores** | Client state (cart, auth) | cartStore (persistent), authStore - lightweight, non-server state |
| **NestJS Modules** | Bounded contexts for business domains | Each module = controller + service + entities + DTOs |
| **Controllers** | HTTP request handling, route definitions | @Get(), @Post() decorators, validation, response mapping |
| **Services** | Business logic, orchestration | TypeORM queries, data transformation, business rules |
| **Entities** | Database models with TypeORM decorators | Product, ProductVariant, ProductImage, Brand, Category |
| **PostgreSQL** | Relational data storage | Products catalog with variants, multi-brand support, referential integrity |

## Recommended Project Structure

### Frontend Structure
```
apps/frontend/src/
├── pages/                      # Route-level components
│   ├── HomePage.tsx           # Landing page
│   ├── ProductsPage.tsx       # Product listing with filters
│   ├── ProductPage.tsx        # Product detail view
│   ├── CartPage.tsx           # Shopping cart
│   └── CheckoutPage.tsx       # Checkout flow
├── components/                 # Feature components
│   ├── home/                  # Homepage sections
│   │   ├── HeroSection.tsx
│   │   ├── PopularProducts.tsx
│   │   └── Newsletter.tsx
│   ├── product/               # Product-related components
│   │   ├── ProductCard.tsx
│   │   ├── ProductImageViewer.tsx
│   │   ├── ProductInfo.tsx
│   │   └── ProductTabs.tsx
│   ├── cart/                  # Cart components
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── EmptyCart.tsx
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── ui/                    # Reusable UI primitives
│       ├── Breadcrumb.tsx
│       ├── Skeleton.tsx
│       └── QuantitySelector.tsx
├── stores/                     # Zustand state stores
│   ├── cartStore.ts           # Client-side cart (persisted)
│   └── authStore.ts           # Authentication state
├── lib/                        # Utilities and configuration
│   └── api.ts                 # Axios instance + interceptors
├── types/                      # TypeScript definitions
│   └── product.ts             # Product, Brand, Category types
└── hooks/                      # Custom React hooks (future)
    └── useProductFilters.ts   # Reusable filter logic
```

### Backend Structure
```
apps/backend/src/
├── products/                   # Products module
│   ├── entities/
│   │   ├── product.entity.ts
│   │   ├── product-variant.entity.ts
│   │   └── product-image.entity.ts
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── brands/                     # Brands module
│   ├── entities/
│   │   └── brand.entity.ts
│   ├── brands.controller.ts
│   ├── brands.service.ts
│   └── brands.module.ts
├── categories/                 # Categories module
│   ├── entities/
│   │   └── category.entity.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── cart/                       # Shopping cart module
│   ├── entities/
│   │   └── cart-item.entity.ts
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── cart.module.ts
├── orders/                     # Order management module
│   ├── entities/
│   │   ├── order.entity.ts
│   │   └── order-item.entity.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── auth/                       # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
└── app.module.ts               # Root module
```

### Database Schema Organization
```
database/
├── migrations/                 # SQL migration files
│   ├── 001_initial_schema.sql
│   ├── 002_drop_model_3d_url.sql
│   └── 003_update_product_images.sql
└── seeds/                      # Development seed data (future)
    ├── brands.sql
    ├── categories.sql
    └── products.sql
```

### Structure Rationale

- **Frontend pages/:** Route containers that orchestrate data fetching and compose business components. Pages handle URL state and query parameters for filtering.

- **Frontend components/:** Organized by domain (home, product, cart, layout, ui). Business logic lives in domain components, pure presentation in ui/.

- **Frontend stores/:** Only for client-side state (cart persisted to localStorage, auth). Server state (products, brands) handled by TanStack Query, NOT in stores.

- **Backend modules/:** Each domain (products, brands, categories, cart, orders) is self-contained with controller → service → entity. Prevents tight coupling and supports future microservice extraction.

- **Entities folder per module:** TypeORM entities co-located with their business logic. Product module owns product.entity, product-variant.entity, product-image.entity.

- **DTOs for validation:** Create/Update DTOs with class-validator ensure type safety and validation at API boundaries.

## Architectural Patterns

### Pattern 1: Server State vs Client State Separation

**What:** Distinguish between server-owned data (products, orders) and client-owned data (cart before checkout, UI preferences). Use TanStack Query for server state, Zustand for client state.

**When to use:** Always in modern React applications. TanStack Query now handles ~80% of app state in 2026 e-commerce systems.

**Trade-offs:**
- **Pros:** Automatic caching, background refetching, optimistic updates, reduced boilerplate
- **Cons:** Learning curve for cache invalidation strategies

**Example:**
```typescript
// Server state - TanStack Query
const { data: products = [], isLoading } = useQuery<Product[]>({
  queryKey: ['products', 'featured'],
  queryFn: async () => {
    const res = await api.get('/products/featured');
    return res.data;
  },
});

// Client state - Zustand
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => { /* ... */ },
      getTotalPrice: () => { /* ... */ },
    }),
    { name: 'cart-storage' }
  )
);
```

### Pattern 2: Product Variant Schema (Separate Table)

**What:** Products table stores shared attributes (name, description, brand, category). product_variants table stores size/color/SKU combinations with separate inventory tracking.

**When to use:** When products have multiple variations (size, color) with independent pricing and inventory. Essential for shoe e-commerce.

**Trade-offs:**
- **Pros:** Accurate inventory per variant, supports price adjustments per variant, scalable to millions of SKUs
- **Cons:** Slightly more complex queries (need joins), frontend must handle variant selection

**Example Database Schema:**
```sql
-- Base product (shared attributes)
CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  brand_id BIGINT NOT NULL REFERENCES brands(id),
  category_id BIGINT NOT NULL REFERENCES categories(id),
  price NUMERIC(10,2) NOT NULL,
  sale_price NUMERIC(10,2),
  -- ...
);

-- Variants (size/color combinations)
CREATE TABLE product_variants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  price_adjustment NUMERIC(10,2) NOT NULL DEFAULT 0,
  CONSTRAINT product_variants_unique_combination UNIQUE (product_id, size, color)
);
```

### Pattern 3: Modular NestJS with Domain Modules

**What:** Each business domain (products, brands, categories, cart, orders) is a self-contained NestJS module with controller, service, entities, and DTOs. Modules expose public APIs and hide internal implementation.

**When to use:** Always in NestJS for medium-to-large applications. Maps to Domain-Driven Design bounded contexts.

**Trade-offs:**
- **Pros:** Loose coupling, testable in isolation, easy refactoring, microservice-ready
- **Cons:** More files and folders, need to think about module boundaries

**Example:**
```typescript
// products.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, ProductVariant]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService], // Other modules can import ProductsService
})
export class ProductsModule {}

// app.module.ts
@Module({
  imports: [
    ProductsModule,
    BrandsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

### Pattern 4: Component-Driven Development (Frontend)

**What:** Build UI from small, reusable components. Composition over inheritance. Pages compose business components, business components use UI primitives.

**When to use:** Always in React. Hierarchy: Pages → Business Components (ProductCard, CartItem) → UI Components (Breadcrumb, Skeleton).

**Trade-offs:**
- **Pros:** Reusable, testable, maintainable, design system consistency
- **Cons:** Can lead to over-abstraction if not careful

**Example:**
```typescript
// Page composes business components
export default function ProductsPage() {
  const { data: products } = useQuery({ ... });

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Business component uses UI primitives
function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="product-card">
      {!imageLoaded && <Skeleton />}
      <img src={product.image} onLoad={() => setImageLoaded(true)} />
      <h3>{product.name}</h3>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}
```

### Pattern 5: Image Collection per Product (One-to-Many)

**What:** Store product images in separate product_images table with is_primary flag and sort_order. Each product can have multiple images (angles, colors).

**When to use:** When products need image galleries (not just single hero image). Standard for e-commerce.

**Trade-offs:**
- **Pros:** Flexible image management, supports color variants with different images, easy to add/remove images
- **Cons:** Need to handle primary image selection logic, slightly more complex queries

**Example:**
```typescript
// TypeORM Entity
@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'bigint', name: 'product_id' })
  productId: number;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'boolean', default: false, name: 'is_primary' })
  isPrimary: boolean;

  @Column({ type: 'smallint', default: 0, name: 'sort_order' })
  sortOrder: number;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

// Frontend usage
const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
```

### Pattern 6: Repository Pattern with TypeORM

**What:** Services use TypeORM repositories to abstract database operations. Business logic stays in service layer, data access in repository.

**When to use:** Standard NestJS + TypeORM pattern. Service injects repository, repository handles queries.

**Trade-offs:**
- **Pros:** Clean separation, testable (can mock repository), supports transactions
- **Cons:** Abstraction layer adds slight complexity

**Example:**
```typescript
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private imagesRepository: Repository<ProductImage>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['brand', 'category', 'images', 'variants'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<Product> {
    return this.productsRepository.findOne({
      where: { slug },
      relations: ['brand', 'category', 'images', 'variants'],
    });
  }
}
```

## Data Flow

### Request Flow (Product Listing)

```
[User visits /shop]
    ↓
[ProductsPage Component]
    ↓
[useQuery('products')] → Check TanStack Query cache
    ↓ (cache miss or stale)
[api.get('/products')] → HTTP GET request
    ↓
[Axios Interceptor] → Add auth token (if exists)
    ↓
[NestJS ProductsController @Get()]
    ↓
[ProductsService.findAll()]
    ↓
[TypeORM Repository Query] → SELECT * FROM products JOIN brands JOIN categories
    ↓
[PostgreSQL Database]
    ↓ (return rows)
[TypeORM Entity Mapping] → Convert DB rows to Product entities
    ↓
[ProductsService] → Return Product[]
    ↓
[ProductsController] → Return JSON response
    ↓
[Axios Interceptor] → Convert numeric strings to numbers
    ↓
[TanStack Query] → Cache response, update state
    ↓
[ProductsPage] → Re-render with products
    ↓
[ProductCard Components] → Display product grid
```

### State Management (Add to Cart)

```
[User clicks "Add to Cart"]
    ↓
[ProductCard.handleAddToCart()]
    ↓
[useCartStore.addItem()] → Zustand action
    ↓
[cartStore state update] → Check if variant exists
    ↓ (if exists)
[Update quantity] → items.map(i => i.variantId === id ? {...i, quantity++} : i)
    ↓ (if new)
[Add to items array] → [...items, { ...item, quantity: 1 }]
    ↓
[Zustand persist middleware] → localStorage.setItem('cart-storage', JSON.stringify(state))
    ↓
[React re-render] → Components using useCartStore re-render
    ↓
[Header cart icon] → Shows updated item count
```

### Product Detail Flow (with Variants)

```
[User clicks product card]
    ↓
[Navigate to /product/:slug]
    ↓
[ProductPage Component]
    ↓
[useQuery(['product', slug])] → Fetch single product
    ↓
[api.get('/products/:slug')]
    ↓
[ProductsController @Get(':slug')]
    ↓
[ProductsService.findBySlug(slug)]
    ↓
[TypeORM Query] → JOIN product_variants, product_images, brands, categories
    ↓
[Return Product with nested relations]
    ↓
[ProductPage renders]
    ↓
[ProductImageViewer] → Display images carousel
[ProductInfo] → Display name, price, brand, category
[ProductTabs] → Description, specifications
[Variant Selector] → Size/color picker
    ↓
[User selects variant]
    ↓
[Update local state] → selectedVariant = variants.find(...)
    ↓
[Display variant stock] → variant.stockQuantity > 0 ? "In Stock" : "Out of Stock"
```

### Key Data Flows

1. **Product Catalog Loading:** TanStack Query fetches products on page load, caches response, auto-refetches on window focus (configurable). Filters applied client-side via useMemo for instant filtering.

2. **Cart Operations:** All cart operations (add, remove, update quantity) happen in Zustand store. Cart persists to localStorage. On checkout, cart data sent to backend to create order.

3. **Image Delivery:** Product images served from database URLs. Future optimization: migrate to CDN, serve WebP format, lazy load below-fold images.

4. **Authentication Flow:** Login → backend returns JWT → store in localStorage → axios interceptor adds to all requests → 401 response clears token and redirects to login.

5. **Filtering & Sorting:** ProductsPage reads URL search params (category, brand, sale), filters products client-side, updates URL on filter change (enables shareable filter URLs).

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Current architecture sufficient. Single PostgreSQL instance, no CDN, no caching layer. Focus on feature development. |
| **1k-10k users** | Add Redis for session caching, product catalog caching. Implement database connection pooling. Move images to CDN (Cloudinary/Uploadcare). Add database indexes for hot queries (brand, category filters). |
| **10k-100k users** | Add read replicas for PostgreSQL. Implement API rate limiting. Use Redis for cart session storage (move from localStorage for logged-in users). Add full-text search (Elasticsearch) for product search. Implement lazy loading and pagination on product listing. |
| **100k+ users** | Consider microservices extraction (products, orders, auth as separate services). Implement event-driven architecture (Kafka/RabbitMQ) for order processing. Add GraphQL for flexible frontend queries. Split database by domain (products DB, orders DB). Implement CDN edge caching for API responses. |

### Scaling Priorities

1. **First bottleneck:** Database query performance on product listing with filters. **Fix:** Add composite indexes on (brand_id, category_id, is_active), implement pagination with limit/offset, cache common filter combinations in Redis.

2. **Second bottleneck:** Image delivery latency (large product images slow page load). **Fix:** Migrate to CDN with automatic WebP conversion, implement responsive image sizes (srcset), lazy load images below fold, use LQIP (Low Quality Image Placeholder).

3. **Third bottleneck:** Cart operations for logged-in users (localStorage doesn't sync across devices). **Fix:** Move cart to backend cart_items table, sync on login, implement optimistic UI updates.

4. **Fourth bottleneck:** Checkout process under high load (inventory race conditions). **Fix:** Implement optimistic locking on product_variants.stock_quantity, add database-level constraints, use database transactions for order creation.

## Anti-Patterns

### Anti-Pattern 1: Storing Server Data in Zustand/Redux

**What people do:** Fetching products via useEffect, storing in global state store, manually managing loading/error states.

**Why it's wrong:** Duplicates server state in client, no automatic cache invalidation, stale data, manual refetching logic, doesn't handle race conditions.

**Do this instead:** Use TanStack Query for ALL server data. Zustand only for client-owned state (cart, UI preferences). TanStack Query handles caching, refetching, error states automatically.

```typescript
// ❌ WRONG: Storing server data in Zustand
const useProductStore = create((set) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    const res = await api.get('/products');
    set({ products: res.data, loading: false });
  },
}));

// ✅ RIGHT: Use TanStack Query for server data
const { data: products = [], isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const res = await api.get('/products');
    return res.data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Anti-Pattern 2: Single Products Table with JSON Variants

**What people do:** Store variants as JSON column in products table: `{ variants: [{size: "10", color: "red", stock: 5}, ...] }`.

**Why it's wrong:** Can't query inventory efficiently, can't join on variants for cart/orders, PostgreSQL JSON queries slower than relational, harder to enforce constraints, breaks normalization.

**Do this instead:** Separate product_variants table with proper foreign keys. Enables efficient inventory queries, JOIN operations, and database-level constraints.

```sql
-- ❌ WRONG: JSON column for variants
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  variants JSONB -- [{size: "10", color: "red", stock: 5}]
);

-- ✅ RIGHT: Separate variants table
CREATE TABLE product_variants (
  id BIGINT PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL,
  UNIQUE (product_id, size, color)
);
CREATE INDEX product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX product_variants_in_stock_idx ON product_variants(product_id, stock_quantity) WHERE stock_quantity > 0;
```

### Anti-Pattern 3: Tightly Coupled NestJS Modules

**What people do:** ProductsService directly imports OrdersService, BrandsService imports ProductsService, circular dependencies everywhere.

**Why it's wrong:** Modules become interdependent, can't test in isolation, can't extract to microservices, circular dependency errors, violates single responsibility.

**Do this instead:** Use dependency injection and module exports. If modules need to communicate, use events (EventEmitter) or shared interfaces. Keep modules independent.

```typescript
// ❌ WRONG: Direct service imports across modules
@Injectable()
export class ProductsService {
  constructor(
    private ordersService: OrdersService, // Tight coupling
    private brandsService: BrandsService,
  ) {}
}

// ✅ RIGHT: Modules communicate via exports/imports
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService], // Expose service for other modules
})
export class ProductsModule {}

@Module({
  imports: [ProductsModule], // Import module, not service
  providers: [OrdersService],
})
export class OrdersModule {}
```

### Anti-Pattern 4: Client-Side Pagination Only

**What people do:** Fetch all products from API, paginate in React component using slice().

**Why it's wrong:** Transfers entire dataset to client (slow on large catalogs), wastes bandwidth, poor performance with 10k+ products, doesn't scale, vulnerable to DoS.

**Do this instead:** Implement server-side pagination from day one. API returns page + total count, client requests specific pages.

```typescript
// ❌ WRONG: Client-side pagination
const { data: allProducts } = useQuery({ ... }); // Returns 10,000 products
const currentPageProducts = allProducts.slice(page * 20, (page + 1) * 20);

// ✅ RIGHT: Server-side pagination
const { data } = useQuery({
  queryKey: ['products', { page, limit: 20 }],
  queryFn: async () => {
    const res = await api.get('/products', {
      params: { page, limit: 20 }
    });
    return res.data; // { items: Product[], total: 10000, page: 1, totalPages: 500 }
  },
});
```

### Anti-Pattern 5: Storing Images as Base64 in Database

**What people do:** Convert product images to base64 strings, store directly in products table as TEXT.

**Why it's wrong:** Massive database bloat (base64 is 33% larger than binary), slow queries, wasted bandwidth, poor image optimization, no CDN caching.

**Do this instead:** Store image URLs in product_images table, host actual images on CDN (Cloudinary, Uploadcare, AWS S3 + CloudFront). Database stores only metadata.

```typescript
// ❌ WRONG: Base64 images in database
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  image_base64 TEXT -- "data:image/png;base64,iVBORw0KGgoAAAANS..."
);

// ✅ RIGHT: URL references to CDN-hosted images
CREATE TABLE product_images (
  id BIGINT PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  url TEXT NOT NULL, -- "https://cdn.example.com/products/nike-air-max-1.webp"
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false
);
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **PostgreSQL Database** | TypeORM connection pool | Configure max connections (default: 10), use connection string from env vars, enable query logging in dev |
| **CDN (Future)** | URL references in product_images | Cloudinary/Uploadcare for image hosting, automatic WebP conversion, responsive image sizes |
| **Payment Gateway (Future)** | Stripe/PayPal SDK in checkout | Webhook integration for order status updates, PCI compliance handled by provider |
| **Email Service (Future)** | SendGrid/Mailgun API | Order confirmations, shipping notifications, triggered from OrdersService |
| **Search Engine (Future)** | Elasticsearch for product search | Sync products via event listener, full-text search with autocomplete, faceted filtering |
| **Analytics (Future)** | Google Analytics 4 | Client-side tracking for product views, add-to-cart events, purchases |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Frontend ↔ Backend** | REST API (axios) | JSON payloads, JWT auth via Bearer token, /api prefix for all endpoints |
| **ProductsModule ↔ BrandsModule** | Direct import (ProductsModule imports BrandsModule) | Products need brand data, one-way dependency is acceptable |
| **CartModule ↔ ProductsModule** | Import ProductsService for variant validation | Cart validates variant exists and has stock before adding |
| **OrdersModule ↔ CartModule** | Import CartService to convert cart to order | On checkout, cart items become order items, cart cleared |
| **TanStack Query ↔ Zustand** | Independent (no direct communication) | TanStack Query manages server state, Zustand manages client state, never mix |
| **Pages ↔ Components** | Props drilling (shallow hierarchy) | Pages fetch data, pass to components via props, avoid deep nesting |

## Build Order Implications

Based on dependencies between components, suggested implementation order:

### Phase 1: Foundation (Database + Core Backend)
1. **Database schema** (brands, categories, products, product_variants, product_images)
2. **BrandsModule** (no dependencies)
3. **CategoriesModule** (no dependencies)
4. **ProductsModule** (depends on Brands, Categories)

### Phase 2: Frontend Catalog Display
1. **Frontend API client** (axios setup with interceptors)
2. **TanStack Query setup** (queryClient configuration)
3. **Product types** (TypeScript interfaces matching backend entities)
4. **ProductCard component** (reusable UI component)
5. **ProductsPage** (product listing with filters)
6. **ProductPage** (detail view with variant selection)

### Phase 3: Cart & User Management
1. **CartStore** (Zustand with persistence)
2. **AuthModule** (backend JWT authentication)
3. **AuthStore** (frontend auth state)
4. **CartPage** (display cart items, update quantities)
5. **CartModule** (backend cart for logged-in users, optional)

### Phase 4: Checkout & Orders
1. **OrdersModule** (backend order creation)
2. **CheckoutPage** (address, payment UI)
3. **Order confirmation flow**

### Phase 5: Optimization
1. **Image CDN migration**
2. **Server-side pagination**
3. **Redis caching**
4. **Performance monitoring**

**Why this order?**
- Database first (all layers depend on it)
- Backend modules before frontend (API endpoints must exist to query)
- Brands/Categories before Products (Products reference them)
- Basic product display before cart (users browse before buying)
- Cart before orders (cart converts to orders)
- Optimization last (premature optimization is anti-pattern)

## Sources

### E-Commerce Architecture
- [E-commerce Product Catalog—Design, Best Practice & Strategy](https://www.publitas.com/blog/e-commerce-product-catalog-best-practices/)
- [Ecommerce Architecture in 2026 (Website Best Practices)](https://www.bigcommerce.com/articles/ecommerce-website-development/ecommerce-architecture/)
- [Retail Architecture Best Practices Part 1: Building A MongoDB Product Catalog](https://www.mongodb.com/resources/solutions/industries/retail-reference-architecture-part-1-building-flexible-searchable-low-latency-product)

### NestJS Architecture Patterns
- [Prisma or TypeORM in 2026? The NestJS Data Layer Call](https://medium.com/@Nexumo_/prisma-or-typeorm-in-2026-the-nestjs-data-layer-call-ae47b5cfdd73)
- [Mastering NestJS: Unleashing the Power of Clean Architecture and DDD in E-commerce Development](https://medium.com/nestjs-ninja/mastering-nestjs-unleashing-the-power-of-clean-architecture-and-ddd-in-e-commerce-development-97850131fd87)
- [NestJS in 2026: Why It's Still the Gold Standard for Scalable Backends](https://tyronneratcliff.com/nestjs-for-scaling-backend-systems/)

### React Frontend Patterns
- [Front-End E-commerce Guide for 2026](https://elitex.systems/blog/front-end-e-commerce-guide)
- [React Architecture Patterns and Best Practices for 2026](https://www.bacancytechnology.com/blog/react-architecture-patterns-and-best-practices)
- [Ecommerce Frontend System: Architecture and Technologies](https://www.mgt-commerce.com/blog/ecommerce-frontend-system/)

### Product Variants & Database Design
- [E-Commerce Database Design: Managing Product Variants Using the EAV Model](https://np4652.medium.com/e-commerce-database-design-managing-product-variants-for-multi-vendor-platforms-using-the-eav-01307e63b920)
- [How to create a document schema for product variants and SKUs](https://www.elastic.co/blog/how-to-create-a-document-schema-for-product-variants-and-skus-for-your-ecommerce-search-experience)
- [Database Design for Product Management](https://medium.com/@pesarakex/database-design-for-product-management-9280fd7c66fe)

### State Management
- [State Management in 2026: Redux, Context API, and Modern Patterns](https://www.nucamp.co/blog/state-management-in-2026-redux-context-api-and-modern-patterns)
- [How to Use React Query (TanStack Query) for Server State Management](https://oneuptime.com/blog/post/2026-01-15-react-query-tanstack-server-state/view)
- [TanStack Query](https://tanstack.com/query/latest)

### Image Management
- [E-commerce Product Image Standardization: Best Practices Guide](https://www.musedam.ai/en-US/blog/ecommerce-product-image-standards)
- [Image Management Systems: Key Capabilities and Best Practices](https://cloudinary.com/guides/web-performance/image-management-systems-key-capabilities-and-best-practices)
- [Best Image CDNs in 2026: An Expert's Guide](https://heyserp.com/blog/best-image-cdns/)

### API Design
- [REST API Design: Filtering, Sorting, and Pagination](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/)
- [API Design: Filtering, Searching, Sorting, and Pagination](https://rajasekar.dev/blog/api-design-filtering-searching-sorting-and-pagination)

---
*Architecture research for: Multi-Brand E-Commerce Shoe Store*
*Researched: 2026-02-10*
