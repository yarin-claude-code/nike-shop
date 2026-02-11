import { setSeederFactory } from 'typeorm-extension';
import { Product } from '../../products/entities/product.entity';
import { faker } from '@faker-js/faker';

export const ProductFactory = setSeederFactory(Product, () => {
  const product = new Product();

  // Real shoe model names
  const shoeModels = [
    'Air Max 90',
    'Air Force 1',
    'React Infinity Run',
    'Pegasus 40',
    'Ultraboost 22',
    'NMD_R1',
    'Superstar',
    'Forum Low',
    'RS-X3',
    'Suede Classic',
    'Future Rider',
    'Cloudstratus',
    'Cloudswift',
    'Cloudflow',
  ];

  product.name = faker.helpers.arrayElement(shoeModels);
  product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Realistic shoe descriptions
  const features = [
    'premium mesh upper',
    'responsive cushioning',
    'durable rubber outsole',
    'breathable construction',
    'lightweight design',
    'supportive fit',
    'enhanced traction',
    'modern style',
  ];

  product.description = `Premium athletic footwear featuring ${faker.helpers.arrayElement(features)}, ${faker.helpers.arrayElement(features)}, and ${faker.helpers.arrayElement(features)}. Perfect for both performance and everyday wear.`;

  // Price range: $80-$250 (stored as string for NUMERIC type)
  const basePrice = faker.number.int({ min: 80, max: 250 });
  product.price = basePrice;

  // 20% chance of sale price (10-30% discount)
  if (faker.number.int({ min: 1, max: 100 }) <= 20) {
    const discount = faker.number.float({ min: 0.1, max: 0.3, fractionDigits: 2 });
    product.salePrice = parseFloat((basePrice * (1 - discount)).toFixed(2));
  } else {
    product.salePrice = null;
  }

  // 30% chance of isFeatured
  product.isFeatured = faker.number.int({ min: 1, max: 100 }) <= 30;
  product.isActive = true;

  return product;
});
