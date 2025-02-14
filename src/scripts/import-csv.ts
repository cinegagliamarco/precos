import * as fs from 'fs';
import { BaseProduct } from '../database/base-product.entity';
import { TypeOrmDataSource } from '../database/typeorm-datasource';

async function importCSV(filePath: string): Promise<void> {
  const data = fs.readFileSync(filePath, { encoding: 'utf8' });
  const rows = data.split(/\r?\n/);

  await TypeOrmDataSource.initialize();
  const productRepository = TypeOrmDataSource.getRepository(BaseProduct);

  const mapper = {};
  for (let index = 0; index < rows.length; index++) {
    if (!index) continue; // Skip first line (header)

    const row = rows[index];
    if (!row.trim()) continue; // Skip empty lines

    const parsedRow = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g).map((value) => value.replace(/^"|"$/g, '').trim());
    const entity = parseBaseProduct(parsedRow)
    mapper[entity.ean] = entity;
  }

  const total = Object.values(mapper).length;
  console.log(`Importando ${total} produtos base`)

  for (const baseProductEntity of Object.values(mapper)) {
    await productRepository.save(baseProductEntity);
  }
}

function parseBaseProduct(row: string[]): BaseProduct {
  const [ean, name, curve, book, _, __, price] = row;
  const parsedEan = parseNumberColumn(ean);

  const baseProductEntity = new BaseProduct();
  baseProductEntity.ean = parsedEan;
  baseProductEntity.name = name;
  baseProductEntity.curve = curve;
  baseProductEntity.book = book;
  baseProductEntity.price = parsePriceColumn(price);

  return baseProductEntity;
}

function parseNumberColumn(value: string): number {
  const parsedValue = value.replace(/^0+/, '');
  return Number(parsedValue);
}

function parsePriceColumn(value: string): number {
  const parsedValue = /,\d{2}$/.test(value) ? value.replace(/\./g, '').replace(',', '.') : value.replace(/,/g, '');

  const numericValue = parseFloat(parsedValue);
  return isNaN(numericValue) ? 0 : numericValue;
}

(async () => importCSV(`${__dirname}/products-base.csv`))();
