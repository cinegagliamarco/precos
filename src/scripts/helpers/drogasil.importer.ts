import axios from 'axios';
import { load } from 'cheerio';
import { Repository } from 'typeorm';
import { BaseProductTypeormEntity } from '../../database/entities/base-product.entity';
import { GenericProductTypeormEntity } from '../../database/entities/generic-product.entity';
import { ProductTypeormEntity } from '../../database/entities/product.entity';
import { TypeOrmDataSource } from '../../database/typeorm.data-source';
import { DrogasilGetProductApiResponse } from '../../interfaces/drogasil/get-product.api.interface';
import { Origin } from '../../common/origin.enum';

export async function importDrogasil(generic = false): Promise<void> {
  await TypeOrmDataSource.initialize();
  const baseProducts = await fetchBaseProducts(generic);
  const productRepository = TypeOrmDataSource.getRepository(ProductTypeormEntity);
  const products = await productRepository.find({ select: ['ean'], where: { origin: Origin.DROGASIL } });
  const productsHashMap = {};
  products.forEach(({ ean }) => (productsHashMap[ean] = true));

  console.log(`Quantidade de produtos`, baseProducts.length);
  const notInsertedProducts = baseProducts.filter(({ ean }) => !productsHashMap[ean]);

  const workSize = 100;
  const tasks = [...notInsertedProducts];
  while (tasks.length) {
    console.log(`Missing ${tasks.length}`);
    const promises = tasks.splice(0, workSize).map(async ({ ean }) => {
      const product = await fetchProductSku(ean);
      if (!product?.success) {
        return saveEmptyProduct(productRepository, ean);
      }
      await saveProduct(productRepository, ean, product);
    });

    await Promise.all(promises);
    await new Promise((res) => setTimeout(res, 2000));
  }
}

async function fetchProductSku(ean: number): Promise<DrogasilGetProductApiResponse | null> {
  const url = `https://www.drogasil.com.br/search?w=${ean}&facets=filters.Vendido+por%3ADrogasil&p=1`;

  try {
    const { data: html } = await axios.get(url);
    const $ = load(html);
    const products = $('article[data-item-id]');

    if (!products?.length) return;

    const productDetails = await Promise.all(
      products
        .map((_, element) => {
          const product = $(element);
          const sku = product.attr('data-item-id');
          return sku ? getProductDetails(sku) : null;
        })
        .get()
    );
    return productDetails.find((product) => !!product);
  } catch (error) {
    console.error('Error fetching the page:', error.message);
  }
}

async function fetchBaseProducts(generic = false): Promise<{ ean: number }[]> {
  if (generic) {
    const genericProductRepository = TypeOrmDataSource.getRepository(GenericProductTypeormEntity);
    return genericProductRepository.createQueryBuilder('generic_product').select('DISTINCT generic_product.ean', 'ean').getRawMany();
  }
  const baseProductRepository = TypeOrmDataSource.getRepository(BaseProductTypeormEntity);
  return baseProductRepository.createQueryBuilder('base_product').select('DISTINCT base_product.ean', 'ean').getRawMany();
}

async function getProductDetails(sku: string) {
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

    const response = await axios.post<DrogasilGetProductApiResponse>(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching the page:', error.message);
  }
}

async function saveEmptyProduct(productRepository: Repository<ProductTypeormEntity>, ean: number): Promise<void> {
  const productEntity = new ProductTypeormEntity();
  productEntity.ean = ean;
  productEntity.origin = Origin.DROGASIL;

  await productRepository.save(productEntity);
}

async function saveProduct(productRepository: Repository<ProductTypeormEntity>, ean: number, product: DrogasilGetProductApiResponse): Promise<void> {
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

  await productRepository.save(productEntity);
}
