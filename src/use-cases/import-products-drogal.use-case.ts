import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Origin } from '../common/origin.enum';
import { ProductTypeormEntity } from '../database/entities/product.entity';
import { BaseProductRepository } from '../database/repositories/base-product.repository';
import { ProductRepository } from '../database/repositories/product.repository';
import { DrogalApiGetProductApiResponse } from '../interfaces/drogal/get-product.api.interface';
import { GenericProductRepository } from '../database/repositories/generic-product.repository';

@Injectable()
export class ImportProductsDrogalUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly baseProductRepository: BaseProductRepository,
    private readonly genericProductRepository: GenericProductRepository,
    private readonly httpService: HttpService
  ) {}

  public async execute(generic = false): Promise<void> {
    const [products, baseProducts] = await Promise.all([
      this.productRepository.findByOrigin(Origin.DROGAL),
      this.fetchBaseProducts(generic)
    ]);

    const productsHashMap = {};
    products.forEach(({ ean }) => (productsHashMap[ean] = true));

    console.log(`Products Total`, baseProducts.length);
    const notInsertedProducts = baseProducts.filter(({ ean }) => !productsHashMap[ean]);
    const workSize = 100;

    const tasks = [...notInsertedProducts];
    while (tasks.length) {
      console.log(`Missing ${tasks.length}`);
      const promises = tasks.splice(0, workSize).map(async ({ ean }) => {
        const { products, error } = await this.fetchProductByEan(ean);
        if (error) return Promise.resolve();

        if (!products.length) {
          return this.saveEmptyProduct(ean);
        }
        const [product] = products;
        await this.saveProduct(ean, product);
      });

      await Promise.all(promises);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  private async fetchBaseProducts(generic: boolean): Promise<{ ean: number }[]> {
    if (generic) return this.genericProductRepository.findAllDistinct();

    return this.baseProductRepository.findAllDistinct();
  }

  private async fetchProductByEan(ean: number): Promise<{ products: DrogalApiGetProductApiResponse[]; error: boolean }> {
    try {
      const url = `https://www.drogal.com.br/api/catalog_system/pub/products/search?fq=alternateIds_Ean:${ean}`;
      const response = await this.httpService.axiosRef.get<DrogalApiGetProductApiResponse[]>(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0', // Avoid
          accept: '*/*',
          'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty'
        }
      });

      return { products: response.data, error: false };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { products: [], error: true };
    }
  }

  private async saveEmptyProduct(ean: number): Promise<void> {
    const productEntity = new ProductTypeormEntity();
    productEntity.ean = ean;
    productEntity.origin = Origin.DROGAL;

    await this.productRepository.save(productEntity);
  }

  private async saveProduct(ean: number, product: DrogalApiGetProductApiResponse): Promise<void> {
    if (!product.items.length || !product.items[0].sellers.length || !product.items[0].sellers[0].commertialOffer) return;

    const productEntity = new ProductTypeormEntity();
    productEntity.ean = ean;
    productEntity.name = product.productName;
    productEntity.origin = Origin.DROGAL;
    productEntity.price = product.items[0].sellers[0].commertialOffer.Price;
    productEntity.observation = product.items[0].sellers[0].commertialOffer.PromotionTeasers[0]?.Name || '';
    productEntity.brand = product.brand;
    productEntity.image = product.brandImageUrl;
    productEntity.exists = true;
    productEntity.sku = Number(product.productReferenceCode);
    productEntity.hasStock = product.items[0].sellers[0].commertialOffer.IsAvailable;

    await this.productRepository.save(productEntity);
  }
}
