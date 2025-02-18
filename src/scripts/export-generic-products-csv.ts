import * as fs from 'fs';
import * as path from 'path';
import { TypeOrmDataSource } from '../database/typeorm.datasource';

const query = `
  SELECT
    gp.ean,
    COALESCE(
        MAX(p.name) FILTER (WHERE p.origin = 'drogal'),
        MAX(p.name) FILTER (WHERE p.origin = 'drogasil')
    ) AS name,
    MAX(p.price) FILTER (WHERE p.origin = 'drogal') AS drogal_price,
    MAX(p.price) FILTER (WHERE p.origin = 'drogasil') AS drogasil_price,
    MAX(p.observation) FILTER (WHERE p.origin = 'drogal') AS drogal_observation,
    MAX(p.observation) FILTER (WHERE p.origin = 'drogasil') AS drogasil_observation
  FROM generic_product gp
  LEFT JOIN product p ON p.ean = gp.ean
  WHERE p.has_stock = TRUE
  GROUP BY gp.ean;
`;

interface QueryRowResult {
  ean: number;
  name: string;
  drogal_price?: number;
  drogasil_price?: number;
  drogal_observation?: string;
  drogasil_observation?: string;
}

async function exportCSV(filename: string): Promise<void> {
  try {
    await TypeOrmDataSource.initialize();
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

const convertToCSV = (results: QueryRowResult[]): string => {
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

(async () => exportCSV(`${__dirname}/csvs/combined-generic-products.csv`))();
