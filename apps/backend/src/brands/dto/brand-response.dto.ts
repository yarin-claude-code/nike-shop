import { Brand } from '../entities/brand.entity';
import { Product } from '../../products/entities/product.entity';

export interface BrandWithProductsResponse extends Brand {
  products: Product[];
}
