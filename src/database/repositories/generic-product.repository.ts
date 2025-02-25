import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GenericProductTypeormEntity } from '../entities/generic-product.entity';

@Injectable()
export class GenericProductRepository {
  constructor(private readonly repository: Repository<GenericProductTypeormEntity>) {}

  public async findAll(): Promise<GenericProductTypeormEntity[]> {
    return this.repository.find();
  }

  public findAllDistinct(): Promise<{ ean: number }[]> {
    return this.repository.createQueryBuilder('base_product').select('DISTINCT base_product.ean', 'ean').getRawMany();
  }

  public async save(entity: GenericProductTypeormEntity): Promise<GenericProductTypeormEntity> {
    return this.repository.save(entity);
  }
}
