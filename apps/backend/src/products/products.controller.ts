import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { QueryProductsDto } from './dto/query-products.dto';
import { PaginatedResponse } from './dto/product-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: QueryProductsDto): Promise<PaginatedResponse<Product>> {
    return this.productsService.findAllWithFilters(query);
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
