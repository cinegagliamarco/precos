import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportBaseProductsUseCase } from '../use-cases/import-base-products.use-case';
import { ImportGenericProductsUseCase } from '../use-cases/import-generic-products.use-case';

@Controller('products/base')
export class BaseProductController {
  constructor(
    private readonly importBaseProductsUseCase: ImportBaseProductsUseCase,
    private readonly importGenericProductsUseCase: ImportGenericProductsUseCase
  ) {}

  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  public import(@UploadedFile() file: Express.Multer.File) {
    return this.importBaseProductsUseCase.execute(file.buffer.toString());
  }

  @Post('/import/generic')
  @UseInterceptors(FileInterceptor('file'))
  public importGeneric(@UploadedFile() file: Express.Multer.File) {
    return this.importGenericProductsUseCase.execute(file.buffer.toString());
  }
}
