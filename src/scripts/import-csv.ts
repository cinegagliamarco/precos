import * as fs from 'fs';
import { Repository } from 'typeorm';
import { BaseProduct } from '../database/base-product.entity';
import { TypeOrmDataSource } from '../database/typeorm-datasource';

async function readCSV(filePath: string): Promise<void> {
  const data = fs.readFileSync(filePath, { encoding: 'utf8' });
  const rows = data.split(/\r?\n/);

  await initializeDB();
  const productRepository = TypeOrmDataSource.getRepository(BaseProduct);

  for (let index = 0; index < rows.length; index++) {
    if (!index) continue; // Skip first line (header)

    const row = rows[index];
    if (row.trim() === '') continue; // Skip empty lines

    const parsedRow = row.match(/("[^"]*"|[^,]+)/g)?.map(
      (value) => value.replace(/^"|"$/g, '').trim(), // Remove surrounding quotes and trim
    );

    await saveBaseProduct(productRepository, parsedRow)
  }
}

async function saveBaseProduct(productRepository: Repository<BaseProduct>, row: string[]): Promise<void> {
  const [ean, name, _, __, price] = row;
  const parsedEan = parseNumberColumn(ean);

  const baseProductEntity = new BaseProduct();
  baseProductEntity.ean = parsedEan;
  baseProductEntity.name = name;
  baseProductEntity.price = parsePriceColumn(price);

  await productRepository.save(baseProductEntity)
}

function parseNumberColumn(value: string): number {
  const parsedValue = value.replace(/^0+/, '');
  return Number(parsedValue);
}

function parsePriceColumn(value: string): number {
  const parsedValue = /,\d{2}$/.test(value) ? value.replace(/\./g, '').replace(',', '.') : value.replace(/,/g, '')

  const numericValue = parseFloat(parsedValue);
  return isNaN(numericValue) ? 0 : numericValue;
}

async function initializeDB() {
  try {
    // Initialize the connection
    await TypeOrmDataSource.initialize();
    console.log('DataSource has been initialized!');
  } catch (error) {
    console.error('Error during DataSource initialization:', error);
  }
} 

(async () => readCSV(`${__dirname}/products-base.csv`))();
