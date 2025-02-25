import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseProductTypeormEntity } from '../entities/base-product.entity';

@Injectable()
export class BaseProductRepository {
  constructor(private readonly repository: Repository<BaseProductTypeormEntity>) {}

  public findAll(): Promise<BaseProductTypeormEntity[]> {
    return this.repository.find();
  }

  public save(entity: BaseProductTypeormEntity): Promise<BaseProductTypeormEntity> {
    return this.repository.save(entity);
  }

  public findAllDistinct(): Promise<{ ean: number }[]> {
    return this.repository.createQueryBuilder('base_product').select('DISTINCT base_product.ean', 'ean').getRawMany();
  }
}
