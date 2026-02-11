import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryProductsDto } from './dto/query-products.dto';
import { PaginatedResponse } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAllWithFilters(query: QueryProductsDto): Promise<PaginatedResponse<Product>> {
    const qb = this.productRepository.createQueryBuilder('product');

    // Join relations
    qb.leftJoinAndSelect('product.brand', 'brand');
    qb.leftJoinAndSelect('product.category', 'category');
    qb.leftJoinAndSelect('product.images', 'images');
    qb.leftJoinAndSelect('product.variants', 'variants');

    // Base filter
    qb.where('product.isActive = :isActive', { isActive: true });

    // Search filter
    if (query.search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR brand.name ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    // Brand filter
    if (query.brands && query.brands.length > 0) {
      qb.andWhere('brand.slug IN (:...brands)', { brands: query.brands });
    }

    // Price filters
    if (query.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }
    if (query.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    // Variant filters (sizes/colors) - use subquery to avoid duplicates
    if ((query.sizes && query.sizes.length > 0) || (query.colors && query.colors.length > 0)) {
      const subQuery = this.productRepository
        .createQueryBuilder('pv_product')
        .select('pv_product.id')
        .innerJoin('pv_product.variants', 'pv');

      if (query.sizes && query.sizes.length > 0) {
        subQuery.andWhere('pv.size IN (:...sizes)', { sizes: query.sizes });
      }
      if (query.colors && query.colors.length > 0) {
        subQuery.andWhere('pv.color IN (:...colors)', { colors: query.colors });
      }

      qb.andWhere(`product.id IN (${subQuery.getQuery()})`);
      qb.setParameters(subQuery.getParameters());
    }

    // Order
    qb.orderBy('product.createdAt', 'DESC');

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    qb.skip((page - 1) * limit).take(limit);

    // Execute query
    const [data, total] = await qb.getManyAndCount();

    // Build response
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        perPage: limit,
      },
    };
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
