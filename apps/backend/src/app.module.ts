import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get('POSTGRES_USERNAME', 'postgres'),
        password: configService.get('POSTGRES_PASSWORD', 'postgres'),
        database: configService.get('POSTGRES_DATABASE', 'tonys_shoes'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [join(__dirname, 'migrations', '*.js')],
        migrationsRun: false,
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    BrandsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
  ],
})
export class AppModule {}
