import { Product } from '../entities/product.entity';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    perPage: number;
  };
}

export type PaginatedProductResponse = PaginatedResponse<Product>;
