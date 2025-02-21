import axios from 'axios';
import { Repository } from 'typeorm';
import { BaseProductTypeormEntity } from '../../database/entities/base-product.entity';
import { GenericProductTypeormEntity } from '../../database/entities/generic-product.entity';
import { ProductTypeormEntity } from '../../database/entities/product.entity';
import { TypeOrmDataSource } from '../../database/typeorm.data-source';
import { DrogalApiGetProductApiResponse } from '../../interfaces/drogal/get-product.api.interface';
import { Origin } from '../../common/origin.enum';

export async function importDrogal(generic = false): Promise<void> {
  await TypeOrmDataSource.initialize();
  const productRepository = TypeOrmDataSource.getRepository(ProductTypeormEntity);
  const baseProducts = await fetchBaseProducts(generic);
  const products = await productRepository.find({ select: ['ean'], where: { origin: Origin.DROGAL } });
  const productsHashMap = {};
  products.forEach(({ ean }) => (productsHashMap[ean] = true));

  console.log(`Quantidade de produtos`, baseProducts.length);
  const notInsertedProducts = baseProducts.filter(({ ean }) => !productsHashMap[ean]);

  const workSize = 100;
  const tasks = [...notInsertedProducts];
  while (tasks.length) {
    console.log(`Missing ${tasks.length}`);
    const promises = tasks.splice(0, workSize).map(async ({ ean }) => {
      const { products, error } = await fetchProductByEan(ean);
      if (error) return Promise.resolve();

      if (!products.length) {
        return saveEmptyProduct(productRepository, ean);
      }
      const [product] = products;
      await saveProduct(productRepository, ean, product);
    });

    await Promise.all(promises);
    await new Promise((res) => setTimeout(res, 5000));
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

async function fetchProductByEan(ean: number): Promise<{ products: DrogalApiGetProductApiResponse[], error: boolean }> {
  try {
    const url = `https://www.drogal.com.br/api/catalog_system/pub/products/search?fq=alternateIds_Ean:${ean}`;
    const response = await axios.get<DrogalApiGetProductApiResponse[]>(url, {
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

async function saveEmptyProduct(productRepository: Repository<ProductTypeormEntity>, ean: number): Promise<void> {
  const productEntity = new ProductTypeormEntity();
  productEntity.ean = ean;
  productEntity.origin = Origin.DROGAL;

  await productRepository.save(productEntity);
}

async function saveProduct(productRepository: Repository<ProductTypeormEntity>, ean: number, product: DrogalApiGetProductApiResponse): Promise<void> {
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

  await productRepository.save(productEntity);
}
