import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService implements OnModuleInit {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async onModuleInit() {
    await this.seedBrands();
  }

  private async seedBrands(): Promise<void> {
    const brandsToSeed = [
      { name: 'Nike', slug: 'nike' },
      { name: 'Adidas', slug: 'adidas' },
      { name: 'Jordan', slug: 'jordan' },
      { name: 'New Balance', slug: 'new-balance' },
      { name: 'Puma', slug: 'puma' },
      { name: 'Reebok', slug: 'reebok' },
      { name: 'Yeezy', slug: 'yeezy' },
      { name: 'On Cloud', slug: 'on-cloud' },
      { name: 'Salomon', slug: 'salomon' },
      { name: 'Vans', slug: 'vans' },
      { name: 'Converse', slug: 'converse' },
      { name: 'ASICS', slug: 'asics' },
      { name: 'New Balance', slug: 'new-balance-2' },
      { name: 'Saucony', slug: 'saucony' },
      { name: 'Brooks', slug: 'brooks' },
    ];

    for (const brandData of brandsToSeed) {
      const existing = await this.brandRepository.findOne({
        where: { name: brandData.name },
      });

      if (!existing) {
        await this.brandRepository.insert(brandData);
      } else if (!existing.slug) {
        // Update existing brands with null slugs
        await this.brandRepository.update(existing.id, { slug: brandData.slug });
      }
    }
  }

  async findAll(): Promise<Brand[]> {
    return this.brandRepository.find({
      where: { name: Not(IsNull()) },
      order: { name: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    return this.brandRepository.findOne({
      where: { slug },
    });
  }
}
