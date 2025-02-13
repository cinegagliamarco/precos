import axios from 'axios';
import { Repository } from 'typeorm';
import { BaseProduct } from '../database/base-product.entity';
import { Product } from '../database/product.entity';
import { TypeOrmDataSource } from '../database/typeorm-datasource';
import { DrogalApiProductInterface } from '../interfaces/drogal-api-product.interface';

async function importDrogal(): Promise<void> {
  await TypeOrmDataSource.initialize();
  const baseProductRepository = TypeOrmDataSource.getRepository(BaseProduct);
  const productRepository = TypeOrmDataSource.getRepository(Product);
  const baseProducts = await baseProductRepository.createQueryBuilder('base_product').select('DISTINCT base_product.ean', 'ean').getRawMany();
  const products = await productRepository.find({ select: ['ean'], where: { origin: 'drogal' } });
  const productsHashMap = {};
  products.forEach(({ ean }) => (productsHashMap[ean] = true));

  console.log(`Quantidade de produtos`, baseProducts.length);
  const notInsertedProducts = baseProducts.filter(({ ean }) => !productsHashMap[ean]);

  let total = notInsertedProducts.length;
  for (const { ean } of notInsertedProducts) {
    console.log(`Missing ${total--}`);
    const products = await fetchProductByEan(ean);
    await new Promise((res) => setTimeout(res, 100));
    if (!products?.length) continue;
    const [product] = products;
    await saveProduct(productRepository, ean, product);
  }
}

async function fetchProductByEan(ean: string): Promise<DrogalApiProductInterface[]> {
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

async function saveProduct(productRepository: Repository<Product>, ean: number, product: DrogalApiProductInterface): Promise<void> {
  if (!product.items.length) return;
  if (!product.items[0].sellers.length) return;
  if (!product.items[0].sellers[0].commertialOffer) return;

  const productEntity = new Product();
  productEntity.ean = ean;
  productEntity.name = product.productName;
  productEntity.origin = 'drogal';
  productEntity.price = product.items[0].sellers[0].commertialOffer.Price;
  productEntity.observation = product.items[0].sellers[0].commertialOffer.PromotionTeasers[0]?.Name || '';
  productEntity.brand = product.brand;
  productEntity.image = product.brandImageUrl;
  productEntity.sku = 0;

  await productRepository.save(productEntity);
}

(async () => importDrogal())();
