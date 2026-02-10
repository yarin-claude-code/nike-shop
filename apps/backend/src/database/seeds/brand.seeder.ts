import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Brand } from '../../brands/entities/brand.entity';

export class BrandSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const brandRepository = dataSource.getRepository(Brand);

    // Check if brands already exist (idempotent)
    const existingCount = await brandRepository.count();
    if (existingCount > 0) {
      console.log('Brands already seeded, skipping...');
      return;
    }

    const brands = [
      {
        name: 'Nike',
        slug: 'nike',
        description: 'Just Do It. Innovative athletic footwear and apparel.',
        logoUrl: '/logos/nike.svg',
      },
      {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Impossible is Nothing. Performance and lifestyle footwear.',
        logoUrl: '/logos/adidas.svg',
      },
      {
        name: 'Puma',
        slug: 'puma',
        description: 'Forever Faster. Bold and sporty footwear.',
        logoUrl: '/logos/puma.svg',
      },
      {
        name: 'On Cloud',
        slug: 'on-cloud',
        description: 'Run on Clouds. Swiss-engineered running shoes.',
        logoUrl: '/logos/on-cloud.svg',
      },
    ];

    await brandRepository.save(brands);
    console.log('Successfully seeded 4 brands');
  }
}
