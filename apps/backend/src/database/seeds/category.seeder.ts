import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Category } from '../../categories/entities/category.entity';

export class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Category);

    // Check if categories already exist (idempotent)
    const existingCount = await categoryRepository.count();
    if (existingCount > 0) {
      console.log('Categories already seeded, skipping...');
      return;
    }

    const categories = [
      {
        name: 'Running',
        slug: 'running',
        description: 'High-performance running shoes for all distances',
        imageUrl: '/categories/running.jpg',
      },
      {
        name: 'Basketball',
        slug: 'basketball',
        description: 'Court-ready basketball shoes for maximum performance',
        imageUrl: '/categories/basketball.jpg',
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Casual and comfortable footwear for everyday wear',
        imageUrl: '/categories/lifestyle.jpg',
      },
      {
        name: 'Training',
        slug: 'training',
        description: 'Versatile training shoes for gym and cross-training',
        imageUrl: '/categories/training.jpg',
      },
      {
        name: 'Walking',
        slug: 'walking',
        description: 'Comfortable walking shoes for daily comfort',
        imageUrl: '/categories/walking.jpg',
      },
    ];

    await categoryRepository.save(categories);
    console.log('Successfully seeded 5 categories');
  }
}
