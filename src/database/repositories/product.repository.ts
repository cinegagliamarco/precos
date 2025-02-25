import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Origin } from '../../common/origin.enum';
import { ProductTypeormEntity } from '../entities/product.entity';

export interface GenericProductExportRow {
  ean: number;
  name: string;
  drogal_price?: number;
  drogasil_price?: number;
  drogal_observation?: string;
  drogasil_observation?: string;
}

export interface ProductExportRow {
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
  subsidiary_one_stock: number;
  subsidiary_two_stock: number;
}

@Injectable()
export class ProductRepository {
  constructor(private readonly repository: Repository<ProductTypeormEntity>) {}

  public async findByEan(ean: number): Promise<ProductTypeormEntity | null> {
    return this.repository.findOne({ where: { ean } });
  }

  public async findByOrigin(origin: Origin): Promise<ProductTypeormEntity[]> {
    return this.repository.find({ where: { origin } });
  }

  public async save(product: ProductTypeormEntity): Promise<ProductTypeormEntity> {
    return this.repository.save(product);
  }

  public async findProductsToExport(): Promise<ProductExportRow[]> {
    const query = `
      SELECT
        bp.ean,
        bp.name,
        bp.curve,
        bp.book,
        bp.price,
        MAX(p.price) FILTER (WHERE p.origin = '${Origin.DROGAL}') AS drogal_price,
        MAX(p.price) FILTER (WHERE p.origin = '${Origin.DROGASIL}') AS drogasil_price,
        MAX(p.observation) FILTER (WHERE p.origin = '${Origin.DROGAL}') AS drogal_observation,
        MAX(p.observation) FILTER (WHERE p.origin = '${Origin.DROGASIL}') AS drogasil_observation,
        p.subsidiary_one_stock,
        p.subsidiary_two_stock    
      FROM base_product bp
      LEFT JOIN product p ON p.ean = bp.ean
      WHERE p.has_stock = true
      AND p.exists = TRUE
      GROUP BY bp.ean, bp.name, bp.curve, bp.book, bp.price, p.subsidiary_one_stock, p.subsidiary_two_stock;
    `;

    return this.repository.query(query);
  }

  public async findGenericProductsToExport(): Promise<GenericProductExportRow[]> {
    const query = `
      SELECT
        gp.ean,
        COALESCE(
            MAX(p.name) FILTER (WHERE p.origin = '${Origin.DROGAL}'),
            MAX(p.name) FILTER (WHERE p.origin = '${Origin.DROGASIL}')
        ) AS name,
        MAX(p.price) FILTER (WHERE p.origin = '${Origin.DROGAL}') AS drogal_price,
        MAX(p.price) FILTER (WHERE p.origin = '${Origin.DROGASIL}') AS drogasil_price,
        MAX(p.observation) FILTER (WHERE p.origin = '${Origin.DROGAL}') AS drogal_observation,
        MAX(p.observation) FILTER (WHERE p.origin = '${Origin.DROGASIL}') AS drogasil_observation
      FROM generic_product gp
      LEFT JOIN product p ON p.ean = gp.ean
      WHERE p.has_stock = TRUE
      GROUP BY gp.ean;
    `;

    return this.repository.query(query);
  }
}
