import axios from 'axios';
import { load } from 'cheerio';
import { Repository } from 'typeorm';
import { Product } from '../database/product.entity';
import { TypeOrmDataSource } from '../database/typeorm-datasource';
import { DrogalApiProductInterface } from '../interfaces/drogal-api-product.interface';

async function importDrogasil(): Promise<void> {
  // await initializeDB();
  // const baseProductRepository = TypeOrmDataSource.getRepository(BaseProduct);
  // const productRepository = TypeOrmDataSource.getRepository(Product);
  // const baseProducts = await baseProductRepository.createQueryBuilder('base_product').select('DISTINCT base_product.ean', 'ean').getRawMany();
  // const products = await productRepository.find({ select: ['ean'], where: { origin: 'drogasil' } });
  // const productsHashMap = {};
  // products.forEach(({ ean }) => (productsHashMap[ean] = true));

  await fetchProductByEan('7899941201804');

  // console.log(`Quantidade de produtos`, baseProducts.length);
  // const notInsertedProducts = baseProducts.filter(({ ean }) => !productsHashMap[ean]);

  // let total = notInsertedProducts.length;
  // for (const { ean } of notInsertedProducts) {
  //   console.log(`Missing ${total--}`);
  //   const products = await fetchProductByEan(ean);
  //   await new Promise((res) => setTimeout(res, 100));
  //   if (!products?.length) continue;
  //   const [product] = products;
  //   await saveProduct(productRepository, ean, product);
  // }
}

async function fetchProductByEan(ean: string): Promise<any> {
  const url = `https://www.drogasil.com.br/search?w=${ean}&facets=filters.Vendido+por%3ADrogasil&p=1`;

  try {
    const { data: html } = await axios.get(url);
    const $ = load(html);
    const productContainers = $('[data-testid="container-products"]');

    productContainers.each(async (_, element) => {
      const product = $(element);

      const linkElement = product.find('a');

      if (!linkElement?.length) return;
      const productLink = `https://www.drogasil.com.br${linkElement.attr('href')}`;
      await fetchProductDetails(productLink);
    });
  } catch (error) {
    console.error('Error fetching the page:', error.message);
  }
}

async function fetchProductDetails(url: string) {
  try {
    const { data: html } = await axios.get(url);
    const $ = load(html);
    const product = JSON.parse($('[type="application/ld+json"]').text());
    console.log('product', product)
  } catch (error) {
    console.error('Error fetching the product details:', error.message);
  }
}

async function saveProduct(productRepository: Repository<Product>, ean: number, product: DrogalApiProductInterface): Promise<void> {
  if (!product.items.length) return;
  if (!product.items[0].sellers.length) return;
  if (!product.items[0].sellers[0].commertialOffer) return;

  const productEntity = new Product();
  productEntity.ean = ean;
  productEntity.name = product.productName;
  productEntity.origin = 'drogasil';
  productEntity.price = product.items[0].sellers[0].commertialOffer.Price;
  productEntity.observation = product.items[0].sellers[0].commertialOffer.PromotionTeasers[0]?.Name || '';
  productEntity.brand = product.brand;
  productEntity.image = product.brandImageUrl;
  productEntity.sku = 0;

  await productRepository.save(productEntity);
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

(async () => importDrogasil())();
