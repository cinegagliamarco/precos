import axios from 'axios';
import { load } from 'cheerio';
import { Repository } from 'typeorm';
import { BaseProduct } from '../database/base-product.entity';
import { Product } from '../database/product.entity';
import { TypeOrmDataSource } from '../database/typeorm-datasource';
import { DrogasilApiProductInterface } from '../interfaces/drogasil-api-product.interface';

async function importDrogasil(): Promise<void> {
  await initializeDB();
  const baseProductRepository = TypeOrmDataSource.getRepository(BaseProduct);
  const productRepository = TypeOrmDataSource.getRepository(Product);
  const baseProducts = await baseProductRepository.createQueryBuilder('base_product').select('DISTINCT base_product.ean', 'ean').getRawMany();
  const products = await productRepository.find({ select: ['ean'], where: { origin: 'drogasil' } });
  const productsHashMap = {};
  products.forEach(({ ean }) => (productsHashMap[ean] = true));

  console.log(`Quantidade de produtos`, baseProducts.length);
  const notInsertedProducts = baseProducts.filter(({ ean }) => !productsHashMap[ean]);

  let total = notInsertedProducts.length;
  for (const { ean } of notInsertedProducts) {
    console.log(`Missing ${total--}`);
    const product = await fetchProductSku(ean);
    await new Promise((res) => setTimeout(res, 100));
    if (!product?.success) continue;
    await saveProduct(productRepository, ean, product);
  }
}

async function fetchProductSku(ean: number): Promise<DrogasilApiProductInterface | null> {
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
        }
      }`,
      variables: { sku }
    };
  
    const url = 'https://www.drogaraia.com.br/api/next/middlewareGraphql';
  
    const response = await axios.post<DrogasilApiProductInterface>(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching the page:', error.message);
  }
}

async function saveProduct(productRepository: Repository<Product>, ean: number, product: DrogasilApiProductInterface): Promise<void> {
  if (!product.data?.productBySku) return;

  const productEntity = new Product();
  productEntity.ean = ean;
  productEntity.name = product.data.productBySku.name;
  productEntity.origin = 'drogasil';
  productEntity.observation = '';
  productEntity.brand = '';
  productEntity.image = product.data.productBySku.media_gallery_entries?.[0]?.file;
  productEntity.sku = Number(product.data.productBySku.sku || '0');

  if (product.data.productBySku.price_aux) {
    const { value_to, lmpm_value_to, lmpm_qty } = product.data.productBySku.price_aux;

    if (lmpm_value_to && lmpm_qty) {
      productEntity.observation = `Leve ${lmpm_qty} unidades por R$ ${lmpm_value_to.toString().replace('.', ',')} cada`;
    }
    productEntity.price = value_to;
  }

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

// async function fetchProductDetails(url: string) {
//   try {
//     const { data: html } = await axios.get(url);
//     const $ = load(html);
//     const product = JSON.parse($('[type="application/ld+json"]').text());
//     console.log('product', product);
//   } catch (error) {
//     console.error('Error fetching the product details:', error.message);
//   }
// }

// await fetchProductByEan('7899941201804');
// await fetchProductByEan('7896422507738');
// async function fetchProductByEan(ean: string): Promise<any> {
//   const url = `https://www.drogasil.com.br/search?w=${ean}&facets=filters.Vendido+por%3ADrogasil&p=1`;

//   try {
//     const { data: html } = await axios.get(url);
//     const $ = load(html);
//     const productContainers = $('[data-testid="container-products"]');

//     productContainers.each(async (_, element) => {
//       const product = $(element);

//       const linkElement = product.find('a');

//       if (!linkElement?.length) return;
//       const productLink = `https://www.drogasil.com.br${linkElement.attr('href')}`;
//       await fetchProductDetails(productLink);
//     });
//   } catch (error) {
//     console.error('Error fetching the page:', error.message);
//   }
// }

(async () => importDrogasil())();
