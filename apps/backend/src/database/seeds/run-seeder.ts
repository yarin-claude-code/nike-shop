import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { dataSourceOptions } from '../data-source';
import { BrandSeeder } from './brand.seeder';
import { CategorySeeder } from './category.seeder';
import { ProductSeeder } from './product.seeder';
import { ProductFactory } from '../factories/product.factory';

async function runSeeding() {
  console.log('🌱 Starting database seeding...\n');

  const dataSource = new DataSource(dataSourceOptions);

  try {
    // Initialize connection
    await dataSource.initialize();
    console.log('✓ Database connection established\n');

    // Run seeders in order
    await runSeeders(dataSource, {
      seeds: [BrandSeeder, CategorySeeder, ProductSeeder],
      factories: [ProductFactory],
    });

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    // Clean up connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✓ Database connection closed');
    }
  }
}

// Run seeding
runSeeding();
