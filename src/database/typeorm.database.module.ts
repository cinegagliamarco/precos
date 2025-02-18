import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BASE_PRODUCT_REPOSITORY_TOKEN, DATABASE_CONNECTION_TOKEN, PRODUCT_REPOSITORY_TOKEN } from './typeorm.database.tokens';
import { TypeOrmDataSource } from './typeorm.datasource';
import { ProductRepository } from './repositories/product.repository';
import { BaseProductRepository } from './repositories/base-product.repository';
import { BaseProductTypeormEntity } from './entities/base-product.entity';
import { ProductTypeormEntity } from './entities/product.entity';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION_TOKEN,
      useFactory: async (): Promise<DataSource> => {
        const connection = await TypeOrmDataSource.initialize().catch((e) => {
          throw new Error(`DB Connection Error: ${e}`);
        });
        return connection;
      }
    },
    {
      provide: BASE_PRODUCT_REPOSITORY_TOKEN,
      inject: [DATABASE_CONNECTION_TOKEN],
      useFactory: (dataSource: DataSource): BaseProductRepository => {
        return new BaseProductRepository(dataSource.getRepository(BaseProductTypeormEntity));
      }
    },
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      inject: [DATABASE_CONNECTION_TOKEN],
      useFactory: (dataSource: DataSource): ProductRepository => {
        return new ProductRepository(dataSource.getRepository(ProductTypeormEntity));
      }
    }
  ],
  exports: [DATABASE_CONNECTION_TOKEN, BASE_PRODUCT_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN]
})
export class TypeormDatabaseModule {}
