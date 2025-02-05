import * as fs from 'fs';
import { TypeOrmDataSource } from '../database/typeorm-datasource';
import { Product } from '../database/product.entity';

async function readCSV(filePath: string): Promise<void> {
  const data = fs.readFileSync(filePath, { encoding: 'utf8' });
  const rows = data.split(/\r?\n/);

  await initializeDB();
  // You can now start interacting with your database, for example:
  const productRepository = TypeOrmDataSource.getRepository(Product);
  const products = await productRepository.find();
  console.log(products);

  for (let index = 0; index < rows.length; index++) {
    if (!index) continue; // Skip first line (header)

    const row = rows[index];
    if (row.trim() === '') continue; // Skip empty lines

    const parsedRow = row.match(/("[^"]*"|[^,]+)/g)?.map(
      (value) => value.replace(/^"|"$/g, '').trim(), // Remove surrounding quotes and trim
    );

    const [ean, name, _, __, price] = parsedRow;
    const parsedEan = parseNumberColumn(ean);

    console.log(parsedEan, name, price);
  }
}

function parseNumberColumn(value: string): number {
  const parsedValue = value.replace(/^0+/, '');
  return Number(parsedValue);
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
