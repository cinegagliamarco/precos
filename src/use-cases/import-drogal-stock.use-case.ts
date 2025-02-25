import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ProductRepository } from '../database/repositories/product.repository';
import { Origin } from '../common/origin.enum';
import { ProductTypeormEntity } from '../database/entities/product.entity';
import { DrogalCheckoutApiResponse } from '../interfaces/drogal/checkout.api.interface';

@Injectable()
export class ImportDrogalStockUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  public async execute(): Promise<void> {
    const products = await this.productRepository.findByOrigin(Origin.DROGAL);

    const workSize = 50;
    const tasks = [...products];
    while (tasks.length) {
      console.log(`Missing ${tasks.length}`);
      const productsToRequest = tasks.splice(0, workSize);
      const productsWithStock = await this.fetchProductStock(productsToRequest);
      if (productsWithStock) {
        await Promise.all(productsWithStock.map((product) => this.productRepository.save(product)));
      }

      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  private async fetchProductStock(products: ProductTypeormEntity[]): Promise<ProductTypeormEntity[]> {
    const url = `https://www.drogal.com.br/_v/drogalCheckout`;
    const items = products.map(({ sku }) => ({
      productRefId: sku,
      quantity: '1'
    }));
    const payload = {
      type: 'getPickupPointsByItems',
      params: { items }
    };

    try {
      const response = await axios.post<DrogalCheckoutApiResponse>(url, payload, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          accept: '*/*',
          'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty'
        },
        timeout: 30000
      });
      if (!response.data?.body?.pickupPointItems?.length) return;
      const subsidiaryOne = response.data.body.pickupPointItems.find(({ CodigoFilial }) => CodigoFilial === 113);
      const subsidiaryTwo = response.data.body.pickupPointItems.find(({ CodigoFilial }) => CodigoFilial === 310);
      if (!subsidiaryOne || !subsidiaryTwo) return;

      for (const product of products) {
        const stockSubsidiaryOne = subsidiaryOne.CartDetail.find(({ productRefId }) => productRefId === product.sku);
        const stockSubsidiaryTwo = subsidiaryTwo.CartDetail.find(({ productRefId }) => productRefId === product.sku);
        if (stockSubsidiaryOne) {
          product.subsidiaryOneStock = stockSubsidiaryOne.quantityAvaliable;
        }
        if (stockSubsidiaryTwo) {
          product.subsidiaryTwoStock = stockSubsidiaryTwo.quantityAvaliable;
        }
      }

      return products;
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }
}
