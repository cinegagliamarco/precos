import { Injectable } from '@nestjs/common';
import { GenericProductRepository } from '../database/repositories/generic-product.repository';

@Injectable()
export class GenericProductService {
  constructor(private readonly genericProductRepository: GenericProductRepository) {}

  public async import(): Promise<void> {
    const genericProducts = await this.genericProductRepository.findAll();
    console.log(genericProducts);
  }
}
