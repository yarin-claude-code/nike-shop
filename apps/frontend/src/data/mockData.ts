import { Product, Brand, Category } from '../types/product';

// Mock Brands
export const mockBrands: Brand[] = [
  { id: 1, name: 'Nike', slug: 'nike', logoUrl: null },
  { id: 2, name: 'Adidas', slug: 'adidas', logoUrl: null },
  { id: 3, name: 'Jordan', slug: 'jordan', logoUrl: null },
  { id: 4, name: 'New Balance', slug: 'new-balance', logoUrl: null },
  { id: 5, name: 'Puma', slug: 'puma', logoUrl: null },
  { id: 6, name: 'Reebok', slug: 'reebok', logoUrl: null },
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: 1, name: 'Running', slug: 'running', imageUrl: null },
  { id: 2, name: 'Basketball', slug: 'basketball', imageUrl: null },
  { id: 3, name: 'Lifestyle', slug: 'lifestyle', imageUrl: null },
  { id: 4, name: 'Training', slug: 'training', imageUrl: null },
  { id: 5, name: 'Skateboarding', slug: 'skateboarding', imageUrl: null },
  { id: 6, name: 'Football', slug: 'football', imageUrl: null },
];

// High-quality shoe images from Unsplash (free to use)
// Using verified working image URLs
const shoeImages = {
  // Nike
  nikeRed: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  nikeAirMax: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
  nikeDunk: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80',
  // Adidas
  adidasUltraboost: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
  adidasForum: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
  // Jordan
  jordan1: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80',
  // New Balance
  newBalance: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',
  // Puma
  pumaRSX: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
  // Reebok
  reebokClassic: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
  // Generic
  whiteSneaker: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
  blackSneaker: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80',
};

