import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Origin } from '../../common/origin.enum';
import { ProductTypeormEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(private readonly repository: Repository<ProductTypeormEntity>) {}

  public async findByEan(ean: number): Promise<ProductTypeormEntity | null> {
    return this.repository.findOne({ where: { ean } });
  }

  public async findByOrigin(origin: Origin): Promise<ProductTypeormEntity[]> {
    return this.repository.find({ where: { origin } });
  }
}
