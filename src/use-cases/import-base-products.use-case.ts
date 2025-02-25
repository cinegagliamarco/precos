import { Injectable } from '@nestjs/common';
import { BaseProductRepository } from '../database/repositories/base-product.repository';
import { BaseProductTypeormEntity } from '../database/entities/base-product.entity';

@Injectable()
export class ImportBaseProductsUseCase {
  constructor(private readonly baseProductRepository: BaseProductRepository) {}

  public async execute(file: string) {
    const rows = file.split(/\r?\n/);

    const mapper: Record<number, BaseProductTypeormEntity> = {};
    for (let index = 0; index < rows.length; index++) {
      if (!index) continue; // Skip first line (header)

      const row = rows[index];
      if (!row.trim()) continue; // Skip empty lines

      const parsedRow = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g).map((value) => value.replace(/^"|"$/g, '').trim());
      const entity = this.parseBaseProduct(parsedRow);
      mapper[entity.ean] = entity;
    }

    const total = Object.values(mapper).length;
    console.log(`Importing ${total} base products`);

    for (const baseProductEntity of Object.values(mapper)) {
      await this.baseProductRepository.save(baseProductEntity);
    }
  }

  private parseBaseProduct(row: string[]): BaseProductTypeormEntity {
    const [ean, name, curve, book, _, __, price] = row;
    const parsedEan = this.parseNumberColumn(ean);

    const baseProductEntity = new BaseProductTypeormEntity();
    baseProductEntity.ean = parsedEan;
    baseProductEntity.name = name;
    baseProductEntity.curve = curve;
    baseProductEntity.book = book;
    baseProductEntity.price = this.parsePriceColumn(price);

    return baseProductEntity;
  }

  private parseNumberColumn(value: string): number {
    const parsedValue = value.replace(/^0+/, '');
    return Number(parsedValue);
  }

  private parsePriceColumn(value: string): number {
    const parsedValue = /,\d{2}$/.test(value) ? value.replace(/\./g, '').replace(',', '.') : value.replace(/,/g, '');

    const numericValue = parseFloat(parsedValue);
    return isNaN(numericValue) ? 0 : numericValue;
  }
}
