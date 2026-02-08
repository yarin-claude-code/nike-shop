# Blueprint: NestJS Backend API

## Goal

Create the NestJS backend with all required modules, controllers, services, and entities for Tony's Shoe Store.

## Inputs Required

- database_schema: from `02-database-schema.md`
- nest_project: initialized NestJS project

## Skills Reference

- `senior-fullstack-skill.md` - Architecture patterns, REST API design

## Module Structure

```
backend/src/
├── auth/           # Authentication (JWT)
├── users/          # User management
├── products/       # Products/Shoes CRUD
├── brands/         # Brands management
├── categories/     # Categories management
├── cart/           # Shopping cart
├── orders/         # Order management
├── common/         # Shared utilities, guards, decorators
└── config/         # Configuration
```

## Steps

### 1. Generate NestJS Modules

```bash
cd backend
nest g module auth
nest g module users
nest g module products
nest g module brands
nest g module categories
nest g module cart
nest g module orders
nest g module common
```

### 2. Create Base Entity

`src/common/entities/base.entity.ts`:
```typescript
import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
```

### 3. Create Product Entity

`src/products/entities/product.entity.ts`:
```typescript
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ name: 'product_id' })
  declare id: number;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, name: 'sale_price' })
  salePrice: number;

  @Column({ type: 'text', nullable: true, name: 'model_3d_url' })
  model3dUrl: string;

  @Column({ type: 'boolean', default: false, name: 'is_featured' })
  isFeatured: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => ProductVariant, variant => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, image => image.product)
  images: ProductImage[];
}
```

### 4. Create Products Service

`src/products/products.service.ts`:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(options?: { featured?: boolean; categoryId?: number }): Promise<Product[]> {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isActive = :isActive', { isActive: true });

    if (options?.featured) {
      query.andWhere('product.isFeatured = :isFeatured', { isFeatured: true });
    }

    if (options?.categoryId) {
      query.andWhere('product.category.id = :categoryId', { categoryId: options.categoryId });
    }

    return query.orderBy('product.createdAt', 'DESC').getMany();
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug, isActive: true },
      relations: ['brand', 'category', 'variants', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  async findFeatured(): Promise<Product[]> {
    return this.findAll({ featured: true });
  }
}
```

### 5. Create Products Controller

`src/products/products.controller.ts`:
```typescript
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('featured') featured?: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<Product[]> {
    return this.productsService.findAll({
      featured: featured === 'true',
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
    });
  }

  @Get('featured')
  async findFeatured(): Promise<Product[]> {
    return this.productsService.findFeatured();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.findBySlug(slug);
  }
}
```

### 6. Create Auth Module with JWT

`src/auth/auth.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### 7. Configure CORS in main.ts

`src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173'], // Vite dev server
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| GET | /api/products/featured | Get featured products |
| GET | /api/products/:slug | Get product by slug |
| GET | /api/brands | List all brands |
| GET | /api/categories | List all categories |
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/cart | Get user's cart |
| POST | /api/cart | Add item to cart |
| DELETE | /api/cart/:itemId | Remove from cart |
| POST | /api/orders | Create order |
| GET | /api/orders | Get user's orders |

## Expected Output

- All NestJS modules created
- TypeORM entities matching database schema
- RESTful API endpoints
- JWT authentication

## Edge Cases

- **Invalid slug**: Return 404 NotFoundException
- **Out of stock**: Check stock before adding to cart
- **Concurrent orders**: Use database transactions

## Known Issues

- **N+1 queries**: Use `relations` or QueryBuilder with joins
- **Large payloads**: Implement pagination for product lists
