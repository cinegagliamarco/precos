import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportGenericProductsUseCase } from '../use-cases/export-generic-products.use-case';
import { ExportProductsUseCase } from '../use-cases/export-products.use-case';
import { ImportProductsDrogalUseCase } from '../use-cases/import-products-drogal.use-case';
import { ImportProductsDrogasilUseCase } from '../use-cases/import-products-drogasil.use-case';

@Controller('products')
export class ProductController {
  constructor(
    private readonly importProductsDrogalUseCase: ImportProductsDrogalUseCase,
    private readonly importProductsDrogasilUseCase: ImportProductsDrogasilUseCase,
    private readonly exportProductsUseCase: ExportProductsUseCase,
    private readonly exportGenericProductsUseCase: ExportGenericProductsUseCase
  ) {}

  @Post('/import/drogasil')
  public importDrogasil() {
    return this.importProductsDrogasilUseCase.execute();
  }

  @Post('/import/drogal')
  public importDrogal() {
    return this.importProductsDrogalUseCase.execute();
  }

  @Get('/export')
  public async export(@Res() response: Response) {
    const csvContent = await this.exportProductsUseCase.execute();
    if (!csvContent) return;

    // Set response headers for CSV download
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader('Content-Disposition', 'attachment; filename="combined-products.csv"');
    return response.send(csvContent);
  }

  @Get('/export/generic')
  public async exportGeneric(@Res() response: Response) {
    const csvContent = await this.exportGenericProductsUseCase.execute();
    if (!csvContent) return;

    response.setHeader('Content-Type', 'text/csv');
    response.setHeader('Content-Disposition', 'attachment; filename="combined-generic-products.csv"');
    return response.send(csvContent);
  }
}
