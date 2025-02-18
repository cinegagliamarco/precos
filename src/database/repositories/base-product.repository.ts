import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseProductTypeormEntity } from '../entities/base-product.entity';

@Injectable()
export class BaseProductRepository {
  constructor(private readonly typeormRepository: Repository<BaseProductTypeormEntity>) {}
}
