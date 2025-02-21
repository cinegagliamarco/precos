import * as fs from 'fs';
import { GenericProductTypeormEntity } from '../database/entities/generic-product.entity';
import { TypeOrmDataSource } from '../database/typeorm.data-source';

async function importGenericProductsCSV(filePath: string): Promise<void> {
  const data = fs.readFileSync(filePath, { encoding: 'utf8' });
  const rows = data.split(/\r?\n/);

  await TypeOrmDataSource.initialize();
  const repository = TypeOrmDataSource.getRepository(GenericProductTypeormEntity);

  const mapper = {};
  for (let index = 0; index < rows.length; index++) {
    if (!index) continue; // Skip first line (header)

    const row = rows[index];
    if (!row.trim()) continue; // Skip empty lines

    const parsedRow = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g).map((value) => value.replace(/^"|"$|^-$|^""$/g, '').trim());

    for (const ean of parsedRow) {
      if (!ean) continue;
      const parsedEan = parseNumberColumn(ean);
      const genericProductEntity = new GenericProductTypeormEntity();
      genericProductEntity.ean = parsedEan;
      mapper[parsedEan] = genericProductEntity;
    }
  }

  const total = Object.values(mapper).length;
  console.log(`Importando ${total} produtos genéricos`);

  for (const entity of Object.values(mapper)) {
    await repository.save(entity).catch((e) => console.error(e));
  }
}

function parseNumberColumn(value: string): number {
  const parsedValue = value.replace(/^0+/, '');
  return Number(parsedValue);
}

(async () => importGenericProductsCSV(`${__dirname}/csvs/generic-products.csv`))();
