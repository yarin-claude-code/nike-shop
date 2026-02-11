import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandRepository.find({ order: { name: 'ASC' } });
  }

  async findBySlugWithProducts(slug: string): Promise<Brand> {
    const brand = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.products', 'product', 'product.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('brand.slug = :slug', { slug })
      .getOne();

    if (!brand) {
      throw new NotFoundException(`Brand with slug "${slug}" not found`);
    }

    return brand;
  }
}
