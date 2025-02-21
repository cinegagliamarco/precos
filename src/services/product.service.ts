import { Injectable } from '@nestjs/common';
import { Origin } from '../common/origin.enum';
import { ProductRepository } from '../database/repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  public async importDrogasil(): Promise<void> {
    const products = await this.productRepository.findByOrigin(Origin.DROGASIL);
    console.log(products);
  }

  public async importDrogal(): Promise<void> {
    const products = await this.productRepository.findByOrigin(Origin.DROGAL);
    console.log(products);
  }
}
