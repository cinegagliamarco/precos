import * as fs from 'fs';
import * as path from 'path';
import { TypeOrmDataSource } from '../database/typeorm-datasource';

const query = `
  SELECT
    bp.id,
    bp.ean,
    bp.name,
    bp.curve,
    bp.book,
    bp.price,
    CASE 
      WHEN p.origin = 'drogal' THEN p.price 
      ELSE null
    END AS drogal_price,
    CASE 
      WHEN p.origin = 'drogasil' THEN p.price 
      ELSE null
    END AS drogasil_price,
    CASE 
      WHEN p.origin = 'drogal' THEN p.observation 
      ELSE null
    END AS drogal_observation,
    CASE 
      WHEN p.origin = 'drogasil' THEN p.observation 
      ELSE null
    END AS drogasil_observation
  FROM
    base_product bp
  LEFT JOIN product p ON p.ean = bp.ean;
`;

interface QueryRowResult {
  id: number;
  ean: number;
  name: string;
  curve?: string;
  book?: string;
  price: number;
  drogal_price?: number;
  drogasil_price?: number;
  drogal_observation?: string;
  drogasil_observation?: string;
}

async function exportCSV(filename: string): Promise<void> {
  try {
    await initializeDB();
    const records: QueryRowResult[] = await TypeOrmDataSource.query(query);

    if (!records?.length) return;

    const csvData = convertToCSV(records);

    const filePath = path.resolve(process.cwd(), filename); // Use `process.cwd()` instead of `__dirname`

    fs.writeFileSync(filePath, csvData, 'utf8');
    console.log(`CSV file saved`);
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
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

const convertToCSV = (results: QueryRowResult[]): string => {
  const header = ['ean', 'name', 'curve', 'book', 'price', 'drogal_price', 'drogasil_price', 'drogal_observation', 'drogasil_observation'];
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
      r.drogasil_observation ?? ''
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(',')
  ); // Escape double quotes

  return [header.join(','), ...rows].join('\n');
};

(async () => exportCSV(`${__dirname}/combined-products.csv`))();
