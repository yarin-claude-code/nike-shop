import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Product } from '../../products/entities/product.entity';
import { ProductImage } from '../../products/entities/product-image.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';

interface ProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  isFeatured: boolean;
  brandSlug: string;
  categorySlug: string;
  images: Array<{ url: string; altText: string; isPrimary: boolean; sortOrder: number }>;
  variants: Array<{ size: string; color: string; skuSuffix: string; stock: number }>;
}

export class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);
    const imageRepository = dataSource.getRepository(ProductImage);
    const variantRepository = dataSource.getRepository(ProductVariant);
    const brandRepository = dataSource.getRepository(Brand);
    const categoryRepository = dataSource.getRepository(Category);

    // Check if products already exist (idempotent)
    const existingCount = await productRepository.count();
    if (existingCount > 0) {
      console.log('Products already seeded, skipping...');
      return;
    }

    const productsData: ProductData[] = [
      // Nike Products (4)
      {
        name: 'Nike Air Max 90',
        slug: 'nike-air-max-90',
        description: 'Iconic Air Max cushioning with premium leather and mesh upper. Features visible Max Air unit for all-day comfort and timeless style.',
        price: 130,
        salePrice: null,
        isFeatured: true,
        brandSlug: 'nike',
        categorySlug: 'lifestyle',
        images: [
          { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', altText: 'Nike Air Max 90 - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', altText: 'Nike Air Max 90 - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80', altText: 'Nike Air Max 90 - Detail', isPrimary: false, sortOrder: 2 },
          { url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80', altText: 'Nike Air Max 90 - Back View', isPrimary: false, sortOrder: 3 },
        ],
        variants: [
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 15 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 20 },
          { size: '10', color: 'Black', skuSuffix: 'BLK-10', stock: 18 },
          { size: '11', color: 'Black', skuSuffix: 'BLK-11', stock: 12 },
          { size: '8', color: 'White', skuSuffix: 'WHT-8', stock: 10 },
          { size: '9', color: 'White', skuSuffix: 'WHT-9', stock: 25 },
          { size: '10', color: 'White', skuSuffix: 'WHT-10', stock: 22 },
          { size: '11', color: 'White', skuSuffix: 'WHT-11', stock: 8 },
        ],
      },
      {
        name: 'Nike Air Force 1',
        slug: 'nike-air-force-1',
        description: 'Classic basketball heritage meets street style. Premium leather upper with Air-Sole cushioning for legendary comfort and durability.',
        price: 110,
        salePrice: 95,
        isFeatured: true,
        brandSlug: 'nike',
        categorySlug: 'lifestyle',
        images: [
          { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', altText: 'Nike Air Force 1 - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80', altText: 'Nike Air Force 1 - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80', altText: 'Nike Air Force 1 - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'White', skuSuffix: 'WHT-8', stock: 20 },
          { size: '9', color: 'White', skuSuffix: 'WHT-9', stock: 25 },
          { size: '10', color: 'White', skuSuffix: 'WHT-10', stock: 18 },
          { size: '11', color: 'White', skuSuffix: 'WHT-11', stock: 15 },
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 12 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 16 },
        ],
      },
      {
        name: 'Nike React Infinity Run',
        slug: 'nike-react-infinity-run',
        description: 'Designed to help reduce injury with soft, smooth Nike React foam. Wide shape provides stability for long runs and everyday training.',
        price: 160,
        salePrice: null,
        isFeatured: false,
        brandSlug: 'nike',
        categorySlug: 'running',
        images: [
          { url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80', altText: 'Nike React Infinity Run - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80', altText: 'Nike React Infinity Run - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', altText: 'Nike React Infinity Run - Detail', isPrimary: false, sortOrder: 2 },
          { url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80', altText: 'Nike React Infinity Run - Back View', isPrimary: false, sortOrder: 3 },
        ],
        variants: [
          { size: '8', color: 'Blue', skuSuffix: 'BLU-8', stock: 10 },
          { size: '9', color: 'Blue', skuSuffix: 'BLU-9', stock: 14 },
          { size: '10', color: 'Blue', skuSuffix: 'BLU-10', stock: 12 },
          { size: '11', color: 'Blue', skuSuffix: 'BLU-11', stock: 8 },
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 15 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 20 },
        ],
      },
      {
        name: 'Nike Pegasus 40',
        slug: 'nike-pegasus-40',
        description: 'Responsive cushioning in a lightweight package. Updated with ReactX foam and wider forefoot for more room and better support.',
        price: 140,
        salePrice: null,
        isFeatured: false,
        brandSlug: 'nike',
        categorySlug: 'running',
        images: [
          { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', altText: 'Nike Pegasus 40 - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&q=80', altText: 'Nike Pegasus 40 - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80', altText: 'Nike Pegasus 40 - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'Gray', skuSuffix: 'GRY-8', stock: 12 },
          { size: '9', color: 'Gray', skuSuffix: 'GRY-9', stock: 18 },
          { size: '10', color: 'Gray', skuSuffix: 'GRY-10', stock: 15 },
          { size: '11', color: 'Gray', skuSuffix: 'GRY-11', stock: 10 },
          { size: '8', color: 'Blue', skuSuffix: 'BLU-8', stock: 14 },
          { size: '9', color: 'Blue', skuSuffix: 'BLU-9', stock: 16 },
        ],
      },

      // Adidas Products (4)
      {
        name: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22',
        description: 'Energy-returning Boost cushioning with Primeknit upper. Designed for comfort and performance in every stride.',
        price: 190,
        salePrice: 152,
        isFeatured: true,
        brandSlug: 'adidas',
        categorySlug: 'running',
        images: [
          { url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80', altText: 'Adidas Ultraboost 22 - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80', altText: 'Adidas Ultraboost 22 - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80', altText: 'Adidas Ultraboost 22 - Detail', isPrimary: false, sortOrder: 2 },
          { url: 'https://images.unsplash.com/photo-1581101767113-1677fc2beaa8?w=800&q=80', altText: 'Adidas Ultraboost 22 - Back View', isPrimary: false, sortOrder: 3 },
        ],
        variants: [
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 18 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 22 },
          { size: '10', color: 'Black', skuSuffix: 'BLK-10', stock: 20 },
          { size: '11', color: 'Black', skuSuffix: 'BLK-11', stock: 14 },
          { size: '8', color: 'White', skuSuffix: 'WHT-8', stock: 16 },
          { size: '9', color: 'White', skuSuffix: 'WHT-9', stock: 25 },
        ],
      },
      {
        name: 'Adidas NMD_R1',
        slug: 'adidas-nmd-r1',
        description: 'Modern street style with Boost technology. Primeknit upper with signature heel and midsole plugs for iconic look.',
        price: 140,
        salePrice: null,
        isFeatured: false,
        brandSlug: 'adidas',
        categorySlug: 'lifestyle',
        images: [
          { url: 'https://images.unsplash.com/photo-1584735175097-719d848f8bb8?w=800&q=80', altText: 'Adidas NMD_R1 - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1617606002779-51d866b88f1a?w=800&q=80', altText: 'Adidas NMD_R1 - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80', altText: 'Adidas NMD_R1 - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 15 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 20 },
          { size: '10', color: 'Black', skuSuffix: 'BLK-10', stock: 18 },
          { size: '11', color: 'Black', skuSuffix: 'BLK-11', stock: 12 },
          { size: '8', color: 'Blue', skuSuffix: 'BLU-8', stock: 10 },
          { size: '9', color: 'Blue', skuSuffix: 'BLU-9', stock: 14 },
        ],
      },
      {
        name: 'Adidas Superstar',
        slug: 'adidas-superstar',
        description: 'Classic shell toe design with premium leather. An icon of sport and street culture since 1970.',
        price: 90,
        salePrice: null,
        isFeatured: false,
        brandSlug: 'adidas',
        categorySlug: 'lifestyle',
        images: [
          { url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80', altText: 'Adidas Superstar - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1622266095748-b5f502b7c5d7?w=800&q=80', altText: 'Adidas Superstar - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1609252925148-c5d676bc1d2c?w=800&q=80', altText: 'Adidas Superstar - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'White', skuSuffix: 'WHT-8', stock: 20 },
          { size: '9', color: 'White', skuSuffix: 'WHT-9', stock: 25 },
          { size: '10', color: 'White', skuSuffix: 'WHT-10', stock: 22 },
          { size: '11', color: 'White', skuSuffix: 'WHT-11', stock: 18 },
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 15 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 20 },
        ],
      },
      {
        name: 'Adidas Forum Low',
        slug: 'adidas-forum-low',
        description: 'Basketball heritage meets modern street style. Premium leather with iconic ankle strap and trefoil logo.',
        price: 100,
        salePrice: null,
        isFeatured: false,
        brandSlug: 'adidas',
        categorySlug: 'basketball',
        images: [
          { url: 'https://images.unsplash.com/photo-1603808033587-f3a45c4e8af6?w=800&q=80', altText: 'Adidas Forum Low - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1621665421552-b5c6f5d6c3e4?w=800&q=80', altText: 'Adidas Forum Low - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1590319041612-75f492c22528?w=800&q=80', altText: 'Adidas Forum Low - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'White', skuSuffix: 'WHT-8', stock: 14 },
          { size: '9', color: 'White', skuSuffix: 'WHT-9', stock: 18 },
          { size: '10', color: 'White', skuSuffix: 'WHT-10', stock: 16 },
          { size: '11', color: 'White', skuSuffix: 'WHT-11', stock: 12 },
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 10 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 15 },
        ],
      },

      // Puma Products (3)
      {
        name: 'Puma RS-X3',
        slug: 'puma-rs-x3',
        description: 'Bold retro design with modern comfort. RS cushioning system and mesh/synthetic upper for style and performance.',
        price: 110,
        salePrice: 88,
        isFeatured: false,
        brandSlug: 'puma',
        categorySlug: 'lifestyle',
        images: [
          { url: 'https://images.unsplash.com/photo-1543508282-7823578d0494?w=800&q=80', altText: 'Puma RS-X3 - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80', altText: 'Puma RS-X3 - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80', altText: 'Puma RS-X3 - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'Multi', skuSuffix: 'MLT-8', stock: 12 },
          { size: '9', color: 'Multi', skuSuffix: 'MLT-9', stock: 16 },
          { size: '10', color: 'Multi', skuSuffix: 'MLT-10', stock: 14 },
          { size: '11', color: 'Multi', skuSuffix: 'MLT-11', stock: 10 },
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 15 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 18 },
        ],
      },
      {
        name: 'Puma Suede Classic',
        slug: 'puma-suede-classic',
        description: 'Timeless suede upper with classic formstrip. A cultural icon since 1968, perfect for everyday wear.',
        price: 80,
        salePrice: null,
        isFeatured: false,
        brandSlug: 'puma',
        categorySlug: 'lifestyle',
        images: [
          { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', altText: 'Puma Suede Classic - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1508523793298-3fef8e825bad?w=800&q=80', altText: 'Puma Suede Classic - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1582897177862-a0d3c3e4a1c0?w=800&q=80', altText: 'Puma Suede Classic - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'Navy', skuSuffix: 'NVY-8', stock: 18 },
          { size: '9', color: 'Navy', skuSuffix: 'NVY-9', stock: 20 },
          { size: '10', color: 'Navy', skuSuffix: 'NVY-10', stock: 15 },
          { size: '11', color: 'Navy', skuSuffix: 'NVY-11', stock: 12 },
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 16 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 22 },
        ],
      },
      {
        name: 'Puma Future Rider',
        slug: 'puma-future-rider',
        description: 'Contemporary running silhouette with retro inspiration. Lightweight construction with Federbein cushioning.',
        price: 90,
        salePrice: null,
        isFeatured: false,
        brandSlug: 'puma',
        categorySlug: 'running',
        images: [
          { url: 'https://images.unsplash.com/photo-1622643065534-8f889c00ad0d?w=800&q=80', altText: 'Puma Future Rider - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1628253747716-c5b0c1f54f9d?w=800&q=80', altText: 'Puma Future Rider - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1586525198428-225f6f12cfa5?w=800&q=80', altText: 'Puma Future Rider - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'White', skuSuffix: 'WHT-8', stock: 14 },
          { size: '9', color: 'White', skuSuffix: 'WHT-9', stock: 18 },
          { size: '10', color: 'White', skuSuffix: 'WHT-10', stock: 16 },
          { size: '11', color: 'White', skuSuffix: 'WHT-11', stock: 12 },
          { size: '8', color: 'Gray', skuSuffix: 'GRY-8', stock: 10 },
          { size: '9', color: 'Gray', skuSuffix: 'GRY-9', stock: 15 },
        ],
      },

      // On Cloud Products (3)
      {
        name: 'On Cloudstratus',
        slug: 'on-cloudstratus',
        description: 'Maximum cushioning with double-layer CloudTec. Designed for long-distance comfort with Helion superfoam.',
        price: 170,
        salePrice: null,
        isFeatured: true,
        brandSlug: 'on-cloud',
        categorySlug: 'running',
        images: [
          { url: 'https://images.unsplash.com/photo-1527010154944-f1705a835943?w=800&q=80', altText: 'On Cloudstratus - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80', altText: 'On Cloudstratus - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&q=80', altText: 'On Cloudstratus - Detail', isPrimary: false, sortOrder: 2 },
          { url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80', altText: 'On Cloudstratus - Back View', isPrimary: false, sortOrder: 3 },
        ],
        variants: [
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 10 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 14 },
          { size: '10', color: 'Black', skuSuffix: 'BLK-10', stock: 12 },
          { size: '11', color: 'Black', skuSuffix: 'BLK-11', stock: 8 },
          { size: '8', color: 'White', skuSuffix: 'WHT-8', stock: 12 },
          { size: '9', color: 'White', skuSuffix: 'WHT-9', stock: 16 },
        ],
      },
      {
        name: 'On Cloudswift',
        slug: 'on-cloudswift',
        description: 'Urban running shoe with responsive cushioning. Engineered mesh upper and Helion foam for city streets.',
        price: 150,
        salePrice: null,
        isFeatured: false,
        brandSlug: 'on-cloud',
        categorySlug: 'running',
        images: [
          { url: 'https://images.unsplash.com/photo-1626379801255-5b4b7f8e0f6b?w=800&q=80', altText: 'On Cloudswift - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80', altText: 'On Cloudswift - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=800&q=80', altText: 'On Cloudswift - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'Gray', skuSuffix: 'GRY-8', stock: 15 },
          { size: '9', color: 'Gray', skuSuffix: 'GRY-9', stock: 18 },
          { size: '10', color: 'Gray', skuSuffix: 'GRY-10', stock: 14 },
          { size: '11', color: 'Gray', skuSuffix: 'GRY-11', stock: 10 },
          { size: '8', color: 'Blue', skuSuffix: 'BLU-8', stock: 12 },
          { size: '9', color: 'Blue', skuSuffix: 'BLU-9', stock: 16 },
        ],
      },
      {
        name: 'On Cloudflow',
        slug: 'on-cloudflow',
        description: 'Lightweight performance running shoe. Computer-optimized CloudTec for faster runs and explosive takeoffs.',
        price: 140,
        salePrice: 112,
        isFeatured: false,
        brandSlug: 'on-cloud',
        categorySlug: 'running',
        images: [
          { url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80', altText: 'On Cloudflow - Side View', isPrimary: true, sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=800&q=80', altText: 'On Cloudflow - Front View', isPrimary: false, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1542219550-37153d387c27?w=800&q=80', altText: 'On Cloudflow - Detail', isPrimary: false, sortOrder: 2 },
        ],
        variants: [
          { size: '8', color: 'White', skuSuffix: 'WHT-8', stock: 14 },
          { size: '9', color: 'White', skuSuffix: 'WHT-9', stock: 18 },
          { size: '10', color: 'White', skuSuffix: 'WHT-10', stock: 15 },
          { size: '11', color: 'White', skuSuffix: 'WHT-11', stock: 11 },
          { size: '8', color: 'Black', skuSuffix: 'BLK-8', stock: 12 },
          { size: '9', color: 'Black', skuSuffix: 'BLK-9', stock: 16 },
        ],
      },
    ];

    // Process each product
    for (const productData of productsData) {
      // Look up brand and category
      const brand = await brandRepository.findOne({ where: { slug: productData.brandSlug } });
      const category = await categoryRepository.findOne({ where: { slug: productData.categorySlug } });

      if (!brand || !category) {
        console.error(`Skipping ${productData.name}: brand or category not found`);
        continue;
      }

      // Create product with explicit FK assignments
      const product = new Product();
      product.name = productData.name;
      product.slug = productData.slug;
      product.description = productData.description;
      product.price = productData.price;
      product.salePrice = productData.salePrice;
      product.isFeatured = productData.isFeatured;
      product.isActive = true;
      product.brandId = brand.id;
      product.categoryId = category.id;

      const savedProduct = await productRepository.save(product);

      // Create images with explicit productId FK
      for (const imageData of productData.images) {
        const image = new ProductImage();
        image.productId = savedProduct.id;
        image.url = imageData.url;
        image.altText = imageData.altText;
        image.isPrimary = imageData.isPrimary;
        image.sortOrder = imageData.sortOrder;
        await imageRepository.save(image);
      }

      // Create variants with explicit productId FK
      const brandPrefix = productData.brandSlug.toUpperCase().replace('-', '');
      for (const variantData of productData.variants) {
        const variant = new ProductVariant();
        variant.productId = savedProduct.id;
        variant.size = variantData.size;
        variant.color = variantData.color;
        variant.sku = `${brandPrefix}-${variantData.skuSuffix}`;
        variant.stockQuantity = variantData.stock;
        variant.priceAdjustment = 0;
        await variantRepository.save(variant);
      }
    }

    console.log(`✓ Seeded ${productsData.length} products with images and variants`);
  }
}
