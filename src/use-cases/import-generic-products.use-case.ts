import { Injectable } from '@nestjs/common';
import { GenericProductTypeormEntity } from '../database/entities/generic-product.entity';
import { GenericProductRepository } from '../database/repositories/generic-product.repository';

@Injectable()
export class ImportGenericProductsUseCase {
  constructor(private readonly genericProductRepository: GenericProductRepository) {}
  public async execute(file: string): Promise<void> {
    const rows = file.split(/\r?\n/);

    const mapper: Record<number, GenericProductTypeormEntity> = {};
    for (let index = 0; index < rows.length; index++) {
      if (!index) continue; // Skip first line (header)

      const row = rows[index];
      if (!row.trim()) continue; // Skip empty lines

      const parsedRow = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g).map((value) => value.replace(/^"|"$|^-$|^""$/g, '').trim());

      for (const ean of parsedRow) {
        if (!ean) continue;
        const parsedEan = this.parseNumberColumn(ean);
        const genericProductEntity = new GenericProductTypeormEntity();
        genericProductEntity.ean = parsedEan;
        mapper[parsedEan] = genericProductEntity;
      }
    }

    const total = Object.values(mapper).length;
    console.log(`Importing ${total} generic products!`);

    for (const entity of Object.values(mapper)) {
      await this.genericProductRepository.save(entity).catch((e) => console.error(e));
    }
  }

  private parseNumberColumn(value: string): number {
    const parsedValue = value.replace(/^0+/, '');
    return Number(parsedValue);
  }
}
