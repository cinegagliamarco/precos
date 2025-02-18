import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductTypeormEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(private readonly typeormRepository: Repository<ProductTypeormEntity>) {}
}
