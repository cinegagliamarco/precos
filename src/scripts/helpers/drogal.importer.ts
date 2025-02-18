import axios from 'axios';
import { Repository } from 'typeorm';
import { BaseProductTypeormEntity } from '../../database/entities/base-product.entity';
import { ProductTypeormEntity } from '../../database/entities/product.entity';
import { TypeOrmDataSource } from '../../database/typeorm.datasource';
import { DrogalApiProductInterface } from '../../interfaces/drogal-api-product.interface';
import { GenericProductTypeormEntity } from '../../database/entities/generic-product.entity';

export async function importDrogal(generic = false): Promise<void> {
  await TypeOrmDataSource.initialize();
  const productRepository = TypeOrmDataSource.getRepository(ProductTypeormEntity);
  const baseProducts = await fetchBaseProducts(generic);
  const products = await productRepository.find({ select: ['ean'], where: { origin: 'drogal' } });
  const productsHashMap = {};
  products.forEach(({ ean }) => (productsHashMap[ean] = true));

  console.log(`Quantidade de produtos`, baseProducts.length);
  const notInsertedProducts = baseProducts.filter(({ ean }) => !productsHashMap[ean]);

  const workSize = 100;
  const tasks = [...notInsertedProducts];
  while (tasks.length) {
    console.log(`Missing ${tasks.length}`);
    const promises = tasks.splice(0, workSize).map(async ({ ean }) => {
      const products = await fetchProductByEan(ean);
      await new Promise((res) => setTimeout(res, 100));
      if (!products?.length) return;
      const [product] = products;
      await saveProduct(productRepository, ean, product);
    });

    await Promise.all(promises);
    await new Promise((res) => setTimeout(res, 2000));
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

async function fetchProductByEan(ean: number): Promise<DrogalApiProductInterface[]> {
  try {
    const url = `https://www.drogal.com.br/api/catalog_system/pub/products/search?fq=alternateIds_Ean:${ean}`;
    const response = await axios.get<DrogalApiProductInterface[]>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // Avoid bot detection
        Accept: 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
  }
}

async function saveProduct(productRepository: Repository<ProductTypeormEntity>, ean: number, product: DrogalApiProductInterface): Promise<void> {
  if (!product.items.length || !product.items[0].sellers.length || !product.items[0].sellers[0].commertialOffer) return;

  const productEntity = new ProductTypeormEntity();
  productEntity.ean = ean;
  productEntity.name = product.productName;
  productEntity.origin = 'drogal';
  productEntity.price = product.items[0].sellers[0].commertialOffer.Price;
  productEntity.observation = product.items[0].sellers[0].commertialOffer.PromotionTeasers[0]?.Name || '';
  productEntity.brand = product.brand;
  productEntity.image = product.brandImageUrl;
  productEntity.sku = Number(product.productId);
  productEntity.hasStock = product.items[0].sellers[0].commertialOffer.IsAvailable;

  await productRepository.save(productEntity);
}
