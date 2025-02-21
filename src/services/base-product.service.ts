import { Injectable } from '@nestjs/common';
import { BaseProductRepository } from '../database/repositories/base-product.repository';

@Injectable()
export class BaseProductService {
  constructor(private readonly baseProductRepository: BaseProductRepository) {}
  public async import() {
    const baseProducts = await this.baseProductRepository.findAll();
    console.log(baseProducts);
  }
}
