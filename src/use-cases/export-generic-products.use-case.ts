import { Injectable } from '@nestjs/common';
import { GenericProductExportRow, ProductRepository } from '../database/repositories/product.repository';

@Injectable()
export class ExportGenericProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  public async execute(): Promise<string> {
    try {
      const records = await this.productRepository.findGenericProductsToExport();
      if (!records?.length) return;

      return this.convertToCSV(records);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  }

  private convertToCSV(results: GenericProductExportRow[]): string {
    const header = ['ean', 'name', 'drogal_price', 'drogasil_price', 'drogal_observation', 'drogasil_observation'];
    const rows = results.map((r) =>
      [
        r.ean,
        r.name,
        (r.drogal_price ?? '').toString().replaceAll('.', ','),
        (r.drogasil_price ?? '').toString().replaceAll('.', ','),
        r.drogal_observation ?? '',
        r.drogasil_observation ?? ''
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',')
    ); // Escape double quotes

    return [header.join(','), ...rows].join('\n');
  };
}
