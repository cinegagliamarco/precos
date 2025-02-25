import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { BaseProductController } from './controllers/base-product.controller';
import { ProductController } from './controllers/product.controller';
import { TypeormDatabaseModule } from './database/typeorm.database.module';
import { ExportProductsUseCase } from './use-cases/export-products.use-case';
import { ImportBaseProductsUseCase } from './use-cases/import-base-products.use-case';
import { ImportGenericProductsUseCase } from './use-cases/import-generic-products.use-case';
import { ImportProductsDrogalUseCase } from './use-cases/import-products-drogal.use-case';
import { ImportProductsDrogasilUseCase } from './use-cases/import-products-drogasil.use-case';
import { ExportGenericProductsUseCase } from './use-cases/export-generic-products.use-case';

@Module({
  imports: [HttpModule, TypeormDatabaseModule],
  controllers: [AppController, BaseProductController, ProductController],
  providers: [ImportBaseProductsUseCase, ImportProductsDrogalUseCase, ImportProductsDrogasilUseCase, ImportGenericProductsUseCase, ExportProductsUseCase, ExportGenericProductsUseCase]
})
export class AppModule {}
