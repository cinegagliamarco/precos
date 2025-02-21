import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseProductTypeormEntity } from './entities/base-product.entity';
import { GenericProductTypeormEntity } from './entities/generic-product.entity';
import { ProductTypeormEntity } from './entities/product.entity';
import { BaseProductRepository } from './repositories/base-product.repository';
import { GenericProductRepository } from './repositories/generic-product.repository';
import { ProductRepository } from './repositories/product.repository';
import { TypeOrmDataSource } from './typeorm.data-source';
import { DATABASE_CONNECTION_TOKEN } from './typeorm.database.tokens';

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
      provide: BaseProductRepository,
      inject: [DATABASE_CONNECTION_TOKEN],
      useFactory: (dataSource: DataSource): BaseProductRepository => {
        return new BaseProductRepository(dataSource.getRepository(BaseProductTypeormEntity));
      }
    },
    {
      provide: ProductRepository,
      inject: [DATABASE_CONNECTION_TOKEN],
      useFactory: (dataSource: DataSource): ProductRepository => {
        return new ProductRepository(dataSource.getRepository(ProductTypeormEntity));
      }
    },
    {
      provide: GenericProductRepository,
      inject: [DATABASE_CONNECTION_TOKEN],
      useFactory: (dataSource: DataSource): GenericProductRepository => {
        return new GenericProductRepository(dataSource.getRepository(GenericProductTypeormEntity));
      }
    }
  ],
  exports: [BaseProductRepository, ProductRepository, GenericProductRepository]
})
export class TypeormDatabaseModule {}
