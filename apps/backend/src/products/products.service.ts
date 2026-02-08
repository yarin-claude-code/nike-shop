import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { SHOE_CATALOG } from './shoe-catalog';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  private async seedProducts(): Promise<void> {
    const existingCount = await this.productRepository.count();
    if (existingCount > 0) {
      return; // Don't re-seed if products already exist
    }

    const productsToSeed = SHOE_CATALOG.map((product) => ({
      ...product,
      images: product.images.map((img, idx) => ({
        ...img,
        isPrimary: idx === 0,
        sortOrder: idx,
      })),
      variants: product.variants.map((variant) => ({
        ...variant,
        sku: `${product.slug.substring(0, 3).toUpperCase()}-${variant.color.substring(0, 3).toUpperCase()}-${variant.size}`,
        stockQuantity: Math.floor(Math.random() * 20) + 5,
        priceAdjustment: 0,
      })),
    }));

    for (const productData of productsToSeed) {
      const brand = await this.brandsService.findBySlug(productData.brandSlug);
      const category = await this.categoriesService.findBySlug(productData.categorySlug);

      if (!brand || !category) {
        console.error(
          `Skipping product ${productData.name}: brand or category not found`,
        );
        continue;
      }

      const product = this.productRepository.create({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        salePrice: productData.salePrice,
        brandId: brand.id,
        categoryId: category.id,
        isFeatured: productData.isFeatured,
        isActive: true,
      });

      const savedProduct = await this.productRepository.save(product);

      // Create images
      for (const imageData of productData.images) {
        const image = this.imageRepository.create({
          productId: savedProduct.id,
          url: imageData.url,
          altText: imageData.altText,
          isPrimary: imageData.isPrimary,
          sortOrder: imageData.sortOrder,
        });
        await this.imageRepository.save(image);
      }

      // Create variants
      for (const variantData of productData.variants) {
        const variant = this.variantRepository.create({
          productId: savedProduct.id,
          size: variantData.size,
          color: variantData.color,
          sku: variantData.sku,
          stockQuantity: variantData.stockQuantity,
          priceAdjustment: variantData.priceAdjustment,
        });
        await this.variantRepository.save(variant);
      }
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['brand', 'category', 'images', 'variants'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true, isFeatured: true },
      relations: ['brand', 'category', 'images', 'variants'],
      take: 8,
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug, isActive: true },
      relations: ['brand', 'category', 'images', 'variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  async findByCategory(categorySlug: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true, category: { slug: categorySlug } },
      relations: ['brand', 'category', 'images', 'variants'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByBrand(brandSlug: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true, brand: { slug: brandSlug } },
      relations: ['brand', 'category', 'images', 'variants'],
      order: { createdAt: 'DESC' },
    });
  }
}
