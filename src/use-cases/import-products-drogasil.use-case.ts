import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Origin } from '../common/origin.enum';
import { ProductTypeormEntity } from '../database/entities/product.entity';
import { BaseProductRepository } from '../database/repositories/base-product.repository';
import { ProductRepository } from '../database/repositories/product.repository';
import { DrogasilGetProductApiResponse } from '../interfaces/drogasil/get-product.api.interface';
import { load } from 'cheerio';
import { GenericProductRepository } from '../database/repositories/generic-product.repository';

@Injectable()
export class ImportProductsDrogasilUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly baseProductRepository: BaseProductRepository,
    private readonly genericProductRepository: GenericProductRepository,
    private readonly httpService: HttpService
  ) {}

  public async execute(generic = false): Promise<void> {
    const [products, baseProducts] = await Promise.all([
      this.productRepository.findByOrigin(Origin.DROGASIL),
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
        const product = await this.fetchProductSku(ean);
        if (!product?.success) {
          return this.saveEmptyProduct(ean);
        }
        await this.saveProduct(ean, product);
      });

      await Promise.all(promises);
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  private async fetchBaseProducts(generic: boolean): Promise<{ ean: number }[]> {
    if (generic) return this.genericProductRepository.findAllDistinct();

    return this.baseProductRepository.findAllDistinct();
  }

  private async fetchProductSku(ean: number): Promise<DrogasilGetProductApiResponse | null> {
    const url = `https://www.drogasil.com.br/search?w=${ean}&facets=filters.Vendido+por%3ADrogasil&p=1`;

    try {
      const { data: html } = await this.httpService.axiosRef.get(url);
      const $ = load(html);
      const products = $('article[data-item-id]');

      if (!products?.length) return;

      const productDetails = await Promise.all(
        products
          .map((_, element) => {
            const product = $(element);
            const sku = product.attr('data-item-id');
            return sku ? this.getProductDetails(sku) : null;
          })
          .get()
      );
      return productDetails.find((product) => !!product);
    } catch (error) {
      console.error('Error fetching the page:', error.message);
    }
  }

  private async getProductDetails(sku: string) {
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty'
      };

      const data = {
        query: `query getProduct($sku: String!) {
          productBySku(sku: $sku) {
            id
            sku
            name
            price
            price_aux {
              value_to
              lmpm_value_to
              lmpm_qty
            }
            media_gallery_entries {
              file
            }
            liveComposition {
              liveStock {
                qty
              }
            }
          }
        }`,
        variables: { sku }
      };

      const url = 'https://www.drogaraia.com.br/api/next/middlewareGraphql';

      const response = await this.httpService.axiosRef.post<DrogasilGetProductApiResponse>(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching the page:', error.message);
    }
  }

  private async saveEmptyProduct(ean: number): Promise<void> {
    const productEntity = new ProductTypeormEntity();
    productEntity.ean = ean;
    productEntity.origin = Origin.DROGASIL;

    await this.productRepository.save(productEntity);
  }

  private async saveProduct(ean: number, product: DrogasilGetProductApiResponse): Promise<void> {
    if (!product.data?.productBySku) return;

    const productEntity = new ProductTypeormEntity();
    productEntity.ean = ean;
    productEntity.name = product.data.productBySku.name;
    productEntity.origin = Origin.DROGASIL;
    productEntity.observation = '';
    productEntity.brand = '';
    productEntity.image = product.data.productBySku.media_gallery_entries?.[0]?.file;
    productEntity.sku = Number(product.data.productBySku.sku || '0');
    productEntity.hasStock = !!product.data.productBySku.liveComposition?.liveStock?.qty;

    if (product.data.productBySku.price_aux) {
      const { value_to, lmpm_value_to, lmpm_qty } = product.data.productBySku.price_aux;

      if (lmpm_value_to && lmpm_qty) {
        productEntity.observation = `Leve ${lmpm_qty} unidades por R$ ${lmpm_value_to.toString().replace('.', ',')} cada`;
      }
      productEntity.price = value_to;
    }

    await this.productRepository.save(productEntity);
  }
}
