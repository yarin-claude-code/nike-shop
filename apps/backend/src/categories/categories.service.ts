import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    await this.seedCategories();
  }

  private async seedCategories(): Promise<void> {
    const categoriesToSeed = [
      { name: 'Running', slug: 'running' },
      { name: 'Basketball', slug: 'basketball' },
      { name: 'Lifestyle', slug: 'lifestyle' },
      { name: 'Training', slug: 'training' },
      { name: 'Skateboarding', slug: 'skateboarding' },
      { name: 'Football', slug: 'football' },
    ];

    for (const categoryData of categoriesToSeed) {
      const existing = await this.categoryRepository.findOne({
        where: { name: categoryData.name },
      });

      if (!existing) {
        await this.categoryRepository.insert(categoryData);
      }
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { name: Not(IsNull()) },
      order: { name: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { slug },
    });
  }
}
