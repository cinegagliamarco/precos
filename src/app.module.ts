import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { BaseProductController } from './controllers/base-product.controller';
import { TypeormDatabaseModule } from './database/typeorm.database.module';
import { ProductController } from './controllers/product.controller';
import { BaseProductService } from './services/base-product.service';
import { ProductService } from './services/product.service';

@Module({
  imports: [HttpModule, TypeormDatabaseModule],
  controllers: [AppController, BaseProductController, ProductController],
  providers: [BaseProductService, ProductService]
})
export class AppModule {}
