import { Controller, Get, Param } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string): Promise<Brand> {
    return this.brandsService.findBySlugWithProducts(slug);
  }
}
