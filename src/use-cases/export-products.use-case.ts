import { Injectable } from '@nestjs/common';
import { ProductExportRow, ProductRepository } from '../database/repositories/product.repository';

@Injectable()
export class ExportProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  public async execute(): Promise<string> {
    try {
      const records = await this.productRepository.findProductsToExport();
      if (!records?.length) return;

      return this.convertToCSV(records);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  }

  private convertToCSV(results: ProductExportRow[]): string {
    const header = [
      'ean',
      'name',
      'curve',
      'book',
      'price',
      'drogal_price',
      'drogasil_price',
      'drogal_observation',
      'drogasil_observation',
      'subsidiary_one_stock',
      'subsidiary_two_stock'
    ];
    const rows = results.map((r) =>
      [
        r.ean,
        r.name,
        r.curve ?? '',
        r.book ?? '',
        (r.price ?? '').toString().replaceAll('.', ','),
        (r.drogal_price ?? '').toString().replaceAll('.', ','),
        (r.drogasil_price ?? '').toString().replaceAll('.', ','),
        r.drogal_observation ?? '',
        r.drogasil_observation ?? '',
        r.subsidiary_one_stock,
        r.subsidiary_two_stock
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',')
    ); // Escape double quotes

    return [header.join(','), ...rows].join('\n')
  }
}
