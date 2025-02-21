import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GenericProductTypeormEntity } from '../entities/generic-product.entity';

@Injectable()
export class GenericProductRepository {
  constructor(private readonly repository: Repository<GenericProductTypeormEntity>) {}

  public async findAll(): Promise<GenericProductTypeormEntity[]> {
    return this.repository.find();
  }
}