const now = new Date().toISOString();

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Air Max 90',
    slug: 'air-max-90',
    description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU accents. Fresh colors give a modern look while Max Air cushioning adds comfort to your journey.',
    price: 130.00,
    salePrice: null,
    brand: mockBrands[0],
    category: mockCategories[2],
    images: [
      { id: 1, url: shoeImages.nikeRed, altText: 'Air Max 90 Red', isPrimary: true, sortOrder: 0 },
      { id: 2, url: shoeImages.nikeAirMax, altText: 'Air Max 90 Side', isPrimary: false, sortOrder: 1 },
    ],
    variants: [
      { id: 1, size: '8', color: 'Red', sku: 'AM90-RED-8', stockQuantity: 10, priceAdjustment: 0 },
      { id: 2, size: '9', color: 'Red', sku: 'AM90-RED-9', stockQuantity: 15, priceAdjustment: 0 },
      { id: 3, size: '10', color: 'Red', sku: 'AM90-RED-10', stockQuantity: 8, priceAdjustment: 0 },
      { id: 4, size: '8', color: 'Black', sku: 'AM90-BLK-8', stockQuantity: 12, priceAdjustment: 0 },
      { id: 5, size: '9', color: 'Black', sku: 'AM90-BLK-9', stockQuantity: 20, priceAdjustment: 0 },
      { id: 6, size: '10', color: 'Black', sku: 'AM90-BLK-10', stockQuantity: 5, priceAdjustment: 0 },
    ],

    isFeatured: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: 'Ultraboost 22',
    slug: 'ultraboost-22',
    description: 'These running shoes deliver incredible energy return with every stride. The BOOST midsole and Linear Energy Push system work together to propel you forward.',
    price: 190.00,
    salePrice: 159.99,
    brand: mockBrands[1],
    category: mockCategories[0],
    images: [
      { id: 3, url: shoeImages.adidasUltraboost, altText: 'Ultraboost 22', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 7, size: '8', color: 'Black', sku: 'UB22-BLK-8', stockQuantity: 8, priceAdjustment: 0 },
      { id: 8, size: '9', color: 'Black', sku: 'UB22-BLK-9', stockQuantity: 12, priceAdjustment: 0 },
      { id: 9, size: '10', color: 'Black', sku: 'UB22-BLK-10', stockQuantity: 6, priceAdjustment: 0 },
      { id: 10, size: '11', color: 'Black', sku: 'UB22-BLK-11', stockQuantity: 3, priceAdjustment: 0 },
    ],

    isFeatured: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: 'Air Jordan 1 Retro High OG',
    slug: 'air-jordan-1-retro-high',
    description: 'The Air Jordan 1 Retro High remakes the classic sneaker with premium materials and crisp details. Full-length Nike Air unit and padded collar deliver all-day comfort.',
    price: 180.00,
    salePrice: null,
    brand: mockBrands[2],
    category: mockCategories[2],
    images: [
      { id: 4, url: shoeImages.jordan1, altText: 'Jordan 1 Retro', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 11, size: '8', color: 'Red', sku: 'AJ1-RED-8', stockQuantity: 5, priceAdjustment: 0 },
      { id: 12, size: '9', color: 'Red', sku: 'AJ1-RED-9', stockQuantity: 7, priceAdjustment: 0 },
      { id: 13, size: '10', color: 'Red', sku: 'AJ1-RED-10', stockQuantity: 4, priceAdjustment: 0 },
      { id: 14, size: '8', color: 'Blue', sku: 'AJ1-BLU-8', stockQuantity: 6, priceAdjustment: 0 },
      { id: 15, size: '9', color: 'Blue', sku: 'AJ1-BLU-9', stockQuantity: 8, priceAdjustment: 0 },
    ],

    isFeatured: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    name: 'Fresh Foam 1080v12',
    slug: 'fresh-foam-1080v12',
    description: 'The most cushioned shoe in the Fresh Foam collection. Designed to deliver ultra-plush comfort for long runs and daily training.',
    price: 165.00,
    salePrice: 139.99,
    brand: mockBrands[3],
    category: mockCategories[0],
    images: [
      { id: 5, url: shoeImages.newBalance, altText: 'Fresh Foam 1080', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 16, size: '8', color: 'White', sku: 'FF1080-WHT-8', stockQuantity: 10, priceAdjustment: 0 },
      { id: 17, size: '9', color: 'White', sku: 'FF1080-WHT-9', stockQuantity: 15, priceAdjustment: 0 },
      { id: 18, size: '10', color: 'White', sku: 'FF1080-WHT-10', stockQuantity: 8, priceAdjustment: 0 },
      { id: 19, size: '11', color: 'White', sku: 'FF1080-WHT-11', stockQuantity: 4, priceAdjustment: 0 },
    ],

    isFeatured: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    name: 'RS-X³ Puzzle',
    slug: 'rs-x3-puzzle',
    description: 'Bold and chunky, the RS-X³ Puzzle takes the classic RS design and amplifies it with exaggerated proportions and vibrant color blocking.',
    price: 110.00,
    salePrice: null,
    brand: mockBrands[4],
    category: mockCategories[2],
    images: [
      { id: 6, url: shoeImages.pumaRSX, altText: 'RS-X3 Puzzle', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 20, size: '8', color: 'Orange', sku: 'RSX3-ORG-8', stockQuantity: 12, priceAdjustment: 0 },
      { id: 21, size: '9', color: 'Orange', sku: 'RSX3-ORG-9', stockQuantity: 18, priceAdjustment: 0 },
      { id: 22, size: '10', color: 'Orange', sku: 'RSX3-ORG-10', stockQuantity: 10, priceAdjustment: 0 },
    ],

    isFeatured: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    name: 'Club C 85 Vintage',
    slug: 'club-c-85-vintage',
    description: 'Originally designed for the tennis court, the Club C 85 has become a streetwear icon. Clean lines and vintage styling make it endlessly versatile.',
    price: 85.00,
    salePrice: 69.99,
    brand: mockBrands[5],
    category: mockCategories[2],
    images: [
      { id: 7, url: shoeImages.reebokClassic, altText: 'Club C 85 Vintage', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 23, size: '8', color: 'White', sku: 'CC85-WHT-8', stockQuantity: 20, priceAdjustment: 0 },
      { id: 24, size: '9', color: 'White', sku: 'CC85-WHT-9', stockQuantity: 25, priceAdjustment: 0 },
      { id: 25, size: '10', color: 'White', sku: 'CC85-WHT-10', stockQuantity: 15, priceAdjustment: 0 },
      { id: 26, size: '11', color: 'White', sku: 'CC85-WHT-11', stockQuantity: 8, priceAdjustment: 0 },
    ],

    isFeatured: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 7,
    name: 'Dunk Low Retro',
    slug: 'dunk-low-retro',
    description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors.',
    price: 110.00,
    salePrice: null,
    brand: mockBrands[0],
    category: mockCategories[4],
    images: [
      { id: 8, url: shoeImages.nikeDunk, altText: 'Nike Dunk Low', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 27, size: '8', color: 'Black', sku: 'DNK-BLK-8', stockQuantity: 8, priceAdjustment: 0 },
      { id: 28, size: '9', color: 'Black', sku: 'DNK-BLK-9', stockQuantity: 12, priceAdjustment: 0 },
      { id: 29, size: '10', color: 'Black', sku: 'DNK-BLK-10', stockQuantity: 6, priceAdjustment: 0 },
    ],

    isFeatured: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 8,
    name: 'Forum Low',
    slug: 'forum-low',
    description: 'Born on the basketball court in 1984, the adidas Forum became a streetwear legend. This low-cut version delivers the same iconic style.',
    price: 100.00,
    salePrice: 79.99,
    brand: mockBrands[1],
    category: mockCategories[2],
    images: [
      { id: 9, url: shoeImages.adidasForum, altText: 'Adidas Forum Low', isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: 30, size: '8', color: 'White', sku: 'FORUM-WHT-8', stockQuantity: 14, priceAdjustment: 0 },
      { id: 31, size: '9', color: 'White', sku: 'FORUM-WHT-9', stockQuantity: 20, priceAdjustment: 0 },
      { id: 32, size: '10', color: 'White', sku: 'FORUM-WHT-10', stockQuantity: 10, priceAdjustment: 0 },
    ],

    isFeatured: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

// Helper to get featured products
export function getFeaturedProducts(): Product[] {
  return mockProducts.filter((p) => p.isFeatured);
}

// Helper to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

// Helper to get products by category
export function getProductsByCategory(categorySlug: string): Product[] {
  return mockProducts.filter((p) => p.category.slug === categorySlug);
}

// Helper to get products by brand
export function getProductsByBrand(brandSlug: string): Product[] {
  return mockProducts.filter((p) => p.brand.slug === brandSlug);
}

// Helper to get sale products
export function getSaleProducts(): Product[] {
  return mockProducts.filter((p) => p.salePrice !== null);
}
